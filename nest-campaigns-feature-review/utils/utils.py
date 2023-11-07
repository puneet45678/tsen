from config.read_yaml import config
from typing import Optional
import httpx
from jose import jwt
from jose.exceptions import JWTError
from fastapi import HTTPException
from logger.logging import getLogger
logger = getLogger(__name__)
from supertokens_python.recipe.jwt import asyncio
from supertokens_python.recipe.jwt.interfaces import CreateJwtOkResult
import uuid , time
import cachetools
from config import read_yaml
# Set up a cache with no explicit size limit, and a TTL of "forever" (since you want it for the application runtime)
cache = cachetools.TTLCache(maxsize=float('inf'), ttl=float('inf'))

AWS_BUCKET = config.aws["s3"]["bucket"]
AWS_URL_PATH_REGION_NAME = config.aws["s3"]["path-region"]
from datetime import datetime, timezone


def get_id_as_timezone():
    ts = int(datetime.now(timezone.utc).timestamp() * 1000000)
    return ts


def get_time_from_stamp(ts):
    dt_obj = datetime.fromtimestamp(ts / 1000000)
    return dt_obj


def get_path_for_deleting_tier_rewards_s3(year, month, campaignId, tierId):
    path = f"{year}/{month}/{campaignId}/rewards/{tierId}"
    return path


def get_path_for_rewards_s3(year, month, campaignId, tierId, file_name):
    path = f"{year}/{month}/{campaignId}/rewards/{tierId}/{file_name}"
    return path


def get_path_for_campaign_assets(year, month, campaignId, file_name):
    path = f"{year}/{month}/{campaignId}/campaign-assets/{file_name}"
    return path


def get_path_for_tier_s3(year, month, campaignId, tierId, file_name):
    path = f"{year}/{month}/{campaignId}/tier-assets/{tierId}/{file_name}"
    return path


def generating_url_s3(file_name):
    file_url = (
        f"https://{AWS_BUCKET}.{AWS_URL_PATH_REGION_NAME}.amazonaws.com/{file_name}"
    )
    return file_url


# def is_fileName_already_present_in_campaign_assets(campaignId, fileName):
#     present = database_actions.is_file_name_present_in_campaignAssets(
#         campaignId, fileName
#     )
#     if present:
#         return True
#     else:
#         return False


# def is_fileName_already_present_in_tierasset(campaignId, fileName):
#     present = database_actions.is_file_name_present_in_tierAsset(campaignId, fileName)
#     if present:
#         return True
#     else:
#         return False


def cropped_url(imageId, crop_info):
    try:
        new_url = f"https://ucarecdn.com/{imageId}/-/crop/{crop_info['width']}x{crop_info['height']}/{crop_info['x']},{crop_info['y']}/"
        return new_url
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail="Unable to crop image")


from fastapi import HTTPException

async def calling_jwks_endpoint():
    try:
        async with httpx.AsyncClient() as client:
            logger.debug(f"Getting jwks from auth service url,{read_yaml.jwks_endpoint}")
            response = await client.get(read_yaml.jwks_endpoint)
            response_data = response.json()
            cache[read_yaml.jwks_cached_key] = response_data
            logger.debug(f"Jwks cached successfully")
    
    except httpx.HTTPError as http_err:
        logger.error(f"HTTP error occurred: {http_err}")
        cache[read_yaml.jwks_cached_key] = None
        raise HTTPException(status_code=500, detail=f"HTTP error occurred: {http_err}")
    
    except Exception as err:
        logger.error(f"An error occurred: {err}")
        cache[read_yaml.jwks_cached_key] = None
        raise HTTPException(status_code=500, detail=f"An error occurred: {err}")
    

def get_token_from_request_headers(request):
    authorization: Optional[str] = request.headers.get('Authorization')
    if authorization:
        parts = authorization.split()

        if parts[0].lower() != 'bearer':
            print("Invalid token header")
            raise HTTPException(status_code=401, detail='Invalid token header')
        elif len(parts) == 1:
            print("Token missing")
            raise HTTPException(status_code=401, detail='Token missing')
        elif len(parts) > 2:
            print("Token contains spaces")
            raise HTTPException(status_code=401, detail='Token contains spaces')

        jwt_token = parts[1]
        return jwt_token
    else:
        raise HTTPException(status_code=401, detail='Token missing')
    
async def get_key(header):
    jwks_client = cache.get(read_yaml.jwks_cached_key)
    if jwks_client is None:
        logger.error("Key not found in cache")
        logger.debug("Fetching key from jwks endpoint")
        try:
            await calling_jwks_endpoint()
            jwks_client = cache.get(read_yaml.jwks_cached_key)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to fetch key from jwks endpoint. Error: {e}")
    rsa_key = {}
    for key in jwks_client['keys']:
        if key['kid'] == header['kid']:
            rsa_key = {
                'kty': key['kty'],
                'kid': key['kid'],
                'use': key['use'],
                'n': key['n'],
                'e': key['e']
            }
    if not rsa_key:
        raise HTTPException(status_code=500, detail="No RSA key found.")
    return rsa_key

async def create_jwt_and_auth_headers(userid = None, session_payload = None):
    payload = {"userId": userid, "sessionData": session_payload}
    try:
        jwtResponse = await asyncio.create_jwt(payload)
        if isinstance(jwtResponse, CreateJwtOkResult):
            jwt = jwtResponse.jwt
            return {"Authorization": f"Bearer {jwt}"}
        else:
            raise Exception("Unable to create JWT. Should never come here.")
    except Exception as e:
        raise Exception(e)

def get_unique_ikarus_request_id():
    # Create a UUID4
    uuid4 = uuid.uuid4().int

    # Get the current timestamp
    timestamp = int(time.time())

    # Combine the two values to create a 64-bit integer
    # In this case, I am taking the 32 most significant bits from the UUID and 32 bits from the timestamp
    unique_id = (uuid4 & 0xFFFFFFFF00000000) | (timestamp & 0xFFFFFFFF)

    return "ikarus-"+str(unique_id)