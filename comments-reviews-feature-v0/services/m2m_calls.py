from fastapi import HTTPException,status
from logger.logging import getLogger
from HTTPX.AsyncIkarusClient import AsyncIkarusClient
from HTTPX.SyncIkarusClient import SyncIkarusClient
client = AsyncIkarusClient()
sync_client = SyncIkarusClient()
from utils import utils
from commentReviewsDb import database_actions
import httpx
from config import read_yaml
import time
logger = getLogger(__name__)
async def m2m_request(method:str,
                      service:str,
                      url:str,
                      x_request_id:str,
                      payload:dict=None,
                      params:dict=None,
                      user_id:str=None,
                      session=None)->dict:
    start_time = time.time()
    client._set_request_id(x_request_id)
    logger.debug(f"Making a {method} call to url: {url}")
    try:
        headers = await utils.create_jwt_and_auth_headers(userid=user_id)
    except Exception as e:
        logger.error(f"Failed to create JWT. Error: {e}")
        raise Exception("Failed to create JWT.")
    
    logger.debug("Calling")
    
    try:
        #Curently we are overriding the default timeout of 5 second to None on individual request basis. We have to check the exact time required for the request and set the timeout accordingly.
        #This was in accordance to the discussion we had with the team. We will be removing this once we have the exact time required for the request.
     
        if method == "GET":    
            response = await client.get(url,headers=headers,params = params,timeout=None)
        elif method == "POST":
            print("payload",payload)
            response = await client.post(url,json=payload,headers=headers,params = params,timeout=None)
        elif method == "PUT":
            response = await client.put(url,json=payload,headers=headers,params = params,timeout=None)
        elif method == "DELETE":
            response = await client.delete(url,headers=headers,params = params,timeout=None)
        else:
            raise Exception(f"Invalid method: {method}")
        
        response_json = response.json()
        status_code = response.status_code
        if status_code == 401:
            logger.error(f"Unauthorized to {service} service: {response_json}")
            raise Exception("Unauthorized")
        
        elif status_code == 404:
            logger.error(f"{service} service not found: {response_json}")
            raise Exception(f"{service} service url not found")
        
        elif status_code == 500:
            logger.error(f"Internal server error from {service} service: {response_json}")
            raise Exception("Internal server error")
        
        elif status_code not in [201,200]:
            logger.error(f"An Unexpected error occurred while requesting to {service} service: {response_json}")
            raise Exception(f"An error occurred while requesting to {service} service: {response_json}")
        
        end_time = time.time() - start_time
        logger.debug(f"time taken by {service} service is {end_time}")
        return response_json
    
    except httpx.RequestError as exc:
        logger.error(f"An error occurred while requesting to {service} service: {exc}")
        raise Exception(f"An error occurred while requesting to {service} service: {exc}")


async def get_users_data(request,user_id_list):
    try:
        users_data = await m2m_request(method="POST",
                        service="user", 
                        url=f"{read_yaml.USER_DOMAIN}/api/v1/users/user-ids",
                        x_request_id=request.state.x_request_id,
                        payload={"userids": user_id_list},
                        user_id=request.state.user_id)
        return users_data
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail= str(e))
    

async def in_app_comment_like(request,commentId):
    try:
        comment = database_actions.find_comment_from_commentId(commentId)
        user_id = comment["commentBy"]
        verb = "liked_your_comment"
        json = {"user_id": user_id, "verb": verb}
        response = await m2m_request(method="POST",
                                service="notification",
                                url=f"{read_yaml.NOTIFCATION_DOMAIN}/admin_panel/api/v1/notifications/in-app/scheduler/user/single",
                                x_request_id=request.state.x_request_id,
                                payload=json,
                                user_id=request.state.user_id,
                                session=None)
        
    except Exception as e:
        logger.error(e)
        raise e

async def in_app_comment_reply(request,commentId):
    try:
        comment = database_actions.find_comment_from_commentId(commentId)
        user_id = comment["commentBy"]
        verb = "replied_to_your_comment"
        json = {"user_id": user_id, "verb": verb}
        response = await m2m_request(method="POST",
                                service="notification",
                                url=f"{read_yaml.NOTIFCATION_DOMAIN}/admin_panel/api/v1/notifications/in-app/scheduler/user/single",
                                x_request_id=request.state.x_request_id,
                                payload=json,
                                user_id=request.state.user_id,
                                session=None)
        
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail= str(e))
    
async def adding_review_in_models_db(request,reviewId,modelId):
    try:
        str_time = time.time()
        response = await m2m_request(method="POST",
                                service="campaign",
                                url=f"{read_yaml.CAMPAIGN_DOMAIN}/api/v1/model/{modelId}/review/{reviewId}",
                                x_request_id=request.state.x_request_id,
                                payload={},
                                user_id=request.state.user_id,
                                session=None)
        end_time = time.time() - str_time
        logger.debug(f"time taken for adding review in models db{end_time}")
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR , detail= str(e))
    
async def adding_review_in_campaign_db(request,reviewId,campaignId , tierId):
    try:
        str_time = time.time()
        response = await m2m_request(method="POST",
                                service="campaign",
                                url=f"{read_yaml.CAMPAIGN_DOMAIN}/api/v1/campaign/{campaignId}/review/{reviewId}",
                                x_request_id=request.state.x_request_id,
                                payload={"tierId" : tierId},
                                user_id=request.state.user_id,
                                session=None)
        end_time = time.time() - str_time
        logger.debug(f"time taken for adding review in campaign db{end_time}")
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR , detail= str(e))

async def deleting_review_from_model_db(request,reviewId,modelId):
    try:
        str_time = time.time()
        response = await m2m_request(method="DELETE",
                                service="campaign",
                                url=f"{read_yaml.CAMPAIGN_DOMAIN}/api/v1/model/{modelId}/review/{reviewId}",
                                x_request_id=request.state.x_request_id,
                                payload={},
                                user_id=request.state.user_id,
                                session=None)
        end_time = time.time() - str_time
        logger.debug(f"time taken for deleting review from models db{end_time}")
    except Exception as e:
        logger.error(e)
        raise e

async def deleting_review_from_campaign_db(request,reviewId,campaignId,tierId):
    try:
        str_time = time.time()
        response = await m2m_request(method="DELETE",
                                service="campaign",
                                url=f"{read_yaml.CAMPAIGN_DOMAIN}/api/v1/campaign/{campaignId}/review/{reviewId}",
                                x_request_id=request.state.x_request_id,
                                payload={"tierId" : tierId},
                                user_id=request.state.user_id,
                                session=None)
        end_time = time.time() - str_time
        logger.debug(f"time taken for deleting review from campaign db{end_time}")
    except Exception as e:
        logger.error(e)
        raise e
    
async def deleting_review_from_campaign_db_by_admin(request , reviewId):
    try:
        str_time = time.time()
        response = await m2m_request(method="DELETE",
                                service="campaign",
                                url=f"{read_yaml.CAMPAIGN_DOMAIN}/api/v1/review/{reviewId}",
                                x_request_id=request.state.x_request_id,
                                payload={},
                                user_id=request.state.user_id,
                                session=None)
        end_time = time.time() - str_time
        logger.debug(f"time taken for deleting review from campaign db{end_time}")
    except Exception as e:
        logger.error(e)
        raise e

async def posting_comment_ids_in_campaign_service(request,commentFor,id,commentId):
    try:
        str_time = time.time()
        response = await m2m_request(method="POST",
                                service="campaign",
                                url=f"{read_yaml.CAMPAIGN_DOMAIN}/api/v1/{commentFor}/{id}/comment/{commentId}",
                                x_request_id=request.state.x_request_id,
                                payload={},
                                user_id=request.state.user_id,
                                session=None)
        end_time = time.time() - str_time
        logger.debug(f"time taken for posting comment ids in campaign service{end_time}")
    except Exception as e:
        logger.error(e)
        raise e

async def posting_comment_ids_in_user_service_for_portfolio(request,commentFor,id,commentId):
    try:
        str_time = time.time()
        response = await m2m_request(method="POST",
                                service="user",
                                url=f"{read_yaml.USER_DOMAIN}/api/v1/{commentFor}/{id}/comment/{commentId}",
                                x_request_id=request.state.x_request_id,
                                payload={},
                                user_id=request.state.user_id,
                                session=None)
        end_time = time.time() - str_time
        logger.debug(f"time taken for posting comment ids in user service for portfolio{end_time}")
    except Exception as e:
        logger.error(e)
        raise e

async def deleting_comments_from_campaign_service(commentId,id,commenFor,request):
    try:
        str_time = time.time()
        response = await m2m_request(method="DELETE",
                                service="campaign",
                                url=f"{read_yaml.CAMPAIGN_DOMAIN}/api/v1/{commenFor}/{id}/comment/{commentId}",
                                x_request_id=request.state.x_request_id,
                                payload={},
                                user_id=request.state.user_id,
                                session=None)
        end_time = time.time() - str_time
        logger.debug(f"time taken for deleting comment from campaign service{end_time}")
    except Exception as e:
        logger.error(e)
        raise e

async def deleting_comments_from_user_service_for_portfolio(commentId,id,commenFor,request):
    try:
        str_time = time.time()
        response = await m2m_request(method="DELETE",
                                service="user",
                                url=f"{read_yaml.USER_DOMAIN}/api/v1/{commenFor}/{id}/comment/{commentId}",
                                x_request_id=request.state.x_request_id,
                                payload={},
                                user_id=request.state.user_id,
                                session=None)
        end_time = time.time() - str_time
        logger.debug(f"time taken for deleting comment from user service for portfolio{end_time}")
    except Exception as e:
        logger.error(e)
        raise e