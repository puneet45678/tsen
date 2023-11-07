from datetime import datetime
from jinja2 import Environment, FileSystemLoader
import os
import shutil
import aiofiles
from datetime import datetime
from supertokens_python.recipe.jwt import asyncio
from supertokens_python.recipe.jwt.interfaces import CreateJwtOkResult
from logger.logging import get_logger
logger = get_logger(__name__)
import uuid
import time
from jose import jwt
from jose.exceptions import JWTError
from fastapi import HTTPException
from typing import Optional
import httpx
from config import read_yaml
import re

def remove_region(url):
    return url.replace(".ap-south-1.", ".")

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

def get_forget_password_template():
    templates_dir = os.path.join(os.getcwd(), 'templates')
    env = Environment(loader=FileSystemLoader(templates_dir))
    template = env.get_template('forget_password.html')
    return template

async def save_file(userid,file):
    save_directory = os.path.join(os.getcwd(),'temp','uploads','stls',userid)
    os.makedirs(save_directory,exist_ok=True)
    async with aiofiles.open(os.path.join(save_directory, file.filename), "wb") as f:
        contents = await file.read()
        await f.write(contents)
    print("File saved locally...")
    return os.path.join(save_directory,file.filename)


async def create_jwt_and_auth_headers(userid = None,session=None, session_payload = None):
    payload = {"userId": userid, "session":session, "sessionData": session_payload}
    try:
        jwtResponse = await asyncio.create_jwt(payload)
        print("JWT created...", jwtResponse)
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
    try:
        jwks_uri = f"{read_yaml.api_domain}/auth/jwt/jwks.json"
        async with httpx.AsyncClient() as client:
            response = await client.get(jwks_uri)
            response.raise_for_status()  # Raises an HTTPError for 4xx and 5xx responses
            jwks_client = response.json()
    
    except httpx.HTTPError as http_err:
        logger.error(f"HTTP error occurred: {http_err}")
        raise HTTPException(status_code=500, detail=f"HTTP error occurred: {http_err}")
    
    except Exception as err:
        logger.error(f"An error occurred: {err}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {err}")

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


def get_unique_ikarus_request_id():
    # Create a UUID4
    uuid4 = uuid.uuid4().int

    # Get the current timestamp
    timestamp = int(time.time())

    # Combine the two values to create a 64-bit integer
    # In this case, I am taking the 32 most significant bits from the UUID and 32 bits from the timestamp
    unique_id = (uuid4 & 0xFFFFFFFF00000000) | (timestamp & 0xFFFFFFFF)

    return "ikarus-"+str(unique_id)