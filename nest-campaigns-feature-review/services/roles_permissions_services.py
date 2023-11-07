from supertokens_python.recipe.userroles import UserRoleClaim, PermissionClaim
from fastapi import HTTPException,status
from campaign_db import campaign_actions , model_actions
from logger.logging import getLogger

logger = getLogger(__name__)

async def check_role_claim(session, role_claim):
    if type(role_claim) is str:
        role_claim = [role_claim]
    for role in role_claim:
        present_roles = await session.get_claim_value(UserRoleClaim)
        if present_roles is None or role not in present_roles:

            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User doesn not have authorization role of {role_claim}")

async def check_permission_claim(session, permission_claim):
    if type(permission_claim) is str:
        permission_claim = [permission_claim]
    for permission in permission_claim:
        present_permissions = await session.get_claim_value(PermissionClaim)
        if present_permissions is None or permission not in present_permissions:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User doesn't have required permissions {permission_claim}")
    
async def check_is_owner_campaign(userId , campaignId):
    try:
        campaign,campaign_owner_id= campaign_actions.get_campaign_from_db(campaignId)
        if campaign_owner_id != userId:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User doesn not have authorization role of campaign owner")
    
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="unable to check is owner campaign"
        )

async def check_is_owner_model(userId , modelId):
    try:
        model = model_actions.get_model(modelId)
        model_owner_id = model["userId"]
        if model_owner_id!= userId:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User doesn not have authorization role of model owner")
    
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="unable to check is owner model"
        )