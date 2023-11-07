from logger.logging import getLogger
import httpx
from fastapi import HTTPException,status
from HTTPX.AsyncIkarusClient import AsyncIkarusClient
from HTTPX.SyncIkarusClient import SyncIkarusClient
import requests,time
from utils import utils
from config import read_yaml

logger = getLogger(__name__)
client = AsyncIkarusClient()
sync_client = SyncIkarusClient()

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
    print(f"Calling {url} with payload {payload} and request id {x_request_id}")
    
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
        logger.debug(f"Got response from {service} service")
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
        
        elif status_code not in [200,201]:
            logger.error(f"An Unexpected error occurred while requesting to {service} service: {response_json}")
            raise Exception(f"An error occurred while requesting to {service} service: {response_json}")
        end_time = time.time() - start_time
        logger.debug(f"total time taken in m2m call from {service} service: {end_time}")
        return response_json
    
    except httpx.RequestError as exc:
        logger.error(f"An error occurred while requesting to {service} service: {exc}")
        raise Exception(f"An error occurred while requesting to {service} service: {exc}")

################################################   USER SERVICE CALLS   #########################################################    

async def get_user_data(request,user_id):
    try:
        user_data = await m2m_request(method="GET",
                            service="user",
                            url=f"{read_yaml.USER_DOMAIN}/api/v1/user?userid={user_id}",
                            x_request_id=request.state.x_request_id,
                            user_id=request.state.user_id)
        
        return user_data
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail= str(e))

async def get_user_follower_list(request,user_id,response_type):
    
    try:
        follower_list = await m2m_request(method="GET",
                                        service="user",
                                        url=f"{read_yaml.USER_DOMAIN}/api/v1/followers/{response_type}?userid={user_id}",
                                        x_request_id=request.state.x_request_id,
                                        user_id=request.state.user_id)
        return follower_list
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="error in getting user follower list")
    

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
    
############################################### NOTIFICATION SERVICE CALLS FOR MODEL #########################################################

async def send_email_notification_for_model_deletion_to_backers(request,buyers_list,model_name, model_id,deletion_request_date,final_deletion_date):
    try:

        json={
            "model_name": model_name,
            "buyers_user_id_list":buyers_list,
            "deletion_request_date":deletion_request_date,
            "final_deletion_date":final_deletion_date}
        
        response = await m2m_request(method="POST",
                        service="notification",
                        url = f"{read_yaml.NOTIFCATION_DOMAIN}/email/api/v1/notification/backers/model-deletion",
                        x_request_id=request.state.x_request_id,
                        payload=json,
                        user_id=request.state.user_id,)
        logger.debug(response)
        return response
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR , detail=str(e))



async def send_email_notification_for_model_deletion_to_owners(request,user_id,model_name, model_id,deletion_request_date,final_deletion_date):
    try:
        json = {
                "model_name": model_name,
                "owner_user_id": user_id,
                "deletion_request_date":deletion_request_date,
                "final_deletion_date":final_deletion_date}
        
        response = await m2m_request(method="POST",
                        service="notification",
                        url = f"{read_yaml.NOTIFCATION_DOMAIN}/email/api/v1/notification/owner/model-deletion",
                        x_request_id=request.state.x_request_id,
                        payload=json,
                        user_id=request.state.user_id,)
        logger.debug(response)
        return response
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR , detail=str(e))
    


async def send_email_admin_approve_model(request,user_id , model_name):
    try:
        json = {"user_id": user_id,
                "model_name": str(model_name)}
        
        response = await m2m_request(method="POST",
                        service="notification",
                        url = f"{read_yaml.NOTIFCATION_DOMAIN}/email/api/v1/notification/model-approval",
                        x_request_id=request.state.x_request_id,
                        payload=json,
                        user_id=request.state.user_id,)
        logger.debug(response)
        return response
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR , detail=str(e))
    
async def send_email_admin_reject_model(request,user_id , model_name):
    try:
        json = {"user_id": user_id,
                "model_name": str(model_name)}
        
        response = await m2m_request(method="POST",
                        service="notification",
                        url = f"{read_yaml.NOTIFCATION_DOMAIN}/email/api/v1/notification/model-rejection",
                        x_request_id=request.state.x_request_id,
                        payload=json,
                        user_id=request.state.user_id,)
        logger.debug(f"response from service is {response}")
        return response
        
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR , detail=str(e))

async def send_in_app_model_live(request,follower_list,notification_data,owner_user_name,verb):
    
    try:
        json={"user_id_list": follower_list, 
            "notification_data": notification_data,
            "owner_user_name" : owner_user_name,
            "verb" : verb}
        
        logger.info("sending live model in-app-notification")
        response = await m2m_request(method="POST",
                        service="notification",
                        url=f"{read_yaml.NOTIFCATION_DOMAIN}/admin_panel/api/v1/notifications/in-app/scheduler/user/multiple",
                        x_request_id=request.state.x_request_id,
                        payload=json,
                        user_id=request.state.user_id,)
        logger.debug(response)
        return response
        
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

async def send_in_app_model_purchase(request,user_id,verb):
    try:
        json={"user_id": user_id,
            "verb" : verb}
        
        response = await m2m_request(method="POST",
                        service="notification",
                        url=f"{read_yaml.NOTIFCATION_DOMAIN}/admin_panel/api/v1/notifications/in-app/scheduler/user/single",
                        x_request_id=request.state.x_request_id,
                        payload=json,
                        user_id=request.state.user_id,)
        logger.debug(response)
        return response
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

async def send_in_app_model_like(request,user_id,verb,notification_data):
    try:
        json={"user_id": user_id,
            "verb" : verb,
            "notification_data" : notification_data}
        
        response = await m2m_request(method="POST",
                        service="notification",
                        url=f"{read_yaml.NOTIFCATION_DOMAIN}/admin_panel/api/v1/notifications/in-app/scheduler/user/single",
                        x_request_id=request.state.x_request_id,
                        payload=json,
                        user_id=request.state.user_id,)
        logger.debug(response)
        return response
        
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

async def send_in_app_model_comment(request,user_id,verb):
    try:
        json={"user_id": user_id,
            "verb" : verb}
        
        response = await m2m_request(method="POST",
                        service="notification",
                        url=f"{read_yaml.NOTIFCATION_DOMAIN}/admin_panel/api/v1/notifications/in-app/scheduler/user/single",
                        x_request_id=request.state.x_request_id,
                        payload=json,
                        user_id=request.state.user_id,)
        logger.debug(response)
        return response
        
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    
################################################ NOTIFICATION SERVICE CALLS FOR CAMPAIGN #########################################################

async def send_campaign_ending_notification(request,user_id, campaign_name,time_left,pre_marketing_signees,wishlisted_users):
    try:
        json = {"campaign_owner_id": user_id, 
                "campaign_name": campaign_name,
                "time_left": time_left,
                "pre_marketing_signees_user_ids_list" : pre_marketing_signees,
                "wishlisted_user_ids_list" : wishlisted_users,}
        
        await m2m_request(method="POST",
                        service="notification",
                        url = f"{read_yaml.NOTIFCATION_DOMAIN}/email/api/v1/notification/campaign-ending-soon",
                        x_request_id=request.state.x_request_id,
                        payload=json,
                        user_id=request.state.user_id,)
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR , detail=str(e))

async def send_campaign_draft_state_notification(request,user_id, campaign_name):
    try:
        json = {"user_id": user_id,
                "draft_product_item_name": campaign_name,
                "draft_product_item_type": "campaign",}
        
        await m2m_request(method="POST",
                        service="notification",
                        url = f"{read_yaml.NOTIFCATION_DOMAIN}/email/api/v1/notification/object-in-draft",
                        x_request_id=request.state.x_request_id,
                        payload=json,
                        user_id=request.state.user_id,)
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR , detail=str(e))
    
async def send_campaign_live_notification(request,user_id , campaign_name,pre_marketing_signees,campaign_description):
    try:
        logger.info("Sending campaign live notification")
        base_url=f"{read_yaml.NOTIFCATION_DOMAIN}/email/api/v1/notification/campaign-published"
        json={"campaign_owner_user_id": user_id, 
            "campaing_name": str(campaign_name),
            "pre_marketing_signees_user_id_list" : pre_marketing_signees,
            "campaign_description" : campaign_description,}
        
        response = await m2m_request(method="POST",
                            service="notification",
                            url=base_url,
                            x_request_id=request.state.x_request_id,
                            payload=json,
                            user_id=request.state.user_id,
                            session=None)
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    
async def send_email_admin_action_campaign(request,user_id , action , campaign_name,comment):
    try:
        json = {"campaign_user_id" : user_id,
                "campaign_name" : campaign_name,
                "action" : action,
                "campaign_comments" : comment}
        
        await m2m_request(method="POST",
                        service="notification",
                        url = f"{read_yaml.NOTIFCATION_DOMAIN}/email/api/v1/notification/admin/campaign-action",
                        x_request_id=request.state.x_request_id,
                        payload=json,
                        user_id=request.state.user_id,)
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR , detail=str(e))
    

async def send_in_app_campaign_comment_notification(request,user_id,verb):
    try:
        json={"user_id": user_id,
            "verb" : verb}
        
        response = await m2m_request(method="POST",
                            service="notification",
                            url=f"{read_yaml.NOTIFCATION_DOMAIN}/admin_panel/api/v1/notifications/in-app/scheduler/user/single",
                            x_request_id=request.state.x_request_id,
                            payload=json,
                            user_id=request.state.user_id,
                            session=None)
        return response
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

async def send_in_app_campaign_like_notification(request,user_id_campaign_owner,verb):
    try:
        json={"user_id": user_id_campaign_owner,
            "verb" : verb}
        
        response = await m2m_request(method="POST",
                            service="notification",
                            url=f"{read_yaml.NOTIFCATION_DOMAIN}/admin_panel/api/v1/notifications/in-app/scheduler/user/single",
                            x_request_id=request.state.x_request_id,
                            payload=json,
                            user_id=request.state.user_id,
                            session=None)
        return response
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    
async def send_earlybird_ending_notification(request,userId, campaign_id, time_left):
    try:
        json = {"user_id": userId,
                "campaign_id": campaign_id,
                "time_left": time_left,}
        
        await m2m_request(method="POST",
                        service="notification",
                        url = f"{read_yaml.NOTIFCATION_DOMAIN}/email/api/v1/notification/earlybird-tier-ending-soon",
                        x_request_id=request.state.x_request_id,
                        payload=json,
                        user_id=request.state.user_id,)
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

########################################################################################################################
async def get_review_from_review_db(request,reviewId):
    try:
        logger.info("Getting review from review db")
        base_url=f"{read_yaml.REVIEW_DOMAIN}/api/v1/review/{reviewId}"
        response = await m2m_request(method="GET",
                            service="review",
                            url=base_url,
                            x_request_id=request.state.x_request_id,
                            payload=None,
                            user_id=request.state.user_id,
                            session=None)
        return response
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    
async def get_reviews_from_review_db(request,review_ids):
    try:
        logger.info("Getting review from review db")
        base_url=f"{read_yaml.REVIEW_DOMAIN}/api/v1/reviews/orders"
        response = await m2m_request(method="POST",
                            service="review",
                            url=base_url,
                            x_request_id=request.state.x_request_id,
                            payload={"reviewIds":review_ids},
                            user_id=request.state.user_id,
                            session=None)
        return response
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    
async def send_email_to_backers(request,campaign_owner_user_id,campaign_name,milestoneTitle,backers_list,milestone_rewards):
    try:
        json = {"campaign_owner_user_id": campaign_owner_user_id,
                "campaign_name": campaign_name,
                "milestone_name": milestoneTitle,
                "backers_user_ids_list": backers_list,
                "milestone_rewards": milestone_rewards}
        
        await m2m_request(method="POST",
                        service="notification",
                        url = f"{read_yaml.NOTIFCATION_DOMAIN}/email/api/v1/notification/milestone-reached",
                        x_request_id=request.state.x_request_id,
                        payload=json,
                        user_id=request.state.user_id,)
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR , detail=str(e))