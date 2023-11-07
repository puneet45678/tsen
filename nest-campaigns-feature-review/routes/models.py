from models import campaignNew
from typing import List, Optional
from fastapi import (
    Form,
    APIRouter,
    Request,
    HTTPException,
    status,
    UploadFile,
    Body,
    File,
    BackgroundTasks,
)
from fastapi.requests import Request
from models import model
from services import (
    modelService,
    uploads,
)
from utils import utils
from logger.logging import getLogger
from services.roles_permissions_services import (
    check_role_claim,
    check_permission_claim,
    check_is_owner_model,
)

logger = getLogger(__name__)


router = APIRouter(tags=["models"], prefix="/api/v1")

index = "/api/v1"

@router.post("/model" ,status_code=status.HTTP_201_CREATED)
async def create_model(request: Request):
    session = request.state.session
    await check_permission_claim(session, "CreateModal")
    user_id = request.state.user_id
    modelId = await modelService.posting_modeldata(user_id)
    return {"modelId": modelId}

@router.put("/model/{modelId}")
async def update_model(request: Request, modelId: str, model: model.DraftModel):
    userId = request.state.user_id
    await check_is_owner_model(userId, modelId)
    model_dict = {k: v for k, v in model.dict().items() if v is not None}
    await modelService.update_model(modelId, model_dict)
    return {"message": "Model updated successfully",
            "modelId" : modelId}

@router.put("/model/{modelId}/submit")
async def submit_model_for_review(request: Request, modelId: str, model: model.SubmitModel):
    userId = request.state.user_id
    await check_is_owner_model(userId, modelId)
    model_dict = {k: v for k, v in model.dict().items() if v is not None}
    await modelService.submit_model_for_review(modelId, model_dict,userId)
    return {"message" : "model submitted succesfully",
            "modelId": modelId}

@router.put("/model/{modelId}/cover-image")
async def set_cover_image(request: Request, modelId: str, url: str):
    userId = request.state.user_id
    await check_is_owner_model(userId, modelId)
    await modelService.set_cover_image(modelId, url)
    return {"message": "Cover Image updated Succesfully",
            "modelId": modelId}

@router.get("/admin/models")
async def get_models_admin(
    request: Request,
    _status: model.Approvalstatus = model.Approvalstatus.SUBMITTED.value,
    deprecated: bool = False,
    visiblility : model.InputVisibility = model.InputVisibility.PUBLIC.value,
):
    session = request.state.session
    await check_permission_claim(session , "Admin_ViewModel")
    details = await modelService.get_models_for_admin(request,_status.value ,deprecated,visiblility.value)
    return details

@router.get("/model/{modelId}")
async def get_model(request: Request, modelId: str):
    result = await modelService.getting_model(request,modelId)
    return result

@router.get("/user/models")
async def get_user_models(
    request: Request,
    _status: model.Approvalstatus = model.Approvalstatus.SUBMITTED,
    deprecated: bool = False,
    visibility: model.InputVisibility = model.InputVisibility.ALL,
):
    userId = request.state.user_id
    visibility = visibility.value
    details = await modelService.get_models(_status, visibility, userId, deprecated)
    return details

@router.get("/user/{userId}/models")
async def get_user_models_by_user_id(
    request: Request,
    userId: str,
):
    details = await modelService.get_public_user_models(userId)
    return details

@router.get("/all/models")
async def getting_all_models(nsfw:bool = False,pageSize: int = 8, pageNum: int = 1):
    models = modelService.skiplimit(nsfw,pageSize, pageNum)
    result = await modelService.fetching_model_data_ui(models)
    return result
    
@router.delete("/model/{modelId}")
async def delete_model(request: Request, modelId: str):
    userId = request.state.user_id
    session = request.state.session
    await check_role_claim(session,"SuperAdmin")
    await modelService.delete_model(modelId)
    logger.debug(f"Model {modelId} deleted successfully by admin {userId}")
    return {"message": "Model deleted successfully"}

@router.get("/model/{modelId}/states" )
async def getting_states_of_model(modelId: str):
    return await modelService.getting_states(modelId)

@router.post("/model/{modelId}/images",status_code=status.HTTP_201_CREATED)
async def upload_images(request: Request, file: UploadFile, modelId: str ):
    userId = request.state.user_id
    await check_is_owner_model(userId, modelId)
    file_bytes = await file.read()
    details = await uploads.upload_picture_to_uploadcare(file_bytes, file.filename)
    image = model.PrintImage(imageId=details[1], 
                             imageUrl=details[0],
                             imageName=file.filename,
                             croppedUrl="",
                             )
    image = image.dict()
    await modelService.pushing_images(image, modelId)
    return {
        "imageID": image["imageId"],
        "imageUrl": image["imageUrl"],
        "imageName": image["imageName"],
    }

@router.delete("/model/{modelId}/images")
async def delete_modelImage(request: Request, modelId: str, imageId: str , background_tasks: BackgroundTasks):
    userId = request.state.user_id
    await check_is_owner_model(userId, modelId)
    background_tasks.add_task(uploads.delete_pictures_from_uploadcare, [imageId])
    await modelService.deleting_modelImage(modelId, imageId)
    return {"message": f"{imageId} deleted succesfully"}

@router.delete("/model/{modelId}/file/{fileType}/{fileName}")
async def delete_upload_url(
    request: Request, fileName: str, modelId: str, fileType: str
):
    userId = request.state.user_id
    await check_is_owner_model(userId, modelId)
    year, month = await modelService.find_time_of_model_creation(request,modelId)
    path = f"{year}/{month}/{userId}/{modelId}/{fileType}/{fileName}"
    uploads.delete_from_bucket(path)
    await modelService.update_model_file_url(modelId, fileType, "")
    return {"message": "Model files deleted succesfully"}

@router.put("/model/{modelId}/buyer/{userId}")
async def add_buyer(request:Request,modelId: str, userId: str , background_tasks: BackgroundTasks):
    await modelService.add_buyer_to_model(request,modelId, userId,background_tasks)
    return {"message": "Buyer added successfully"}    
    
@router.put("/model/{modelId}/url/cropped")
async def update_cropped_url_route(
    request: Request, modelId: str, imageId: str, crop_info: model.ImageCrop = Body(...)
):
    userId = request.state.user_id
    await check_is_owner_model(userId, modelId)
    crop_info = crop_info.dict()
    croppedUrl = utils.cropped_url(imageId, crop_info)
    try:
        image_url = await modelService.get_image_url_by_ids(modelId, imageId)
        cover_image_url = await modelService.get_cover_image_url(modelId)

        if image_url == cover_image_url:
            try:
                modelService.set_cover_image(modelId, croppedUrl)
                modelService.set_cropped_url(modelId, imageId, croppedUrl)
            except:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Error in updating cover Image",
                )
        else:
            modelService.set_cropped_url(modelId, imageId, croppedUrl)
        return {"message": "Cropped URL updated successfully", "croppedUrl": croppedUrl}

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.get("/model/{modelId}/upload/url")
async def get_upload_url(request: Request, fileName: str, modelId: str, fileType: str):
    approval_status = modelService.get_approval_status(modelId)
    if approval_status == "Live":
        raise HTTPException(
            status_code=status.HTTP_412_PRECONDITION_FAILED,
            detail="you cannot change model files of live model",
        )
    userId = request.state.user_id
    await check_is_owner_model(userId, modelId)
    year, month = await modelService.find_time_of_model_creation(request,modelId)
    path = f"{year}/{month}/{userId}/{modelId}/{fileType}/{fileName}"
    presigned_url = uploads.create_presigned_url(path)
    if presigned_url is None:
        return {"error": "Could not generate presigned URL."}
    logger.debug(f"presigned url generated , {presigned_url}")
    return {"presignedurl": presigned_url}

@router.post("/model/{modelId}/file",status_code=status.HTTP_201_CREATED)
async def update_model_file_url(
    request: Request, modelId: str, fileType: str, fileName: str
):
    approval_status = modelService.get_approval_status(modelId)
    if approval_status == "Live":
        raise HTTPException(
            status_code=status.HTTP_412_PRECONDITION_FAILED,
            detail="you cannot change model files of live model",
        )
    userId = request.state.user_id
    await check_is_owner_model(userId, modelId)

    year, month = await modelService.find_time_of_model_creation(request,modelId)
    path = f"{year}/{month}/{userId}/{modelId}/{fileType}/{fileName}"
    uploads.is_file_present_in_s3(path)
    s3Url = utils.generating_url_s3(path)
    await modelService.update_model_file_url(modelId, fileType, s3Url)
    return {"message": "Model file URL updated successfully."}


@router.post("/model/{modelId}/like", status_code=status.HTTP_201_CREATED)
async def like_model(request: Request, modelId: str, likeState: int , background_tasks: BackgroundTasks):
    logger.info(f"{request.url.path} Api Called . Toggle like ")

    userId = request.state.user_id

    if likeState not in [-1, 1]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="like_state must be 1 or -1",
        )

    await modelService.toggle_like(request,modelId, userId, likeState,background_tasks)
    return {"message": f"model Like state changed to {likeState}"}

@router.get("/admin/models/{modelId}/download")
async def get_model_files_admin(request: Request, modelId: str):
    session = request.state.session
    await check_permission_claim(session,"Admin_ApproveOrRejectSubmittedModel")
    return await uploads.downloding_model_files(modelId)

@router.post("/models")
async def get_models(request: Request, modelrequest: model.ModelIds):
    userId = request.state.user_id
    modelIds = modelrequest.modelIds
    result = await modelService.getting_models(request,modelIds, userId)
    return result

#TODO : check if user is buyer of model
@router.get("/model/{modelId}/downlaod")
async def get_model_files(request: Request, modelId: str):
    user_id = request.state.user_id
    return await uploads.downloding_model_files(modelId)

@router.post("/model/{modelId}/report")
async def report_model(request: Request, modelId: str , comment: str):
    user_id = request.state.user_id
    await modelService.report_model(modelId, user_id , comment)
    return {"message": "Model reported successfully"}

@router.post("/model/{modelId}/comment/{commentId}")
async def add_comment(request:Request,modelId : str , commentId : str,background_tasks: BackgroundTasks):
    await modelService.add_comment(request,modelId, commentId,background_tasks)
    return {"message": "Comment added successfully"}

@router.delete("/model/{modelId}/comment/{commentId}")
async def delete_comment(request:Request,modelId : str , commentId : str):
    await modelService.delete_comment(modelId, commentId)
    return {"message": "Comment deleted successfully",
            "commentId" : commentId}

@router.get("/model/{modelId}/model-files", response_model=campaignNew.ModelFilesResponse)
async def get_model_files(request: Request,modelId:str,campId:Optional[str]=None,tierId:Optional[str]=None):
    return await modelService.get_model_files(modelId,campId,tierId)


############################## LICENSES FOR MDOELS #################################################

@router.post("/license",status_code=status.HTTP_201_CREATED)
async def add_license(request: Request, licenseName:str = Form(), licenseUrl : str = Form(),  file : UploadFile = File(...)):
    session = request.state.session
    await check_role_claim(session,"ModelsAdmin")
    try:
        file_bytes = await file.read()
        details = await uploads.upload_picture_to_uploadcare(
            file_bytes, file.filename
        ) 
        license = model.License(
            licenseName=licenseName,
            licenseUrl=licenseUrl,
            #licenseDescription="This work is licensed under a Creative Commons Attribution 4.0 International License",
            licenseLogoUrl=details[0],
        )
        license = license.dict()
        licenseId =  await modelService.add_license(license)
        logger.debug(f"License added successfully with license id {licenseId}")
        return {"message": f"License added successfully with license id {licenseId}"}
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/licenses")
async def get_licenses():
    return await modelService.get_licenses()

@router.get("/license/{licenseId}")
async def get_license(licenseId: str):
    return await modelService.get_license(licenseId)

@router.put("/license/update")
async def update_license(request: Request, licenseId: str = Form(), licenseName:str = Form(), licenseUrl : str = Form(),  file : UploadFile = None):
    session = request.state.session
    await check_role_claim(session,"ModelsAdmin")
    try:
        if file:
            file_bytes = await file.read()
            details = await uploads.upload_picture_to_uploadcare(
                file_bytes, file.filename
            )
        else:
            details = ["",""]
        license = model.License(
            licenseName=licenseName,
            licenseUrl=licenseUrl,
            #licenseDescription="This work is licensed under a Creative Commons Attribution 4.0 International License",
            licenseLogoUrl=details[0],
        )
        license = license.dict()
        await modelService.update_license(licenseId,license)
        logger.debug(f"License updated successfully with license id {licenseId}")
        return {"message": f"License updated successfully with license id {licenseId}"}
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.delete("/license/{licenseId}")
async def delete_license(request: Request, licenseId: str):
    session = request.state.session
    await check_role_claim(session,"ModelsAdmin")
    try:
        await modelService.delete_license(licenseId)
        logger.debug(f"License deleted successfully with license id {licenseId}")
        return {"message": f"License deleted successfully with license id {licenseId}"}
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
####################################### Categories for models #########################################

@router.post("/category",status_code=status.HTTP_201_CREATED)
async def add_category(request: Request , categories : List[str]):
    session = request.state.session
    # await check_role_claim(session,"ModelsAdmin")
    categoryIds = await modelService.add_category_to_category_db(categories)
    return {"message": f"Categories added successfully with category id {categoryIds}"}

@router.get("/categories")
async def get_categories(pageSize: int = 8, pageNo: int = 1):
    return await modelService.get_categories(pageSize, pageNo)

@router.get("/category/{categoryId}")
async def get_category(categoryId: str):
    return await modelService.get_category(categoryId)

@router.delete("/category/{categoryId}")
async def delete_category(request: Request, categoryId: str):
    session = request.state.session
    await check_role_claim(session,"ModelsAdmin")
    await modelService.delete_category(categoryId)
    logger.debug(f"Category deleted successfully with category id {categoryId}")
    return {"message": f"Category deleted successfully with category id {categoryId}"}

######################################### ADDING TAGS TO MODELS ADMIN #########################################

@router.post("/tags",status_code=status.HTTP_201_CREATED)
async def add_tags(request: Request, tags: List[str]):
    session = request.state.session
    await check_role_claim(session,"ModelsAdmin")
    tagIds = await modelService.add_tags_to_tag_db(tags , admin=True)
    logger.debug(f"Tags added successfully with tag ids {tagIds}")
    return {"message": f"Tags added successfully with tag ids {tagIds}"}

@router.delete("/tag/{tagId}")
async def delete_tag(request: Request, tagId: str):
    session = request.state.session
    await check_role_claim(session,"ModelsAdmin")
    await modelService.delete_tag(tagId)
    logger.debug(f"Tag deleted successfully with tag id {tagId}")
    return {"message": f"Tag deleted successfully with tag id {tagId}"}

@router.get("/tags")
async def get_tags(pageSize: int = 8, pageNo: int = 1):
    return await modelService.get_tags(pageSize, pageNo)

@router.post("/tags/ids")
async def get_tags_by_ids(tags: model.TagIds):
    tag_ids = tags.tagIds
    response = await modelService.get_tags_by_ids(tag_ids)
    return response

############################################# ADDING REVIEWID TO MODELS #############################################

@router.post("/model/{modelId}/review/{reviewId}",status_code=status.HTTP_201_CREATED)
async def add_review(request: Request, modelId: str, reviewId: str):
    userId = request.state.user_id
    await modelService.add_review_to_model(modelId, reviewId,userId)
    logger.debug(f"Review added successfully with review id {reviewId}")
    return {"message": f"Review added successfully with review id {reviewId}"}

@router.delete("/model/{modelId}/review/{reviewId}")
async def delete_review(request: Request, modelId: str, reviewId: str):
    userId = request.state.user_id
    await modelService.delete_review_from_model(modelId, reviewId,userId)
    logger.debug(f"Review deleted successfully with review id {reviewId}")
    return {"message": f"Review deleted successfully",
            "reviewId": reviewId}

#TODO permissions needs to be added 
@router.delete("/review/{reviewId}")
async def delete_review_by_admin(request: Request,reviewId : str):
    session = request.state.session
    await modelService.delete_review_by_admin(reviewId)
    logger.debug(f"Review deleted successfully with review id {reviewId}")
    return {"message": f"Review deleted successfully",
            "reviewId": reviewId}