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
from pathlib import Path
import shutil
import zipfile
from config.read_yaml import config
# AWS_BUCKET = config.aws["s3"]["bucket"]
# AWS_URL_PATH_REGION_NAME = config.aws["s3"]["region"]
public_key = config.uploadcare["uploadcare_public_key"]
secret_key = config.uploadcare["uploadcare_secret_key"]

from logger.logging import getLogger

logger = getLogger(__name__)

router = APIRouter(tags=["campaign_tier"], prefix=f"/api/v1")
# s3 = boto3.client(
#     "s3",
#     aws_access_key_id=config.aws["aws_access_key_id"],
#     aws_secret_access_key=config.aws["aws_secret_access_key"],
#     region_name="ap-south-1",
# )
# bucketName = config.aws["s3"]["bucket"]


def is_file_size_acceptable(contents: str):
    print("checking file size")
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
    logger.debug(f"uploading picture of size {len(contents)}")
    directory = "temporary"

    def print_progress(info: UploadProgress):
        print(f"{info.done}/{info.total} B")

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
    except HTTPException as e:
        logger.error(e)
        raise e 
    except UploadcareException as e:
        logger.error(f"Uploadcare Exception: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR , detail="error in uploading to uploadcare")
    finally:
        file_path = Path(f"temporary/{name}")
        if file_path.exists() and file_path.is_file():
            file_path.unlink()
            logger.debug("file deleted locally")
        else:
            logger.debug(f"File not found: {file_path}")


async def delete_pictures_from_uploadcare(picturesList: list):
    logger.info(f"Callling Function for deleting pictures to uploadcare")
    try:
        uploadcare = Uploadcare(public_key=public_key, secret_key=secret_key)
        uploadcare.delete_files(picturesList)
        logger.debug(f"Picture deleted succesfully")
        return "Deleted"
    except UploadcareException as e:
        logger.error(f"uploadcare Exception : {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR , detail= "error in deleting picture from uploadcare")
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR , detail= "error in deleting picture from uploadcare")
