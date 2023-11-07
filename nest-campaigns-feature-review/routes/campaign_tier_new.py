import uuid
from fastapi import APIRouter, UploadFile, File, BackgroundTasks, HTTPException, status
from services import campaign_new_tier_service
from uuid import uuid4
from typing import List
from models import campaignNew
import yaml
from constants import supported_lists
from utils import utils
from fastapi import Request
from logger.logging import getLogger

logger = getLogger(__name__)

router = APIRouter(tags=["campaign_tier"], prefix=f"/api/v1")
from services import campaign_new_service 

@router.post("/campaigns/{campaignId}/tiers", status_code=status.HTTP_201_CREATED)
async def putting_tiers_data(campaignId: str, reward_tier: campaignNew.RewardTier):
    # tierId = find_tier_from_data(data)    
    logger.info(
        f"/api/v1/campaigns/{campaignId}/tiers Api called. Adding tiers data of campaignId:{campaignId}"
    )
    reward_tier = reward_tier.dict()

    try:
        # await putting_for_key(campaignId , tierId)
        # data["tier"]=uuid4()        
        logger.info(f"Adding campaign tier data in database of campaignId:{campaignId}")
        if campaign_new_service.get_field_length(campaignId, "rewardAndTier") >= 20:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot upload more than 20 tiers",
            )        
        updated_tiers = campaign_new_tier_service.creating_campaign_tier_data(
            campaignId, reward_tier
        )        
        return {"data":updated_tiers}
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Not responded"
        )
    finally:        
        logger.debug(f"/api/v1/campaigns/{campaignId}/tiers Api Execution Complete")


@router.put(
    "/campaigns/{campaignId}/create-update-tier", status_code=status.HTTP_201_CREATED
)
async def update_tier(campaignId: str, data: List[campaignNew.RewardTier]):
    logger.info(
        f"/api/v1/campaigns/{campaignId}/create-update-tier Api called. Updating tiers data of campaignId:{campaignId} , "
    )
    tier_data = []

    for item in data:
        item = item.dict()
        
        campaign_dict = {k: v for k, v in item.items() if v is not None}
        tier_data.append(campaign_dict)
    try:
        campaign_new_tier_service.updating_tier_data_in_database(campaignId, tier_data)
        logger.debug(f"Tier updated succesfully for campaign=>{campaignId}")
        return f"Tier updated succesfully for campaign=>{campaignId}"

    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error in updating tier",
        )
    finally:
        logger.debug(
            f"/api/v1/campaigns/{campaignId}/create-update-tier Api Execution Complete"
        )

@router.get("/campaigns/tiers/{tierId}", status_code=status.HTTP_200_OK)
async def get_tier(request:Request,tierId: str):
    tier = await campaign_new_tier_service.get_tier_details(request,tierId)
    if tier:
        return tier
    else:
        raise HTTPException(status_code=404, detail="Tier not found")


@router.delete("campaigns/{campaignId}/tier/{tier_id}")
async def delete_tier(tier_id: str, campaign_id: str) -> dict:
    modified_count = campaign_new_tier_service.delete_tier_from_campaigns(
        tier_id, campaign_id
    )
    if modified_count is not None:
        if modified_count > 0:
            return {
                "message": f"Deleted tier with id {tier_id} from campaign with id {campaign_id}."
            }
        else:
            return {
                "message": f"No draft campaign with id {campaign_id} containing tier with id {tier_id} was found."
            }
    else:
        raise HTTPException(
            status_code=500, detail="An error occurred while trying to delete the tier."
        )



@router.post("/campaigns/tiers",status_code=status.HTTP_200_OK)
async def get_tiers(request:Request , tierRequest : campaignNew.TierIds):
    tierIds = tierRequest.tierIds
    tiers = await campaign_new_tier_service.get_tiers(request,tierIds)
    return tiers



@router.post("/campaigns",status_code=status.HTTP_200_OK)
async def get_campaigns(request:Request , campaignRequest : campaignNew.CampaignIds):
    campaignIds = campaignRequest.campaignIds
    campaigns = await campaign_new_tier_service.get_campaigns(request,campaignIds)
    return campaigns



@router.get("/campaigns/{campaignId}/campaign-rewards", status_code=status.HTTP_200_OK)
async def get_campaign_rewards(campaignId: str, tierId: str):
    logger.info(
        f"/api/v1/campaigns/{campaignId}/campaign-rewards Api called. Getting rewards data of campaignId:{campaignId} , "
    )
    try:
        rewards_assets = campaign_new_tier_service.get_rewards(campaignId, tierId)
        
        logger.debug(f"Rewards fetched succesfully for campaign=>{campaignId}")
        print(rewards_assets)
        return rewards_assets

    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error in getting rewards",
        )
    finally:
        logger.debug(
            f"/api/v1/campaigns/{campaignId}/campaign-rewards Api Execution Complete"
        )
### this endpoint to be called by order service after successfull transaction  from payment service
@router.post("/campaign/buyer/{buyerId}",status_code=status.HTTP_201_CREATED)
async def add_buyer_to_tiers(request:Request,tierIds : campaignNew.TierIds, buyerId: str,background_task : BackgroundTasks):
    tier_ids = tierIds.tierIds
    await campaign_new_tier_service.add_buyer_to_tier(request,tier_ids, buyerId,background_task)
    logger.debug(f"Buyer added succesfully for tiers=>{tier_ids}")
    return {"message" : "Buyer added succesfully for tier",
            "tierIds" : tier_ids}
