from typing import List
from supertokens_python.asyncio import delete_user
from supertokens_python.recipe.session.asyncio import revoke_all_sessions_for_user
from fastapi.responses import RedirectResponse
from supertokens_python.recipe.session.asyncio import revoke_session as rs
from supertokens_python.recipe.thirdpartyemailpassword.asyncio import create_reset_password_token,reset_password_using_token, get_users_by_email
from supertokens_python.recipe.emailpassword.interfaces import SignInWrongCredentialsError
from supertokens_python.recipe.thirdpartyemailpassword.interfaces import EmailPasswordSignInWrongCredentialsError, UpdateEmailOrPasswordPasswordPolicyViolationError
from supertokens_python.recipe.thirdpartyemailpassword.asyncio import get_user_by_id,emailpassword_sign_in, update_email_or_password,get_users_by_email
from supertokens_python.recipe.emailverification.asyncio import verify_email_using_token
from supertokens_python.recipe.usermetadata.asyncio import get_user_metadata
from supertokens_python.recipe.thirdpartyemailpassword.types import User
from supertokens_python.recipe.session import SessionContainer
from fastapi.templating import Jinja2Templates
templates = Jinja2Templates(directory="templates")
from supertokens_python.recipe.session.asyncio import get_all_session_handles_for_user, get_session_information
from fastapi import  Request, HTTPException, Response
from fastapi.encoders import jsonable_encoder
from db.models.UserDetails import UserDetails
from db.models.Username import Username
from db.models.Metadata import Metadata
from db.models.Session import Session
from db.models.ChangePassword import ChangePassword
from db.models.ChangeEmail import ChangeEmail
from db.models.UserEmail import UserEmail
from db.models.EmailRequest import Email
from db.models.SignupDetails import SignupDetails
from db.models.PasswordReset import PasswordReset
from db.models.Session import SessionResponse

from services import supertokens_auth_services, routes_db_services, roles_permissions_services
from config import read_yaml
from utils import utils
import url64
from services.claim_validators import check_role_claim_and_throw_error_if_not_present, check_permission_claim_and_throw_error_if_not_present
from datetime import datetime, timedelta
from logger.logging import get_logger
logger = get_logger(__name__)
from config.read_yaml import responses


async def index(request: Request):
    session: SessionContainer = request.state.session
    print(request.state.user_id)
    user_info = await get_user_by_id(request.state.user_id)
    # print(user_info)
    return user_info

    # session_handles = await get_all_session_handles_for_user(request.state.user_id)
    # for handle in session_handles:
    #     session_information = await get_session_information(handle)
    #     if session_information is None:
    #         continue
    #     current_access_token_payload = session_information.custom_claims_in_access_token_payload
    #     # print("current_access_token_payload",current_access_token_payload)
    # return current_access_token_payload
    
    # await check_role_claim_and_throw_error_if_not_present(session, "SuperAdmin")
    # md =  await get_user_metadata(session.user_id)
    # client_ip = request.headers.get("X-Forwarded-For", request.client.host)
    # return {"client_ip": client_ip,"metadata":md.metadata,"session_data": session.user_data_in_access_token}


async def test(request: Request,
               response:Response):
    print("force_refreshed_handles",utils.cache.get("force_refreshed_handles"))
    return utils.cache.get("force_refreshed_handles")
    
async def verify_signup_email(token:str,user_id:str):
    try:
        await verify_email_using_token("public",token)
    except Exception as e:
        logger.error(f"Error while verifying email {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    logger.debug(f"Email is verified for the userId:{user_id}")
    logger.debug("Removing guest role from user")
    
    #Removing Guest Role
    try:
        await roles_permissions_services.remove_role(user_id,"Guest")
    except Exception as e:
        logger.error(f"Error while removing guest role for userId:{user_id} : {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    #Adding 3DA 3DP Role
    for role in ["3DA","3DP"]:
        try:
            await roles_permissions_services.add_role(user_id,role)
        except Exception as e:
            logger.error(f"Error while adding {role} role for userId:{user_id} : {e}")
            raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
            
    return RedirectResponse(url=f"{read_yaml.website_domain}/welcome",status_code=307)



async def add_to_known_device_list(userid:str,
                                   device: str, 
                                   request: Request):
    try:
        fingerprint =  url64.decode(device)
    except Exception as e:
        logger.error(f"Error while decoding the device fingerprint for userId:{userid} : {e}")
        raise HTTPException(status_code= responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    try:
        res = supertokens_auth_services.add_to_known_device_list(userid,fingerprint)
    except Exception as e:
        if "Internal Server Error"=="User ID and Device Fingerprint pair already exists.":
            logger.error("User ID and Device Fingerprint pair already exists.")

            raise HTTPException(status_code=responses.DEVICE_FINGERPRINT_ALREADY_EXISTS.CODE,detail=responses.DEVICE_FINGERPRINT_ALREADY_EXISTS.MESSAGE)
    
    logger.info(f"Device added to known device list for user_id:{userid}")
    return res



async def check_is_verified_mail(request: Request):

    session: SessionContainer = request.state.session
    userDbId = session.user_id
    try:
        bool = await supertokens_auth_services.is_email_verified(userDbId)
    except Exception as e:
        logger.error(f"Error while checking if email is verified for userId:{userDbId} : {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    logger.debug(f"Function executed for email verification")
    logger.info(f"Email verified: {bool}")
    return {"verified":bool}



async def add_details(request: Request, 
                      data: UserDetails):
    
    session = request.state.session
    data = jsonable_encoder(data)
    firstName = data['firstName']
    lastName = data['lastName']
    userDbId = session.user_id
    metaData = Metadata(firstName+" "+lastName)
    try:
        await supertokens_auth_services.meta_data_operations(metaData,userDbId)
    except Exception as e:
        logger.error(f"Error while adding details for userId:{userDbId} : {e}")
        raise HTTPException(detail= responses.INTERNAL_SERVER_ERROR.MESSAGE,status_code=responses.INTERNAL_SERVER_ERROR.CODE)
    logger.debug(f"Details Added for Username:{firstName} {lastName}")
    return f"details added"



async def add_username(request:Request, 
                       username:Username):
    
    userDbId = request.state.user_id
    try:
        res = await routes_db_services.check_unique_username_from_user_service(userDbId,username.username,request)
    except Exception as e:
        logger.error(f"Error while checking if username is unique for userId:{userDbId} : {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    if res['exists']:
        raise HTTPException(status_code=responses.USERNAME_ALREADY_EXISTS.CODE,detail=responses.USERNAME_ALREADY_EXISTS.MESSAGE)
    
    try:
        await supertokens_auth_services.add_username_to_metadata(userDbId,username.username)
    except Exception as e:
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    

    logger.debug(f"Username is added for the userId:{userDbId}")
    logger.info(f"Username added for userId:{userDbId}")
    return f"Username Added Successfully"


async def add_signup_details(request:Request,
                             signup_details:SignupDetails):
    
    session: SessionContainer = request.state.session
    user_id = request.state.user_id
    username = signup_details.username
    full_name = signup_details.fullName
    name_split = full_name.split(" ")
    first_name = name_split[0]
    if len(name_split) > 1:
        last_name = " ".join(name_split[1:])
    else:
        last_name = None


    metaData = Metadata(full_name,username,first_name,last_name)
    try:
        await supertokens_auth_services.meta_data_operations(metaData,user_id)
    except Exception as e:
        logger.error(f"Error while adding details for userId:{user_id} : {e}")
        raise HTTPException(detail= responses.INTERNAL_SERVER_ERROR.MESSAGE,status_code=responses.INTERNAL_SERVER_ERROR.CODE)
    logger.debug(f"Details Added for Username:{full_name} ")

    signup_data = metaData.__dict__
    if session is not None:
        await session.merge_into_access_token_payload({"signup_data":signup_data})
    return f"details added"


async def get_sessions(request:Request) -> List[SessionResponse]:

    user_id = request.state.user_id
    try:
        sessions = await get_all_session_handles_for_user(user_id)
    except Exception as e:
        logger.error(f"Error while getting sessions for userId:{user_id} : {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    print("supertokens_sessions",sessions)
    
    result = []
    for session in sessions:
        try:
            session_object = await get_session_information(session)
            print(session_object.session_data_in_database)
        except Exception as e:
            logger.error(f"Error while getting session information for userId:{user_id} : {e}")
            raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)


        result.append(SessionResponse(sessionHandle=session,
                                      createdTime=session_object.time_created,
                                      expiresOn=session_object.expiry,
                                      device=session_object.session_data_in_database["OperatingSystem"],
                                      browser=session_object.session_data_in_database["Browser"],
                                      location=session_object.session_data_in_database["Location"]))
        
    
    if not result:
        raise HTTPException(status_code=responses.SESSION_NOT_FOUND.CODE,detail=responses.SESSION_NOT_FOUND.MESSAGE)
    
    logger.debug(f"All sessions recieved succesfully with userId:{user_id}")
    return result


async def revoke_session(sessionHandle: str, 
                         request: Request, 
                         response:Response):
    
    try:
        check = await rs(sessionHandle)
    except Exception as e:
        logger.error(f"Error while revoking session for userId:{request.state.user_id} : {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    if not check:
        raise HTTPException(status_code=responses.SESSION_NOT_FOUND.CODE,detail=responses.SESSION_NOT_FOUND.MESSAGE)
    
    supertokens_auth_services.remove_tokens_from_frontend(response)
    
    logger.debug(f"Session Revoked")
    return f"Session Revoked Successfully"


async def revoke_all_sessions(request:Request,response:Response):
    userDbId = request.state.user_id
    session: SessionContainer = request.state.session   

    try:
        await supertokens_auth_services.force_refresh_sessions(userDbId)
    except Exception as e:
        logger.error(f"Error while forcing refresh sessions for userId:{userDbId} : {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)

    try:
        res = await revoke_all_sessions_for_user(userDbId)
    except Exception as e:
        logger.error(f"Error while revoking all sessions for userId:{userDbId} : {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    
    
    await session.revoke_session()  # This will delete the session from the db and from the frontend (cookies)
    
    supertokens_auth_services.remove_tokens_from_frontend(response)
    
    logger.debug(f"Sessions Revoked")
    return f"Revoked Session Handles: {res}"


async def sign_out(request:Request,response:Response):
      
    session: SessionContainer = request.state.session  
    await session.revoke_session()  # This will delete the session from the db and from the frontend (cookies)
    supertokens_auth_services.remove_tokens_from_frontend(response)
    logger.debug(f"Signed Out")
    logger.info(f"Signed Out for userId:{session.user_id}")
    return f"Signed Out Successfully"



async def permanently_delete(userDbId:str, 
                            request:Request,
                            response: Response):
    
    session: SessionContainer = request.state.session
    await check_role_claim_and_throw_error_if_not_present(session, "UserAdmin")
    try:
        await revoke_all_sessions_for_user(userDbId)
    except Exception as e:
        logger.error(f"Error while deleting the user for userId:{userDbId} : {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)

    print("Deleting the user")
    try:
        await delete_user(userDbId)
    except Exception as e:
        logger.error(f"Error while deleting the user for userId:{userDbId} : {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    # supertokens_auth_services.remove_tokens_from_frontend(response)

    logger.debug(f"Account Removed")
    logger.info(f"Account Removed for userId:{userDbId}")
    return f"Account Removed Successfully"




async def change_password(request:Request,
                          password:ChangePassword,
                          response:Response):
    
    '''
    Extract Session Information: Extract the session information from the request state to get the user_id.

    Retrieve User Input: Retrieve the old password (old_password) and the new password (new_password) from the user input.

    Fetch User Information: Call the get_user_by_id function to fetch the user's information using user_id. Extract the user's email from the fetched information.

    Verify Old Password: Call the emailpassword_sign_in function to verify if the old password entered by the user is correct. If the password is incorrect, log an error and raise an HTTP exception with a 403 status code.

    Update Password: If the old password is correct, call the update_email_or_password function to update the user's password to the new password. If there is a password policy violation, log an error and raise an HTTP exception with a 403 status code.

    Revoke All Sessions: If the password is successfully updated, revoke all sessions for the user by calling revoke_all_sessions_for_user except its current session

    Send Confirmation Email: Send a confirmation email to the user regarding the password change by calling send_email_regarding_password_change.

    Log and Return Success: Log that the password has been updated successfully and return a success message.

    # https://showme.redstarplugin.com/d/d:9ZmDqVB2
    # https://miro.com/app/board/uXjVMgk1B0U=/?utm_source=showme&utm_campaign=cpa&share_link_id=942028490604
    '''

    session: SessionContainer = request.state.session
    user_id = session.get_user_id()

    old_password = password.currentPassword
    new_password = password.newPassword
    users_info= await get_user_by_id(user_id)
    email = users_info.email

    # Check if the old password and new password are same
    if old_password == new_password:
        logger.error(f"Old password and new password are same for userId:{user_id}")
        raise HTTPException(status_code=responses.OLD_AND_NEW_PASSWORDS_ARE_SAME.CODE,detail=responses.OLD_AND_NEW_PASSWORDS_ARE_SAME.MESSAGE)

    # Check if the password is correct
    is_password_correct =  await emailpassword_sign_in("public",email, old_password)
    
    # If the password is wrong, raise an error
    if isinstance(is_password_correct, EmailPasswordSignInWrongCredentialsError):
        logger.error(f"Wrong Password Entered for userId:{user_id}")
        raise HTTPException(status_code=responses.WRONG_PASSWORD_ENTERED.CODE,detail=responses.WRONG_PASSWORD_ENTERED.MESSAGE)
    
    # If the password is correct, change the password and send the confirmation email to user
    update_response = await update_email_or_password(user_id, password=new_password, tenant_id_for_password_policy=session.get_tenant_id())

    if isinstance(update_response, UpdateEmailOrPasswordPasswordPolicyViolationError):
        logger.error(f"Password Policy Violation for userId:{user_id}")
        raise HTTPException(detail=responses.PASSWORD_POLICY_NOT_MATCHED.MESSAGE,status_code=responses.PASSWORD_POLICY_NOT_MATCHED.CODE)        

    try:
        await supertokens_auth_services.revoke_all_sessions_except_current(session)
        
    except Exception as e:
        logger.error(f"Error while revoking all sessions for userId:{user_id} : {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    try:
        api_response = await routes_db_services.send_password_change_email(user_id,request)
    except Exception as e:
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)

    
    logger.debug(f"Password is updated for the userId:{user_id}")
    return "Password Changed Successfully"

# 

async def change_email(request:Request,
                       email:ChangeEmail):
    
    '''
    Start: The process begins when a request to change the email is received.

    Retrieve User ID: The User ID is retrieved from the session.

    Validate New Email: The new email provided is validated. If the email is invalid, an error is returned indicating "Invalid Email".

    Check User Type: The type of user is checked. If the user is not found, an error "User Not Found" is returned. If the user is not a custom email user, an error "Not Custom Email User" is returned.

    Check if New Email Exists: The system checks whether the new email already exists in the database. If it does, an error "Email Already Taken" is returned.

    Verify Password: The user's password is verified. If the password is incorrect, an error "Wrong Password" is returned.

    Create Verification Token: A verification token is created for the user. If an unexpired token already exists, an error "Unexpired Token Exists" is returned.

    Send Verification Email: An email containing the verification token is sent to the user's new email address. If the email fails to send, an error "Email Send Fail" is returned.

    End: Email Change Requested: If all the above steps are successful, the process ends with a message "Email Change Requested Successfully".

    https://showme.redstarplugin.com/d/d:tXt8ANgj
    '''
    
    session : SessionContainer = request.state.session
    user_id = session.get_user_id()
    password = email.currentPassword
    new_email = email.newEmail
    user_info= await get_user_by_id(user_id)
    old_email = user_info.email

    # validate the input email
    if not await utils.is_valid_email(new_email):
        logger.error(f"Invalid Email for userId:{user_id}")
        raise HTTPException(detail = responses.INVALID_EMAIL.MESSAGE,status_code=responses.INVALID_EMAIL.CODE)

    # Check if the user is a custom email password user
    if user_info is None:
        logger.error(f"User not found for userId:{user_id}")
        raise HTTPException(detail= responses.USER_NOT_FOUND.MESSAGE,status_code=responses.USER_NOT_FOUND.CODE)
    

    if user_info.third_party_info is not None:
        logger.error(f"User is not a custom email password user for userId:{user_id}")
        raise HTTPException(detail= responses.NOT_CUSTOM_EMAIL_USER.MESSAGE,status_code=responses.NOT_CUSTOM_EMAIL_USER.CODE)
    

    #Check if the new email is already taken by someone else
    try:
        bool = await supertokens_auth_services.check_email_exists(new_email)
    
    except Exception as e:
        logger.error(f"Error while checking if email exists for userId:{user_id} : {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    if bool:
        logger.error(f"Email is already taken for userId:{user_id}")
        raise HTTPException(detail= responses.EMAIL_ALREADY_TAKEN.MESSAGE,status_code=responses.EMAIL_ALREADY_TAKEN.CODE)
    

    # Check if the password is correct
    is_password_correct = await emailpassword_sign_in(tenant_id="public", email=old_email, password= password)
    
    # If the password is wrong, raise an error
    if isinstance(is_password_correct, EmailPasswordSignInWrongCredentialsError):
        logger.error(f"Wrong Password Entered for userId:{user_id}")
        raise HTTPException(status_code=responses.WRONG_PASSWORD_ENTERED.CODE,detail=responses.WRONG_PASSWORD_ENTERED.MESSAGE)
    
    # If the password is correct, create a token and send it to the user's new email
    
    try:
        token = supertokens_auth_services.create_email_verification_token_and_add_it_to_db(user_id,new_email)


    except Exception as e:
        if str(e)=="Unexpired token for user already exists.":
            logger.error(f"Unexpired token for user already exists for userId:{user_id}")
            raise HTTPException(detail= responses.UNEXPIRED_TOKEN_EXISTS.MESSAGE,status_code=responses.UNEXPIRED_TOKEN_EXISTS.CODE)
        else:
            logger.error(f"Error while creating email verification token for userId:{user_id} : {e}")
            raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)

    

    # Send the email to the user's old email
    try:  
        await routes_db_services.send_new_email_verification_mail(user_id,old_email,token,request)
    

    except Exception as e:
        # If the email sending fails, delete the token from the database and raise an error
        
        try:
            token_in_db = supertokens_auth_services.get_token_from_db(token,user_id)
        except Exception as e:
            logger.error(f"Error while getting token from db for userId:{user_id} : {e}")
            raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
        
        try:
            supertokens_auth_services.delete_token_from_db(token_in_db)
        except Exception as e:
            logger.error(f"Error while deleting token from db for userId:{user_id} : {e}")
            raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
        
        logger.error(f"Error while sending email for userId:{user_id} : {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    

    #Adding the change email requested bool in the session token
    await session.merge_into_access_token_payload({"isChangeEmailRequested":True, "newEmail":new_email})


    #Adding the email_change_requested bool in the auth database/ user's metadata
    try:
        await supertokens_auth_services.add_email_change_requested_to_metadata(user_id,new_email)
    except Exception as e:
        logger.error(f"Error while adding email change requested to metadata for userId:{user_id} : {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    return "Email Change Requested Successfully"


    # So, within the scope of this API, it does follow the ACID principles, but the potential rollback in this scenario would be the deletion of the token if the email sending fails. However, if the token is already saved and the email sending fails, the user wouldn't know about the token, so it wouldn't affect the system's state from the user's perspective. As such, it wouldn't be absolutely necessary to implement a rollback in this case.



async def resend_change_email_verification_email(new_email:str,
                                                 request:Request):
    user_id = request.state.user_id 
    user_info = await get_user_by_id(user_id)
    old_email = user_info.email

    #Check if there is already token in the db corresponding to the user_id and new email
    existing_token = supertokens_auth_services.check_if_token_exists(user_id,new_email)
    
    if not existing_token:
        raise HTTPException(status_code=responses.CHANGE_EMAIL_REQUEST_NOT_INITIATED, detail=responses.CHANGE_EMAIL_REQUEST_NOT_INITIATED.MESSAGE)
    
    try:
        supertokens_auth_services.delete_token_from_db(existing_token)
    except Exception as e:
        logger.error(f"Error while deleting token from db for userId:{user_id} : {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    # Create a new token and send it to the user's new email
    try:
        token = supertokens_auth_services.create_email_verification_token_and_add_it_to_db(user_id,new_email)
    except Exception as e:
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    # Send the email to the user's old email
    try:
        await routes_db_services.send_new_email_verification_mail(user_id,old_email,token,request)
    except Exception as e:
        logger.error(f"Error while sending email for userId:{user_id} : {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    return "Email Resend Successfully"
        


async def cancel_email_change_request(request:Request,
                                      new_email:str):
    
    user_id = request.state.user_id
    session:SessionContainer = request.state.session

    #Check if there is already token in the db corresponding to the user_id and new email
    try:
        existing_token = supertokens_auth_services.check_if_token_exists(user_id,new_email)
    except Exception as e:
        logger.error(f"Error while checking if token exists for userId:{user_id} : {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    if not existing_token:
        raise HTTPException(detail=responses.CHANGE_EMAIL_REQUEST_NOT_INITIATED.MESSAGE,status_code=responses.CHANGE_EMAIL_REQUEST_NOT_INITIATED.CODE)
    

    # Delete the token from the database if existed no matter if it is expired or not
    try:
        supertokens_auth_services.delete_token_from_db(existing_token)
    except Exception as e:
        logger.error(f"Error while deleting token from db for userId:{user_id} : {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    # Remove the change email requested bool from the session token
    await session.merge_into_access_token_payload({"isChangeEmailRequested":None,"newEmail":None})

    # Remove the email_change_requested bool from the auth database/ user's metadata
    try:
        await supertokens_auth_services.remove_email_change_requested_from_metadata(user_id)
    except Exception as e:
        logger.error(f"Error while removing email change requested from metadata for userId:{user_id} : {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    return "Email Change Request Cancelled Successfully"



async def verify_email(request:Request,
                       token:str,
                       user_id:str):
    

    '''
    Retrieve Token from Database: Attempt to retrieve the token from the database using the provided token and user_id. If an error occurs during this process, log the error and raise an HTTP 500 error.

    Check Token Existence: If the token is not found in the database, it implies that it has either already been used or was never created. In this case, raise an HTTP 404 error.

    Check Token Expiry: If the token is found, check whether it is expired. If the token has expired, raise an HTTP 404 error.

    Update Email in External Database: If the token is valid and not expired, attempt to update the user's email in an external database. If an error occurs, raise an HTTP 500 error.

    Update Email and Rollback if Fail: Update the email in the local database and rollback the changes if any failure occurs during the update. If the rollback is necessary, raise an HTTP 500 error.

    Delete Token from Database: After successfully updating the email, attempt to delete the token from the database. If an error occurs during token deletion, log the error and raise an HTTP 500 error.

    Manually Verify Email: Manually verify the user's email. If an error occurs during email verification, log the error and raise an HTTP 500 error.

    Log and Return Success: Log that the email has been verified successfully and return a success message.

    https://showme.redstarplugin.com/d/d:4MLHvYn2
    https://miro.com/app/board/uXjVMgkyEm4=/?utm_source=showme&utm_campaign=cpa&share_link_id=334238219216

    '''

    user_info = await get_user_by_id(user_id)
    old_email = user_info.email
    
    try:
        token_in_db = supertokens_auth_services.get_token_from_db(token,user_id) 
    except Exception as e:
        logger.error(f"Error while getting token from db for userId:{user_id} : {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    # If the token is not found in the database, it has already been used or was never created.
    if token_in_db is None:
        raise HTTPException(detail=responses.TOKEN_NOT_FOUND.MESSAGE,status_code=responses.TOKEN_NOT_FOUND.CODE)
    
        #TODO: Send the html template back to user with a message that the token has already been used or was never created


    # If the token is found and it's not expired, update the user's email and delete the token
    if datetime.now() <= token_in_db.token_expiry:
        try:
            api_response = await routes_db_services.update_email_in_external_db(token_in_db.user_id, token_in_db.new_email,request)
        except Exception as e:
            raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)

        logger.debug(f"Email is updated in external db for the userId:{user_id}")

        if not await supertokens_auth_services.update_email_and_rollback_if_fail(token_in_db,request):
            raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
        
        # After you successfully update the email in both the external service and your own database, you attempt to delete the token from your database. If this operation fails, it does not leave your system in an inconsistent state. The email update operation has completed successfully, and the user's email has been changed as expected. The only side effect is that the token is not deleted, but that should not cause any problems for your user. They've already used the token to change their email, so it's not needed anymore.

        # If it's important to make sure the token is deleted, you could consider adding a retry mechanism. For example, if the token deletion fails, you could try again a few more times before giving up. However, this is an enhancement and not a rollback operation. If the token deletion fails, it's not a big deal. The user's email has already been updated, and the token is not needed anymore.

        try:
            supertokens_auth_services.delete_token_from_db(token_in_db)
        except Exception as e:

            logger.error(f"Error while deleting token from db for userId:{user_id} : {e}")
            raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
        
        
        try:
            await supertokens_auth_services.manually_verify_email(user_id)
        except Exception as e:
            logger.error(f"Error while manually verifying email for userId:{user_id} : {e}")
            raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
        
        logger.debug(f"Email is verified for the userId:{user_id}")


        try:
            await revoke_all_sessions_for_user(user_id)
        except Exception as e:
            logger.error(f"Error while revoking all the sessions for user: {user_id}")


        try:
            await routes_db_services.send_acknowledgement_about_email_change(user_id,old_email,token_in_db.new_email,request)
        except Exception as e:
            logger.error(f"Error while sending acknowledgement email for userId:{user_id} : {e}")
           
        #TODO: Delete the change email requested bool from the session token, This has to be done using the offline mode without session for all the present sessions of the user

        #Delete the email_change_requested bool from the auth database/ user's metadata
        try:
            await supertokens_auth_services.remove_email_change_requested_from_metadata(user_id)
        except Exception as e:
            logger.error(f"Error while removing email change requested from metadata for userId:{user_id} : {e}")
            raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)


        return RedirectResponse(url=f"{read_yaml.website_domain}/login?changeEmail=success",status_code=307)
    

    else:
        raise HTTPException(status_code=responses.VERIFICATION_TOKEN_EXPIRED.CODE,detail=responses.VERIFICATION_TOKEN_EXPIRED.MESSAGE)
        #TODO: Send the template back to user with a message that the token has Expired and ask them to request a new one




async def manually_verify_email(user_id:str,
                                request:Request):
    
    session: SessionContainer = request.state.session
    # await check_role_claim_and_throw_error_if_not_present(session,"UserAdmin")
    try:
        await supertokens_auth_services.manually_verify_email(user_id)
    except Exception as e:
        logger.error(f"Error while manually verifying email for userId:{user_id} : {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    return "Email marked verified successfully"



async def manually_unverify_email(user_id:str,
                                request:Request):
    
    session: SessionContainer = request.state.session
    # await check_role_claim_and_throw_error_if_not_present(session,"UserAdmin")
    try:
        await supertokens_auth_services.manually_unverify_email(user_id)
    except Exception as e:
        logger.error(f"Error while manually unverifying email for userId:{user_id} : {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    return "Email marked unverified successfully"



async def send_verification_email(email:str,
                                  request:Request):
    
    users: List[User] = await get_users_by_email(email)
    

    if not users:
        logger.error(f"User not found for email: {email}")
        raise HTTPException(detail=responses.USER_NOT_FOUND.MESSAGE,status_code=responses.USER_NOT_FOUND.CODE)

    user_info = users[0]
    user_id = user_info.user_id

    if user_info.third_party_info is not None:
        logger.error(f"User is not a custom email password user for userId:{user_id}")
        raise HTTPException(detail= responses.NOT_CUSTOM_EMAIL_USER.MESSAGE,status_code=responses.NOT_CUSTOM_EMAIL_USER.CODE)
    
    email = user_info.email

    
    # Check if the Email is already verified or not 
    try:    
        verified = await supertokens_auth_services.is_email_verified(user_id)
    except Exception as e:
        logger.error(f"Error while checking if email is verified for userId:{user_id} : {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    if verified:
        logger.error(f"Email is already verified for userId:{user_id}")
        raise HTTPException(detail= responses.EMAIL_ALREADY_VERIFIED.MESSAGE,status_code=responses.EMAIL_ALREADY_VERIFIED.CODE)

    try:
        await supertokens_auth_services.send_verification_email(user_id,email,request)
    except Exception as e:
        logger.error(f"Error while sending verification email for userId:{user_id} : {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    return "Verification email sent successfully"



async def forget_password(request:Request,
                          email:str):
    
    
    Users = await get_users_by_email("public",email)
    
    if not Users:
        logger.error(f"No user found with the email:{email}")
        raise HTTPException(detail=responses.USER_NOT_FOUND.MESSAGE,status_code=responses.USER_NOT_FOUND.CODE)
    
    user_id = Users[0].user_id


    try:
        is_verified_user = await supertokens_auth_services.is_email_verified(user_id)
    except Exception as e:
        logger.error(f"Error while checking if email is verified for userId:{user_id} : {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)


    if not is_verified_user:
        logger.error(f"Email is not verified for userId:{user_id}")
        raise HTTPException(detail= responses.EMAIL_NOT_VERIFIED.MESSAGE,status_code=responses.EMAIL_NOT_VERIFIED.CODE)
    
    try:
        bool =  await supertokens_auth_services.check_if_email_password_user(email)
    except Exception as e:
        logger.error(f"Error while checking if user is custom email password user for userId:{user_id} : {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    if not bool:
        logger.error(f"User is not a custom email password user for userId:{user_id}")
        raise HTTPException(detail= responses.NOT_CUSTOM_EMAIL_USER.MESSAGE,status_code=responses.NOT_CUSTOM_EMAIL_USER.CODE)
    

    try:
        token = await create_reset_password_token("public", user_id)
        token = token.token

    except Exception as e:
        logger.error(f"Error while creating reset password token for userId:{user_id} : {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    try:
        await routes_db_services.send_reset_password_email(user_id,email,token,request)
    except Exception as e:
        logger.error(f"Error while sending reset password email for userId:{user_id} : {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    logger.debug(f"Reset Password Email Sent for the userId:{user_id}")
    return "Reset Password Email Sent Successfully"

    

async def reset_password_form(user_id:str,
                              token:str,
                              request:Request):
    
    return templates.TemplateResponse("reset_password.html", {"request": request, "token": token, "user_id": user_id})




async def reset_password_confirm(user_id:str, 
                                 token:str,
                                 password:str):
    
    try:
        data = PasswordReset(token=token, password=password)
    except ValueError:
        raise HTTPException(status_code=responses.INVALID_DATA.CODE,detail=responses.INVALID_DATA.MESSAGE)
    
    token = data.token
    password = data.password

    #Check if old password and new password matches

    user_info = await get_user_by_id(user_id)
    email = user_info.email

    is_same_password = await emailpassword_sign_in(tenant_id="public", email=email, password= password)
    
    # If the password is same, raise an error
    if not isinstance(is_same_password, EmailPasswordSignInWrongCredentialsError):
        logger.error(f"Not a new password for userId:{user_id}")
        raise HTTPException(detail= responses.OLD_AND_NEW_PASSWORDS_ARE_SAME.MESSAGE,status_code=responses.OLD_AND_NEW_PASSWORDS_ARE_SAME.CODE)


    try:
        x = await reset_password_using_token("public",token, password)
    except Exception as e:
        logger.error(f"Error while resetting password for token:{token} : {e}")
        raise HTTPException(status_code=responses.INTERNAL_SERVER_ERROR.CODE,detail=responses.INTERNAL_SERVER_ERROR.MESSAGE)
    
    logger.debug("Password Reset Successfully")

    #Reset Password success Acknowledgement mail

    try:
        await routes_db_services.send_acknowledgement_about_password_reset(user_id)
    except Exception as e:
        logger.error(f"Error while sending acknowledgement email for userId:{user_id} : {e}")

    return "Password Reset Successfully"








