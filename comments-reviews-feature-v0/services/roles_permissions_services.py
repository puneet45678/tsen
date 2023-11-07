from supertokens_python.recipe.userroles import UserRoleClaim, PermissionClaim
from supertokens_python.recipe.session.exceptions import raise_invalid_claims_exception, ClaimValidationError
from fastapi import HTTPException,status
from logger.logging import getLogger

logger = getLogger(__name__)

async def check_role_claim(session, role_claim):
    if type(role_claim) is str:
        role_claim = [role_claim]
    for role in role_claim:
        present_roles = await session.get_claim_value(UserRoleClaim)
        if present_roles is None or role not in present_roles:
            raise HTTPException(status_code=403, detail=f"User doesn not have authorization role of {role_claim}")

async def check_permission_claim(session, permission_claim):
    if type(permission_claim) is str:
        permission_claim = [permission_claim]
    for permission in permission_claim:
        present_permissions = await session.get_claim_value(PermissionClaim)
        if present_permissions is None or permission not in present_permissions:
            raise HTTPException(status_code=403, detail=f"User doesn't have required permissions {permission_claim}")
