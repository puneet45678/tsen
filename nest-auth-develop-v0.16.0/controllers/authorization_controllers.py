
from supertokens_python.recipe.userroles.asyncio import create_new_role_or_add_permissions
from supertokens_python.recipe.userroles.asyncio import add_role_to_user
from supertokens_python.recipe.userroles.interfaces import UnknownRoleError
from supertokens_python.recipe.userroles import UserRoleClaim,PermissionClaim
from supertokens_python.recipe.userroles.asyncio import remove_user_role
from supertokens_python.recipe.session.asyncio import get_all_session_handles_for_user
from supertokens_python.recipe.userroles.asyncio import get_roles_for_user
from supertokens_python.recipe.userroles.asyncio import get_permissions_for_role
from supertokens_python.recipe.userroles.interfaces import UnknownRoleError
from supertokens_python.recipe.userroles.asyncio import get_roles_that_have_permission
from supertokens_python.recipe.userroles import UserRoleClaim
from services.claim_validators import check_role_claim_and_throw_error_if_not_present, check_permission_claim_and_throw_error_if_not_present
from supertokens_python.recipe.session.framework.fastapi import verify_session
from supertokens_python.recipe.userroles import UserRoleClaim
from supertokens_python.recipe.session import SessionContainer


from fastapi import APIRouter, Depends, Request, HTTPException
from db.models import Role, UserPermission, UserRole
from utils import utils
from services import roles_permissions_services
from logger.logging import get_logger
logger = get_logger(__name__)
from config.read_yaml import responses
router = APIRouter(tags=['Authorization'], prefix="")
prefix="/api/v1"


async def fetch_and_set_claims(request:Request):
    session = request.state.session
    await session.fetch_and_set_claim(UserRoleClaim)
    await session.fetch_and_set_claim(PermissionClaim)
    return "OK"

async def test_excluded(session: SessionContainer = Depends(verify_session(override_global_claim_validators=lambda global_validators, session, user_context: global_validators + \
[UserRoleClaim.validators.includes("ContentsAdmin")]))):
    return {"message": "Hello World"}


async def test(request:Request):
    session = request.state.session
    roles = await session.get_claim_value(UserRoleClaim)
    return roles


async def create_role(request:Request,request_role: Role.Role):
    await check_role_claim_and_throw_error_if_not_present(request.state.session, "SuperAdmin")
    logger.info(f"{prefix}/role Api Called. Posting role ")
    role = request_role.role
    permissions = request_role.permissions
    res = await create_new_role_or_add_permissions(role, permissions)
    
    try:
        await roles_permissions_services.add_permissions_to_db(permissions)
    except Exception as e:
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    if not res.created_new_role:
        return f"{role} role already exists"

    logger.debug(f"Role Created Succesfully")
    try:
        utils.add_roles_permission_in_yaml(role,permissions)
    except Exception as e:
        logger.error(f"Error while adding permission to role: {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    logger.debug(f"{prefix}/role Api Executed ")
    return {"message": f"New role {role} created"}


async def get_all_roles(request:Request):
    await check_role_claim_and_throw_error_if_not_present(request.state.session, "SuperAdmin")

    logger.info(f"{prefix}/roles Api Called. Getting all roles")
    try:
        res_dict = roles_permissions_services.get_all_roles_permission()
        res = []
        for role, permissions in res_dict.items():
            res.append({"role": role, "permissions": permissions})
    except Exception as e:
        logger.error(f"Error while fetching roles from dB: {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    return res


async def get_roles_for_user_func(request:Request, userId:str):
    await check_role_claim_and_throw_error_if_not_present(request.state.session, "SuperAdmin")
    logger.info(f"{prefix}/roles/{userId} Api Called. Getting roles for userId:{userId}") 
    try: 
        roles = (await get_roles_for_user("public",userId)).roles
    except Exception as e:
        logger.error(f"Error while fetching roles from dB: {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    try:
        response = [{"role": role,"permissions": (await get_permissions_for_role(role)).permissions} for role in roles]
    except Exception as e:
        logger.error(f"Error while fetching roles from dB: {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    return response


async def get_permissions_from_role(request:Request,role:str):

    await check_role_claim_and_throw_error_if_not_present(request.state.session, "SuperAdmin")
    logger.info(f"{prefix}/roles/role/{role} Api Called. Getting permissions for role:{role}")
    perm= (await get_permissions_for_role(role))
    if isinstance(perm, UnknownRoleError):
        logger.error(f"{role} role doesn't Exists")
        raise HTTPException(status_code=responses.ROLE_NOT_FOUND.CODE,detail=responses.ROLE_NOT_FOUND.MESSAGE)

    perm = perm.permissions
    if not perm:
        logger.error(f"No permissions found with role: {role}")
        raise HTTPException(status_code=responses.PERMISSION_NOT_FOUND.CODE,detail=responses.PERMISSION_NOT_FOUND.MESSAGE)
    return perm


async def get_roles_with_permission(request:Request, permission:str):

    await check_role_claim_and_throw_error_if_not_present(request.state.session, "SuperAdmin")
    logger.info(f"{prefix}/roles/permission/{permission} Api Called. Getting roles with permission:{permission}")
    try:
        res = (await get_roles_that_have_permission(permission)).roles
    except Exception as e:
        logger.error(f"Error while fetching roles from dB: {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    if not res:
        logger.error(f"No role found with permission: {permission}")
        raise HTTPException(status_code=responses.ROLE_NOT_FOUND.CODE,detail=responses.ROLE_NOT_FOUND.MESSAGE)
    response = [{"role": role} for role in res]
    return response


async def get_admin_roles(request:Request):
    await check_role_claim_and_throw_error_if_not_present(request.state.session, "SuperAdmin")
    logger.info(f"{prefix}/admin-roles Api Called. Getting all roles")
    try:
        res_dict = roles_permissions_services.get_all_roles_permission()
        res = []
        for role, permissions in res_dict.items():
            # Add only roles that end with 'Admin'
            if role.endswith('Admin'):
                res.append({"role": role, "permissions": permissions})
    except Exception as e:
        logger.error(f"Error while fetching roles from dB: {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    return res


async def get_admin_details(request:Request):
    await check_role_claim_and_throw_error_if_not_present(request.state.session, "SuperAdmin")
    logger.info(f"{prefix}/admin-details Api Called. Getting admin details")
    try:
        res_dict = roles_permissions_services.get_all_roles_permission()
        print(res_dict)
        res = []
        for role, permissions in res_dict.items():
            # Add only roles that end with 'Admin'
            if role.endswith('Admin'):
                try:
                    user_details = roles_permissions_services.get_admin_user_details(role, permissions)
                except Exception as e:
                    logger.error(f"Error while fetching admin details from dB: {e}")
                    raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
                res.extend(user_details)
    
    except Exception as e:
        logger.error(f"Error while fetching roles from dB: {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    return res


async def assign_role(request:Request, user_id:str, request_role: UserRole.UserRole):
    await check_role_claim_and_throw_error_if_not_present(request.state.session, "SuperAdmin")
    # session = request.state.session
    logger.info(f"{prefix}/role-to-user Api Called. Adding Role to userId:{user_id}")    
    role = request_role.role


    res = await add_role_to_user("public",user_id, role)

    # await session.fetch_and_set_claim(UserRoleClaim)
    # await session.fetch_and_set_claim(PermissionClaim)

    
    if isinstance(res, UnknownRoleError):
        logger.error(f"{role} role doesn't Exists")
        raise HTTPException(status_code=responses.ROLE_NOT_FOUND.CODE,detail=responses.ROLE_NOT_FOUND.MESSAGE)
    
    if res.did_user_already_have_role:
        logger.error(f"User already has {role} role")
        raise HTTPException(status_code=responses.ROLE_ALREADY_ASSIGNED.CODE,detail=responses.ROLE_ALREADY_ASSIGNED.MESSAGE)
    
    try:
        await roles_permissions_services.add_role_to_user_all_sessions_offline(user_id,role)
    except Exception as e:
        logger.error(f"Error while adding role to user's metadata: {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)

    try:
        await roles_permissions_services.add_default_role_to_user_metadata(user_id,role)
    except Exception as e:
        logger.error(f"Error while adding role to user's metadata: {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    logger.info(f"Role {role} added to user {user_id}")
    return {"message": f"Role {role} added to user {user_id}"}
    

async def assign_role_excluded(user_id:str, request_role: UserRole.UserRole,session: SessionContainer = Depends(verify_session())):
    # session = request.state.session
    logger.info(f"{prefix}/role-to-user Api Called. Adding Role to userId:{user_id}")    
    role = request_role.role


    res = await add_role_to_user("public",user_id, role)

    print(res)
    
    if isinstance(res, UnknownRoleError):
        logger.error(f"{role} role doesn't Exists")
        raise HTTPException(status_code=responses.ROLE_NOT_FOUND.CODE,detail=responses.ROLE_NOT_FOUND.MESSAGE)
    
    if res.did_user_already_have_role:
        logger.error(f"User already has {role} role")
        raise HTTPException(status_code=responses.ROLE_ALREADY_ASSIGNED.CODE,detail=responses.ROLE_ALREADY_ASSIGNED.MESSAGE)
    
    try:
        await roles_permissions_services.add_default_role_to_user_metadata(user_id,role)
    except Exception as e:
        logger.error(f"Error while adding role to user's metadata: {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)


    await session.fetch_and_set_claim(UserRoleClaim)
    await session.fetch_and_set_claim(PermissionClaim)
    
    logger.info(f"Role {role} added to user {user_id}")
    return {"message": f"Role {role} added to user {user_id}"}
    


async def attach_permission(request:Request ,role:str, request_permission:UserPermission.UserPermission):
    await check_role_claim_and_throw_error_if_not_present(request.state.session, "SuperAdmin")
    logger.info(f"{prefix}/permission/{role}. Adding Role")
    permissions = request_permission.permissions
    session = request.state.session
    
    try:
        await roles_permissions_services.add_permission_for_role(role,permissions)
    except Exception as e:
        logger.error(f"Error while adding permission to role: {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    try:
        await roles_permissions_services.add_permissions_to_db(permissions)
    except Exception as e:
        logger.error(f"Error while adding permission to role: {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    try:
        await session.fetch_and_set_claim(UserRoleClaim)
        await session.fetch_and_set_claim(PermissionClaim)
    except Exception as e:
        logger.error(f"Error while adding the claims to user's session: {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    try:
        utils.add_roles_permission_in_yaml(role,permissions)
    except Exception as e:
        logger.error(f"Error while adding permission to role: {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    logger.info(f"Permssions {permissions} added to the role")
    return {"message": f"Permssions {permissions} added to the role"}


async def attach_standalone_permission(request:Request, userId:str, request_permission:UserPermission.UserPermission):
    await check_role_claim_and_throw_error_if_not_present(request.state.session, "SuperAdmin")
    session = request.state.session
    logger.info(f"{prefix}/permission/user/{userId}. Adding Permisison")
    permissions = request_permission.permissions
    for permission in permissions:

        #Create a custom role for the permission
        custom_permission_role = f"{permission}_role"
        try:
            res = await create_new_role_or_add_permissions(custom_permission_role, [permission])
        except Exception as e:
            logger.error(f"Error while adding permission to role: {e}")
            raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)

        #If role is created (not present in roles dB already) then add the permission to dB
        if res.created_new_role:
            try:
                await roles_permissions_services.add_permissions_to_db([permission])
            except Exception as e:
                logger.error(f"Error while adding permission to role: {e}")
                raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)

        #Add the custom role to the user
        try:
            res = await add_role_to_user("public",userId, custom_permission_role)
        except Exception as e:
            logger.error(f"Error while adding permission to role: {e}")
            raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)

        #Add the custom roles and permission to the session

        try:
            await session.fetch_and_set_claim(UserRoleClaim)
            await session.fetch_and_set_claim(PermissionClaim)
        except Exception as e:
            logger.error(f"Error while adding the claims to user's session: {e}")
            raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)

        #If user already have the role then return
        if res.did_user_already_have_role:
            logger.error(f"User already has {custom_permission_role} role")
            raise HTTPException(status_code=responses.ROLE_ALREADY_ASSIGNED.CODE,detail=responses.ROLE_ALREADY_ASSIGNED.MESSAGE)

        #Add the custom role and permission to the user's metadata
        try:
            await roles_permissions_services.add_custom_role_perm_to_metadata(userId,permission,custom_permission_role)
        except Exception as e:
            logger.error(f"Error while adding permission to role: {e}")
            raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
        
        try:
            utils.add_roles_permission_in_yaml(custom_permission_role,[permission])
        except Exception as e:
            logger.error(f"Error while adding permission to role: {e}")
            raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
        
    return f"Added {custom_permission_role} role and {permissions} permission to the user's session, dB and metadata"


async def remove_role(request:Request,user_id:str,request_role:UserRole.UserRole):
    await check_role_claim_and_throw_error_if_not_present(request.state.session, "SuperAdmin")
    session = request.state.session
    logger.info(f"{prefix}/remove-role-from-user. Removing Role for userId:{user_id}")
    try:
        res = await remove_user_role("public",user_id, request_role.role)
    except Exception as e:
        logger.error(f"Error while removing role from user: {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    if isinstance(res, UnknownRoleError):
        logger.error(f"{request_role.role} role doesn't Exists")
        raise HTTPException(status_code=responses.ROLE_NOT_FOUND.CODE,detail=responses.ROLE_NOT_FOUND.MESSAGE)

    if res.did_user_have_role == False:
        logger.error(f"User was never assigned {request_role.role} role")
        raise HTTPException(status_code=responses.ROLE_NOT_ASSIGNED.CODE,detail=responses.ROLE_NOT_ASSIGNED.MESSAGE)
    try:
        await roles_permissions_services.delete_role_from_metadata(user_id,request_role.role)
    except Exception as e:
        logger.error(f"Error while deleting role from user's metadata: {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    
    try:
        await session.fetch_and_set_claim(UserRoleClaim)
        await session.fetch_and_set_claim(PermissionClaim)
    except Exception as e:

        logger.error(f"Error while adding the claims to user's session: {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)

    logger.debug(f"Role Removed")
    logger.debug(f"{prefix}/remove-role-from-user Api Executed")

    return {"message": f"Role {request_role.role} removed from user {user_id}"}



async def add_role_to_all_sessions(request:Request, userId:str, request_role:UserRole.UserRole):
    await check_role_claim_and_throw_error_if_not_present(request.state.session, "SuperAdmin")
    session = request.state.session

    logger.info(f"{prefix}/role-to-current-session-only. Adding Role to current session only ")

    try:
        session_handles = await get_all_session_handles_for_user(userId)
    except Exception as e:
        logger.error(f"Error while fetching session handles from dB: {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    role =request_role.role
    try:
        await roles_permissions_services.add_role_to_session_payload(session_handles,role)
    except Exception as e:
        logger.error(f"Error while adding role to session payload: {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    logger.debug(f"Role Added For Current User")
    logger.debug(f"{prefix}/role-to-current-session-only Api Executed")
    return {"message": f"Role {role} added to current session only"}


async def get_custom_roles_of_session(request:Request, userId:str):
    await check_role_claim_and_throw_error_if_not_present(request.state.session, "SuperAdmin")

    logger.info(f"{prefix}/custom-roles-from-payload. Roles from payload for userId:{userId}")
    try:
        session_handles = await get_all_session_handles_for_user(userId)
    except Exception as e:
        logger.error(f"Error while fetching session handles from dB: {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    try:
        ans = await roles_permissions_services.get_role_from_session_payload(session_handles)
    except Exception as e:
        logger.error(f"Error while fetching roles from session payload: {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    logger.debug(f"Roles recieved from payload for userId:{userId}")
    logger.debug("{prefix}/custom-roles-from-payload/{userId} Api Called" )
    return ans


