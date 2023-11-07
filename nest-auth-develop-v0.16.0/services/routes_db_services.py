from config import read_yaml
from db.models.User import User
from logger.logging import get_logger
from HTTPX.AsyncIkarusClient import AsyncIkarusClient
from services import m2m_calls
from fastapi import Request
from utils import utils
logger = get_logger(__name__)
client = AsyncIkarusClient()



async def add_user_to_external_db(newUser:User,
                                  x_request_id:str):
    
    #TODO: Set the request id using class method and make request_id as internal variable
    uid = newUser.userid
    email = newUser.email
    url = f"{read_yaml.inter_api_calls_base_url}/api/v1/user"
    logger.info(f"Adding user to external db with url: {url}")
    logger.debug(f"Calling user service with url: {url}")
    payload = {"userId": uid, "email": email}
    try:
        response = await m2m_calls.m2m_request("POST","user",url,x_request_id,payload=payload,user_id=uid)
    except Exception as e:
        raise Exception(e)
    return response
    

async def update_email_in_external_db(userDbId:str,
                                      new_email:str,
                                      request:Request):
    
    x_request_id = request.state.x_request_id
    url = f"{read_yaml.inter_api_calls_base_url}/api/v1/user/email"
    logger.info(f"Updating email in external db for user with userDbId: {userDbId} and new email: {new_email}")
    logger.debug(f"Calling user service with url: {url}")
    payload = {"userId": userDbId, "newEmail": new_email}

    try:
        response = await m2m_calls.m2m_request("PUT","user",url,x_request_id,payload=payload,user_id=userDbId)
    except Exception as e:
        raise Exception(e)
    return response


async def remove_user_from_external_db(user_id:str,
                                       x_request_id:str):
    
    url = f"{read_yaml.inter_api_calls_base_url}/api/v1/user/{user_id}"
    logger.info(f"Removing user from external db with url: {url}")
    logger.debug(f"Calling user service with url: {url}")

    try:
        response = await m2m_calls.m2m_request("DELETE","user",url,x_request_id,user_id=user_id)
    except Exception as e:
        raise Exception(e)
    return response
    

    

async def check_unique_username_from_user_service(userDbId:str,
                                                  username:str,
                                                  request:Request):
    
    request_id = request.state.x_request_id
    url = f"{read_yaml.inter_api_calls_base_url}/api/v1/user/username"
    query_params = {"uid": userDbId, "username":username}
    try:
        response = await  m2m_calls.m2m_request("POST","user",url,request_id,payload={},params=query_params,user_id=userDbId)
    except Exception as e:
        raise Exception(str(e))
    return response


async def send_email_regarding_unknown_device(payload:dict,
                                              request:Request):
    
    request_id = request.state.x_request_id
    url = f"{read_yaml.notification_service_url}/email/api/v1/notification/user/new-device-login"
    logger.debug(f"Calling notifications service with url: {url}")
    try:
        response = await m2m_calls.m2m_request("POST","notifications",url,request_id,payload=payload,user_id=payload["user_id"])
    except Exception as e:
        raise Exception(e)
    return response


async def send_signup_verification_email(email: str, 
                                         user_id:str , 
                                         verification_link:str,
                                         request:Request):
    
    request_id = request.state.x_request_id
    url = f"{read_yaml.notification_service_url}/email/api/v1/notification/confirmation/sign-up"
    logger.debug(f"Calling notifications service with url: {url}")
    payload = {"user_id": user_id, "user_email": email, "verification_link":verification_link}
    try:
        response = await m2m_calls.m2m_request("POST","notifications",url,request_id,payload=payload,user_id=user_id)
    except Exception as e:
        raise Exception(e)
    return response



async def send_new_email_verification_mail(userid:str,
                                            email:str,
                                            token:str,
                                            request:Request):
    
    x_request_id = request.state.x_request_id
    url = f"{read_yaml.notification_service_url}/email/api/v1/notification/change-email/verification/new-email"
    logger.debug(f"Calling notifications service with url: {url}")
    payload = {"user_id": userid, "user_email": email, "token":token}
    try:
        response = await m2m_calls.m2m_request("POST","notifications",url,x_request_id,payload=payload,user_id=userid)
    except Exception as e:
        raise Exception(e)
    return response


async def send_acknowledgement_about_email_change(user_id:str,
                                                  old_email:str,
                                                  new_email:str,
                                                  request:Request):
    x_request_id = request.state.x_request_id
    url = f"{read_yaml.notification_service_url}/email/api/v1/notification/change-email/acknowledgement"
    logger.debug(f"Calling notifications service with url: {url}")
    payload = {"user_id": user_id, "old_email": old_email, "new_email":new_email}
    try:
        response = await m2m_calls.m2m_request("POST","notifications",url,x_request_id,payload=payload,user_id=user_id)
    except Exception as e:
        raise Exception(e)
    return response



async def send_password_change_email(user_id:str,
                                     request:Request):
    
    x_request_id = request.state.x_request_id
    payload = {"user_id": user_id}
    url = f"{read_yaml.notification_service_url}/email/api/v1/notification/change-password/acknowledgement"
    logger.debug(f"Calling notifications service with url: {url}")
    try:
        response = await m2m_calls.m2m_request("POST","notifications",url,x_request_id,payload=payload,user_id=user_id)
    except Exception as e:
        if str(e)=="Request Error":
            return None
        raise Exception(e)
    return response



async def send_reset_password_email(user_id:str,
                                    email:str,
                                    token:str,
                                    request:Request):
    
    x_request_id = request.state.x_request_id
    payload = {"user_id": user_id, "user_email": email, "token":token}
    # verification_link = f"{read_yaml.api_domain}/reset-password/{token}"

    url = f"{read_yaml.notification_service_url}/email/api/v1/notification/reset-password"
    
    logger.debug(f"Calling notifications service with url: {url}")
    try:
        response = await m2m_calls.m2m_request("POST","notifications",url,x_request_id,payload=payload,user_id=user_id)
    except Exception as e:
        raise Exception(e)
    return response



async def send_acknowledgement_about_password_reset(user_id:str):
    x_request_id = utils.get_unique_ikarus_request_id()
    payload = {"user_id": user_id}
    url = f"{read_yaml.notification_service_url}/email/api/v1/notification/reset-password/acknowledgement"
    logger.debug(f"Calling notifications service with url: {url}")
    try:
        response = await m2m_calls.m2m_request("POST","notifications",url,x_request_id,payload=payload,user_id=user_id)
    except Exception as e:
        raise Exception(e)
    return response



async def check_for_suspendend_user(x_request_id:str,
                                    user_id:str):
        
    url = f"{read_yaml.inter_api_calls_base_url}/api/v1/user/check-login-eligibility/{user_id}"
    
    logger.debug(f"Calling user service with url: {url}")

    try:
        response = await m2m_calls.m2m_request("GET","user",url,x_request_id,user_id=user_id)
    except Exception as e:
        raise Exception(e)
    logger.debug("Resposne from user service for eligibility check: ",response)
    return response
    
