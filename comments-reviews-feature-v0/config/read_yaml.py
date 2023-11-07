from confz import ConfZ, ConfZEnvSource, ConfZFileSource
import os 
env = os.getenv("MY_APP_ENV") 
class MyAppConfig(ConfZ):
            
    if not env:
        env="local"
    
    # Load application.yaml file
    CONFIG_SOURCES = [
        ConfZFileSource(f"config/{env}/application.yaml"),
    ]
    # Load secrets.yaml file only for non-production environments
    if env not in ["production"]:
        CONFIG_SOURCES.append(ConfZFileSource(f"config/local/secrets.yaml"))

    # Load environment variables for all environments (can overwrite values from files)
    else:
        CONFIG_SOURCES.append(ConfZEnvSource(allow_all=True ,  file=".env.local" , nested_separator="__"))
    
    
    logging: dict ={}
    aws: dict ={}
    encryption: dict ={}
    auth: dict ={}
    uploadcare: dict ={}
    version: dict ={}
    cors: dict ={}
    size: dict ={}
    mongodb: dict ={}
    supertokens: dict ={}
    name: dict ={}
    excluded_apis:list=[]
    HOST: str = ""
    ports: dict ={}
    sumologic: dict ={}
    cache : dict ={}
    

config = MyAppConfig()

if env == "local":
    AUTH_DOMAIN = f"http://{config.HOST}:{config.ports['auth_port']}"
    WEBSITE_DOMAIN = f"http://{config.HOST}:{config.ports['website_port']}"
    CAMPAIGN_DOMAIN = f"http://{config.HOST}:{config.ports['campaign_port']}"
    USER_DOMAIN = f"http://{config.HOST}:{config.ports['user_port']}"
    NOTIFCATION_DOMAIN = f"http://{config.HOST}:{config.ports['notification_port']}"
    jwks_endpoint = f"http://{config.HOST}:{config.ports['auth_port']}/auth/jwt/jwks.json"

else:
    AUTH_DOMAIN= f"https://auth.{config.HOST}"
    WEBSITE_DOMAIN = f"https://app.{config.HOST}"
    CAMPAIGN_DOMAIN = f"https://campaign.{config.HOST}"
    USER_DOMAIN = f"https://user.{config.HOST}"
    jwks_endpoint = f"https://auth.{config.HOST}/auth/jwt/jwks.json"

jwks_cached_key = config.cache["jwks_cached_key"]

print("jwks_endpoint",jwks_endpoint)
print("hello",config.HOST)


