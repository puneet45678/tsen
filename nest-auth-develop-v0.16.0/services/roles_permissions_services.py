from supertokens_python.recipe.userroles.asyncio import add_role_to_user
from supertokens_python.recipe.userroles.asyncio import create_new_role_or_add_permissions
from supertokens_python.recipe.session.asyncio import get_session_information,merge_into_access_token_payload
from supertokens_python.recipe.usermetadata.asyncio import get_user_metadata,update_user_metadata
from utils import utils
from supertokens_python.recipe.userroles.asyncio import remove_user_role
from db import mysql_supertokens_db,mysql_auth_db_orm
from config import read_yaml
from logger.logging import get_logger
from supertokens_python.recipe.session.asyncio import get_all_session_handles_for_user, merge_into_access_token_payload, get_session_information

logger = get_logger(__name__)


async def define_startup_roles():
    roles = read_yaml.roles
    for role in roles:
        try:
            res = await create_new_role_or_add_permissions(role, read_yaml.permissions[role])
        except Exception as e:
            raise Exception(e)
        if not res.created_new_role:
            logger.debug(f"{role} role already Present")


async def add_permission_for_role(role:str,
                                  permissions:list):
    
    try:
        await create_new_role_or_add_permissions(role, permissions)
    except Exception as e:
        raise Exception(e)

def get_all_roles_permission():
    try:
        roles, roles_permissions= mysql_supertokens_db.get_all_roles_with_permissions()
    except Exception as e:
        raise Exception(e)
    return roles_permissions


async def add_permissions_to_db(permissions:list =read_yaml.global_permission_set ):
    logger.debug("Adding permissions to the database if not existed")
    try:
        mysql_auth_db_orm.add_permissions_to_db(permissions)
    except Exception as e:
        raise Exception(e)


def get_admin_user_details(role:str,
                          permissions:list):
    
    logger.debug("Getting admin user details")
    try:
        user_details = mysql_supertokens_db.get_admin_user_details(role, permissions)
    except Exception as e:
        raise Exception(e)
    return user_details


async def add_role_to_user_all_sessions_offline(user_id,role):
    # we first get all the session_handles (List[string]) for a user
    session_handles = await get_all_session_handles_for_user(user_id)
    utils.cache["force_refreshed_handles"] = (utils.cache.get("force_refreshed_handles") or [])
    for handle in session_handles:
        session_information = await get_session_information(handle)
        if session_information is None:
            continue
        current_access_token_payload = session_information.custom_claims_in_access_token_payload
        print("current_access_token_payload",current_access_token_payload)
        previous_custom_claims = current_access_token_payload.get("sessionRoles",[])
        previous_custom_claims.append(role)
        await merge_into_access_token_payload(handle, { 'sessionRoles': previous_custom_claims })
        print("After", (await get_session_information(handle)).custom_claims_in_access_token_payload)
        utils.cache["force_refreshed_handles"].append(handle)


async def add_default_role_to_user_metadata(user_id:str,
                                            role:str):
    
    logger.debug(f"Adding the {role} role and permission to user's metadata")
    try:
        metadataResult = await get_user_metadata(user_id)
    except Exception as e:
        raise Exception(e)
    
    metadata = metadataResult.metadata
    metadata["roles"].append(role)
    
    try:
        metadata["permissions"]+=read_yaml.permissions[role] 
    except Exception as e:
        raise Exception(e)
    try:
        await update_user_metadata(user_id, metadata)
    except Exception as e:
        raise Exception(e)
    
    logger.debug("Metadata Updated")


async def add_custom_role_perm_to_metadata(user_id:str,
                                           permission:str,
                                           role:str):

    logger.debug(f"Adding the {role} role and permission {permission} to user's metadata")

    try:
        metadataResult = await get_user_metadata(user_id)
    except Exception as e:
        raise Exception(e)

    metadata = metadataResult.metadata
    metadata["roles"].append(role)
    metadata["permissions"].append(permission) 

    try:
        await update_user_metadata(user_id, metadata)
    except Exception as e:
        raise Exception(e)

    logger.debug("Metadata Updated")



async def add_roles_permissions_to_metadata(user_id:str,
                                            roles:list):
    
    metadataResult = await get_user_metadata(user_id)
    metadata = metadataResult.metadata

    # Initialize roles and permissions in metadata if they don't exist
    if "roles" not in metadata:
        metadata["roles"] = []
    if "permissions" not in metadata:
        metadata["permissions"] = []

    # Add roles to metadata
    for role in roles:
        if role not in metadata["roles"]:
            metadata["roles"].append(role)

    # Add permissions to metadata, ensuring no duplicates
    for role in roles:
        permissions_for_role = read_yaml.permissions[role]
        for permission in permissions_for_role:
            if permission not in metadata["permissions"]:
                metadata["permissions"].append(permission)


    logger.debug(f"Adding {roles} role and its corresponding permissions to the user's metadata")
    await update_user_metadata(user_id, metadata)
    logger.debug("Metadata Updated")


async def delete_role_from_metadata(user_id:str,
                                    role: str ):
    metadataResult = await get_user_metadata(user_id)
    metadata = metadataResult.metadata

    # Remove role if present in metadata
    if "roles" in metadata and role in metadata["roles"]:
        metadata["roles"].remove(role)
    else:
        logger.debug(f"{role} role not present in user's metadata")
        return  # No need to continue if role isn't in metadata

    # Remove permissions associated with the role
    if "permissions" in metadata:
        permissions_to_remove = set(read_yaml.permissions.get(role, []))
        metadata["permissions"] = [p for p in metadata["permissions"] if p not in permissions_to_remove]
    
    logger.debug(f"Removed {role} role and its associated permissions from metadata")

    await update_user_metadata(user_id, metadata)


# async def delete_role_from_metadata(user_id,role):
#     try:
#         metadataResult = await get_user_metadata(user_id)
#     except Exception as e:
#         raise Exception(e)
#     metadata = metadataResult.metadata
#     # print(metadata)

#     try:
#         if role in metadata["roles"]:
#             metadata["roles"].remove(role)
#         else:
#             logger.debug(f"{role} role not present in user's metadata")
    
#     except Exception as e:
#         raise Exception(e)

#     permissions = metadata.get("permissions",None)
#     if permissions:
#         for permission in permissions:
#             metadata["permissions"].remove(permission)
    
#     logger.debug("Removed permissions from metadata too")

#     try:
#         await update_user_metadata(user_id, metadata)
#     except Exception as e:
#         raise Exception(e)
    


async def add_guest_role_to_user(userDbId:str,
                                 email:str,
                                 tenant:str ="public"):
    roles=["Guest"]
    await add_role_to_user(tenant,userDbId, "Guest")
    logger.debug(f"Assigning viewer role to {email}")
    # print(f"viewer role added to {email}")
    logger.debug(f"Adding viewer role to the user's metadata")
    try:
        await add_roles_permissions_to_metadata(userDbId,roles)
    except Exception as e:
        raise Exception(e)



async def remove_role(user_id:str,
                      role:str,
                      tenant:str ="public"):
    
    logger.debug(f"Removing {role} from user")
    try:
        await delete_role_from_metadata(user_id,role)
    except Exception as e:
        raise Exception(e)
    try:
        res = await remove_user_role(tenant,user_id, role)
    except Exception as e:
        logger.error(f"Error while removing role from user: {e}")
        raise Exception(e)
    if not res.did_user_have_role:
        logger.error(f"User never had a {role} role")
    


async def add_role(user_id:str,
                   role:str,
                   tenant:str="public"):
    
    logger.debug(f"Adding {role} to user")
    try:
        await add_role_to_user(tenant,user_id, role)
    except Exception as e:
        raise Exception(e)
    
    try:
        await add_roles_permissions_to_metadata(user_id,[role])
    except Exception as e:
        raise Exception(e)



async def add_authorized_3DP_user_role(userDbId:str,
                                       email:str,
                                       tenant_id:str="public"):
    
    #Here I am adding 3DA role to the user as well because of demo purpose
    roles = ["3DP","3DA"]
    if email == read_yaml.super_admin_email :
        roles.append("SuperAdmin")
    for role in roles:
        try:
            await add_role_to_user(tenant_id,userDbId, role)
        except Exception as e:
            raise Exception(e)  
        logger.debug(f"Assigning {role} role to {email}")   
    try:
        await add_roles_permissions_to_metadata(userDbId,roles)
    except Exception as e:
        raise Exception(e)
    
    

async def get_role_from_session_payload(session_handles:list):
    
    ans= []
    for handle in session_handles:
        try:
            session_information = await get_session_information(handle)
        except Exception as e:
            raise Exception(e)
        if session_information is None:
            continue

        try:
            current_access_token_payload = session_information.access_token_payload
        except Exception as e:
            raise Exception(e)
        
        custom_claim_value = current_access_token_payload["sessionRole"]
        logger.debug("custom claim value",custom_claim_value)
        ans.append(custom_claim_value)
    return ans
        



