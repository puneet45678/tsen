from supertokens_python.recipe.userroles import UserRoleClaim,PermissionClaim
from supertokens_python.recipe.userroles import UserRoleClaim
from supertokens_python.recipe.session.exceptions import raise_invalid_claims_exception, ClaimValidationError
from supertokens_python.recipe.emailverification import EmailVerificationClaim

async def check_role_claim_and_throw_error_if_not_present(session, role_claim):
    if type(role_claim) is str:
        role_claim = [role_claim]
    for role in role_claim:
        present_roles = await session.get_claim_value(UserRoleClaim)
        if present_roles is None or role not in present_roles:
            raise_invalid_claims_exception(f"User has not required role {role}", [ClaimValidationError(UserRoleClaim.key, None)])
            

async def check_permission_claim_and_throw_error_if_not_present(session, permission_claim):
    if type(permission_claim) is str:
        permission_claim = [permission_claim]
    for permission in permission_claim:
        present_permissions = await session.get_claim_value(PermissionClaim)
        if present_permissions is None or permission not in present_permissions:
            raise_invalid_claims_exception("User doesn't have permission", [ClaimValidationError(PermissionClaim.key, None)])





