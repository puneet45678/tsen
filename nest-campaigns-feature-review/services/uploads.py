from botocore.exceptions import NoCredentialsError, ClientError, BotoCoreError
from concurrent.futures import ThreadPoolExecutor
import math, time, os, io, boto3, sys, yaml
from pyuploadcare import Uploadcare
from pyuploadcare.resources.file import UploadProgress
from pyuploadcare.exceptions import UploadcareException
from loguru import logger
from fastapi import (
    APIRouter,
    Query,
    Request,
    Response,
    HTTPException,
    status,
    UploadFile,
    BackgroundTasks,
    File,
)
from utils import utils
from pathlib import Path
import shutil
import zipfile
from campaign_db import model_actions
from config.read_yaml import config
AWS_BUCKET = config.aws["s3"]["bucket"]
AWS_URL_PATH_REGION_NAME = config.aws["s3"]["region"]
public_key = config.uploadcare["uploadcare_public_key"]
secret_key = config.uploadcare["uploadcare_secret_key"]

from logger.logging import getLogger

logger = getLogger(__name__)

router = APIRouter(tags=["campaign_tier"], prefix=f"/api/v1")
s3 = boto3.client(
    "s3",
    aws_access_key_id=config.aws["aws_access_key_id"],
    aws_secret_access_key=config.aws["aws_secret_access_key"],
    region_name="ap-south-1",
)
bucketName = config.aws["s3"]["bucket"]


def is_file_size_acceptable(contents: str):
    MB = 1024 * 1024
    if contents:
        size = len(contents)
        if size > int((config.uploadcare["uploadcare_file_size"]["file_size"]) * MB):
            return False
        return True
    else:
        raise FileExistsError


def adding_alt_text_uploadcare(file_UUID: str, key: str, value: str):
    uploadcare = Uploadcare(public_key=public_key, secret_key=secret_key)
    uploadcare.metadata_api.update_or_create_key(file_UUID, key, value)


def getting_cropped_url(file_UUID, metadata):
    width = str(metadata["width"])
    height = str(metadata["height"])
    adding_alt_text_uploadcare(file_UUID, "height:", height)
    adding_alt_text_uploadcare(file_UUID, "width:", width)
    cropped_url = f'https://{config.uploadcare["uploadcare_url_parameter"]}/{file_UUID}/-/scale_crop/{width}x{height}/'
    return cropped_url


async def upload_picture_to_uploadcare(
    contents: str, name: str
):
    logger.info(
        f"Callling Function for uploading picture to uploadcare with name:{name}"
    )

    directory = "temporary"

    def print_progress(info: UploadProgress):
        logger.info(f" progress of the file upload = {info.done}/{info.total} B")

    if not os.path.exists(directory):
        os.makedirs(directory)
    try:
        if not is_file_size_acceptable(contents):
            raise HTTPException(
                status_code=status.HTTP_406_NOT_ACCEPTABLE,
                detail="Try to upload files upto 10 MB",
            )
        with open(f"temporary/{name}", "wb") as f:
            f.write(contents)
        uploadcare = Uploadcare(public_key=public_key, secret_key=secret_key)
        with open(f"temporary/{name}", "rb") as created_picture:
            uploaded_picture: File = uploadcare.upload(
                created_picture, callback=print_progress
            )

            logger.debug(f"Picture:{name} uploaded succesfully")
            return (
                f'https://{config.uploadcare["uploadcare_url_parameter"]}/{uploaded_picture.uuid}/',
                uploaded_picture.uuid,
            )

    except UploadcareException as e:
        logger.error(f"Uploadcare Exception: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR , detail= "error in uplaoding to uplaodcare")
    finally:
        file_path = Path(f"temporary/{name}")
        if file_path.exists() and file_path.is_file():
            file_path.unlink()
            logger.debug("file deleted locally")
            logger.debug("image upload completed")
        else:
            logger.debug(f"File not found: {file_path}")


def delete_pictures_from_uploadcare(picturesList: list):
    logger.info(f"Callling Function for deleting pictures to uploadcare")
    uploadcare = Uploadcare(public_key=public_key, secret_key=secret_key)
    uploadcare.delete_files(picturesList)
    logger.info(f"Picture deleted succesfully from uploadcare")


async def s3_upload(contents :bytes , key : str, metadata:dict):
    logger.info(f"Calling Function for uploading asset in s3")
    logger.info(f"uploading {key} to s3 ")
    try:
        s3.put_object(Bucket=bucketName,Key=key ,Body=contents ,Metadata= metadata)
        logger.info(f"Asset Uploaded in s3")
    except Exception as e:
        print(e)


def delete_campaign_assets_s3(folder_name: str):
    logger.info(
        f"Calling Function for deleting assets from s3 of folder: {folder_name}"
    )
    objects = s3.list_objects(Bucket=bucketName, Prefix=folder_name)
    if "Contents" in objects:
        for obj in objects["Contents"]:
            if obj["Key"].endswith("/"):
                continue
            s3.delete_object(Bucket=bucketName, Key=obj["Key"])
        logger.info(f"Assets deleted successfully from s3")
    else:
        logger.info(f"No assets found in s3 folder: {folder_name}")


async def delete_from_bucket(fileName):
    logger.info(f"file requesting for deletion:{fileName}")
    try:
        response = s3.delete_object(Bucket=bucketName, Key=fileName)
        logger.debug(f"Asset delete from bucket with response:{response}")
        return response
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="not deleted succesfully ",
        )

def is_file_present_in_s3(path):
    try:
        s3.head_object(Bucket=bucketName, Key=path)
    except ClientError as e:
        if e.response["Error"]["Code"] == "404":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File does not exist in S3.",
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="S3 operation failed.",
            )
    except BotoCoreError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to S3.",
        )


async def delete_s3_folder(prefix):
    logger.info(f"Calling Function for completely delete s3 folder:{prefix}")
    objects_to_delete = s3.list_objects(Bucket=bucketName, Prefix=prefix)
    if "Contents" in objects_to_delete:
        for obj in objects_to_delete["Contents"]:
            s3.delete_object(Bucket=bucketName, Key=obj["Key"])
            logger.debug(f"Assets of folder:{prefix} deleted succesfully")
    s3.delete_object(Bucket=bucketName, Key=prefix)
    logger.debug(f"Folder deleted{prefix}")


# Right now we are using the presigned url of s3 instead of this function
# def s3_upload(contents, key):
#     s3 = boto3.client("s3")
#     response = s3.create_multipart_upload(Bucket=bucketName, Key=key)
#     upload_id = response["UploadId"]
#     file_size = len(contents)
#     bytes_uploaded = 0
#     last_update_time = time.time()
#     with io.BytesIO(contents) as f:
#         parts = []
#         part_number = 1
#         executor = ThreadPoolExecutor(max_workers=10)
#         futures = []
#         while True:
#             data = f.read(10 * 1024 * 1024)  # 5 MB
#             if not data:
#                 break
#             future = executor.submit(
#                 s3.upload_part,
#                 Bucket=bucketName,
#                 Key=key,
#                 PartNumber=int(part_number),
#                 UploadId=upload_id,
#                 Body=data,
#             )
#             futures.append((part_number, future))
#             part_number += 1
#             bytes_uploaded += len(data)
#             if time.time() - last_update_time > 0.01:
#                 percent_done = math.floor(bytes_uploaded / file_size * 100)
#                 progress_msg = f"Uploading: {percent_done}%\r"
#                 sys.stdout.write(progress_msg)
#                 sys.stdout.flush()
#                 last_update_time = time.time()

#         for part_number, future in futures:
#             response = future.result()
#             parts.append({"PartNumber": int(part_number), "ETag": response["ETag"]})

#     # parts = sorted(parts, key=lambda part: part['PartNumber'])

#     s3.complete_multipart_upload(
#         Bucket=bucketName, Key=key, UploadId=upload_id, MultipartUpload={"Parts": parts}
#     )


def create_presigned_url(object_name, expiration=3600, HttpMethod=None):
    """
    Generate a presigned URL to share an S3 object

    :param bucket_name: string
    :param object_name: string
    :param expiration: Time in seconds for the presigned URL to remain valid
    :return: Presigned URL as string. If error, returns None.
    """

    try:
        logger.info("generating pre-signed url")
        response = s3.generate_presigned_url(
            "put_object",
            Params={"Bucket": bucketName, "Key": object_name},
            ExpiresIn=expiration,
        )
        logger.info("pre-signed url generated ")
        return response
    except NoCredentialsError:
        return None

def unzip_on_s3(path,model_id):
    try:
        logger.debug(f"unzippping started for {path}")
        obj = io.BytesIO()
        s3.download_fileobj(Bucket=bucketName, Key=path, Fileobj=obj)
        obj.seek(0)
        # print("Zip file size:", len(obj.getvalue()))
        stl_files = []
        glb_files = []
        with zipfile.ZipFile(obj, 'r') as archive:
            for file in archive.namelist():
                file_size = archive.getinfo(file).file_size
                with archive.open(file) as f:
                    filename , ext = os.path.splitext(file)
                    if ext.lower() == ".stl":
                        cropped_path = path.partition("stl")[0]
                        cropped_path += f"stl/{model_id}_unzipped/{file}"
                        s3_url = utils.generating_url_s3(cropped_path)
                        stl_files.append((filename,file_size,s3_url))
                        s3.put_object(Bucket=bucketName, Key=cropped_path, Body=f.read())
                    elif ext.lower() == ".glb":
                        cropped_path = path.partition("glb")[0]
                        cropped_path += f"glb/{model_id}_unzipped/{file}"
                        s3_url = utils.generating_url_s3(cropped_path)
                        glb_files.append((filename,file_size,s3_url))
                        s3.put_object(Bucket=bucketName, Key=cropped_path, Body=f.read())
        
        model_actions.adding_unzipped_files_to_models_db(stl_files,glb_files,model_id)

    except BotoCoreError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to S3.",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="error in unzipping",
        )

def unzipping_file_on_s3(model_id):
    try:
        strt = time.time()
        model = model_actions.get_model(model_id)
        model_name = model["modelName"]
        stl_url = model["modelFileUrl"]["stl"]
        glb_url = model["modelFileUrl"]["glb"]

        if stl_url and glb_url:
            stl_path = stl_url.replace(f"https://{AWS_BUCKET}.{AWS_URL_PATH_REGION_NAME}.amazonaws.com/", "", 1)
            glb_path = glb_url.replace(f"https://{AWS_BUCKET}.{AWS_URL_PATH_REGION_NAME}.amazonaws.com/", "", 1)

            unzip_on_s3(stl_path,model_id)
            unzip_on_s3(glb_path,model_id)
        
        elif stl_url:
            stl_path = stl_url.replace(f"https://{AWS_BUCKET}.{AWS_URL_PATH_REGION_NAME}.amazonaws.com/", "", 1)
            unzip_on_s3(stl_path,model_id)
        else:
            glb_path = glb_url.replace(f"https://{AWS_BUCKET}.{AWS_URL_PATH_REGION_NAME}.amazonaws.com/", "", 1)
            unzip_on_s3(glb_path,model_id)
        elapsed_time = time.time() - strt
        logger.debug(f"time taken to execute unzipping is {elapsed_time}")
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="error in unzipping",
        )


def download_from_s3(path , expiration=3600):
    try:
        logger.info(f"generating pre-signed url for downloading ")
        response = s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": bucketName, "Key": path},
            ExpiresIn=expiration,
        )
        logger.debug(f"pre-signed url generated for {path}")
        return response
    except NoCredentialsError:
        raise HTTPException(
            status_code=status.HTTP_511_NETWORK_AUTHENTICATION_REQUIRED,
            detail="check your s3 credentials.",
        )

async def downloding_model_files(model_id):
    try:
        model = model_actions.get_model(model_id)
        stl_url = model["modelFileUrl"]["stl"]
        if stl_url:
            stl_path = stl_url.replace(f"https://{AWS_BUCKET}.{AWS_URL_PATH_REGION_NAME}.amazonaws.com/", "", 1)
            stl_file = download_from_s3(stl_path)
            return stl_file
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="error in downloading",
        )