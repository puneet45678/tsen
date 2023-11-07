from datetime import datetime
from jinja2 import Environment, FileSystemLoader
import os
from supertokens_python.recipe.jwt import asyncio
from supertokens_python.recipe.jwt.interfaces import CreateJwtOkResult
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from config import read_yaml
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from db.models.EmailRequest import Email
from logger.logging import get_logger
import yaml
cwd = os.getcwd()
logger = get_logger(__name__)
from jose import jwk
from jose.utils import base64url_decode
from jose import jwt, jwk
from jose.utils import base64url_decode
from itsdangerous import URLSafeTimedSerializer
from datetime import datetime, timedelta
import httpx
from typing import Optional
from fastapi import Body, Depends, HTTPException, Request
import uuid
import time
from bson.objectid import ObjectId
from re import fullmatch
import cachetools
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_ipaddr
# Set up a cache with no explicit size limit, and a TTL of "forever" (since you want it for the application runtime)
cache = cachetools.TTLCache(maxsize=float('inf'), ttl=float('inf'))




def get_email_from_request(email_request: Email = Body(...)):
    return email_request.email


def get_id_from_request(request: Request):
    return request.state.user_id


ip_limiter = Limiter(key_func=get_ipaddr)  # For IP-based limiting
email_limiter = Limiter(key_func=get_email_from_request)   # For email-based limiting  
id_limiter = Limiter(key_func=get_id_from_request)  # For id-based limiting


def limit_by_email(request: Request, email: str = Depends(get_email_from_request)):
    if not email_limiter.check_request(request, "3/hour"):
        raise HTTPException(detail="Too Many Requests", status_code=429)
    return email


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
    

def is_valid_mongo_id(s):
    if len(s) != 24:
        return False
    try:
        ObjectId(s)
        return True
    except:
        return False


def rsa_jwk_to_pem(rsa_key):
    n = base64url_decode(rsa_key['n'].encode('utf-8'))
    e = base64url_decode(rsa_key['e'].encode('utf-8'))
    public_key_data = {
        'n': int.from_bytes(n, 'big'),
        'e': int.from_bytes(e, 'big'),
    }
    public_key = jwk.construct(public_key_data, rsa_key['kty'])
    return public_key.to_pem().decode('utf-8')



def decode_jwt(jwt_token, jwks):
    # Extract the key id from the JWT header
    headers = jwt.get_unverified_header(jwt_token)
    kid = headers['kid']

    # Find the right key in the JWKS based on the key id
    rsa_key = next((key for key in jwks['keys'] if key['kid'] == kid), None)
    if rsa_key is None:
        raise Exception('Unable to find the correct key in the JWKS')

    # Convert the JWK to a PEM
    rsa_key_pem = rsa_jwk_to_pem(rsa_key)

    # Decode the JWT and return the payload
    return jwt.decode(jwt_token, rsa_key_pem, algorithms=['RS256'])



async def create_jwt_and_auth_headers(userid = None, session=None, session_payload = None):
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



def get_time_from_stamp(ts):
    dt_obj = datetime.fromtimestamp(ts // 1000)
    return dt_obj

def get_protocol_host(url):
    url = str(url)
    return url.split("?")[0]

def get_external_id(url):
    return url.split("=")[1]

def get_verification_template():
    templates_dir = os.path.join(os.getcwd(), 'templates')
    env = Environment(loader=FileSystemLoader(templates_dir))
    template = env.get_template('email_verification.html')
    return template

def get_new_email_verification_template():
    templates_dir = os.path.join(os.getcwd(), 'templates')
    env = Environment(loader=FileSystemLoader(templates_dir))
    template = env.get_template('new_email_verification.html')
    return template

def get_forget_password_template():
    templates_dir = os.path.join(os.getcwd(), 'templates')
    env = Environment(loader=FileSystemLoader(templates_dir))
    template = env.get_template('forget_password.html')
    return template

def get_new_device_info_template():
    templates_dir = os.path.join(os.getcwd(), 'templates')
    env = Environment(loader=FileSystemLoader(templates_dir))
    template = env.get_template('new_device_info.html')
    return template



def add_roles_permission_in_yaml(role: str, permissions: list):
    logger.debug(f"Adding the role {role} and permissions {permissions} in yaml file")
    filepath = os.path.join(cwd,"config","roles_permissions.yaml")
    try:
        with open(filepath, 'r') as yamlfile:
            current_roles = yaml.safe_load(yamlfile)
    except Exception as e:
        raise Exception(e)

    if role not in current_roles['roles']:
        current_roles['roles'].append(role)

    if role in current_roles['permissions']:
        # append new permissions to the existing ones, removing duplicates
        current_roles['permissions'][role] = list(set(current_roles['permissions'][role] + permissions))
    else:
        current_roles['permissions'][role] = permissions
    
    try:
        with open(filepath, 'w') as yamlfile:
            yaml.safe_dump(current_roles, yamlfile)
            
    except Exception as e:
        raise Exception(e)
    return "Role and permissions successfully updated in yaml file"


def create_email_verification_token(user_id: str, new_email: str):
    s = URLSafeTimedSerializer(read_yaml.change_email_secret_key)
    # Here, 'user_id' and 'new_email' are just data you want to store in the token
    token = s.dumps({'user_id': user_id, 'new_email': new_email})

    return token

def create_password_change_token(user_id: str):
    s = URLSafeTimedSerializer(read_yaml.change_email_secret_key)
    token = s.dumps({'user_id': user_id})
    return token


def get_unique_ikarus_request_id():
    # Create a UUID4
    uuid4 = uuid.uuid4().int

    # Get the current timestamp
    timestamp = int(time.time())

    # Combine the two values to create a 64-bit integer
    # In this case, I am taking the 32 most significant bits from the UUID and 32 bits from the timestamp
    unique_id = (uuid4 & 0xFFFFFFFF00000000) | (timestamp & 0xFFFFFFFF)

    return "ikarus-"+str(unique_id)

def get_unique_ikarus_guest_id():
    # Create a UUID4
    uuid4 = uuid.uuid4().int

    # Get the current timestamp
    timestamp = int(time.time())

    # Combine the two values to create a 64-bit integer
    # In this case, I am taking the 32 most significant bits from the UUID and 32 bits from the timestamp
    unique_id = (uuid4 & 0xFFFFFFFF00000000) | (timestamp & 0xFFFFFFFF)

    return "G-"+str(unique_id)

async def is_valid_email(value: str) -> bool:
    return (
        fullmatch(
            r'^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,'
            r"3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$",
            value,
        )
        is not None
    )