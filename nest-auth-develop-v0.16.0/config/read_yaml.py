from confz import ConfZ, ConfZFileSource
import os
import yaml
from logger.logging import get_logger
logger = get_logger(__name__)

from types import SimpleNamespace


def dict_to_obj(dictionary):
    for key, value in dictionary.items():
        if isinstance(value, dict):
            dictionary[key] = dict_to_obj(value)
    return SimpleNamespace(**dictionary)


def load_responses():
    with open("config/responses.yaml", 'r') as file:
        data = yaml.safe_load(file)
        return data["responses"]

responses_data = load_responses()
# responses = Dict2Obj(responses_data)
responses = dict_to_obj(responses_data) 
      

env = os.getenv("AUTH_APPLICATION_ENV")
cwd = os.getcwd()   
logger.debug(f"Environemnt {env}")
class MyAppConfig(ConfZ):    
    if not env:
        env="local"
    
    # Load application.yaml file
    CONFIG_SOURCES = [ConfZFileSource(os.path.join(cwd,"config",f"{env}_application.yaml")),ConfZFileSource(os.path.join(cwd,"config",f"default_application.yaml")),ConfZFileSource(os.path.join(cwd,"config",f"roles_permissions.yaml")),]
    # Load secrets.yaml file only for non-production environments
    if env not in ["production"]:
        CONFIG_SOURCES.append(ConfZFileSource(os.path.join(cwd,"config",f"secrets.yaml")))
    
    
    mongodb: dict ={}
    mysql:dict={}
    mysql_db: dict = {}
    supertokens:dict={}
    google:dict ={}
    facebook:dict={}
    email:dict ={}
    port:dict ={}
    app:dict ={}
    sendinblue:dict = {}
    host:str =""
    host_core:str =""
    cookie_domain:str=""
    cookie_domain:str=""

    sumologic:dict ={}
    roles:list = []
    permissions:dict={}
    EXCLUDED_APIS: list = []
    change_email: dict = {}
    super_admin_email: str = ""
    cache: dict = {}
    token_expiry_in_hours: str = ""
    fingerprint_cookie: str = ""


config = MyAppConfig()

app_name = config.app["app_name"]
host = config.host
host_core = config.host_core
cookie_domain = config.cookie_domain
cookie_domain = config.cookie_domain
sumologic_uri = config.sumologic["url"]
roles = config.roles
permissions = config.permissions
EXCLUDED_APIS = config.app["EXCLUDED_APIS"]
EMAIL_VERIFICATION_EXCLUDED_APIS = config.app["EMAIL_VERIFICATION_EXCLUDED_APIS"]
super_admin_email = config.super_admin_email
jwks_cached_key = config.cache["jwks_cached_key"]

mysql_port = config.mysql_db["mysql_port"]
mysql_db = config.mysql_db['mysql_supertokens_db']
mysql_auth_custom_db = config.mysql_db['mysql_auth_custom_db']
fingerprint_cookie = config.fingerprint_cookie

print("super_admin_email",super_admin_email)


super_admin_permissions = config.permissions["SuperAdmin"]
models_admin_permissions = config.permissions["ModelsAdmin"]
campaigns_admin_permissions = config.permissions["CampaignsAdmin"]
users_admin_permissions = config.permissions["UserAdmin"]
contents_admin_permissions = config.permissions["ContentsAdmin"]
tech_admin_permissions = config.permissions["TechAdmin"]
guest_permissions = config.permissions["Guest"]
_3DP_permissions = config.permissions["3DP"]
_3DA_permissions = config.permissions["3DA"]

global_permission_set = super_admin_permissions + models_admin_permissions + campaigns_admin_permissions + users_admin_permissions + contents_admin_permissions +tech_admin_permissions+guest_permissions+_3DA_permissions+_3DP_permissions


if env == "local":
    api_domain= f"http://{host}:{config.port['api_port']}"
    website_domain = f"http://{host}:{config.port['website_port']}"
    inter_api_calls_base_url = f"http://{host}:{config.port['user_service_port']}"
    campaign_service_url = f"http://{host}:{config.port['campaign_service_port']}"
    notification_service_url = f"http://{host}:{config.port['notification_service_port']}"
    dashboard_delete_uri = f"http://{host}:{config.port['api_port']}/auth/dashboard/api/user"
    website_domain_admin = f"http://{host}:{config.port['admin_website_port']}"
    website_domain_parent = f"http://{host}:{config.port['website_port']}"
    jwks_endpoint = f"http://{host}:{config.port['api_port']}/auth/jwt/jwks.json"

# if env == "development":
else:
    api_domain= f"https://auth.{host}"
    website_domain = f"https://app.{host}"
    inter_api_calls_base_url = f"https://user.{host}"
    campaign_service_url = f"https://campaign.{host}"
    notification_service_url = f"https://notifications.{host}"
    dashboard_delete_uri = f"https://auth.{host}/auth/dashboard/api/user"
    website_domain_admin = f"https://admin.{host}"
    website_domain_parent = f"https://{host}"
    jwks_endpoint =  f"https://auth.{host}/auth/jwt/jwks.json"

allowed_origins = [website_domain,website_domain_admin,website_domain_parent]

logger.debug(f"api_domain{api_domain}")
logger.debug(f"website_domain,{website_domain}")
logger.debug(f"website_domain_admin {website_domain_admin}")
logger.debug(f"allowed_origins are {allowed_origins}")

supertokens_core_uri = f"http://{host_core}:{config.port['supertokens_core_port']}/"


api_base_path = config.port["api_base_path"]
email_scope = config.google["email_scope"]
profile_scope = config.google["profile_scope"]
google_api = config.google["google_api"]
facebook_api = config.facebook["facebook_api"]
email_verification_mode = config.email["email_verification_mode"]
verification_email_subject = config.email["verification_email_subject"]
reset_password_subject = config.email["reset_password_subject"]
reset_password_email_content = config.email["reset_password_email_content"]
verification_email_content = config.email["verification_email_content"]
verification_token_expiry = config.token_expiry_in_hours




if env  in ["production"]:
    google_client_id = os.environ.get('google_client_id')
    google_client_secret_key = os.environ.get('google_client_secret_key')

    facebook_client_id = os.environ.get('facebook_client_id')
    facebook_client_secret_key = os.environ.get('facebook_client_secret_key')

    supertokens_core_api_key = os.environ.get('supertokens_core_api_key')
    user_management_dashboard_api_key = os.environ.get('user_management_dashboard_api_key')

    mysql_username = os.environ.get('mysql_username')
    mysql_password = os.environ.get('mysql_password')
    mysql_host = os.environ.get('mysql_host')
  
    change_email_secret_key = os.environ.get('change_email_secret_key')

else:
    google_client_id = config.google['google_client_id']
    google_client_secret_key = config.google['google_client_secret_key']

    facebook_client_id = config.facebook['facebook_client_id']
    facebook_client_secret_key = config.facebook['facebook_client_secret_key']

    supertokens_core_api_key = config.supertokens['supertokens_core_api_key']
    user_management_dashboard_api_key = config.supertokens['user_management_dashboard_api_key']

    mysql_username = config.mysql['mysql_username']
    mysql_password = config.mysql['mysql_password']
    mysql_host = config.mysql['mysql_host']
    

    change_email_secret_key = config.change_email['change_email_secret_key']


