from urllib.parse import quote
from fastapi import HTTPException, status
import requests
from campaign_db import campaign_actions
from utils import utils
from datetime import datetime
from fastapi.encoders import jsonable_encoder
from services import uploads , notification_calls
from pymongo.errors import ServerSelectionTimeoutError
from config import read_yaml
from logger.logging import getLogger
from config import read_yaml
from services import m2m_calls,modelService
logger = getLogger(__name__)



async def post_campaign(userId):
    campaignId = campaign_actions.posting_campaign(userId)
    return campaignId
    
def update_approval_status(campaignId, new_state):
    campaign_actions.update_approval_status(campaignId, new_state)


def get_status(campaignId):
    return campaign_actions.get_approval_status(campaignId)

def add_tag(campaignId,tags):
    try:
        if len(tags) > 5:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Maximum 5 tags are allowed")
        for tag in tags:
            tag_value = tag.lower().replace(" ","")
            url_encoded_value = quote(tag_value)
            tag_lable = tag
            campaign_actions.adding_tag(campaignId,url_encoded_value,tag_lable)
    except Exception as e :
        logger.error(e)
        raise e

async def get_campaign_details(campaignId, field):
    return campaign_actions.get_campaign_details(campaignId, field)


def fetches_id_from_url(url):
    id = url.removeprefix("https://ucarecdn.com/").removesuffix("/")
    return id




async def update_campaign(campaignId, campaign_dict):
    campaign_actions.update_campaign(campaignId, campaign_dict)

async def set_cropped_url(campaignId, imageId, croppedUrl):
    campaign_actions.update_cropped_url(campaignId, imageId, croppedUrl)

async def push_image(basics_images, modelId):
    campaign_actions.pushing_image(basics_images, modelId)

async def deleting_campaignImage(campaignId, imageId):
    campaign_actions.delete_campaignImage(campaignId, imageId)

def skiplimit(pageSize, pageNum):
    try:
        cursor = campaign_actions.skipping_campaigns(pageSize, pageNum)
        return [x for x in cursor]
    except HTTPException as e:
        logger.error(e)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR , detail= str(e))


def skiplimit_for_user(_status,userId, pageSize, pageNum):
    try:
        cursor = campaign_actions.skipping_campaigns_for_user(_status,userId, pageSize, pageNum)
        return [x for x in cursor]
    except HTTPException as e:
        logger.error(e)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail= str(e))


async def fetching_campaigns_data_ui(request,campaigns):
    if len(campaigns) == 0:
        logger.error("No campaign exists")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No campaign exists"
        )
    try:
        results = []
        user_ids_list = []
        for campaign in campaigns:
            raised_total = 0.0
            total_backers = 0
            if campaign.get("rewardAndTier") and campaign["rewardAndTier"] != []:
                max_ending_in = campaign["rewardAndTier"][0]["endingDate"]       
                no_of_tiers = len(campaign["rewardAndTier"])
            
                for tier in campaign["rewardAndTier"]:                
                    if tier["earlyBird"]:
                        early_bird_backers = len(tier["earlyBird"]["backers"])
                        early_bird_amount = tier["earlyBird"]["amount"]
                        total_backers+=early_bird_backers   
                        raised_total+= float(early_bird_amount) * early_bird_backers
                        max_ending_in = max(max_ending_in, tier["earlyBird"]["endingDate"])
                    tier_amount = tier["tierAmount"]
                    tier_backers = len(tier["backers"])
                    total_backers+=tier_backers
                    raised_total+= float(tier_amount) * tier_backers
                    max_ending_in = max(max_ending_in, tier["endingDate"])

            user_id = campaign.get("userId", "")
            user_ids_list.append(user_id)
            result = {
                "campaignId": str(campaign.get("_id")),
                "statusOfCampaign": campaign.get("statusOfCampaign"),
                "raisedTotal":raised_total,
                "campaignTitle": campaign.get("basics", {}).get("campaignTitle", ""),
                "coverImage":campaign.get("basics").get("coverImage"),
                "endingOn": max_ending_in,
                "artistUserId": user_id,
                "noOfTiers" : no_of_tiers,
                
            }
            results.append(result)
        users_data = await m2m_calls.get_users_data(request,user_ids_list)
        for user_data , result in zip(users_data,results):
            result["artistUserName"] = user_data.get("username", "")
            result["artistProfilePicture"] = user_data["displayInformation"]["profilePicture"]["pictureUrl"]
            result["artistProfilePictureCropped"] = user_data["displayInformation"]["profilePicture"]["croppedPictureUrl"]
        
        return results
    
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail=str(e))


async def getting_campaign_data(request,campaignId: str):
    try:
        campaign,campaign_owner_id = campaign_actions.get_campaign_from_db(campaignId)
        basics = campaign.get("basics", {})
        story = campaign.get("story", {})
        user_data = await m2m_calls.get_user_data(request,campaign_owner_id)
        rewardAndTier = campaign.get("rewardAndTier", [])
        milestones = campaign.get("milestone", [])
        raised_total = 0.0
        total_backers = 0
        review_ids = []
        if rewardAndTier and rewardAndTier != []:
                max_ending_in = campaign["rewardAndTier"][0]["endingDate"]
            
                for tier in campaign["rewardAndTier"]:                
                    if tier["earlyBird"]:
                        early_bird_backers = len(tier["earlyBird"]["backers"])
                        early_bird_amount = tier["earlyBird"]["amount"]
                        total_backers+=early_bird_backers   
                        raised_total+= float(early_bird_amount) * early_bird_backers
                        max_ending_in = max(max_ending_in, tier["earlyBird"]["endingDate"])
                    
                    tier_amount = tier["tierAmount"]
                    tier_backers = len(tier["backers"])
                    total_backers+=tier_backers
                    raised_total+= float(tier_amount) * tier_backers
                    max_ending_in = max(max_ending_in, tier["endingDate"])

                    for review_data in tier["reviewData"]:
                        review_id = review_data["reviewId"]
                        review_ids.append(review_id)

        campaign_data = {
            "campaignBasics": basics,
            "status": campaign.get("statusOfCampaign"),
            "numberOfLikes": len(campaign.get("likedBy", [])),
            "totalRaised": raised_total,
            "campaignCreatorName": user_data.get("username", ""),
            "campaingCreatorEmail": user_data.get("email", ""),
            "campaignStory" : story,
            "campaignComments" : campaign.get("commentIds", []),
            "totalBackers": total_backers,
            "campaignEndingOn": max_ending_in,
            "reviewIds" : review_ids,
            "campaignRewardAndTier" : rewardAndTier,
            "campaignMilestones" : milestones,
            "isCampaignReported" : campaign.get("reported" , False),
        }
        return campaign_data

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

async def get_raised_total(campaignId):
    try:
        logger.info("getting raised total for campaign")
        campaign,campaign_owner_id = campaign_actions.get_campaign_from_db(campaignId)
        rewardAndTier = campaign.get("rewardAndTier", [])
        milestones = campaign.get("milestone", [])
        raised_total = 0.0
        total_backers = 0
        if rewardAndTier and rewardAndTier != []:
            
                for tier in campaign["rewardAndTier"]:                
                    if tier["earlyBird"]:
                        early_bird_backers = len(tier["earlyBird"]["backers"])
                        early_bird_amount = tier["earlyBird"]["amount"]
                        total_backers+=early_bird_backers   
                        raised_total+= float(early_bird_amount) * early_bird_backers
                    
                    tier_amount = tier["tierAmount"]
                    tier_backers = len(tier["backers"])
                    total_backers+=tier_backers
                    raised_total+= float(tier_amount) * tier_backers
        return raised_total

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


####################################### cover image and basic images services #################################
def post_basic_images(campaignId , urls):
    campaign_actions.posting_basic_images(campaignId,urls)

def set_campaign_meta_image(campaignID, url):
    campaign_actions.set_campaign_meta_image(campaignID, url)

def set_campaign_premarketing_image(campaignID, url):
    campaign_actions.set_campaign_premarketing_image(campaignID, url)

async def set_cover_image(campaignId, url):
    campaign_actions.setting_cover_image(campaignId , url)

async def update_campaigns_approved_to_pre_launch():
    try:
        campaign_actions.update_campaigns_approved_to_pre_launch()
    except Exception as e:
        raise e

################################################################################################################

async def toggle_like(request,campaignId: str, userId: str, likeState,background_task):
    try:
        if likeState not in [-1, 1]:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail= "like state to be in -1 or 1")
     
        if likeState == 1:
            background_task.add_task(notification_calls.in_app_campaign_like,request,campaignId)

        campaign_actions.toggle_like(campaignId, userId, likeState)
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


async def post_faq_data(campaignId, data):
    try:
        campaign , campaign_owner_id = campaign_actions.get_campaign_from_db(campaignId)
        if campaign["story"]:
            faqs_data = campaign["story"]["faqs"]
            if len(faqs_data) >= 50:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail=f"user with user id-{campaign_owner_id} tried to add more than 50 faqs ")
        campaign_actions.posting_faq_data(campaignId, data)
        return True
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR , detail=str(e))


def delete_faq(campaignId: str, faqId: str):
    try:
        campaign_actions.deleting_faq(campaignId, faqId)
    except Exception as e:
        logger.error(e)
        raise e


async def update_faq(campaignId,faqId, data):
    try:
        campaign_actions.updating_faq(campaignId,faqId, data)
    except Exception as e:
        raise e


def deleting_display_url(campaignId: str):
    try:
        campaign_actions.delete_display_url(campaignId)
    except HTTPException as e:
        logger.error(e)
        raise e

def deleting_meta_url(campaignId: str):
    try:
        campaign_actions.delete_meta_url(campaignId)
    except HTTPException as e:
        logger.error(e)
        raise e

def get_display_url(campaignId: str):
    try:
        url = campaign_actions.getting_campaignDP_from_campaigns(campaignId)
        return url
    except HTTPException as e:
        logger.error(e)
        raise


def add_milestone(campaignId, milestoneData):    
    return campaign_actions.add_milestone(campaignId, milestoneData)    


def get_milestone_details(campaignId, milestoneId):
    result = campaign_actions.get_milestone(campaignId, milestoneId)
    return result


async def delete_milestone(campaignId, milestoneId):
    campaign_actions.delete_milestone(campaignId, milestoneId)

def is_campaign_live(campaignId):
    try:
        return campaign_actions.is_campaign_live(campaignId)
    except Exception as e:
        raise Exception(e)


def update_earlybird_tiers():
    return campaign_actions.update_earlybird_tiers()


def get_field_length(campaignId, field):
    return campaign_actions.get_field_length(campaignId, field)


async def get_prematurely_ended_campaigns():
    campaigns = campaign_actions.get_prematurely_ended_campaigns()
    return campaigns

def get_userid_from_campaignid(campaignId):
    campaign = campaign_actions.find_campaign_from_campaignid(campaignId)
    user_id = campaign["userId"]
    if user_id == None:
        logger.error("no such user name exist")
    else:
        return user_id

async def add_comment_to_campaign(request,campaignId , commentId,background_tasks):
    # await notification_calls.in_app_campaign_comment(request,campaignId)
    background_tasks.add_task(notification_calls.in_app_campaign_comment,request,campaignId)
    campaign_actions.adding_comment_to_campaign(campaignId,commentId)

async def delete_comment_from_campaign(campaignId, commentId):
    campaign_actions.deleting_comment_from_campaign(campaignId,commentId)


async def add_comment_to_update( updateId , commentId):
    campaign_actions.adding_comment_to_update(updateId,commentId)
    
async def delete_comment_from_update(updateId, commentId):
    campaign_actions.deleting_comment_from_update(updateId,commentId)

###########################     updates services    ##################################################

async def create_update(campaignId, data):
    return campaign_actions.posting_update_data(campaignId, data)
    

async def edit_update(campaignId , data):
    try:
        campaign_actions.edit_update(campaignId, data)
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

async def get_update_details(campaignId):
    result = campaign_actions.getting_updates(campaignId)
    return result


async def delete_update(campaignId, updateId):
    campaign_actions.deleting_update(campaignId, updateId)


################################## milestone additions ##########################################

def update_milestone(campaignId, data):
    try:
        campaign_actions.update_milestone(campaignId, data)
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

def report_campaign(campaignId, userId,comment):
    try:
        campaign_actions.reporting_campaign(campaignId, userId,comment)
    except Exception as e:
        logger.error("error in reporting campaign")
        raise e
    
def add_user_to_campaign_wishlist(campaignId, userId):
    try:
        campaign_actions.adding_user_to_campaign_wishlist(campaignId, userId)
    except Exception as e:
        logger.error("error in adding user to campaign wishlist")
        raise e

def add_user_to_campaign_premarketing_signee(campaignId, userId):
    try:
        campaign_actions.adding_user_to_campaign_premarketing_signee(campaignId, userId)
    except Exception as e:
        logger.error("error in adding user to campaign premarketing signee")
        raise e

async def add_review_to_campaign(campaignId, reviewId,tierId,userId):
    try:
        campaign_actions.adding_review_to_campaign_db(campaignId, reviewId,tierId,userId)
    except Exception as e :
        logger.error("error in adding review to campaign")
        raise e
    
async def delete_review_from_campaign(campaignId,reviewId,tierId,userId):
    try:
        campaign_actions.deleting_review_from_campaign_db(campaignId, reviewId,tierId,userId)
    except Exception as e :
        logger.error("error in deleting review from campaign")
        raise e

async def get_model_files_from_campaign(campaignId,tierId):
    try:
        response = []
        campaign,campaign_owner = campaign_actions.get_campaign_from_db(campaignId)
        tiers = campaign["rewardAndTier"]
        if tiers is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="no tier added")
        for tier in tiers:
            if tier["tierId"] == tierId:
                modelIds = tier["modelIds"]
                if modelIds is None or []:
                    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="no model added")
        
        for modelId in modelIds:
            res = await modelService.get_model_files(modelId)
            response.append(res)
        return response

    except Exception as e:
        logger.error(e)
        raise e
    
async def get_user_campaigns_and_models(userId):
    return campaign_actions.getting_user_campaigns_models(userId)