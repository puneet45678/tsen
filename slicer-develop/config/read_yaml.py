from confz import ConfZ, ConfZFileSource
import os 

env = os.getenv("APPLICATION_ENV") 
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
    supertokens:dict={}
    port:dict ={}
    cloud_config:dict={}
    aws:dict={}
    app:dict ={}
    host:str =""
    host_core:str =""
    host_slicer:str=""
    cookie_domain:str=""
    gcp_slicer_image: str = ""
    EXCLUDED_APIS: list = []



config = MyAppConfig()


if env  in ["production"]:
    mongo_user_name=os.environ.get("mongo_user_name")
    mongo_pass_word=os.environ.get("mongo_pass_word")
    mongmongodb_uri=os.environ.get("mongmongodb_uri")
    supertokens_core_api_key = os.environ.get("supertokens_core_api_key")
    aws_access_key_id=os.environ.get("aws_access_key_id")
    aws_secret_access_key=os.environ.get("aws_secret_access_key")
    ec2_instance_id=os.environ.get("ec2_instance_id")


else:
    mongo_user_name = config.mongodb["mongo_user_name"]
    mongo_pass_word = config.mongodb["mongo_pass_word"]
    mongmongodb_uri = config.mongodb["mongodb_uri"]
    supertokens_core_api_key = config.supertokens["supertokens_core_api_key"]
    aws_access_key_id = config.aws["aws_access_key_id"]
    aws_secret_access_key = config.aws["aws_secret_access_key"]
    ec2_instance_id = config.aws["ec2_instance_id"]


app_name = config.app["app_name"]
EXCLUDED_APIS = config.app["EXCLUDED_APIS"]
host = config.host
host_core = config.host_core
cookie_domain = config.cookie_domain
host_slicer = config.host_slicer
gcp_slicer_image = config.gcp_slicer_image

if env=="local":
    api_domain= f"http://{host}:{config.port['api_port']}"
    website_domain = f"http://{host}:{config.port['website_port']}"
    campagin_service_base_url =  f"http://{host}:{config.port['camp_service_port']}"
    slicer_service_base_url = f"http://{host}:{config.port['slicer_service_port']}"
   
else:
    api_domain= f"https://auth.{host}"
    website_domain = f"https://app.{host}"
    campagin_service_base_url =  f"https://campaign.{host}"
    slicer_service_base_url = f"https://prusa.{host}"
  



supertokens_core_uri = f"http://{host_core}:{config.port['supertokens_core_port']}/"
api_base_path = config.port["api_base_path"]
cluster_name = config.cloud_config["cluster_name"]
default_slicer_cpu = config.cloud_config["default_slicer_cpu"]
default_slicer_memory = config.cloud_config["default_slicer_memory"]
time_quantum= config.cloud_config["time_quantum"]
idle_time_check= config.cloud_config["idle_time_check"]
default_region = config.cloud_config["default_region"]
file_system_id = config.cloud_config["file_system_id"]
efs_instance_id = config.cloud_config["efs_instance_id"]

s3_bucket = config.cloud_config["s3_bucket"]
config_bucket = config.cloud_config["config_bucket"]
data_mnt_dir_inside_slicer = config.cloud_config["data_mnt_dir_inside_slicer"]
config_mnt_dir_inside_slicer = config.cloud_config["config_mnt_dir_inside_slicer"]
config_sync_dir = config.cloud_config["config_sync_dir"]

gcp_project_id = config.cloud_config["gcp_project_id"]
gcp_zone=   config.cloud_config["gcp_zone"]
gcp_initial_cpu = config.cloud_config["gcp_initial_cpu"]
gcp_initial_memory = gcp_initial_memory = config.cloud_config["gcp_initial_memory"]
gcp_max_cpu = config.cloud_config["gcp_max_cpu"]
gcp_max_memory = config.cloud_config["gcp_max_memory"]
gcp_default_concurrency = int(config.cloud_config["gcp_default_concurrency"])
gcp_default_timeout = int(config.cloud_config["gcp_default_timeout"])
gcp_default_container_port = int(config.cloud_config["gcp_default_container_port"])



