from pymongo import ReturnDocument
from datetime import datetime, timezone, timedelta
from models import campaignNew,model
from pymongo import UpdateOne, DESCENDING
from fastapi import HTTPException, status
from bson import ObjectId
from datetime import datetime, timezone
from schemas.tags import *
from uuid import uuid4
from pymongo.errors import ServerSelectionTimeoutError
from config.read_yaml import config
import pymongo, json
from pymongo import MongoClient
from config.read_yaml import *
from . import db_client, model_actions
from pymongo import ReturnDocument
from models import campaignNew

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


from logger.logging import getLogger

logger = getLogger(__name__)
try:
    db = db_client.client[config.mongodb["username"]]
except ServerSelectionTimeoutError as e:
    logger.error(f"Could not connect to MongoDB: {e}")

userCollection = db["user"]
campaign_collection = db["campaigns"]
tags_collection = db["tags"]
state_collection = db["stateDB"]
models_collection = db["models"]


def update_approval_status_and_ended_date(campaignId, new_state):
    try:
        query = {"_id": ObjectId(campaignId)}
        new_values = {
            "$set": {
                "statusOfCampaign": new_state,
                "updatedOn": datetime.utcnow(),
                "endedOn": datetime.utcnow(),
            }
        }

        campaign_collection.update_one(query, new_values)
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="not able to update approval")


def update_approval_status(campaignId, new_state):
    try:
        query = {"_id": ObjectId(campaignId)}
        new_values = {
            "$set": {"statusOfCampaign": new_state, "updatedOn": datetime.utcnow()}
        }

        campaign_collection.update_one(query, new_values)
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="error in updating approval")


def get_approval_status(campaign_id):
    try:
        campaign_data = campaign_collection.find_one({"_id": ObjectId(campaign_id)})
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    if campaign_data is not None:
        return campaign_data.get("statusOfCampaign")
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No such model exist"
        )


def adding_tag(campaignId , tag_value , tag_label):
    tag = tags_collection.find_one({"value" : tag_value})
    try:
        if tag is None:
            tag = tags_collection.insert_one({"value" : tag_value , "label" : tag_label})
            tag_id = str(tag.inserted_id)
            campaign_collection.update_one({"_id" : ObjectId(campaignId)} , {"$addToSet" : {"basics.tags" : tag_id}})
        else:
            tag_id = str(tag["_id"])
            campaign_collection.update_one({"_id" : ObjectId(campaignId)} , {"$addToSet" : {"basics.tags" : tag_id}})

    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in adding tags"
        )



# def get_campaign_details(campaignId, field):
#     try:        
#         campaign = campaign_collection.find_one({"_id": ObjectId(campaignId)})
#         if not campaign:
#             raise HTTPException(status_code=404, detail="Campaign not found")        

#         if field not in campaign:
#             raise HTTPException(
#                 status_code=400, detail=f"No such field {field} in the campaign"
#             )
#         return {field: campaign[field]}
#     except ServerSelectionTimeoutError as e:
#         logger.error(e)
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Failed to connect to the database",
#         )
#     except Exception as e:
#         logger.error(e)
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


# def find_campaign_from_campaignid(id: str):
#     logger.info(f"Finding campaign with ID: {id}")
#     try:
#         camp = campaign_collection.find_one({"_id": ObjectId(id)})
#     except ServerSelectionTimeoutError as e:
#         logger.error(e)
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Failed to connect to the database",
#         )

#     if camp is None:
#         logger.error("Campaign not found")
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found"
#         )

#     camp["_id"] = str(camp["_id"])
#     logger.debug(f"Campaign data found succesfully ")
#     return camp


def posting_campaign(userId):
    user_id = userId
    campaign = campaignNew.Campaign(
        userId=user_id,
        createdOn=datetime.utcnow(),
        updatedOn=datetime.utcnow(),
        statusOfCampaign="Draft",
        adminModified=False,
        updates=[],
        commentIds=[],
        likedBy=[],
        bookmarks=[],
        milestone=[],
        rewardAndTier=[],
        reportData=[],
        reported=False,
        wishlistedBy=[],
    )
    campaign = campaign.dict()
    try:
        result = campaign_collection.insert_one(campaign)
        campaignId = str(result.inserted_id)
        return campaignId

    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="error in posting campaign")


def update_campaign(campaignId, campaign_dict):
    try:
        campaign_dict = {k: v for k, v in campaign_dict.items() if v is not None }
        campaign_dict["updatedOn"] = datetime.utcnow()
        result = campaign_collection.update_one(
            {"_id": ObjectId(campaignId)}, {"$set": campaign_dict}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Campaign not found")
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in updating campaing details")


def get_nested(data, *args):
    if args and data:
        element = args[0]
        if element:
            value = data.get(element)
            return value if len(args) == 1 else get_nested(value, *args[1:])
    return None


def  aign_details(campaignId, field):
    try:                
        campaign = campaign_collection.find_one({"_id": ObjectId(campaignId)})
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")    

        if field == 'all':            
            campaign.pop('_id',None)
            return campaign

        nested_fields = field.split(".")
        field_value = get_nested(campaign, *nested_fields)
    
        if field_value is None:
            raise HTTPException(
                status_code=400, detail=f"No such field {field} in the campaign"
            )

        return {field: field_value}
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="error in getting campaign details")


def skipping_campaigns(page_size, page_num):
    skips = page_size * (page_num - 1)
    try:
        cursor = (
            campaign_collection.find({"statusOfCampaign": "Live"})
            .sort("updatedOn",-1)
            .skip(skips)
            .limit(page_size)
        )
        return cursor
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,detail="error in skipping campaigns"
        )


def skipping_campaigns_for_user(_status,userId, page_size, page_num):
    skips = page_size * (page_num - 1)
    try:
        if _status == "all":
            query = {"userId" : userId}
        else:
            query = {"userId" : userId, "statusOfCampaign": _status}
        cursor = (
            campaign_collection.find(query).skip(skips).limit(page_size)
        )
        return cursor
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in skipping campaigns"
        )

def update_pre_launched_to_live():
    try:
        now = datetime.utcnow()

        logger.info("Checking for campaigns to update...")

        update_query = {"$set": {"statusOfCampaign": "Live", "updatedOn": now}}
        campaigns_to_update_query = {
            "statusOfCampaign": "Pre_Launched",
            "basics.launchDate": {"$lt": now},
        }

        campaigns_to_update = list(campaign_collection.find(campaigns_to_update_query))
        for campaign in campaigns_to_update:
            user_id = campaign["userId"]
            update_result = campaign_collection.update_one(
                {"_id": ObjectId(campaign["_id"])}, update_query
            )
            if update_result.modified_count > 0:
                model_actions.add_state_change_to_db(
                    campaign["_id"], "Pre_Launched","Live", user_id, "Campaign launched.", "campaign","approval"
                )
        logger.debug(f"{len(campaigns_to_update)} campaigns updated.")
        return campaigns_to_update

    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

# def update_approved_to_live():
#     try:
#         now = datetime.utcnow()
#         # tomorrow = now + timedelta(days=1)
#         # tomorrow_start = datetime(tomorrow.year, tomorrow.month, tomorrow.day)
#         # tomorrow_end = tomorrow_start + timedelta(days=1)

#         print("Checking for campaigns to update...")

#         update_query = {"$set": {"statusOfCampaign": "Live", "updatedOn": now}}
#         campaigns_to_update_query = {
#             "statusOfCampaign": "Approved",
#             "basics.launchDate": {"$lte" : now},
#         }

#         campaigns_to_update = campaign_collection.find(campaigns_to_update_query)
#         count = 0
#         for campaign in campaigns_to_update:
#             user_id = campaign["userId"]
#             update_result = campaign_collection.update_one(
#                 {"_id": ObjectId(campaign["_id"])}, update_query
#             )
#             if update_result.modified_count > 0:
#                 model_actions.add_state_change_to_db(
#                     campaign["_id"], "Approved","Live", user_id, "Campaign launched.", "campaign","approval"
#                 )
#                 count = count + 1

#         print(f"{count} campaigns updated.")
#         return campaigns_to_update

    # except ServerSelectionTimeoutError as e:
    #     logger.error(e)
    #     raise HTTPException(
    #         status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    #         detail="Failed to connect to the database",
    #     )
    # except Exception as e:
    #     logger.error(e)
    #     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="error in updating approval to live")

#TODO add_state_change_to_db structure is changed 
def update_ending_campaigns_status():
    try:
        now = datetime.utcnow()
        tomorrow = now + timedelta(days=1)
        tomorrow_start = datetime(tomorrow.year, tomorrow.month, tomorrow.day)
        tomorrow_end = tomorrow_start + timedelta(days=1)

        print("Checking for campaigns to update...")

        update_query = {"$set": {"statusOfCampaign": "Ended", "updatedOn": now}}
        campaigns_to_update_query = {
            "statusOfCampaign": "Live",
            "basics.endingOn": {"$gte": tomorrow_start, "$lt": tomorrow_end},
        }

        campaigns_to_update = list(campaign_collection.find(campaigns_to_update_query))
        for campaign in campaigns_to_update:
            user_id = campaign["userId"]
            update_result = campaign_collection.update_one(
                {"_id": ObjectId(campaign["_id"])}, update_query
            )
            if update_result.modified_count > 0:
                model_actions.add_state_change_to_db(
                    campaign["_id"], "Live","Ended", user_id, "Campaign launched.", "campaign","approval"
                )

        return f"{len(campaigns_to_update)} campaigns updated."

    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="error in updating campaign status")


# TODO:add this is to user db also
def toggle_like(campaignId: str, userId: str, like_state: int):
    logger.info(
        f"toggling like on campaignId=>{campaignId} from userId=>{userId} with state=>{like_state}"
    )
    try:
        # if like_state not in [-1,1]:
        #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="like_state must be either 1 (to add like) or -1 (to remove like)")
        if like_state == 1:
            campaign_collection.update_one(
                {"_id": ObjectId(campaignId)},
                {
                    "$push": {"likedBy": userId},
                    "$set": {"updatedOn": datetime.utcnow()},
                },
            )
        else:
            campaign_collection.update_one(
                {"_id": ObjectId(campaignId)},
                {
                    "$pull": {"likedBy": userId},
                    "$set": {"updatedOn": datetime.utcnow()},
                },
            )
        logger.debug(
        f"like state toggled by userId=>{userId} on campaignId=>{campaignId} to state=>{like_state}"
        )
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="error in toggling like state",
        )

def update_cropped_url(campaignId: str, imageId: str, newUrl: str):
    try:
        campaign = campaign_collection.find_one_and_update(
            {"_id": ObjectId(campaignId), "basics.basicsImages.imageId": imageId},
            {
                "$set": {"basicsImages.$.croppedUrl": newUrl},
            },
        )
        if campaign is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"campaign with {campaignId} not found")

    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="error in updating cropped url")


def delete_campaignImage(campaignId: str, imageId: str):
    logger.info(f"Deleting modelImage in database")

    try:
        campaign = campaign_collection.find_one_and_update(
            {"_id": ObjectId(campaignId)},
            {
                "$pull": {"basics.basicsImages": {"imageId": imageId}},
                "$set": {"updatedAt": datetime.utcnow()},
            },
            
        )

        if campaign is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"campaign with {campaignId} not found")

    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )

    except Exception as e:
        logger.error(
            f"Campaign Asset not deleted from database correctly Error :str({e})"
        )
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="error in deleting campaign image")



def getting_story_data(campaignId):
    logger.info(f"finding campaign of campaignId :{campaignId}")
    try:
        story = campaign_collection.find_one({"_id": ObjectId(campaignId)})["story"]
        logger.debug(f"Story data recieved")
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    if story == None:
        logger.error("Story not set")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Story not set"
        )
    else:
        return story


########################  TIERS ########################################


def put_campaign_tier_data(campaignId, data):
    logger.info(f"adding campaign tier data with campaignId=>{campaignId}")
    try:
        print("onee")
        campaign_collection.update_one(
            {"_id": ObjectId(campaignId)},
            {
                "$push": {"rewardAndTier": data},
                "$set": {"updatedOn": datetime.utcnow()},
            },
        )                
        updatedCampaign = campaign_collection.find_one({"_id": ObjectId(campaignId)})        
        return updatedCampaign["rewardAndTier"]
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,detail="error in adding tier"
        )


def update_tier(campaignId: str, data: list):
    logger.info(f"updating campaign tier data with campaignId=>{campaignId}")
    try:
        for tier in data:
            tierId = tier.get("tierId")
            query = {
                "_id": ObjectId(campaignId),
                "rewardAndTier": {"$exists": True, "$not": {"$size": 0}},
            }
            campaign = campaign_collection.find_one(query)

            if campaign:
                query = {"_id": ObjectId(campaignId), "rewardAndTier.tierId": tierId}
                update = {
                    "$set": {"rewardAndTier.$": tier, "updatedOn": datetime.utcnow()}
                }
                result = campaign_collection.find_one_and_update(
                    query, update, return_document=ReturnDocument.AFTER
                )

                if result is not None:
                    logger.info(f"Tier with tierId {tierId} updated.")
                    continue

            query = {"_id": ObjectId(campaignId)}
            update = {
                "$push": {"tiers": tier},
                "$set": {"updatedOn": datetime.utcnow()},
            }
            res = campaign_collection.update_one(query, update)
            print("res is", res)
            logger.info(f"New tier with tierId {tierId} created.")

    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,detail="error in updating tier"
        )


def posting_faq_data(campaignId , data):
    logger.info(f"Posting faq with campignId=>{campaignId}")
    try:
        campaign_collection.update_one(
            {"_id": ObjectId(campaignId)},
            {
                "$push": {"story.faqs": data},
                "$set": {"updatedOn": datetime.utcnow()},
            },
        )
        logger.debug(f"campaignId{campaignId}  faq posted")
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,detail="error in posting faq"
        )


def deleting_faq(campaignId: str, faqId: str):
    try:
        campaign_collection.update_one(
            {"_id": ObjectId(campaignId)},
            {
                "$pull": {"story.faqs": {"faqId": faqId}},
                "$set": {"updatedOn": datetime.utcnow()},
            },
        )
        logger.debug(f"faq with faqId=>{faqId} and campaignId{campaignId} deleted")
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,detail="error in deleting faq"
        )


def updating_faq(campaignId , faqId , data):
    logger.info(f"updating faq with campignId=>{campaignId} , faqId=>{faqId}")
    try:
        query = {"_id": ObjectId(campaignId), "story.faqs.faqId": faqId}
        update = {
            "$set": {"story.faqs.$": data, "updatedOn": datetime.utcnow()}
        }
        campaign_collection.find_one_and_update(query, update)
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Failed to connect to the database"
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,detail="error in updating faq"
        )
############################################ basic images and cover images #########################################

def posting_basic_images(campaignId, urls):
    try:
        campaign_collection.update_one(
            {"_id": ObjectId(campaignId)},
            {"$set": {"basics.basicImages": urls, "updatedOn": datetime.utcnow()}},
        )
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="error in posting basic images")
    
def set_campaign_meta_image(campaignId, url):
    try:
        campaign_collection.update_one(
            {"_id": ObjectId(campaignId)},
            {"$set": {"basics.metaImage": url, "updatedOn": datetime.utcnow()}},
        )
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="error in posting meta image",
        )
    
def set_campaign_premarketing_image(campaignId, url):
    try:
        campaign_collection.update_one(
            {"_id": ObjectId(campaignId)},
            {"$set": {"premarketing.premarketingDp": url, "updatedOn": datetime.utcnow()}},
        )
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="error in posting premarketing image",
        )
def setting_cover_image(campaignId , url):
    try:
        campaign_collection.update_one(
            {"_id": ObjectId(campaignId)},
            {"$set": {"basics.coverImage": url, "updatedOn": datetime.utcnow()}},
        )
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:        
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="error in posting cover image",
        )
def delete_display_url(campaignId: str):
    try:
        logger.info(f"Deleting Display Url In Database with camapignId {campaignId}")
        campaign = campaign_collection.find_one_and_update(
            {"_id": ObjectId(campaignId)},
            {"$set": {"basics.coverImage": "", "updatedOn": datetime.utcnow()}},
        )
        logger.debug(f"Display Url Deleted In Database with id {campaignId}")
        return campaign["basics"]["coverImage"]

    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(
            f"Not able to delete display url in Database with id {campaignId} , Error:str({e})"
        )
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not Posted")

def delete_meta_url(campaignId: str):
    try:
        logger.info(f"Deleting meta Url In Database with camapignId {campaignId}")
        campaign = campaign_collection.find_one_and_update(
            {"_id": ObjectId(campaignId)},
            {"$set": {"basics.metaImage": "", "updatedOn": datetime.utcnow()}},
        )
        logger.debug(f"Meta Url Deleted In Database with id {campaignId}")
        return campaign["basics"]["metaImage"]

    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(
            f"Not able to delete display url in Database with id {campaignId} , Error:str({e})"
        )
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not Posted")

def getting_campaignDP_from_campaigns(campaignId):
    logger.info(f"finding campaign of campaignId :{campaignId}")
    try:
        coverImage = campaign_collection.find_one({"_id": ObjectId(campaignId)})["basics"]["coverImage"]
        logger.debug(f"campaignAssets recieved")
        return coverImage
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"error in getting campaign assets",
        )


def add_milestone(campaignId, milestoneDetails):
    try:
        campaign = campaign_collection.find_one_and_update(
            {"_id": ObjectId(campaignId)},
            {
                "$push": {"milestone": milestoneDetails},
                "$set": {"updatedOn": datetime.utcnow()},
            },
            return_document=ReturnDocument.AFTER,
        )
        return milestoneDetails
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"error in adding milestone",
        )


def get_milestone(campaignId, milestoneId):
    result = {}
    try:
        campaign = campaign_collection.find_one({"_id": ObjectId(campaignId)})
        for milestone in campaign.get("milestone", []):
            if milestone.get("milestoneId") == milestoneId:
                result = milestone
                break
        return result
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Milestone not found",
        )


def delete_milestone(campaignId, milestoneId):
    try:
        campaign_collection.update_one(
            {"_id": ObjectId(campaignId)},
            {
                "$pull": {"milestone": {"milestoneId": milestoneId}},
                "$set": {"updatedOn": datetime.utcnow()},
            },
        )
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Failed to connect to the database")
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"error in deleting milestone")


def get_campaigns_ending_in_three_days():
    try:
        now = datetime.utcnow()
        three_days_later = now + timedelta(days=3)

        three_days_later_start = datetime(
            three_days_later.year, three_days_later.month, three_days_later.day
        )
        three_days_later_end = three_days_later_start + timedelta(days=1)

        campaigns_to_notify_query = {
            "statusOfCampaign": "Live",
            "basics.endingOn": {
                "$gte": three_days_later_start,
                "$lt": three_days_later_end,
            },
        }

        return list(campaign_collection.find(campaigns_to_notify_query))
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="error in getting campaigns ending in three days",
        )


def get_early_bird_tier_in_three_days():
    try:
        now = datetime.utcnow()
        three_days_later = now + timedelta(days=3)

        three_days_later_start = datetime(
            three_days_later.year, three_days_later.month, three_days_later.day
        )
        three_days_later_end = three_days_later_start + timedelta(days=1)

        campaigns_to_notify_query = {
            "statusOfCampaign": "Live",
            "basics.endingOn": {
                "$gte": three_days_later_start,
                "$lt": three_days_later_end,
            },
        }

        return campaign_collection.find(campaigns_to_notify_query)
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="error in getting early bird tier in three days",
        )


def get_earlybird_tiers_ending_in_three_days():
    try:
        now = datetime.utcnow()
        three_days_later = now + timedelta(days=3)

        three_days_later_start = datetime(
            three_days_later.year, three_days_later.month, three_days_later.day
        )
        three_days_later_end = three_days_later_start + timedelta(days=1)

        ending_earlybird_tiers = []

        # assuming 'campaign_collection' is the MongoDB collection where you store the campaign data
        all_campaigns = campaign_collection.find()

        for campaign in all_campaigns:
            for tier in campaign["rewardAndTier"]:
                if (
                    tier["isEarlyBird"]
                    and tier["earlyBird"]["endingDate"] >= three_days_later_start
                    and tier["earlyBird"]["endingDate"] < three_days_later_end
                ):
                    ending_earlybird_tiers.append(
                        (campaign["userId"], campaign["_id"], (tier["earlyBird"]["endingDate"]-now))
                    )

        return ending_earlybird_tiers
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"error in gettig early bird tiers ending in three days",
        )

def is_campaign_live(campaignId):
    try:
        status = campaign_collection.find_one({"_id": ObjectId(campaignId)})[
            "statusOfCampaign"
        ]
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise Exception("Failed to connect to the database")
    
    if status == "Live":
        return True
    return False

    


def get_tier_from_campaign(tier_id: str):
    logger.info(f"getting tier with tierId=>{tier_id}")
    try:
        result = campaign_collection.find_one(
            {"rewardAndTier.tierId": tier_id}, {"_id":1 , "userId" : 1,"rewardAndTier.$": 1, "basics":1,"milestone" : 1}
        )
        if result:
            for tier in result["rewardAndTier"]:
                if tier["tierId"] == tier_id:
                    return tier,result["userId"],str(result["_id"]),result["basics"],result["milestone"]
        else:
            return None
        
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"error in getting tier from campaign",
        )


def get_campaign_from_db(campaign_id: str):
    try:
        result = campaign_collection.find_one({"_id": ObjectId(campaign_id)},{"_id":0})
        if result:
            return result,result["userId"]
        else:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")
        
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"error in getting campaign from campaign",
        ) 
    
def get_campaign_name_and_tier_name(campaign_id:str, tier_id:str):
    try:
        result = campaign_collection.find_one({"_id": ObjectId(campaign_id)},{"_id":0})
        if result:
            campaign_name = result["basics"]["campaignTitle"]
            tiers = result["rewardAndTier"]
            for tier in tiers:
                if tier["tierId"]==tier_id:
                    tier_name = tier["tierTitle"]
                    break
            return campaign_name,tier_name
        else:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")
    
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"error in getting campaign from campaign",
        ) 
        


def delete_tier_from_campaigns(tier_id, campaign_id):
    try:
        result = campaign_collection.update_one(
            {
                "_id": ObjectId(campaign_id),
                "statusOfCampaign": "Draft",
                "rewardAndTier.tierId": tier_id,
            },
            {
                "$pull": {"rewardAndTier": {"tierId": tier_id}},
                "$set": {"updatedOn": datetime.utcnow()},
            },
        )
        return result.modified_count
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"error in deleting tier from campaign",
        )


async def update_earlybird_tiers():
    now = datetime.utcnow()
    tomorrow = now + timedelta(days=1)
    tomorrow_start = datetime(tomorrow.year, tomorrow.month, tomorrow.day)
    tomorrow_end = tomorrow_start + timedelta(days=1)

    try:
        result = campaign_collection.update_many(
            {
                "rewardAndTier.isEarlyBird": True,
                "rewardAndTier.earlyBird.endingDate": tomorrow,
            },
            {
                "$set": {
                    "rewardAndTier.$.isEarlyBird": False,
                    "updatedOn": datetime.utcnow(),
                },
            },
        )
        return result.modified_count
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"error updating early bird tiers",
        )


def get_field_length(campaignId, field):
    try:
        campaign = campaign_collection.find_one({"_id": ObjectId(campaignId)})
        count = len(campaign[f"{field}"]) if field in campaign else 0
        return count
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{field} not found",
        )


# def get_tag_values(tag_ids):
#     try:
#         tag_ids = [ObjectId(id) for id in tag_ids]
#         tags = tags_collection.find({"_id": {"$in": tag_ids}})
#         tag_values = [tag["value"] for tag in tags]
#         return tag_values
#     except ServerSelectionTimeoutError as e:
#         logger.error(e)
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Failed to connect to the database",
#         )
#     except Exception as e:
#         logger.error(str(e))
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail=f"Trying to delete tiers from Campaign not in Draft state",
#         )

# def get_tags_from_ids(tag_ids):
#     try:
#         tag_ids = [ObjectId(id) for id in tag_ids]
#         tags = tags_collection.find({"_id": {"$in": tag_ids}})
#         tags = [
#             {"_id": str(tag["_id"]), "label": tag["label"], "value": tag["value"]}
#             for tag in tags
#         ]
#         return tags
#     except ServerSelectionTimeoutError as e:
#         logger.error(e)
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Failed to connect to the database",
#         )
#     except Exception as e:
#         logger.error(str(e))
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail=f"error in getting tags from ids",
#         )

def get_prematurely_ended_campaigns():
    campaigns = []
    try:
        for campaign in campaign_collection.find({"statusOfCampaign": "Ended"}):
            if (
                "endedOn" in campaign
                and "basics" in campaign
                and "endingOn" in campaign["basics"]
            ):
                if campaign["endedOn"] < campaign["basics"]["endingOn"]:
                    campaign["_id"] = str(campaign["_id"])
                    campaigns.append(campaign)
        return campaigns
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="error in getting prematurely ended campaigns")


def set_admin_modified(modified, campaignId):
    try:
        campaign_collection.update_one(
            {"_id": ObjectId(campaignId)}, {"$set": {"adminModified": modified}}
        )
        return {"message": f"adminModified field now become {modified}"}

    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="error in setting adminModified field")


def get_adminModified_value(campaignId):
    try:
        camapign = campaign_collection.find({"_id": ObjectId(campaignId)})
        return camapign["adminModified"]

    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="error in getting adminModified field")

def find_campaign_from_campaignid(id: str):
    logger.info(f"Finding campaign with ID: {id}")
    try:
        camp = campaign_collection.find_one({"_id": ObjectId(id)})
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )

    if camp is None:
        logger.error("Campaign not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found"
        )

    camp["_id"] = str(camp["_id"])
    logger.debug(f"Campaign data found succesfully ")
    return camp



##################################### milestone update added by ansh ##########################

def update_milestone(campaignId: str, data: list):
    logger.info(f"updating campaign milestone data with campaignId=>{campaignId}")
    try:
        for milestone in data:
            milestoneId = milestone.get("milestoneId")
            query = {
                "_id": ObjectId(campaignId),
                "milestone": {"$exists": True, "$not": {"$size": 0}},
            }
            campaign = campaign_collection.find_one(query)

            if campaign:
                query = {"_id": ObjectId(campaignId), "milestone.milestoneId": milestoneId}
                update = {
                    "$set": {"milestone.$": milestone, "updatedOn": datetime.utcnow()}
                }
                result = campaign_collection.find_one_and_update(
                    query, update, return_document=ReturnDocument.AFTER
                )

                if result is not None:
                    logger.info(f"milestone with milestoneId {milestoneId} updated.")
                    continue

            # query = {"_id": ObjectId(campaignId)}
            # update = {
            #     "$push": {"milestone": milestone},
            #     "$set": {"updatedOn": datetime.utcnow()},
            # }
            # campaign_collection.update_one(query, update)
            # logger.info(f"New milestone with milestoneId {milestoneId} created.")

    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,detail="error in updating milestone"
        )
###################################### updates actions ###############################################

def posting_update_data(campaignId, updateData):
    try:
        updateData["updateTime"] = datetime.utcnow()
        campaign_collection.update_one(
            {"_id": ObjectId(campaignId)},
            {
                "$push": {"updates": updateData},
                "$set": {"updatedOn": datetime.utcnow()},
                
            }
        )
        logger.debug(f"campaignId{campaignId}  update posted")
        return updateData
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in posting update"
        )


def edit_update(campaignId, data):
    logger.info(f"editing/updating update data with campaignId=>{campaignId}")
    try:
        for _update in data:
            updateId = _update.get("updateId")
            query = {
                "_id": ObjectId(campaignId),
                "updates": {"$exists": True, "$not": {"$size": 0}},
            }
            campaign = campaign_collection.find_one(query)

            if campaign:
                query = {"_id": ObjectId(campaignId), "updates.updateId": updateId}
                update = {
                    "$set": {"updates.$": _update, "updatedOn": datetime.utcnow()}
                }
                result = campaign_collection.find_one_and_update(
                    query, update, return_document=ReturnDocument.AFTER
                )

                if result is not None:
                    logger.info(f"udpate with updateId {updateId} updated.")
                    continue

            # query = {"_id": ObjectId(campaignId)}
            # update = {
            #     "$push": {"milestone": milestone},
            #     "$set": {"updatedOn": datetime.utcnow()},
            # }
            # campaign_collection.update_one(query, update)
            # logger.info(f"New milestone with milestoneId {milestoneId} created.")

    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,detail="error in updating milestone"
        )
    
def pushing_image(basics_images, campaignId):
    try:
        campaign_collection.update_one(
            {"_id": ObjectId(campaignId)}, {"$push": {"basics.basicsImages": basics_images}}
        )
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in updating images of campaign"
        )


def getting_updates(campaignId):
    result = {}
    try:
        campaign = campaign_collection.find_one({"_id": ObjectId(campaignId)})
        result = campaign.get("updates")
        return result
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"failed to get the update"
        )

def deleting_update(campaignId, updateId):
    try:
        campaign_collection.update_one(
            {"_id": ObjectId(campaignId)},
            {
                "$pull": {"updates": {"updateId": updateId}},
                "$set": {"updatedOn": datetime.utcnow()},
            },
        )
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"failed to delete the update",
        )


def get_draft_state_campaigns():
    campaign_to_notify = []
    try:
        campaign_data = campaign_collection.find({"statusOfCampaign" : "Draft"})
        for x in campaign_data:
            x["_id"] = str(x["_id"])
            campaign_to_notify.append(x)
        return campaign_to_notify
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e: 
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"failed to get the draft state campaigns",
        )

def update_campaigns_approved_to_pre_launch():
    try:
        now = datetime.utcnow()
        after_45_days = now + timedelta(days=45)



        logger.debug("Checking for campaigns to update...")

        update_query = {"$set": {"statusOfCampaign": "Pre_Launched", "updatedOn": now}}
        campaigns_to_update_query = {
            "statusOfCampaign": "Approved",
            "basics.launchDate": {"$lte" : after_45_days},
        }

        campaigns_to_update = list(campaign_collection.find(campaigns_to_update_query))
        for campaign in campaigns_to_update:
            user_id = campaign["userId"]
            update_result = campaign_collection.update_one(
                {"_id": ObjectId(campaign["_id"])}, update_query
            )
            if update_result.modified_count > 0:
                model_actions.add_state_change_to_db(
                    campaign["_id"], "Approved","Pre_Launched", user_id, "Campaign pre_launched.", "campaign","approval"
                )

        logger.debug(f"{len(campaigns_to_update)} campaigns updated.")
        return campaigns_to_update

    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    
def reporting_campaign(campaignId , userId , comment):
    try:
        campaign = campaign_collection.find_one({"_id" : ObjectId(campaignId)})
        if campaign is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="campaign not found"
            )
        if any(report_data["reportedBy"] == userId for report_data in campaign["reportData"]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="campaign already reported by this user"
            )
        report = campaignNew.ReportData(
            reportedBy = userId,
            comment = comment,
            reportedOn= datetime.utcnow()
        )
        report = report.dict()
        campaign_collection.update_one({"_id" : ObjectId(campaignId)} , {"$addToSet" : {"reportData" : report},
                                                         "$set" : {"reported" : True} })
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in reporting campaign"
        )

def adding_comment_to_campaign(campaignId , commentId):
    try:
        campaign = campaign_collection.find_one_and_update({"_id" : ObjectId(campaignId)} , {"$addToSet" : {"commentIds" : commentId}})
        if campaign is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"Campaign not found with campaignId {campaignId}"
            )
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in adding comment"
        )

def deleting_comment_from_campaign(campaignId,commentId):
    try:
        campaign = campaign_collection.find_one_and_update({"_id" : ObjectId(campaignId)} , {"$pull" : {"commentIds" : commentId}})
        if campaign is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"Campaign not found with campaignId {campaignId}"
            )
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in deleting comment"
        )
def adding_comment_to_update(updateId , commentId):
    try:
        campaign = campaign_collection.find_one_and_update({"updates.updateId" : updateId} , {"$addToSet" : {"updates.$.comments" : commentId}})
        if campaign is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"update not found with updateId {updateId} in campaign"
            )
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in adding comment"
        )

def deleting_comment_from_update(updateId,commentId):
    try:
        campaign = campaign_collection.find_one_and_update({"updates.updateId" : updateId} , {"$pull" : {"updates.$.comments" : commentId}})
        if campaign is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"update not found with updateId {updateId} in campaign"
            )
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in deleting comment"
        )

def adding_user_to_campaign_wishlist(campaignId, userId):
    try:
        campaign = campaign_collection.find_one({"_id" : ObjectId(campaignId)})
        if campaign is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="campaign not found"
            )
        campaign_collection.update_one({"_id" : ObjectId(campaignId)} , {"$addToSet" : {"wishlistedBy" : userId}})
        return {"message" : "campaign added to wishlist successfully"}
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in adding campaign to wishlist"
        )

def adding_user_to_campaign_premarketing_signee(campaignId, userId):
    try:
        campaign = campaign_collection.find_one({"_id" : ObjectId(campaignId)})
        if campaign is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="campaign not found"
            )
        campaign_collection.update_one({"_id" : ObjectId(campaignId)} , {"$addToSet" : {"premarketing.premarketingSignees" : userId}})
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in adding campaign to premarketing signee"
        )

def adding_review_to_campaign_db(campaignId, reviewId , tierId ,userId):

    try:
        review = model.Review(
            reviewId=reviewId,
            reviewerId=userId
        )
        review_dict = review.dict()
        campaign = campaign_collection.find_one_and_update({"_id" : ObjectId(campaignId),
                                                    "rewardAndTier.tierId": tierId } , {"$addToSet" : {"rewardAndTier.$.reviewData":review_dict}})
        if campaign is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"campaign not found with campaign {campaignId}"
            )
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in adding review to campaign")

def deleting_review_from_campaign_db(campaignId, reviewId,tierId,userId):
    try:
        campaign = campaign_collection.find_one_and_update({"_id" : ObjectId(campaignId),
                                                    "rewardAndTier.tierId": tierId } , {"$pull" : {"rewardAndTier.$.reviewData":{"reviewId": reviewId}}})
        if campaign is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"campaign not found with campaign {campaignId}"
            )
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in adding review to campaign")

def add_buyer_to_tier_in_earlybird(tierId, buyerId):
    try:
        logger.info("Adding buyer to tier in earlybird")
        campaign = campaign_collection.find_one_and_update({"rewardAndTier.tierId" : tierId} , {"$push" : {"rewardAndTier.$.earlyBird.backers" : buyerId}})
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in adding buyer to tier in earlybird"
        )

def add_buyer_to_tier(tierId, buyerId):
    try:
        logger.info("Adding buyer to tier")
        campaign = campaign_collection.find_one_and_update({"rewardAndTier.tierId" : tierId}, {"$push" : {"rewardAndTier.$.backers" : buyerId}})
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in adding buyer to tier"
        )

def milestone_unlocked(campaignId, milestoneId):
    try:
        logger.debug(f"unlocking milestone with milestoneId=>{milestoneId} in campaign with campaignId=>{campaignId}")
        campaign = campaign_collection.find_one_and_update({"_id" : ObjectId(campaignId),
                                                            "milestone.milestoneId" : milestoneId}, {"$set" : {"milestone.$.hasUnavailabilityMask" : False,
                                                                                                                "milestone.$.blurDp" : False}})
        if campaign is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"campaign not found with campaign {campaignId}"
            )
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in adding milestone to campaign"
        )

def getting_user_campaigns_models(userId):
    try:
        campaign_count = campaign_collection.count_documents({"userId": userId})
        models_count = models_collection.count_documents({"userId": userId})
        return models_count, campaign_count
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail=str(e))

