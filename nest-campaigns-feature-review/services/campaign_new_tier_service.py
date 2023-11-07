from fastapi import HTTPException, status
from campaign_db import campaign_actions,model_actions
from bson import ObjectId
from utils import utils
import httpx, os
from services import uploads
from uuid import uuid4
from datetime import datetime, timezone
from fastapi.encoders import jsonable_encoder
from routes.tmp import encryptScript
from services import campaign_new_service
from logger.logging import getLogger
from services import m2m_calls
from config import read_yaml
from models import campaignNew
import time
logger = getLogger(__name__)


def creating_campaign_tier_data(campaignId, data):    
    try:
        updated_tiers = campaign_actions.put_campaign_tier_data(campaignId, data)        
        return updated_tiers
    except HTTPException as e:
        logger.error(e)
        raise e


def updating_tier_data_in_database(campaignId, data):
    try:
        campaign_actions.update_tier(campaignId, data)
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


async def get_tier_details(request,tierId):
    tier , user_id,campaign_id,basics,milestones = campaign_actions.get_tier_from_campaign(tierId)
    user_data = await m2m_calls.get_user_data(request,user_id)
    tier["userData"] = user_data
    tier["campaignId"]  = campaign_id
    return tier


def delete_tier_from_campaigns(tier_id, campaign_id):
    return campaign_actions.delete_tier_from_campaigns(tier_id, campaign_id)



async def get_tiers(request,tierIds):
    tiers = []
    user_ids = []
    userId = request.state.user_id
    try:
        str_time = time.time()
        for tierId in tierIds:
            response = campaignNew.TiersResponseCart()
            tier , user_id , campaign_id, basics , milestones = campaign_actions.get_tier_from_campaign(tierId)
            
            response.itemName = tier.get("tierTitle")
            response.itemDp = tier.get("tierDp")
            response.campaignId = campaign_id
            response.itemId = tier.get("tierId")

            if tier["reviewData"]:
                for review_data in tier["reviewData"]:
                    reviewId = review_data["reviewId"]
                    reviewerId = review_data["reviewerId"]
                    if reviewerId == userId:
                        response.reviewId = reviewId
                    else:
                        response.reviewId = None
            else:
                response.reviewId = None
            user_ids.append(user_id)
            tiers.append(response.dict())
        end_time = time.time() - str_time
        logger.info(f"time to fetch from db {end_time}")

        logger.debug(f"calling user service to get user data")
       
        users_data = await m2m_calls.get_users_data(request,user_ids)

        logger.debug(f"got user data from user service")
        for user_data,tier_response in zip(users_data,tiers):
            tier_response["artistName"] = user_data["username"]
            tier_response["artistDp"] = user_data['displayInformation']['profilePicture']['croppedPictureUrl']
            
        return tiers
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="error in getting tiers")

async def get_campaigns(request,campaignIds):
    campaigns = []
    user_ids = []
    try:
        for campaign_id in campaignIds:
            campaign,user_id = campaign_actions.get_campaign_from_db(campaign_id)
            campaign["campaignId"] = campaign_id
            campaigns.append(campaign)
            user_ids.append(user_id)
        users_data = await m2m_calls.get_users_data(request,user_ids)
        for user_data,camp in zip(users_data,campaigns):
            camp["userData"] = user_data
        return campaigns
    
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="error in getting tiers")

async def add_buyer_to_tier(request,tierIds, buyerId,background_task):
    try:
        for tierId in tierIds:
            tuple = campaign_actions.get_tier_from_campaign(tierId)
            if tuple is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Tier not found")
            tier = tuple[0]
            campaign_owner_user_id = tuple[1]
            campaign_id = tuple[2]
            basics = tuple[3]
            milestones = tuple[4]
            campaign_name = basics.get("campaignTitle")
            backers_list = []
            backers_list.append(buyerId)
            raised_total = await campaign_new_service.get_raised_total(campaign_id)

            if tier["isEarlyBird"]:
                campaign_actions.add_buyer_to_tier_in_earlybird(tierId, buyerId)
                tier_amount = float(tier["earlyBird"]["amount"])
            else:
                campaign_actions.add_buyer_to_tier(tierId, buyerId)
                tier_amount = float(tier["tierAmount"])
            if tier["earlyBird"]:
                for backer in tier["earlyBird"]["backers"]:
                    backers_list.append(backer)
            
            for backer in tier["backers"]:
                backers_list.append(backer)

            for milestone in milestones:
                    milestone_threshold_amount = float(milestone["milestoneThreshold"])
                    if raised_total + tier_amount >= milestone_threshold_amount:
                        milestone_rewards = milestone["modelIds"]
                        campaign_actions.milestone_unlocked(campaign_id, milestone["milestoneId"])
                        background_task.add_task(m2m_calls.send_email_to_backers,request,campaign_owner_user_id,campaign_name,milestone["milestoneTitle"],backers_list,milestone_rewards)

    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in adding buyer to tier")