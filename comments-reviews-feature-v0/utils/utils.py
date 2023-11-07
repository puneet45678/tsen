from datetime import datetime , timezone 
import uuid , time
from fastapi import HTTPException 
import httpx
from logger.logging import getLogger
from typing import Optional
from supertokens_python.recipe.jwt import asyncio
from supertokens_python.recipe.jwt.interfaces import CreateJwtOkResult
import cachetools
from config import read_yaml
# Set up a cache with no explicit size limit, and a TTL of "forever" (since you want it for the application runtime)
cache = cachetools.TTLCache(maxsize=float('inf'), ttl=float('inf'))
logger = getLogger(__name__)
def get_id_as_timezone():
        ts=int(datetime.now(timezone.utc).timestamp()*1000000)
        return ts

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

def get_uuid_from_image_url_uploadcare(image_url : str):
    uuid = image_url.removeprefix("https://ucarecdn.com/").removesuffix("/")
    return uuid
