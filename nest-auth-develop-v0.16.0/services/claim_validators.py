from fastapi import HTTPException
from fastapi.responses import JSONResponse
from supertokens_python.recipe.userroles import UserRoleClaim,PermissionClaim
from supertokens_python.recipe.userroles import UserRoleClaim
from supertokens_python.recipe.session.exceptions import raise_invalid_claims_exception, ClaimValidationError
from supertokens_python.recipe.emailverification import EmailVerificationClaim
from supertokens_python.recipe.session import SessionContainer
from logger.logging import get_logger
logger = get_logger(__name__)

async def check_role_claim_and_throw_error_if_not_present(session: SessionContainer, role_claim):
    if type(role_claim) is str:
        role_claim = [role_claim]
    for role in role_claim:
        present_roles = await session.get_claim_value(UserRoleClaim)
        if present_roles is None or role not in present_roles:
            logger.error(f"User has not required role {role}")
            claimError = ClaimValidationError(UserRoleClaim.key,{"message": f"{role} role not present in session"})
            raise HTTPException(status_code=403,detail={"Invalid Claims": [claimError.to_json()]})
            
            

async def check_permission_claim_and_throw_error_if_not_present(session, permission_claim):
    if type(permission_claim) is str:
        permission_claim = [permission_claim]
    for permission in permission_claim:
        present_permissions = await session.get_claim_value(PermissionClaim)
        if present_permissions is None or permission not in present_permissions:
            logger.error(f"User has not required permission {permission}")
            claimError = ClaimValidationError(PermissionClaim.key,{"message": f"{permission} permission not present in session"})
            raise HTTPException(status_code=403,detail={"Invalid Claims": [claimError.to_json()]})




