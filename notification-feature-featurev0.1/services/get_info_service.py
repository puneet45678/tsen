from config import read_yaml
from HTTPX.AsyncIkarusClient import AsyncIkarusClient
from utils.utils import create_jwt_and_auth_headers
import httpx
from logger.logging import get_db_action_Logger
from fastapi import HTTPException, status

client = AsyncIkarusClient()
logger = get_db_action_Logger(__name__)


async def m2m_request(
    method: str,
    service: str,
    url: str,
    x_request_id: str,
    payload: dict = None,
    params: dict = None,
    user_id: str = None,
    session=None,
) -> dict:
    print("Request_method: ",method)
    client._set_request_id(x_request_id)
    logger.debug(f"Making a {method} call to url: {url}")
    try:
        headers = await create_jwt_and_auth_headers(userid=user_id, session=session)
    except Exception as e:
        logger.error(f"Failed to create JWT. Error: {e}")
        raise Exception("Failed to create JWT.")
    logger.debug(f"Hitting the service_endpoint: {service}")

    try:
        # Curently we are overriding the default timeout of 5 second to None on individual request basis. We have to check the exact time required for the request and set the timeout accordingly.
        # This was in accordance to the discussion we had with the team. We will be removing this once we have the exact time required for the request.
        try:
            if method == "GET":
                response = await client.get(
                    url, headers=headers, params=params, timeout=None
                )
            elif method == "POST":
                print("payload", payload)
                response = await client.post(
                    url, json=payload, headers=headers, params=params, timeout=None
                )
            elif method == "PUT":
                response = await client.put(
                    url, json=payload, headers=headers, params=params, timeout=None
                )
            elif method == "DELETE":
                response = await client.delete(
                    url, headers=headers, params=params, timeout=None
                )
            else:
                logger.error(f"Invalid method: {method} request")
                raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED, detail=f"Invalid Method Request")

            response_json = response.json()
            status_code = response.status_code
            if status_code == 401:
                logger.error(f"Unauthorized to access {service} service | response: {response_json}")
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")

            elif status_code == 404:
                logger.error(f"{service} service not found | response: {response_json}")
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Service url not found")

            elif status_code == 500:
                logger.error(
                    f"Internal server error from {service} service | response: {response_json}"
                )
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

            elif status_code not in [200 , 201]:
                logger.error(
                    f"An Unexpected error occurred while requesting to {service} service | response: {response_json}"
                )
                raise Exception(
                    f"An error occurred while requesting to {service} service"
                )

            return response_json

        except httpx.RequestError as exc:
            logger.error(f"An error occurred while requesting to {service} service: {exc}")
            raise Exception(
                f"An error occurred while requesting to {service} service"
            )
    except Exception as exc:
        logger.error(str(exc))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An error occurred while requesting to {service} service")


async def get_campaign_name(campaign_id, request_id: str):
    client.request_id = request_id
    base_url = f"{read_yaml.CAMPAIGN_DOMAIN}/api/v1/campaign/{campaign_id}/display"

    try:
        logger.info(f"Getting campaign name for campaign_id: {campaign_id}")
        response = await m2m_request(
            "GET", url=base_url, x_request_id=request_id, service="Campaign"
        )
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error occurred while requesting for campaign name")
    return response["campaignTitle"]


async def get_user_data(user_id: str, request_id: str):
    client.request_id = request_id
    base_url = f"{read_yaml.USER_DOMAIN}/api/v1/user?userid={user_id}"

    try:
        logger.info(f"Getting user data for user_id: {user_id}")
        response = await m2m_request(
            "GET", url=base_url, x_request_id=request_id, service="User"
        )
        user_data = {"user_name": response["username"], "user_email": response["email"]}
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error occurred while requesting for user data")
    return user_data

##TODO: Iterate to get the user_ids
async def get_user_ids(request_id: str):
    client.request_id = request_id
    base_url = f"{read_yaml.USER_DOMAIN}api/v1/users"
    try:
        logger.info(f"Getting all the user IDs in the database with request_id: {request_id}")
        response = await m2m_request(
            "GET", url=base_url, x_request_id=request_id, service="User"
        )
        user_ids_list= []
        for user_response in response:
            user_ids_list.append(user_response["_id"])

    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error occurred while requesting the user IDs")
    return user_ids_list


async def get_user_emails_list(user_id_list: list, request_id: str):
    client.request_id = request_id
    data = {"userids": user_id_list}
    base_url = f"{read_yaml.USER_DOMAIN}/api/v1/users/user-ids"

    users_email_list = []
    

    try:
        logger.info(f"Getting the list of user email IDs with request_id: {request_id}")
        response = await m2m_request(
            "POST", url=base_url, x_request_id=request_id, service="User", payload=data
        )
       
        for user_data in response:
            users_email_list.append(user_data["email"])

    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error occurred while requesting for list of email IDs")
    return users_email_list


async def get_users_followers(user_id: str, request_id: str):
    client.request_id = request_id
    response_type = "list"
    base_url = f"{read_yaml.USER_DOMAIN}/api/v1/followers/{response_type}?userid={user_id}"
    try:
        logger.info(f"Getting the followers for user_id: {user_id}")
        response = await m2m_request(
            "GET", url=base_url, x_request_id=request_id, service="User"
        )
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error occurred while requesting for user's followers")
    return response


async def get_users_followers_data(user_id: str, request_id:str):
    client.request_id = request_id
    base_url = f"{read_yaml.USER_DOMAIN}/api/v1/followers/data?userid={user_id}"

    try:
        logger.info(f"Getting the followers data for user_id: {user_id}")
        response = await m2m_request(
            "GET", url=base_url, x_request_id=request_id, service="User"
        )
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error occurred while requesting for user's followers data")
    return response   

async def get_list_users_data(user_id_list:list,request_id:str):
    client.request_id = request_id
    data = {"userids": user_id_list}
    base_url = f"{read_yaml.USER_DOMAIN}/api/v1/users/user-ids"

    try:
        logger.info(f"Getting the list of user data with request_id: {request_id}")
        response = await m2m_request(
            "POST", url=base_url, x_request_id=request_id, service="User", payload=data
        )
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error occurred while requesting for list of user data")
    return response