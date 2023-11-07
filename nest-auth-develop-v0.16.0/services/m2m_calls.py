from config import read_yaml
from utils import utils
from logger.logging import get_logger
import httpx
from HTTPX.AsyncIkarusClient import AsyncIkarusClient
from HTTPX.SyncIkarusClient import SyncIkarusClient

logger = get_logger(__name__)
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
        
        elif status_code not in [200,201,202,204]:
            logger.error(f"An Unexpected error occurred while requesting to {service} service: {response_json}")
            raise Exception(f"An error occurred while requesting to {service} service: {response_json}")
        
        return response_json
    
    except httpx.RequestError as exc:
        logger.error(f"An error occurred while requesting to {service} service: {exc}")
        raise Exception(f"Request Error")
    

