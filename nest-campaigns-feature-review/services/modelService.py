import re
from fastapi import HTTPException, status
from campaign_db import model_actions,campaign_actions
from datetime import datetime
from logger.logging import getLogger
from services import notification_calls,m2m_calls
from models.model import (Visibility,
                          TriggerType,
                          StateFor,
                          Approvalstatus,
                          ModelResponseCart)
from urllib.parse import quote
from models import campaignNew
logger = getLogger(__name__)


async def posting_modeldata(user_id):
    modelId = model_actions.post_model(user_id)
    return modelId

async def update_model(modelId, model_dict):
    try:
        model = model_actions.get_model(modelId)
        status_of_model = model.get("approvalStatus")
        print(model)
        if status_of_model == Approvalstatus.LIVE.value:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="cannot update live model")
        
        if model["modelFileUrl"]:
            model_stl_file_url = model["modelFileUrl"]["stl"]
            if model_dict["modelFileUrl"]["stl"] and model_dict["modelFileUrl"]["stl"] != model_stl_file_url:
                model_actions.update_approval_status(modelId, Approvalstatus.SUBMITTED.value)
        
        model_license_id = model["licenseId"]
        if model_dict["licenseId"] and model_dict["licenseId"] != model_license_id:
            model_actions.update_approval_status(modelId, Approvalstatus.SUBMITTED.value)

        model_actions.update_model(modelId, model_dict)
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in saving model as draft")

async def add_tags_to_tag_db(tags,admin):
    try:
        tag_ids = []
        if not admin:
            if len(tags) > 5:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Maximum 5 tags are allowed")
        for tag in tags:
            tag_value = tag.lower().replace(" ","_")
            tag_value = "".join(letter for letter in tag_value if letter.isalnum() or letter == '_')
            tag_value = re.sub('_+', '_', tag_value)
            url_encoded_value = quote(tag_value)
            tag_lable = tag
            tag_id = model_actions.adding_tags(url_encoded_value,tag_lable)
            tag_ids.append(tag_id)
        return tag_ids
    except Exception as e :
        logger.error(e)
        raise e
    
async def add_category_to_category_db(categories):
    try:
        category_ids = []
        for category in categories:
            label = category
            category_value = category.lower().replace(" ","_")
            category_value = "".join(letter for letter in category_value if letter.isalnum() or letter == '_')
            category_value = re.sub('_+', '_', category_value)
            url_encoded_value = quote(category_value)
            category_id = model_actions.adding_category(url_encoded_value,label)
            category_ids.append(category_id)
        return category_ids
    except Exception as e :
        logger.error(e)
        raise e


async def submit_model_for_review(modelId, modelDict,userId):
    #TODO check for state to change to draft with changes in license and nsfw value etc.
    try:
        modelDict["updatedAt"] = datetime.utcnow()
        # if is_admin_modified(modelId):
        #     modelDict["visibility"] = Visibility.PRIVATE.value
        state = model_actions.get_approval_status(modelId)
        state_for = StateFor.MODEL.value
        trigger_type = TriggerType.APPROVAL.value
        comment = "model submitted for review"
        # tag_ids are taken in submit model pydantic model as list of strings of tag names later converted to tag ids
        # tag_ids is chosen so that while setting model dict it should not create other 
        # field named tag as we are storing only tag_id in model structure
        tag_ids = await add_tags_to_tag_db(modelDict["tagIds"],admin=False)
        #for checking if categoryId with given id exist or not 
        category = model_actions.getting_category(modelDict["categoryId"])
        #for checking if LicenseId provided is valid or not
        license = model_actions.getting_license(modelDict["licenseId"])
        modelDict["tagIds"] = tag_ids
        result = model_actions.submitting_model_for_review(modelId, modelDict)
        model_actions.add_state_change_to_db(
                modelId,state,Approvalstatus.SUBMITTED.value, userId, comment, state_for, trigger_type,
            )
        model_actions.update_approval_status(modelId, Approvalstatus.SUBMITTED.value)
        return result
    except Exception as e:
        logger.error(e)
        raise e

async def getting_model(request,modelId):
    try:
        model = model_actions.get_model(modelId)
        user_id = model.get("userId", "")
        user_data = await m2m_calls.get_user_data(request,user_id)
        model["userData"] = user_data
        userId = request.state.user_id
        if userId in model["likedBy"] if model["likedBy"] else []:
            model["is_liked_by_user"] = True
        else:
            model["is_liked_by_user"] = False
        return model
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in getting model")

async def getting_models(request,modelIds,userId):
    try:
        models_response = []
        user_ids = []
        review_ids = []
        for modelId in modelIds:
            response_to_cart_service = ModelResponseCart()
            model = model_actions.get_model(modelId)
            user_id = model.get("userId", "")
            user_ids.append(user_id)
            response_to_cart_service.itemName = model.get("modelName")
            response_to_cart_service.itemDp = model.get("coverImage")
            response_to_cart_service.itemCurrency = model.get("currency")
            response_to_cart_service.itemPrice = model.get("price")
            response_to_cart_service.itemId = str(model.get("_id"))

            if model["reviewData"]:
                for review_data in model["reviewData"]:
                    reviewId = review_data["reviewId"]
                    reviewerId = review_data["reviewerId"]
                    if reviewerId == userId:
                        review_ids.append(reviewId)
                    else:
                        response_to_cart_service.reviewId = None
                        response_to_cart_service.rating = 0
            else:
                response_to_cart_service.reviewId = None
                response_to_cart_service.rating = 0

            if userId in model["likedBy"] if model["likedBy"] else []:
                model["is_liked_by_user"] = True
            else:
                model["is_liked_by_user"] = False
            models_response.append(response_to_cart_service.dict())
        users_data = await m2m_calls.get_users_data(request,user_ids)
        if review_ids:
            reviews_data = await m2m_calls.get_reviews_from_review_db(request,review_ids)
        for user_data,response in zip(users_data,models_response):
            response["artistName"] = user_data["username"]
            response["artistDp"] = user_data['displayInformation']['profilePicture']['croppedPictureUrl']
            for review_data in model["reviewData"]:
                    reviewId = review_data["reviewId"]
                    reviewerId = review_data["reviewerId"]
                    if reviewerId == userId:
                        data = reviews_data.get(reviewId)
                        rating = data["rating"]
                        response["rating"] = rating
                        response["reviewId"] = reviewId
                        
        return models_response
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in getting models")

async def get_models(status, visiblity, userId, deprecated):
        response =  model_actions.get_models(status, visiblity, userId, deprecated)
        return response

async def get_public_user_models(userId):
    response = model_actions.get_public_user_models(userId)
    return response
    
async def get_models_for_admin(request,status, deprecated,visibility):
    try:
        models = model_actions.get_models_for_admin(status, visibility,deprecated)
        user_ids =[]
        for model in models:
            user_id = model.get("userId", "")
            user_ids.append(user_id)
        
        users_data = await m2m_calls.get_users_data(request,user_ids)
        for user_data,model in zip(users_data,models):
            model["userData"] = { "userName": user_data["username"],
                                  "displayInformation": user_data['displayInformation']['profilePicture']['croppedPictureUrl'],
                                  "userEmail": user_data["userEmail"],}

        private_models_responses = []
        if visibility == Visibility.PRIVATE.value:
            for model in models:
                response = {
                    "modelId": str(model["_id"]),
                    "coverImage": model["coverImage"], 
                    "modelName" : model["modelName"],
                }
                private_models_responses.append(response)
                
            return private_models_responses
        return models
    except Exception as e:
        logger.error(e)
        raise e


async def set_cover_image(modelId, url):
    return model_actions.set_cover_image(modelId, url)

async def pushing_images(model_images, modelId):
    model_actions.push_images(model_images, modelId)

async def getting_states(modelId):
    return model_actions.getting_states(modelId)

async def deleting_modelImage(modelId, imageId):
    model_actions.delete_modelImage(modelId, imageId)

async def get_model_visiblity(modelId):
    return model_actions.get_model_visibility(modelId)

async def find_time_of_model_creation(request,modelId):
    try:
        logger.info(f"find time of creation of campaign with campaignId=>{modelId}")
        model = await getting_model(request,modelId)
        year = model["uploadDatetime"].year
        month = model["uploadDatetime"].month
        logger.debug(f"data recieved correctly =>year:{year} , month:{month}")
        return (year, month)
    except Exception as e :
        logger.error(e)
        raise HTTPException (status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail=str(e))


async def add_buyer_to_model(request,modelId, userId,background_tasks):
    background_tasks.add_task(notification_calls.in_app_model_purchase,request,modelId)
    detail = model_actions.add_buyer_to_model(modelId, userId)
    return detail

def delete_buyer_from_model(modelId, userId):
    detail = model_actions.remove_buyer_from_model(modelId, userId)
    return detail

def set_cropped_url(modelId, imageId, croppedUrl):
    response = model_actions.update_cropped_url(modelId, imageId, croppedUrl)
    return response

async def update_model_file_url(modelId, fileType, url):
    result = model_actions.update_model_file_url(modelId, fileType, url)
    return result

async def toggle_like(request,modelId: str, userId: str, likeState,background_tasks):
    if likeState == 1:
        background_tasks.add_task(notification_calls.in_app_model_like,request,modelId)
    model_actions.toggle_like(modelId, userId, likeState)

async def get_image_url_by_ids(modelId , imageId):
    model_actions.getting_image_url_by_ids(modelId,imageId)

async def get_cover_image_url(modelId):
    model_actions.getting_cover_image_url(modelId)

def is_admin_modified(modelId:str):
    modified_status= model_actions.get_adminModified_value(modelId)
    return  modified_status

def get_approval_status(model_id):
    return model_actions.get_approval_status(model_id)

def skiplimit(nsfw,pageSize, pageNum):
    cursor = model_actions.skipping_models(nsfw,pageSize, pageNum)
    return [x for x in cursor]
    
async def fetching_model_data_ui(models):
    try:
        if len(models) == 0:
            logger.error("No model exists")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="No model exists"
            )
        results = []
        for model in models:
            model["_id"] = str(model["_id"])
            results.append(model)
        return results
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in fetching model data")

async def report_model(modelId,user_id,comment):
    model_actions.reporting_model(modelId,user_id,comment)
    
async def add_comment(request,modelId,commentId,background_tasks):
    model_actions.adding_comment(modelId,commentId)
    background_tasks.add_task(notification_calls.in_app_model_comment,request,modelId)
    
async def delete_comment(modelId, commentId):
    model_actions.deleting_comment(modelId,commentId)
    
async def get_model_files(modelId,campId,tierId):
    try:
        if campId:
            campaign_name, tier_name = campaign_actions.get_campaign_name_and_tier_name(campId,tierId)
        else:
            campaign_name, tier_name = None,None
        model = model_actions.get_model(modelId)
        modelFiles = model.get("modelFiles" , None)
        modelName = model.get("modelName")
        if modelFiles is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail= "model files not present")
        files = modelFiles["stlFiles"]
        stls = [file["filePath"] for file in files]
        response = campaignNew.ModelFilesResponse(campaignName=campaign_name,
                                                  tierName=tier_name,
                                                  modelId = modelId,
                                                  modelName = modelName,
                                                  modelStls = stls)
        
        return response

    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR , detail= str(e))


async def add_license(license):
    license_id = model_actions.adding_license(license)
    return license_id

async def get_licenses():
    licenses = model_actions.getting_licenses()
    return licenses

async def get_license(licenseId):
    license = model_actions.getting_license(licenseId)
    return license
#TODO fix this what is done here
async def update_license(licenseId,license):
    old_license = model_actions.getting_license(licenseId)
    if license["licenseLogoUrl"] == "":
        license["licenseLogoUrl"] = old_license["licenseLogoUrl"]
    model_actions.updating_license(licenseId,license)
    
async def delete_license(licenseId):
    model_actions.deleting_license(licenseId)

async def get_categories(pageSize, nthPage):
    categories = model_actions.getting_categories(pageSize, nthPage)
    return categories

async def get_category(categoryId):
    category = model_actions.getting_category(categoryId)
    return category

async def delete_category(categoryId):
    model_actions.deleting_category(categoryId)

async def delete_tag(tagId):
    model_actions.deleting_tag(tagId)
    
async def get_tags(pageSize, nthPage):
    tags = model_actions.getting_tags(pageSize, nthPage)
    return tags

async def get_tags_by_ids(tagIds):
    tags_data = model_actions.getting_tags_data_from_ids(tagIds)
    return tags_data

async def delete_model(modelId):
    model_actions.deleting_model(modelId)

async def add_review_to_model(modelId, reviewId , userId):
    model_actions.adding_review(modelId, reviewId,userId)
    
async def delete_review_from_model(modelId, reviewId,userId):
    model_actions.deleting_review_from_model_db(modelId,reviewId,userId)

async def delete_review_by_admin(reviewId):
    model_actions.deleting_review_by_admin(reviewId)