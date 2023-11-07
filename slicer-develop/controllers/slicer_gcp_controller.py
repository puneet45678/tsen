from fastapi import HTTPException,status
from supertokens_python.recipe.session.asyncio import get_session
from fastapi.requests import Request
from services import slicer_gcp_services
import time
import uuid
from config import read_yaml
from typing import Optional
from jose import jwt
from jose.exceptions import JWTError
from supertokens_python.recipe.session.asyncio import get_session
from typing import List
from logger.logging import get_logger
logger = get_logger(__name__)
from services.claim_validators import check_role_claim_and_throw_error_if_not_present,check_permission_claim_and_throw_error_if_not_present
from utils.utils import remove_region
from supertokens_python.recipe.session import SessionContainer
import json


def current_user(request):

    user_id = request.state.user_id
    session_id = request.state.session_id

    return {"current_user": user_id,
            "session_id": session_id}


async def start_container(request: Request , 
                          force: bool,
                          gcp_initial_cpu: str,
                          gcp_max_cpu: str,
                          gcp_initial_memory: str,
                          gcp_max_memory: str,
                          slicer_type:str,
                          idle_time:str,
                          time_quantumm:str,
                          modelId: str, 
                          campId: Optional[str] = None , 
                          tierId : Optional[str] = None,)->dict:
    
    
    request_id = request.state.x_request_id
    session: SessionContainer = request.state.session
    userid = session.user_id
    sessionid = session.session_handle
    session_payload = session.user_data_in_access_token

    service_prefix = f"{userid}-{sessionid}"
    timestamp = time.time()
    uuid_str = str(uuid.uuid1(node=int(timestamp * 1000)))

    try:
        camp_name,tier_name,model_name,assets = await slicer_gcp_services.get_stls_from_model_service(request_id, userid, session_payload, modelId, campId, tierId)
        
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")
       
    assets_removed =[remove_region(asset) for asset in assets]

    assets_str = ",".join(assets_removed)

    print("assets_str",assets_str)

    print("campId",campId)
    print("tierId",tierId)

    environment_variables = slicer_gcp_services.get_environment_variables_object(userid,sessionid,campId,tierId,uuid_str,assets_str,camp_name,tier_name,model_name,modelId,slicer_type,idle_time,time_quantumm)

    try:
        session_present = slicer_gcp_services.check_if_session_present(userid,sessionid)
    except Exception as e:
        logger.error(e)
        raise  HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Internal server error")

    logger.info(f"session_present: {session_present}")

    if session_present and force:
        try:
            delete_container(request)
        except Exception as e:
            logger.error(e)
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Internal server error")  


    try:
        host_port = slicer_gcp_services.get_random_port()
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Internal server error")
    
    try:
        res =slicer_gcp_services.run_service(environment_variables, service_prefix, read_yaml.gcp_slicer_image, port=host_port,gcp_initial_cpu=gcp_initial_cpu,gcp_max_cpu=gcp_max_cpu,gcp_initial_memory=gcp_initial_memory,gcp_max_memory=gcp_max_memory)
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Internal server error")
    
    api_response = res["response"]

    if api_response.status_code == 409:
        try:
            existing_url = slicer_gcp_services.get_existing_url(userid,sessionid)
        except Exception as e:
            logger.error(e)
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Internal server error")
        
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail=f"{existing_url}")

    if api_response.responseError:
        raise HTTPException(status_code=api_response.status_code,detail= api_response.responseError)

    cloud_run_url = res["url"]

    try:
        sub_domain = slicer_gcp_services.get_random_domain()
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Internal server error")
        
    try:
        slicer_session_id,random_url = slicer_gcp_services.set_slicer_session_data(userid,sessionid,host_port,sub_domain,campId,tierId,cloud_run_url,uuid_str)
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Internal server error")

    
    return {"cloud_run_url":cloud_run_url,
            "random_url":random_url}
    



async def delete_container(request):
    userid = request.state.user_id
    sessionid = request.state.session_id

    service_prefix = f"{userid}-{sessionid}"
    try:
        res=slicer_gcp_services.delete_service(userid,sessionid,service_prefix)
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Internal server error")
    
    if res.status_code == 200:
        try:
            slicer_gcp_services.delete_session_from_db(userid,sessionid)
        except Exception as e:
            logger.error(e)
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Internal server error")
        
        return {"message":"Slicer session deleted successfully"}
    
    elif res.status_code == 404:
        return {"message":"Slicer session not found"}
    
    else:
        raise HTTPException(status_code=res.status_code,detail="Internal server error Something went wrong")
    


async def get_cloud_run_url(request,response,subdomain):

    '''
     This asynchronous function retrieves the IP address and port associated with the provided subdomain. It first retrieves the session associated with the request. If no session exists, it raises an HTTP 401 error. The function then retrieves the IP address, port, and user ID associated with the subdomain from the database. If the user ID matches the ID from the session, the function adds the IP address and port to the response headers and returns them. If the IDs do not match, the function raises an HTTP 403 error.

    '''
    session = await get_session(request)
    userid = session.user_id
    sessionid = session.session_handle

    if session is None:
        raise HTTPException(status_code=401,detail="Unauthorized")

    url,userid_db = slicer_gcp_services.get_url_and_userid_using_subdomain_from_db(subdomain)
    print(url,userid_db)
    if userid_db == userid:
        response.headers["X-Slicer-url"]=f"{url}"
        return url
    else:
        raise HTTPException(status_code=403,detail="forbidden")
    
async def get_url_from_user_and_session(request,url_type):
    
    session = await get_session(request)
    user_id = session.user_id
    session_id = session.session_handle

    if url_type == "cloud_run":
        url = slicer_gcp_services.get_cloud_run_url_from_user_and_session(user_id,session_id)
    elif  url_type=="random":
        subdomain = slicer_gcp_services.get_random_url_from_user_and_session(user_id,session_id)
        url = f"https://{subdomain}.slicer.ikarusnest.org"
    else:
        raise HTTPException(status_code=400,detail="Invalid url type")
    if url is not None:
        return url
    else:
        raise HTTPException(status_code=404,detail="No slicer session available")
    

def get_running_services(request):
    session: SessionContainer = request.state.session
    userid = session.user_id
    try:
        res = slicer_gcp_services.get_running_services(userid)
    except Exception as e:
        logger.error(e)
        if str(e) == "No running services found":
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="No running services found")
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Internal server error")
    return res


def get_all_sessions(request):
    session: SessionContainer = request.state.session
    check_role_claim_and_throw_error_if_not_present(session,"SuperAdmin")
    
    try:
        res = slicer_gcp_services.get_all_sessions()
    except Exception as e:
        logger.error(e)
        if str(e) == "No sessions found":
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="No sessions found")
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Internal server error")
    return res