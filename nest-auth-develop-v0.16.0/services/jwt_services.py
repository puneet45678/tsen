from supertokens_python.recipe.jwt import asyncio
from supertokens_python.recipe.jwt.interfaces import CreateJwtOkResult
import httpx
from jose import jwt
from jose.exceptions import JWTError
from config import read_yaml

async def create_jwt(payload):
    jwtResponse = await asyncio.create_jwt(payload)
    if isinstance(jwtResponse, CreateJwtOkResult):
        jwt = jwtResponse.jwt
        return jwt
    else:
        raise Exception("Unable to create JWT. Should never come here.")


async def get_key(header):
    jwks_uri = f"{read_yaml.api_domain}/{read_yaml.api_base_path}/jwt/jwks.json"
    print(jwks_uri)

    async with httpx.AsyncClient() as client:
        response = await client.get(jwks_uri)
        jwks_client = response.json()
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
    return rsa_key


async def get_jwt_payload(jwt_token):
    try:
        header = jwt.get_unverified_header(jwt_token)
    except Exception as e:
        raise Exception(str(e))
    
    rsa_key =await get_key(header)
        
    try:
        payload = jwt.decode(jwt_token, rsa_key, algorithms=['RS256'])
        print("payload",payload)
        return payload
    except Exception as e:
        raise Exception(str(e))
