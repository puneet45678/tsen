from confz import ConfZ, ConfZFileSource
import os 

env = os.getenv("APPLICATION_ENV") 
print("env",env)
cwd = os.getcwd()   
class MyAppConfig(ConfZ):    
    if not env:
        env="local"
    
    # Load application.yaml file
    CONFIG_SOURCES = [
        ConfZFileSource(os.path.join(cwd,"config",f"{env}_application.yaml")),ConfZFileSource(os.path.join(cwd,"config",f"default_application.yaml"))
    ]
    # Load secrets.yaml file only for non-production environments
    if env not in ["production"]:
        CONFIG_SOURCES.append(ConfZFileSource(os.path.join(cwd,"config",f"secrets.yaml")))
   
    mongodb: dict ={}
    port:dict ={}
    app:dict ={}
    supertokens: dict = {}
    sendinblue: dict = {}
    host:str =""
    host_core:str =""
    EXCLUDED_APIS: list = []
        

config = MyAppConfig()


if env  in ["production"]:
    mongo_user_name=os.environ.get("mongo_user_name")
    mongo_pass_word=os.environ.get("mongo_pass_word")
    mongmongodb_uri=os.environ.get("mongmongodb_uri")
    supertokens_core_api_key = os.environ.get("supertokens_core_api_key")
    sendin_blue_api_key = os.environ.get("sendin_blue_api_key")
    sendin_blue_sender = os.environ.get("sendin_blue_sender")


else:
    mongo_user_name = config.mongodb["mongo_user_name"]
    mongo_pass_word = config.mongodb["mongo_pass_word"]
    mongmongodb_uri = config.mongodb["mongodb_uri"]
    supertokens_core_api_key = config.supertokens["supertokens_core_api_key"]
    sendin_blue_api_key = config.sendinblue["sendin_blue_api_key"]
    sendin_blue_sender = config.sendinblue["sendin_blue_sender"]

app_name = config.app["app_name"]
EXCLUDED_APIS = config.app["EXCLUDED_APIS"]
host = config.host
host_core = config.host_core
supertokens_core_uri = f"http://{host_core}:{config.port['supertokens_core_port']}/"
api_base_path = config.port["api_base_path"]

if env == "local":
    api_domain= f"http://{host}:{config.port['api_port']}"
    website_domain = f"http://{host}:{config.port['website_port']}"
    inter_api_calls_base_url = f"http://{host}:{config.port['user_service_port']}"
    campaign_service_url = f"http://{host}:{config.port['campaign_service_port']}"


if env == "development":
    api_domain= f"https://auth.{host}"
    website_domain = f"https://app.{host}"
    inter_api_calls_base_url = f"https://user.{host}"
    campaign_service_url = f"https://campaign.{host}"

print("api_domain",api_domain)
print("website_domain",website_domain)