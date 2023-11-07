from typing import Union
from db.models.Metadata import Metadata
from config import supertokens_config
from supertokens_python.recipe.usermetadata.asyncio import update_user_metadata,get_user_metadata
from supertokens_python.recipe.session.asyncio import get_session_information,merge_into_access_token_payload,get_all_session_handles_for_user
from supertokens_python.recipe.thirdpartyemailpassword.asyncio import get_user_by_id, emailpassword_sign_in, update_email_or_password
from supertokens_python.recipe.emailverification.asyncio import create_email_verification_token, verify_email_using_token
from supertokens_python.recipe.session.asyncio import revoke_session

from supertokens_python.recipe.emailverification.interfaces import CreateEmailVerificationTokenOkResult
from supertokens_python.recipe.emailverification.asyncio import unverify_email
from supertokens_python.recipe.thirdpartyemailpassword.interfaces import  ThirdPartySignInUpPostOkResult, ThirdPartySignInUpOkResult
import httpx
import url64
from user_agents import parse
from utils import utils
from db import mysql_supertokens_db, mysql_auth_db_orm
from config import read_yaml
import requests
from logger.logging import get_logger
logger = get_logger(__name__)
import secrets
from supertokens_python.recipe.session import SessionContainer
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from fastapi import HTTPException, Request, Response
from datetime import datetime
from services import routes_db_services, roles_permissions_services
from db.models import APIResponse


async def meta_data_operations(metaData, userDbId):
    data = metaData.__dict__
    try:
        await update_user_metadata(userDbId,data)
    except Exception as e:
        raise Exception(e)

async def add_username_to_metadata(user_id,username):
    metadataResult = await get_user_metadata(user_id)
    metadata = metadataResult.metadata
    metadata["username"] = username
    await update_user_metadata(user_id, metadata)



async def get_full_name_from_thirdpary_response(userDbId:str,
                                        result:Union[ThirdPartySignInUpPostOkResult, ThirdPartySignInUpOkResult]):
    id_tolen_payload = result.raw_user_info_from_provider.from_id_token_payload
    from_user_info_api = result.raw_user_info_from_provider.from_user_info_api
    
    if  id_tolen_payload is not None and id_tolen_payload.get("iss") == "https://accounts.google.com":
        print("Issuer: Google")
        [firstName, lastName] = from_user_info_api.get("given_name",None), from_user_info_api.get("family_name",None)
        full_name = firstName + " " + lastName
    
    else:
        print("Issuer: Facebook")
        access_token = result.oauth_tokens['access_token']
        request_url = f"https://graph.facebook.com/me?access_token={access_token}"
        response = requests.request("GET", request_url).json()
        full_name= response['name']

    logger.info(f"First Name of user {firstName}, Last name of user {lastName}")
    metaData =Metadata(full_name=full_name,first_name=firstName,last_name=lastName)
    logger.debug("Adding first name and last name to user's metadata")
    await meta_data_operations(metaData, userDbId)

    return full_name



def session_info_operation(session_info, request_headers):
    session_info["sec-ch-ua"] = request_headers.get('sec-ch-ua',"")
    session_info["sec-ch-ua-mobile"] = request_headers.get('sec-ch-ua-mobile',"")
    session_info["sec-ch-ua-platform"] = request_headers.get('sec-ch-ua-platform',"")
    session_info["sec-Fetch-Dest"] = request_headers.get('sec-fetch-dest',"")
    session_info["sec-Fetch-Mode"] = request_headers.get('sec-fetch-mode',"")
    session_info["sec-Fetch-Site"] = request_headers.get('sec-fetch-site',"")
    session_info["user-Agent"] = request_headers.get('user-agent',"")

    return session_info



async def get_custom_payload_value(handle,key):
    session_information = await get_session_information(handle)
    current_access_token_payload = session_information.access_token_payload
    custom_claim_value = current_access_token_payload[key]
    return custom_claim_value



def set_device_fingerprint_to_db(user_id,device_fingerprint_cookie):
    if device_fingerprint_cookie:
        device_fingerprint =  url64.decode(device_fingerprint_cookie)
        try:
            mysql_auth_db_orm.map_fingerprint_with_userid(user_id,device_fingerprint)
        except:
            raise Exception("Error while adding device fingerprint to db")
    else:
        logger.error("No device fingerprint cookie is present")


def check_for_known_device(user_id,device_fingerprint_cookie):
    if device_fingerprint_cookie:
        device_fingerprint =  url64.decode(device_fingerprint_cookie)
        try:
            return mysql_auth_db_orm.check_if_fingerprint_present(user_id,device_fingerprint)
        except:
            raise Exception("Error while checking for known device")
    else:
        logger.error("No finger_print_cookie Present")
        return False
    
def get_location(ip_address):
    response = requests.get(f"http://ip-api.com/json/{ip_address}")
    if response.status_code == 200:
        return response.json()
    else:
        return None

def get_info_from_request(email,request):
    user_agent_string = request.headers.get('User-Agent')
    user_agent = parse(user_agent_string)

    os = user_agent.os.family  # Operating system
    browser = user_agent.browser.family  # Browser type

    #Please read this https://serverfault.com/a/997805/
    client_host = request.headers.get("X-Real-IP")
    if client_host is None:
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for is not None:
            client_host = forwarded_for.split(",")[0]

    if client_host is None:
        client_host = request.client.host

    location = get_location(client_host)  # Geolocation
    if client_host=="127.0.0.1": location="localhost" 
    elif location["status"]=='success':
        location=f"{location['city']}, {location['regionName']}, {location['country']}, {location['zip']}"
    return {
        "email":email,
        "OperatingSystem": os,
        "Browser": browser,
        "IPAddress": client_host,
        "Location": location
    }

async def is_email_verified(userDbId):
    res = await mysql_supertokens_db.check_verified_emails(userDbId)
    print("Verifid Mail ",True) if res else print("Verifid Mail ",False)
    return True if res else False




async def send_email_regarding_unknown_device(userid,device_fingerprint_cookie,email_info,request):
    email = email_info["email"]
    add_to_known_device_api_link = f"{read_yaml.api_domain}/add-to-known-device-list?device={device_fingerprint_cookie}"
    logger.info("Checking Email is verified or not")
    if await is_email_verified(userid):
        payload = {
            "user_id":userid,
            "device_fingerprint_cookie":device_fingerprint_cookie,
            "email_info":email_info,
        }

    try:
        await routes_db_services.send_email_regarding_unknown_device(payload,request)
    except Exception as e:
        raise Exception(e)


def add_to_known_device_list(userid,fingerprint):
    try:
        res = mysql_auth_db_orm.map_fingerprint_with_userid(userid,fingerprint)
    except Exception as e:
        raise Exception(e)
    return res


# def delete_session(sessionHandle):
#     try:
#         mysql_auth_db_orm.delete_session(sessionHandle)
#     except Exception as e:
#         raise Exception(e)
    

# def delete_session_for_user(userDbId):
#     try:
#         mysql_auth_db_orm.delete_session_for_user(userDbId)
#     except Exception as e:
#         raise Exception(e)



async def revoke_all_sessions_except_current(session:SessionContainer):
    current_session_handle = session.get_handle()
    user_id = session.user_id
    try:
        sessions = await get_all_session_handles_for_user(user_id)
    except Exception as e:
        logger.error(f"Error while getting sessions for userId:{user_id} : {e}")
        raise Exception(e)
    
    for sess in sessions:
        if sess != current_session_handle:
            try:
                print("Revoking session ",sess)
                await revoke_session(sess)
            except Exception as e:
                logger.error(f"Error while revoking session for userId:{user_id} : {e}")
                raise Exception(e)
            

def create_email_verification_token_and_add_it_to_db(user_id,email):

    try:
        token = utils.create_email_verification_token(user_id,email)
    except Exception as e:
        logger.error(e)
        raise Exception(e)
    
    try:
        token = mysql_auth_db_orm.add_email_verification_token_to_db(user_id,email,token,read_yaml.verification_token_expiry)
    except Exception as e:
        logger.error(e)
        raise Exception(e)
    
    return token


def create_password_token_and_add_it_to_db(user_id):
    try:
        token = utils.create_password_change_token(user_id)
    except Exception as e:
        raise Exception(e)
    
    try:
        mysql_auth_db_orm.add_password_change_token_to_db(user_id,token,read_yaml.verification_token_expiry)
    except Exception as e:
        raise Exception(e)
    
    return token



def get_token_from_db(token,user_id):
    s = URLSafeTimedSerializer(read_yaml.change_email_secret_key)
    # Deserialize the token and check it against the database
    try:
        data = s.loads(token, max_age=int(read_yaml.verification_token_expiry)*3600)  # Token is valid for 1 hour
    except SignatureExpired:
        logger.error("Token has expired")
        raise HTTPException(detail="Token has expired",status_code=404)
    
    if data['user_id'] != user_id:
        logger.error("Invalid token for this user")
        raise HTTPException(detail="Invalid token for this user", status_code=403)
    
    try:
        token_in_db = mysql_auth_db_orm.get_token_from_db(token,user_id)
    except Exception as e:
        raise Exception(e)
    
    return token_in_db


def check_if_token_exists(user_id:str,
                          new_email:str):
    try:
        res = mysql_auth_db_orm.check_if_token_exists(user_id,new_email)
    except Exception as e:
        raise Exception(e)
    return res



def get_token_from_password_db(token,user_id):
    s = URLSafeTimedSerializer(read_yaml.change_email_secret_key)
    
    # Deserialize the token and check it against the database
    try:
        data = s.loads(token, max_age=read_yaml.verification_token_expiry*3600)  # Token is valid for 1 hour

    except SignatureExpired:
        logger.error("Token has expired")
        raise HTTPException(detail="Token has expired",status_code=404)
    
    if data['user_id'] != user_id:
        logger.error("Invalid token for this user")
        raise HTTPException(detail="Invalid token for this user", status_code=403)
    
    try:
        token_in_db = mysql_auth_db_orm.get_token_from_password_db(token,user_id)
    except Exception as e:
        raise Exception(e)
    
    return token_in_db


def delete_token_from_db(token_in_db):
    try:
        mysql_auth_db_orm.delete_token_from_db(token_in_db)
    except Exception as e:
        raise Exception(e)
   

async def update_email_and_rollback_if_fail(token_in_db,request):
    try:
        await update_email_or_password(token_in_db.user_id, email=token_in_db.new_email)
        return True
    
    # Rollback the email update in user service
    #If Rolling back fails, then the we will have to manually change the email back to the old one using some cronjobs by seeing the logs
    
    except Exception as e:
        logger.error(f"Error while updating email for userId:{token_in_db.user_id} : {e}")
        logger.debug(f"Rolling back the email update in user service for userId:{token_in_db.user_id}")
        users_info = await get_user_by_id(token_in_db.user_id)
        old_email = users_info.email

        try:                          
            api_response = await routes_db_services.update_email_in_external_db(token_in_db.user_id, old_email,request)
        except Exception as e:
            logger.error(f"Error while Rolling back email from {old_email} to {token_in_db.new_email} in user service for userId:{token_in_db.user_id}")
            return False
    
async def check_if_email_password_user(email):
    try:
        res = await mysql_supertokens_db.check_if_email_present_in_custom_db(email)
    except Exception as e:
        raise Exception(e)
    return res

async def check_email_exists(email):
    try:
        res = await mysql_supertokens_db.check_email_exists_in_db(email)
    except Exception as e:
        raise Exception(e)
    return res


async def manually_verify_email(user_id: str,
                                tenant_id: str = "public"):
    try:
        # Create an email verification token for the user
        token_res = await create_email_verification_token(tenant_id,user_id)
        # If the token creation is successful, use the token to verify the user's email
        if isinstance(token_res, CreateEmailVerificationTokenOkResult):
            await verify_email_using_token(tenant_id,token_res.token)

    except Exception as e:
        raise Exception(e)

    #Adding 3DA/3DP role

    for role in ["3DA","3DP"]:
        try:
            await roles_permissions_services.add_role(user_id,role)
        except Exception as e:
            raise Exception(e) 

    #Removing Guest Role
    try:
        await roles_permissions_services.remove_role(user_id,"Guest")
    except Exception as e:
        raise Exception(e)


async def manually_unverify_email(user_id: str):
    try:
        # Set email verification status to false
        await unverify_email(user_id)
    except Exception as e:
        raise Exception(e)
    

    #Removing 3DA/3DP role
    for role in ["3DA","3DP"]:
        try:
            await roles_permissions_services.remove_role(user_id,role)
        except Exception as e:
            raise Exception(e) 
    
    
    #Adding Guest Role
    try:
        await roles_permissions_services.add_role(user_id,"Guest")
    except Exception as e:
        raise Exception(e)


def get_email_verify_link_custom(app_info, token: str) -> str:
    return (
        app_info.website_domain
        + app_info.website_base_path
        + "/verify-email"
        + "?token="
        + token
    )

async def send_verification_email(user_id: str, 
                                  email: str, 
                                  request: Request,
                                  tenant_id: str = "public"):
    
    
    token_res = await create_email_verification_token(tenant_id,user_id)
    if isinstance(token_res, CreateEmailVerificationTokenOkResult):
        verification_token = token_res.token
        verifcation_link = f"{read_yaml.api_domain}/verify-signup-email/{user_id}?token={verification_token}"
        try:
            response = await routes_db_services.send_signup_verification_email(email,user_id,verifcation_link,request)
        except Exception as e:
            raise Exception(e)
    else:
        raise Exception("Error while creating verification token")


def remove_front_token_from_db(response:Response):
    response.delete_cookie("sFrontToken")


def remove_tokens_from_frontend(response:Response):
    response.delete_cookie("sAccessToken")
    response.delete_cookie("sFrontToken")


async def force_refresh_sessions(user_id):
    try:
        sessions = await get_all_session_handles_for_user(user_id)
    except Exception as e:
        raise Exception(e)
    utils.cache["force_refreshed_handles"] = (utils.cache.get("force_refreshed_handles") or [])
    for sess in sessions:
        utils.cache["force_refreshed_handles"].append(sess)
        

async def add_email_change_requested_to_metadata(user_id,new_email):
    metadataResult = await get_user_metadata(user_id)
    email_metadata ={"isChangeEmailRequested":True, "newEmail":new_email}
    metadata = metadataResult.metadata
    metadata["emailChangeRequest"] = email_metadata
    await update_user_metadata(user_id, metadata)


async def remove_email_change_requested_from_metadata(user_id):
    metadataResult = await get_user_metadata(user_id)
    metadata = metadataResult.metadata
    print("Metadata before popping",metadata)
    if metadata.get("emailChangeRequest"):
        metadata["emailChangeRequest"] = None
    print("Metadata after popping",metadata)
    await update_user_metadata(user_id, metadata)


