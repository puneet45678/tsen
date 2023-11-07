from fastapi import (
    APIRouter,
    Request,
    HTTPException,
    status,
    UploadFile,
    Body,
    BackgroundTasks,
)
import yaml
from services import (
    campaign_new_service,
    uploads
)
from utils import utils
from constants import supported_lists
from config.read_yaml import config
from campaign_db import campaign_actions

from logger.logging import getLogger

logger = getLogger(__name__)
pageSize = config.size["pagesize"]

router = APIRouter(tags=["campaignnew"], prefix="/api/v1")
index = "/api/v1/test"
from fastapi.requests import Request
from models import campaignNew
from datetime import datetime
from typing import List
from services.roles_permissions_services import (
    check_is_owner_campaign,
    check_permission_claim,
)

@router.post("/campaign",status_code=status.HTTP_201_CREATED)
async def create_campaign(request: Request):
    session = request.state.session
    await check_permission_claim(session, "CreateCampaign")
    userId = request.state.user_id
    campaignId = await campaign_new_service.post_campaign(userId)
    return {'campaignId':campaignId}


@router.put("/campaign/{campaignId}",status_code=status.HTTP_202_ACCEPTED)
async def update_campaign(request : Request,campaignId: str, campaign: campaignNew.BasicCampaign):
    session = request.state.session
    userId = request.state.user_id
    await check_permission_claim(session, "UpdateCampaign")
    await check_is_owner_campaign(userId, campaignId)
    campaign_dict = campaign.dict()
    await campaign_new_service.update_campaign(campaignId, campaign_dict)
    return {"message": f"{campaignId} updated succesfully"}

#TODO if at all is required ???
@router.get("/campaigns/{campaignId}/field/{field}")
async def get_campaign_field(campaignId: str, field: str):
    try:
        result = await campaign_new_service.get_campaign_details(campaignId, field)
        return result
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="unable to fetch campaing by fields")

@router.get("/campaigns")
async def getting_campaign_for_display(request:Request,pageSize: int = 8, nthPage: int = 1):
    campaigns = campaign_new_service.skiplimit(pageSize, nthPage)        
    result = await campaign_new_service.fetching_campaigns_data_ui(request,campaigns)
    return result


@router.get("/user/campaigns")
async def getting_user_campaign_for_display(
    request: Request,status : str, pageSize: int = 8, nthPage: int = 1
):
    userId = request.state.user_id
    campaigns = campaign_new_service.skiplimit_for_user(status,userId, pageSize, nthPage)
    result = await campaign_new_service.fetching_campaigns_data_ui(request,campaigns)
    return result

@router.get("/campaign/{campaignId}")
async def get_campaign(request:Request,campaignId: str):
    response = await campaign_new_service.getting_campaign_data(request,campaignId)
    return response

@router.post("/campaign/{campaignId}/like", status_code=status.HTTP_201_CREATED)
async def toggle_like(request: Request, campaignId: str, likeState: int,background_task:BackgroundTasks):
    userId = request.state.user_id
    await campaign_new_service.toggle_like(request,campaignId, userId, likeState,background_task)
    return {"message": f"Campaign Like state changed to {likeState}"}

@router.post("/campaign/{campaignId}/story/faqs", status_code=status.HTTP_201_CREATED)
async def adding_faq(request: Request,campaignId: str, faqData: campaignNew.Faqs):
    userId = request.state.user_id
    await check_is_owner_campaign(userId, campaignId)
    faqData = faqData.dict()
    await campaign_new_service.post_faq_data(campaignId, faqData)
    return {"message": "added successfully"}

@router.put("/campaign/{campaignId}/faq/{faqId}", status_code=status.HTTP_200_OK)
async def updating_faq(request : Request,campaignId: str,faqId : str, faqData: campaignNew.Faqs):
    userId = request.state.user_id
    await check_is_owner_campaign(userId,campaignId)
    faqData = faqData.dict()
    await campaign_new_service.update_faq(campaignId,faqId, faqData)
    logger.debug(f"Faq updated for campaignId:{campaignId} ")
    return {"message": "updated successfully",
            "faqId"  : faqId}

@router.delete("/campaign/{campaignId}/faq/{faqId}", status_code=status.HTTP_200_OK)
async def deleting_faq(request : Request,campaignId: str, faqId: str):
    userId = request.state.user_id
    await check_is_owner_campaign(userId,campaignId)
    campaign_new_service.delete_faq(campaignId, faqId)
    logger.debug(f"Faq deleted for campaignId:{campaignId} , faqId:{faqId}")
    return {"message" : "faq deleted successfully",
            "faqId" : faqId}

@router.put("/campaign/{campaignId}/image/cropped-url")
async def update_image_cropped_url(
    request : Request,campaignId: str, imageId: str, crop_info: campaignNew.ImageCrop = Body(...)
):
    userId = request.state.user_id
    await check_is_owner_campaign(userId,campaignId)
    crop_info = crop_info.dict()
    croppedUrl = utils.cropped_url(imageId, crop_info)
    await campaign_new_service.set_cropped_url(campaignId, imageId, croppedUrl)
    return {"message": "Cropped URL updated successfully", 
            "croppedUrl": croppedUrl}

@router.post("/campaign/{campaignId}/image", status_code=status.HTTP_201_CREATED)
async def upload_image(request : Request,file: UploadFile, campaignId: str):
    userId = request.state.user_id
    await check_is_owner_campaign(userId,campaignId)
    file_bytes = await file.read()
    details = await uploads.upload_picture_to_uploadcare(
        file_bytes, file.filename
    )
    image = campaignNew.PrintImage(imageId=details[1], 
                                   imageUrl=details[0], 
                                   imageName=file.filename)
    image = image.dict()
    await campaign_new_service.push_image(image, campaignId)
    return {
        "imageId": image["imageId"],
        "imageUrl": image["imageUrl"],
        "imageName": image["imageName"],
    }
    
@router.put("/campaign/{campaignId}/cover-image")
async def set_cover_image(request : Request,campaignId: str, url: str):
    userId = request.state.user_id
    await check_is_owner_campaign(userId,campaignId)
    await campaign_new_service.set_cover_image(campaignId, url)
    return {"message": "Cover Image updated Succesfully",
            "imageUrl" : url}

@router.delete("/campaign/{campaignId}/image/{imageId}", status_code=status.HTTP_200_OK)
async def delete_campaign_Image(request : Request,campaignId: str, imageId: str, background_tasks: BackgroundTasks):
    userId = request.state.user_id
    await check_is_owner_campaign(userId,campaignId)
    background_tasks.add_task(uploads.delete_pictures_from_uploadcare, [imageId])
    await campaign_new_service.deleting_campaignImage(campaignId, imageId)
    return {"message": "Image deleted succesfully",
            "imageId" : imageId}

@router.put("/campaign/{campaignId}/cover-image/{imageId}")
async def updating_cover_image(request:Request,campaignId: str, imageId: str, crop_info: campaignNew.ImageCrop = Body(...)):
    userId = request.state.user_id
    await check_is_owner_campaign(userId,campaignId)
    crop_info = crop_info.dict()
    croppedUrl = utils.cropped_url(imageId, crop_info)
    await campaign_new_service.set_cover_image(campaignId,croppedUrl)
    return {"message": "Cropped URL updated successfully",
            "croppedUrl": croppedUrl}   

@router.delete("/campaign/{campaignId}/cover-image", status_code=status.HTTP_200_OK)
async def delete_display_picture(request: Request,campaignId: str , background_tasks: BackgroundTasks):
    userId = request.state.user_id
    await check_is_owner_campaign(userId,campaignId)
    logger.info(
        f"{index}/campaigns/{campaignId}/display-picture Api Called . Deleting display picture for campaignId:{campaignId} "
    )
    try:
        url = campaign_new_service.deleting_display_url(campaignId)
        if url:
            imageId = campaign_new_service.fetches_id_from_url(url)
            background_tasks.add_task(uploads.delete_pictures_from_uploadcare, [imageId])
        logger.debug(f"Removing Display url from db of campaignId:{campaignId}")
        return "Campaign display picture removed succesfully"
    except:
        logger.error(
            f"Display Picture Not removed corrrectly with camapaignId:{campaignId}"
        )
        raise HTTPException(
            status_code=status.HTTP_304_NOT_MODIFIED, detail="Not Deleted correctly "
        )
    finally:
        logger.debug(f"{index}/campaigns/{campaignId}/display-picture Api Executed.")

#TODO refactor this code and add return if it is not unsupported file type 
@router.post("/campaign/{campaignId}/image/{endpoint}", status_code=status.HTTP_201_CREATED)
async def posting_display_picture(request : Request,campaignId: str, endpoint: str, file: UploadFile,background_tasks: BackgroundTasks):
    userId = request.state.user_id
    await check_is_owner_campaign(userId,campaignId)
    extension = file.filename.rpartition(".")[-1]
    contents = file.file.read()
    if extension in supported_lists.EXTENSIONS_SUPPORTED_FOR_UPLOADCARE:
        if uploads.is_file_size_acceptable(contents):
            tuple1 = await uploads.upload_picture_to_uploadcare(
                contents, file.filename
            )
            if tuple1:
                fileUrl = tuple1[0]
                fileId = tuple1[1]
                logger.debug(
                    f"file uploaded successfully with filename=>{file.filename}"
                )
                try:
                    if endpoint ==  'metaImage':
                        campaign_new_service.set_campaign_meta_image(campaignId, fileUrl)                    
                    elif endpoint == 'preMarketingImage':
                        campaign_new_service.set_campaign_premarketing_image(campaignId, fileUrl)
                    elif endpoint == 'tierDp':
                        return {"imgUrl": fileUrl}
                    elif endpoint == 'milestone':
                        return {"imgUrl": fileUrl}
                    
                    return {"imgUrl": fileUrl}
                except Exception as e:
                    background_tasks.add_task(uploads.delete_pictures_from_uploadcare, [fileId])
                    raise e

            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Error in uploading File ",
                )
        else:
            logger.error("Try Uploading Image Size Less Than 5MB")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Try Uploading Image Size Less Than 5MB",
            )
    else:
        raise HTTPException(status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,detail="Unsupported file type")
    
@router.get("/campaign/{campaignId}/display-picture", status_code=status.HTTP_200_OK)
async def get_display_url(campaignId: str):
    logger.info(
        f"{index}//campaign/{campaignId}/display-picture Api Called . For getting campaign display picture for campaignId:{campaignId}"
    )
    try:
        campaignDpUrl = campaign_new_service.get_display_url(campaignId)
        logger.debug(f"Display url recieved succesfully for cmapaignId:{campaignId}")
        logger.debug(f"{index}//campaign/{campaignId}/display-picture Api Executed")
        return campaignDpUrl
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.post("/campaign/{campaignId}/milestone")
async def create_milestone(request : Request,campaignId: str, milestone: campaignNew.Milestone):
    userId = request.state.user_id
    await check_is_owner_campaign(userId,campaignId)
    milestone_dict = milestone.dict()
    milestone_data = campaign_new_service.add_milestone(campaignId, milestone_dict)
    return {"message" : f"milestone created successfully",
            "updatedMilestoneData": milestone_data}

@router.put(
    "/campaign/{campaignId}/milestone")
async def update_milestone(request : Request,campaignId: str, data: List[campaignNew.Milestone]): 
    userId = request.state.user_id
    await check_is_owner_campaign(userId,campaignId)   
    logger.info(
        f"/api/v1/campaign/{campaignId}/create-update-milestone Api called. Updating milestones data of campaignId:{campaignId} , "
    )
    milestone_data = []

    for item in data:
        item.dict()
        campaign_dict = {k: v for k, v in item if v is not None}
        milestone_data.append(campaign_dict)
    try:
        campaign_new_service.update_milestone(campaignId, milestone_data)
        logger.debug(f"milestone updated succesfully for campaign=>{campaignId}")
        return f"milestone updated succesfully for campaign=>{campaignId}"

    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="unable to update milestone data")

@router.delete("/campaign/{campaignId}/milestone/{milestoneID}")
async def delete_milestone(request : Request,campaignId: str, milestoneId: str):
    userId = request.state.user_id
    await check_is_owner_campaign(userId,campaignId)
    await campaign_new_service.delete_milestone(campaignId, milestoneId)
    return {"message": "milestone is deleted succesfully",
            "milestoneId" : milestoneId}

@router.post("/campaign/{campaignId}/tag")
async def add_tag(campaignId : str , tags : List[str]):
    campaign_new_service.add_tag(campaignId, tags)
    return {"message": "Tag added successfully"}

@router.get("/campaigns/ended-prematurely")
async def get_campaigns_ended_prematurely():
    campaigns = await campaign_new_service.get_prematurely_ended_campaigns()
    result = await campaign_new_service.fetching_campaigns_data_ui(campaigns)
    return result

################################# campaign updates  ###########################################


@router.post("/campaign/{campaignId}/update", status_code=status.HTTP_201_CREATED)
async def create_update(request : Request,campaignId: str, data:campaignNew.CampaignUpdates):
    sessison = request.state.session
    await check_permission_claim(sessison, "CreateCampaignUpdates")
    userId = request.state.user_id
    await check_is_owner_campaign(userId,campaignId)
    approval_status = campaign_actions.get_approval_status(campaignId)
    if approval_status != "Live":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail= f"cannot post updates on campagings that is not live")
    data = data.dict()
    updated_data = await campaign_new_service.create_update(campaignId, data)
    return { "message" : "update posted succesfully",
             "updatedData" : updated_data}


@router.put(
    "/campaign/{campaignId}/update")
async def edit_update(request : Request,campaignId: str, data:List[campaignNew.CampaignUpdates]):
    session = request.state.session
    await check_permission_claim(session, "EditCampaignUpdates")
    userId = request.state.user_id
    await check_is_owner_campaign(userId,campaignId)
    approval_status = campaign_actions.get_approval_status(campaignId)
    if approval_status != "Live":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail= f"cannot post updates on campagings that is not live")
    update_data = []

    for item in data:
        item.dict()
        update_dict = {k: v for k, v in item if v is not None}
        update_data.append(update_dict)
    await campaign_new_service.edit_update(campaignId, update_data)
    logger.debug(f"updates updated succesfully for campaign=>{campaignId}")
    return f"updates updated succesfully for campaign=>{campaignId}"

@router.get("/campaign/{campaignId}/update/{updateId}")
async def get_update(campaignId: str, updateId: str):
    update = await campaign_new_service.get_update_details(campaignId, updateId)
    return update   


@router.delete("/campaign/{campaignId}/update/{updateId}")
async def delete_update(request : Request,campaignId: str, updateId: str):
    session = request.state.session
    await check_permission_claim(session, "DeleteCampaignUpdates")
    userId = request.state.user_id
    await check_is_owner_campaign(userId,campaignId)
    await campaign_new_service.delete_update(campaignId, updateId)
    return {"message": "update deleted succesfully",
            "updateId": updateId}

@router.post("/campaign/{campaignId}/report")
async def report_campaign(request : Request , campaignId: str , comment : str):
    user_id = request.state.user_id
    campaign_new_service.report_campaign(campaignId, user_id,comment)
    return {"message": "campaign reported succesfully"}

@router.post("/campaign/{campaignId}/comment/{commentId}")
async def add_comment_to_campaign(request: Request,campaignId : str , commentId : str,background_tasks : BackgroundTasks):
    await campaign_new_service.add_comment_to_campaign(request,campaignId, commentId,background_tasks)
    return {"message": "Comment added successfully",
            "commentId" : commentId}

@router.delete("/campaign/{campaignId}/comment/{commentId}")
async def delete_comment_from_campaign(request: Request,campaignId : str , commentId : str):
    await campaign_new_service.delete_comment_from_campaign(campaignId, commentId)
    return {"message": "Comment deleted successfully",
            "commentId" : commentId}

@router.post("/update/{updateId}/comment/{commentId}")
async def add_comment_to_update(updateId : str , commentId : str):
    await campaign_new_service.add_comment_to_update(updateId, commentId)
    return {"message": "Comment added successfully",
            "commentId" : commentId}

@router.delete("/update/{updateId}/comment/{commentId}")
async def delete_comment_from_update(updateId : str , commentId : str):
    await campaign_new_service.delete_comment_from_update(updateId, commentId)
    return {"message": "Comment deleted successfully",
            "commentId" : commentId}

@router.put("/campaign/{campaignId}/wishlist/user/{userId}")
async def add_user_to_campaign_wishlist(campaignId : str , userId : str):
    campaign_new_service.add_user_to_campaign_wishlist(campaignId, userId)
    return {"message": "user added to wishlist successfully"}

@router.put("cammpaign/{campaignId}/premarketing-signee/{userId}")
async def add_user_to_campaign_premarketing_signee(campaignId : str , userId : str):
    campaign_new_service.add_user_to_campaign_premarketing_signee(campaignId, userId)
    return {"message": "user added to premarketing signee successfully"}

@router.post("/campaign/{campaignId}/review/{reviewId}",status_code=status.HTTP_201_CREATED)
async def add_review(request: Request, campaignId: str, reviewId: str , tierId: campaignNew.TierId):
    userId = request.state.user_id
    tier_id = tierId.tierId
    await campaign_new_service.add_review_to_campaign(campaignId, reviewId,tier_id,userId)
    logger.debug(f"Review added successfully with review id {reviewId}")
    return {"message": f"Review added successfully with review id {reviewId}"}

@router.delete("/campaign/{campaignId}/review/{reviewId}")
async def delete_review(request: Request, campaignId: str, reviewId:str , tierId: campaignNew.TierId):
    userId = request.state.user_id
    tier_id = tierId.tierId
    await campaign_new_service.delete_review_from_campaign(campaignId, reviewId,tier_id,userId)
    logger.debug(f"review deleted with review id {reviewId}")
    return {"message": f"review deleted with review id {reviewId}"}

@router.get("/campaign/{campaignId}/tier/{tierId}/model-files",response_model=List[campaignNew.ModelFilesResponse])
async def get_model_files_from_campaign(request: Request, campaignId: str, tierId : str):
    return await campaign_new_service.get_model_files_from_campaign(campaignId,tierId)

@router.get("user/{userId}/campaigns-models/count")
async def get_user_campaigns_models_count(userId : str):
    model_count , campaign_count = await campaign_new_service.get_user_campaigns_and_models(userId)
    return {"modelCount" : model_count,
            "campaignCount" : campaign_count}