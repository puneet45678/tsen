from jinja2 import Environment, FileSystemLoader
import os
import httpx
from typing import Optional
from fastapi import HTTPException
from logger.logging import get_db_action_Logger
logger = get_db_action_Logger(__name__)
from jose import jwt
from config import read_yaml
from supertokens_python.recipe.jwt import asyncio
from supertokens_python.recipe.jwt.interfaces import CreateJwtOkResult
from jose import jwt, jwk
import time
import uuid

def get_new_backer_email_template():
    templates_dir = os.path.join(os.getcwd(), 'templates')
    env = Environment(loader=FileSystemLoader(templates_dir))
    template = env.get_template('backer.html')
    body = template.render()
    return body

def get_abondoned_cart_email_template(user_name:str,last_updated_date:str,item_details:dict):
    templates_dir = os.path.join(os.getcwd(), 'templates')
    env = Environment(loader=FileSystemLoader(templates_dir))
    kwargs={"username":user_name,"last_updated_date":last_updated_date,"item":item_details}
    template = env.get_template('abondoned_cart_template.html')
    body = template.render(**kwargs)
    return body

def get_email_verification_email_template(verificationLink:str,verificationText:str,user_name:str):
    templates_dir = os.path.join(os.getcwd(), 'templates')
    env = Environment(loader=FileSystemLoader(templates_dir))
    kwargs={"verificationLink":verificationLink,"verificationText":verificationText,"user_name":user_name}
    template = env.get_template('email_verification.html')
    body = template.render(**kwargs)
    return body

def get_email_change_verification_email_template(new_email_verification_api_link:str,user_name:str):
    templates_dir = os.path.join(os.getcwd(), 'templates')
    env = Environment(loader=FileSystemLoader(templates_dir))
    kwargs={"new_email_verification_api_link":new_email_verification_api_link,"user_name":user_name}
    template = env.get_template('email_change_verification.html')
    body = template.render(**kwargs)
    return body

def get_unkown_device_login_email_template(email_info:dict,user_name:str,add_to_known_device_api_link:str):
    templates_dir = os.path.join(os.getcwd(), 'templates')
    operating_system = email_info["OperatingSystem"]   
    browser=email_info["Browser"]
    ip=email_info["IPAddress"]
    location=email_info["Location"]
    email = email_info["email"]
    env = Environment(loader=FileSystemLoader(templates_dir))
    kwargs={"user_name":user_name,"os":operating_system,"browser":browser,"ip":ip,"location":location,"add_to_known_device_api_link":add_to_known_device_api_link,"email":email}
    template = env.get_template('new_device_info.html')
    body = template.render(**kwargs)
    return body

def get_marketplace_purchase_owner_template(model_owner:str, buyer_name:str, model_name:str,user_email:str,buyer_number):
    templates_dir = os.path.join(os.getcwd(), 'templates')    
    env = Environment(loader=FileSystemLoader(templates_dir))
    kwargs = {"model_owner":model_owner,"buyer_name":buyer_name,"model_name":model_name,"user_email":user_email,"buyer_number":buyer_number}
    template = env.get_template('marketplace_purchase_owner.html')
    body = template.render(**kwargs)
    return body

def get_new_premarket_signees_template(model_owner_name:str, premarket_signee_numbers:str,user_email:str):
    templates_dir = os.path.join(os.getcwd(), 'templates')    
    env = Environment(loader=FileSystemLoader(templates_dir))   
    kwargs = {"model_owner_name":model_owner_name,"premarket_signee_numbers":premarket_signee_numbers,"user_email":user_email}
    template = env.get_template('new_premarket_signee.html')
    body = template.render(**kwargs)
    return body

def get_new_milestone_achieved_campaign_owner_template(campaign_owner_name,milestone_name,milestone_achieved_date,user_email,milestone_rewards):
    templates_dir = os.path.join(os.getcwd(), 'templates')    
    env = Environment(loader=FileSystemLoader(templates_dir)) 
    kwargs = {"campaign_owner_name":campaign_owner_name,"milestone_name":milestone_name,"milestone_achieved_date":milestone_achieved_date,"user_email":user_email,"milestone_rewards":milestone_rewards}
    template = env.get_template('milestone_achieved_campaign_owner.html')
    body = template.render(**kwargs)
    return body  

def get_new_milestone_unlocked_backers_template(campaign_name,campaign_owner_name:str,milestone_achieved_date,user_email,milestone_rewards):
    templates_dir = os.path.join(os.getcwd(), 'templates')    
    env = Environment(loader=FileSystemLoader(templates_dir))   
    kwargs = {"campaign_name":campaign_name,"campaign_owner_name":campaign_owner_name,"milestone_achieved_date":milestone_achieved_date,"user_email":user_email,"milestone_rewards":milestone_rewards}
    template = env.get_template('new_premarket_signee.html')
    body = template.render(**kwargs)
    return body

def get_email_template_model_rejected(user_name,user_email,model_name,admin_rejection_comments):
    templates_dir = os.path.join(os.getcwd(), 'templates')    
    env = Environment(loader=FileSystemLoader(templates_dir))    
    kwargs = {"user_name":user_name,"user_email":user_email,"model_name":model_name,"admin_rejection_comments":admin_rejection_comments}
    template = env.get_template('new_premarket_signee.html')
    body = template.render(**kwargs)
    return body

def get_email_template_campaign_approved(user_name,user_email,campaign_name):
    templates_dir = os.path.join(os.getcwd(), 'templates')    
    env = Environment(loader=FileSystemLoader(templates_dir)) 
    kwargs = {"user_name":user_name,"user_email":user_email,"campaign_name":campaign_name}
    template = env.get_template('campaign_approved_template.html')
    body = template.render(**kwargs)
    return body

def get_email_template_campaign_rejected(user_name,user_email,campaign_name,campaign_rejection_comments):
    templates_dir = os.path.join(os.getcwd(), 'templates')    
    env = Environment(loader=FileSystemLoader(templates_dir))
    kwargs = {"user_name":user_name,"user_email":user_email,"campaign_name":campaign_name,"campaign_rejection_comments":campaign_rejection_comments}
    template = env.get_template('campaign_rejected_template.html')
    body = template.render(**kwargs)
    return body       

def get_email_template_buyer_purchase_completed(buyer_user_name,buyer_user_email,product_bought_name,order_details):
    templates_dir = os.path.join(os.getcwd(), 'templates')    
    env = Environment(loader=FileSystemLoader(templates_dir))  
    kwargs={"buyer_user_name":buyer_user_name,"buyer_user_email":buyer_user_email,"product_bought_name":product_bought_name,"order_details":order_details}
    template = env.get_template('buyer_purchase_completed_template.html')
    body = template.render(**kwargs)
    return body         

def get_new_signup_email_template(user_name,user_email):
    templates_dir = os.path.join(os.getcwd(), 'templates')    
    env = Environment(loader=FileSystemLoader(templates_dir))
    kwargs = {"user_name":user_name,"user_email":user_email}       
    template = env.get_template('new_user_signup_template.html')
    body = template.render(**kwargs)
    return body

async def create_jwt_and_auth_headers(userid = None, session= None, session_payload = None):
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
    try:
        jwks_uri = f"{read_yaml.AUTH_DOMAIN}/auth/jwt/jwks.json"
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

def get_unique_ikarus_guest_id():
    # Create a UUID4
    uuid4 = uuid.uuid4().int

    # Get the current timestamp
    timestamp = int(time.time())

    # Combine the two values to create a 64-bit integer
    # In this case, I am taking the 32 most significant bits from the UUID and 32 bits from the timestamp
    unique_id = (uuid4 & 0xFFFFFFFF00000000) | (timestamp & 0xFFFFFFFF)

    return "G-"+str(unique_id)