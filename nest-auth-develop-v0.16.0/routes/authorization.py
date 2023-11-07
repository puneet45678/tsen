from fastapi import APIRouter, Depends, Request
from fastapi import Depends
from controllers import authorization_controllers
from db.models import Role, UserPermission, UserRole, AdminDetails
from typing import List
from logger.logging import get_logger


from supertokens_python.recipe.userroles import UserRoleClaim
from supertokens_python.recipe.session.framework.fastapi import verify_session
from supertokens_python.recipe.userroles import UserRoleClaim
from supertokens_python.recipe.session import SessionContainer



logger = get_logger(__name__)
router = APIRouter(tags=['Authorization'], prefix="")


@router.get('/fethch-and-set-claims')
async def fetch_and_set_claims(request:Request):
    res = await authorization_controllers.fetch_and_set_claims(request)
    return res
    

# Not to review
# Middleware Excluded
@router.get("/test_claims")
async def test_excluded(session: SessionContainer = Depends(verify_session(override_global_claim_validators=lambda global_validators, session, user_context: global_validators + \
[UserRoleClaim.validators.includes("ContentsAdmin")]))):
    res = await authorization_controllers.test_excluded(session)
    return res


# Not to review
#Middleware Included
@router.get("/test_claims-2")
async def test(request:Request):
    res = await authorization_controllers.test(request)
    return res



# Creating the role and adding the corresponding permissions
@router.post("/role")
async def create_role(request:Request,request_role: Role.Role):
    res = await authorization_controllers.create_role(request,request_role)
    return res


# Getting all the roles and their corresponding permissions
@router.get("/roles",response_model=List[Role.Role])  
async def get_all_roles(request:Request):
    res = await authorization_controllers.get_all_roles(request)
    return res


#Get all roles for a user
@router.get("/roles/{userId}",response_model=List[Role.Role])
async def get_roles_for_user_func(request:Request, userId:str):
    res=  await authorization_controllers.get_roles_for_user_func(request,userId)
    return res


#get all permissions for particular role
@router.get("/roles/role/{role}",response_model=List[str])
async def get_permissions_from_role(request:Request,role:str):
    res = await authorization_controllers.get_permissions_from_role(request,role)
    return res



#Get a list of all roles that have been assigned a specific permission
@router.get("/roles/permission/{permission}",response_model=List[UserRole.UserRole])
async def get_roles_with_permission(request:Request, permission:str):
    res = await authorization_controllers.get_roles_with_permission(request,permission)
    return res


# Get List of all admin roles and corresponding permission
@router.get("/admin-roles",response_model=List[Role.Role])
async def get_admin_roles(request:Request):
    res =await authorization_controllers.get_admin_roles(request)
    return res
    

# Get the Admin Details
@router.get("/admin-details",response_model=List[AdminDetails.AdminDetails])
async def get_admin_details(request:Request):
    res = await authorization_controllers.get_admin_details(request)
    return res


# Assigning a particular role to the user
@router.put("/user-role/{userId}")
async def assign_role(request:Request,user_id:str, request_role: UserRole.UserRole):
    res = await authorization_controllers.assign_role(request,user_id,request_role)
    

    
# Assigning a particular role to the user
@router.put("/user-role-2/{userId}")
async def assign_role_excluded(user_id:str, request_role: UserRole.UserRole,session: SessionContainer = Depends(verify_session())):
    res = await authorization_controllers.assign_role_excluded(user_id,request_role,session)
    return res


# Attaching a particular permission to the role
@router.put("/permission/{role}")
async def attach_permission(request:Request ,role:str, request_permission:UserPermission.UserPermission):
    res =await authorization_controllers.attach_permission(request,role,request_permission)
    return res


#Attaching the permissions directly to the user
#Here our strategy is to create a custom role to attach a standalone permission to the user
@router.put("/permission/user/{userId}")
async def attach_standalone_permission(request:Request, userId:str, request_permission:UserPermission.UserPermission):
    res = await authorization_controllers.attach_standalone_permission(request,userId,request_permission)
    return res



# Delete the role from the user
@router.delete("/role/{userId}")
async def remove_role(request:Request,user_id:str,request_role:UserRole.UserRole):
    res = await authorization_controllers.remove_role(request,user_id,request_role)
    return res


#Add a temporary role to the user's current sessions
@router.put("/role-to-current-session/{userId}")
async def add_role_to_all_sessions(request:Request, userId:str, request_role:UserRole.UserRole):
    res = await authorization_controllers.add_role_to_all_sessions(request,userId,request_role)
    return res


#Get custom roles from session payload
@router.get("/custom-roles-from-payload/{userId}")
async def get_custom_roles_of_session(request:Request, userId:str):
    res = await authorization_controllers.get_custom_roles_of_session(request,userId)
    return res








