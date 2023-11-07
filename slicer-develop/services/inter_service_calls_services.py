from logger.logging import get_logger
logger = get_logger(__name__)
from config import read_yaml
import httpx
from utils import utils
import requests
from HTTPX.AsyncIkarusClient import AsyncIkarusClient
client = AsyncIkarusClient()

async def m2m_request(method:str,
                      service:str,
                      url:str,
                      x_request_id:str,
                      payload:dict=None,
                      params:dict=None,
                      user_id:str=None,
                      session=None):
    
    client._set_request_id(x_request_id)
    logger.debug(f"Making a {method} call to url: {url}")
    try:
        headers = await utils.create_jwt_and_auth_headers(userid=user_id,session=session)
    except Exception as e:
        logger.error(f"Failed to create JWT. Error: {e}")
        raise Exception("Failed to create JWT.")
    logger.debug("Calling")
    
    try:
        #Curently we are overriding the default timeout of 5 second to None on individual request basis. We have to check the exact time required for the request and set the timeout accordingly.
        #This was in accordance to the discussion we had with the team. We will be removing this once we have the exact time required for the request.
     
        if method == "GET":    
            response = await client.get(url,headers=headers,params=params,timeout=None)
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
        
        elif status_code != 200:
            logger.error(f"An Unexpected error occurred while requesting to {service} service: {response_json}")
            raise Exception(f"An error occurred while requesting to {service} service: {response_json}")
        
        return response_json
    
    except httpx.RequestError as exc:
        logger.error(f"An error occurred while requesting to {service} service: {exc}")
        raise Exception(f"An error occurred while requesting to {service} service: {exc}")
    







async def get_stls_from_campaign_service(userid:dict,campId:str,tierId:str,session_payload:dict):

    api_response = APIResponse()

    url = f"{read_yaml.campagin_service_base_url}/api/v1/campaigns/{campId}/campaign-rewards?tierId={tierId}"
    logger.debug(f"getting stls from campaign service {url}")

    try:
        headers = await utils.create_jwt_and_auth_headers(userid,session_payload)
    except Exception as e:
        logger.error(f"Failed to create JWT. Error: {e}")
        api_response.responseError = "Failed to create JWT."
        api_response.responseCode = 500
        return api_response
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url,headers=headers)
        api_response.response = response.json()
        api_response.responseCode = response.status_code


    except requests.exceptions.RequestException as e:
        # This will catch any kind of requests exceptions, including HTTPError
        api_response.responseError = "Campaign service is down or responded with an error."
        api_response.responseCode = 400
        logger.error(f"Campaign service is down or responded with an error. Error: {e}")
        

    except Exception as e:
        # This is a catch-all for unexpected exceptions
        if response.status_code == 401:
            api_response.responseError = "Unauthorized"
            api_response.responseCode = 401
            logger.error("Unauthorized to call the external service")
        else:
            api_response.responseError = "Unexpected error occurred."
            api_response.responseCode = 500
            logger.error(f"Unexpected error occurred. Error: {e}")
    
    return api_response

