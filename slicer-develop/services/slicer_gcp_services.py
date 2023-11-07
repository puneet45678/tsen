from config import read_yaml
import os
import json
from google.auth import default
from google.auth.transport.requests import Request
from google.auth.transport.requests import AuthorizedSession
import nltk
nltk.download('wordnet')
from typing import Optional, Union
from nltk.corpus import wordnet as wn
import random
import boto3
import os
from botocore.exceptions import NoCredentialsError
from pymongo import MongoClient
from db import gcp_slicer_db_actions
from typing import List, Optional, Dict,Any
import time

from services import inter_service_calls_services
from logger.logging import get_logger
logger = get_logger(__name__)
from urllib.parse import urlparse


session = boto3.Session(
    aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID",read_yaml.aws_access_key_id),
    aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY",read_yaml.aws_secret_access_key),
    region_name=read_yaml.default_region
)

s3_client = session.client('s3')




client = MongoClient(read_yaml.mongmongodb_uri)
db = client[read_yaml.mongo_user_name]
slicer_sessions = db.slicer_sessions


credentials, project = default()
auth_request = Request()
credentials.refresh(auth_request)
session = AuthorizedSession(credentials)
region = "us-central1"

class GCP_API_response:
    def __init__(self):
        self.status_code = None
        self.response = None
        self.responseError = None



def get_environment_variables_object(userid:str,
                                     sessionid:str,
                                     campId:str,
                                     tierId:str,
                                     uuid_str:str,
                                     assets:str,
                                     camp_name:Union[str,None],
                                     tier_name:Union[str,None],
                                     model_name:str,
                                     model_id:str,
                                     slicer_type:str,
                                     idle_time:str,
                                     time_quantumm:str)->List[Dict]:

    '''
    This function, get_environment_variables_object, generates a list of environment variable objects for AWS ECS tasks, with each object containing a "name" and "value" key. The variables include identifiers for a campaign, tier, user, and session, an authentication access token, a unique ID for the container, time quantum and idle time check values from a YAML file, and AWS access key ID and secret access key also from the YAML file.
   
    These env variables is passed from python script to our docker container and the the go file is running in the 2nd stage build so we can directly access the env variables
    '''

    environment_variables = [
        {"name": "CAMPAIGN_ID", "value": campId},
        {"name": "TIER_ID", "value": tierId},
        {"name": "USER_ID", "value": userid},
        {"name": "SESSION_ID", "value": sessionid},
        {"name": "IKARUS_NEST_CONTAINER_ID", "value": uuid_str},
        {"name": "TIME_QUANTUM", "value": time_quantumm},
        {"name": "IDLE_TIME_CHECK", "value":idle_time},
        {"name": "AWS_ACCESS_KEY_ID", "value": read_yaml.aws_access_key_id},
        {"name": "AWS_SECRET_ACCESS_KEY", "value": read_yaml.aws_secret_access_key},
        {"name": "S3_BUCKET", "value": read_yaml.s3_bucket},
        {"name": "ASSETS", "value": assets},
        {"name": "CAMPAIGN_NAME", "value": camp_name},
        {"name": "TIER_NAME", "value": tier_name},
        {"name": "MODEL_NAME", "value": model_name},
        {"name": "MODEL_ID", "value": model_id},
        {"name": "SLICER_TYPE", "value": slicer_type},
        {"name": "STOP_CONTAINER_ENDPOINT", "value": f"{read_yaml.slicer_service_base_url}/gcp/delete-container"},

    ]
    return environment_variables

def get_service_request_body(service_name:str,
                             project_id:str,
                             container_name:str,
                             image_name:str,
                             environment_variables:list,
                             req_cpu:str=read_yaml.gcp_initial_cpu ,
                             req_mem:str=read_yaml.gcp_initial_memory, 
                             max_cpu:str=read_yaml.gcp_max_cpu, 
                             max_mem:str=read_yaml.gcp_max_memory, 
                             concurrency:int=read_yaml.gcp_default_concurrency, 
                             timeout:int= read_yaml.gcp_default_timeout, 
                             container_port=read_yaml.gcp_default_container_port) : 
    return {
    "apiVersion":"serving.knative.dev/v1",
    "kind": "Service",
    "metadata": {
        "name": service_name,
        "namespace": project_id,
        "annotations": {
        "run.googleapis.com/launch-stage": "BETA",
        "run.googleapis.com/ingress": "all"
    }
    },
    "spec": {
        "template": {
            "spec": {
                "containerConcurrency": concurrency,  #This is also default value if not speciifed
                "timeoutSeconds": timeout,
                "containers": [
                    {   "name" : container_name,
                        "image": image_name,
                        # "command":[string],
                        # "args":[string],
                        "env": environment_variables,

                        "resources": {
                            # Limits describes the maximum amount of compute resources allowed. Only 'cpu' and 'memory' keys are supported

                            "limits": {
                                "cpu": max_cpu,
                                "memory": max_mem
                            },
                                   # Requests describes the minimum amount of compute resources required. Only cpu and memory are supported. If Requests is omitted for a container, it defaults to Limits if that is explicitly specified, otherwise to an implementation-defined value.
                            "requests": {
                                "cpu": req_cpu,
                                "memory": req_mem
                            }
                        },
                        "ports":[
                            {"name":"http1",
                            "containerPort":container_port, #default 8080 if not provided 
                            "protocol":"TCP"
                            }
                        ],
                    }
                ]
            }
        }
    }
    }



def attach_authenticate_all_Iam_policy(project_id, service_name, region):   
    command = "gcloud run services add-iam-policy-binding " + service_name + \
              " --member=allUsers --role=roles/run.invoker --region=" + region + \
              " --project=" + project_id
    logger.debug("Running command to enble public access to service")
    try:
        os.system(command)
    except Exception as e:
        raise Exception("something went wrong while attaching IAM policy to the service")



    
def refresh_credentials():
    try:
        credentials, _ = default()
        auth_request = Request()
        credentials.refresh(auth_request)
        session = AuthorizedSession(credentials)
    except Exception as e:
        logger.error(f"something went wrong while handling credentials {e}")
        raise Exception("something went wrong while handling credentials of gcp")
    else:
        return session
    

def api_call(session, method, url, data=None):
    # logger.debug(f"Making an api call to cloud run {url}")
    try:
        response = getattr(session, method)(url, data=data)
        # response = session.post(url, data=data)
    except Exception as e:
        logger.error(f"something went wrong while making an api call to cloud run {e}")
        raise
    else:
        return response
    

def get_service(project_id, location, service_id, session):
    url = f"https://run.googleapis.com/v1/projects/{project_id}/locations/{location}/services/{service_id}"
    
    response = api_call(session, 'get', url)
    
    if response.status_code == 200:
        service = response.json()
        return service['status']['url'] if service['status'] and "url" in service['status'] else None
    else:
        logger.error(f"Error while getting the response from {url} : {response.status_code}, {response.text}")
        return None


def run_service(environment_variables : List[Dict], 
                name_prefix :str, 
                image:str,
                gcp_initial_cpu: str,
                gcp_max_cpu: str,
                gcp_initial_memory: str,
                gcp_max_memory: str, 
                location:str = read_yaml.gcp_zone, 
                project_id:str = read_yaml.gcp_project_id, 
                check_time:int = 2, 
                max_time:int = 300, 
                port:int = read_yaml.gcp_default_container_port,
                )->Dict[str,Any]:
    

    session = refresh_credentials()

    service_name = f"s-{name_prefix}"
    container_name = f"c-{name_prefix}" 
    image_name = f"gcr.io/{project_id}/{image}"
    # image_name = "gcr.io/ikarus-nest-387110/slicer-test-2"

    logger.debug(f"image name {image_name}")

    url = f"https://run.googleapis.com/v1/projects/{project_id}/locations/{location}/services"
    
    service = get_service_request_body(service_name, project_id, container_name, image_name, environment_variables, container_port=port, req_cpu=gcp_initial_cpu, req_mem=gcp_initial_memory, max_cpu=gcp_max_cpu, max_mem=gcp_max_memory)

    print(service)
    run_api_response = GCP_API_response()
    
    try:
        response = api_call(session, 'post', url, data=json.dumps(service))
        logger.debug(f"response from cloud run {response}")
    
    except Exception as e:
        logger.error(f"Error during API call: {e}")
        run_api_response.responseError = str(e)
        run_api_response.status_code = 500  
        return {"url": "", "response": run_api_response}


    run_api_response.status_code = response.status_code
    run_api_response.response = response

    if response.status_code == 200:
        result = response.json()
        logger.info("Service created successfully")
        
        if not result['status']:
            logger.info("Service created successfully but url is not generated yet, getting the url")
            
            curr_time = check_time

            while curr_time<=max_time:
                try:
                    cloud_run_service_url = get_service(project_id, location, service_name, session)
                
                except Exception as e:
                    logger.error(f"something went wrong while getting service url {e}")
                    run_api_response.responseError = str(e)
                    return {"url":"","response": run_api_response}
                
                if not cloud_run_service_url:
                    curr_time+=check_time
                
                else:
                    try:
                        attach_authenticate_all_Iam_policy(project_id,service_name,location) 
                    except Exception as e:
                        logger.error(f"something went wrong while attaching IAM policy {e}")
                        run_api_response.responseError = str(e)
                        return {"url":"","response": run_api_response}
                    
                    return {"url":cloud_run_service_url, "response": run_api_response}
            
            run_api_response.status_code = 408
            run_api_response.responseError = "Request Timeout from gcp, Can't create the service"
            return {"url":"","response": run_api_response}
    else:
        run_api_response.responseError = response.text
        return {"url":"","response": run_api_response}
    


def delete_service(userid,sessionid, name_prefix, location = region,project_id=project):
    service_name = f"s-{name_prefix}"
    # Define the endpoint URL.
    url = url = f"https://{location}-run.googleapis.com/apis/serving.knative.dev/v1/namespaces/{project_id}/services/{service_name}"

    try:
        response = api_call(session, 'delete', url)
        logger.debug(f"response from cloud run {response}")
    
    except Exception as e:
        logger.error(f"Error during API call: {e}")
        raise Exception("something went wrong while deleting the service")
    return response

def get_random_port():

    '''
    This function generates a random port number between 40000 and 65000. It then checks if the port already exists in the MongoDB database. If it does, it generates a new port number. This process continues until a unique port number is found.
    
    '''
    port = random.randint(40000, 65000)
    try:
        while gcp_slicer_db_actions.is_port_exists(port):
            port = random.randint(40000, 65000)
    
    except Exception as e:
        raise Exception("something went wrong while checking port in database")
    
    logger.debug(f" port {port} is unique, So using this port for the container")
    return port



def get_adjectives_and_nouns():

    '''
     This function retrieves all the adjectives and nouns from the WordNet lexical database.
    
    '''

    adjectives = set()
    nouns = set()
    for synset in wn.all_synsets():
        if synset.pos() == 'a':  # Adjectives
            for lemma in synset.lemmas():
                adjectives.add(lemma.name())
        elif synset.pos() == 'n':  # Nouns
            for lemma in synset.lemmas():
                nouns.add(lemma.name())
    return list(adjectives), list(nouns)



def generate_random_subdomain():

    '''
    his function generates a random subdomain by picking a random adjective and a random noun from the list obtained from get_adjectives_and_nouns() function.

    '''
    try:
        ADJECTIVES,NOUNS = get_adjectives_and_nouns()
    except Exception as e:
        raise Exception("something went wrong while getting adjectives and nouns from wordnet")
    
    while True:
        adjective = random.choice(ADJECTIVES).replace("_","-").lower()
        noun = random.choice(NOUNS).replace("_","-").lower()
        if len(adjective)<10 and len(noun)<10: break
    return f"{adjective}-{noun}"



def get_random_domain():

    '''
     Similar to get_random_port_mongodb(), this function generates a random domain and checks if it already exists in the MongoDB database. If it does, it generates a new domain. This process continues until a unique domain is found.
    
    '''
    try:
        domain = generate_random_subdomain()
    except Exception as e:
        raise Exception("something went wrong while generating random domain")
    
    try:
        while gcp_slicer_db_actions.is_domain_exists(domain):
            try:
                domain = generate_random_subdomain()
            except Exception as e:
                raise Exception("something went wrong while generating random domain")
            
    except Exception as e:
        raise Exception("something went wrong while checking domain in database")

    logger.debug(f" subdomain {domain} is unique, So using this subdomain for the container")
    return domain


def set_slicer_session_data(userid:str ,sessionid:str ,port:str ,sub_domain:str ,campId:str ,tierId:str, cloud_run_url:str, uuid_str:str):

    '''
    This function sets the session data for a slicer. If the user does not exist, it inserts a new document for the user. If the user exists, it updates the sessions for the user.
    '''

    try:
        id,random_url = gcp_slicer_db_actions.set_slicer_session_data(userid,sessionid,port,sub_domain,campId,tierId,cloud_run_url,uuid_str)
    except Exception as e:
        logger.error(f"something went wrong while setting slicer session data in database {e}")
        raise Exception("something went wrong while setting slicer session data in database")
    return id,random_url


def set_cloud_run_url_in_database(user_id,sessionid,url):
    filter_ = {"userId": user_id, "sessions.sessionHandle": sessionid}
    update = {"$set": {"sessions.$.cloudRunUrl": url,}}
    result = slicer_sessions.update_one(filter_, update).modified_count


def get_url_and_userid_using_subdomain_from_db(subdomain):

    '''
    get_url_and_userid_using_subdomain_from_db: This function retrieves the url and user ID related to a specific subdomain from the database. If no match is found, it returns None for all three values.

    '''
    query = {"sessions.subDomain": subdomain}
    result = slicer_sessions.find_one(query)
    if result is not None:
        for session in result['sessions']:
            if session['subDomain'] == subdomain:
                return session['cloudRunUrl'],result['userId']
    else:
        return None, None
    

def get_cloud_run_url_from_user_and_session(user_id,session_id):
    query = {"userId": user_id}
    result = slicer_sessions.find_one(query)
    if result is not None:
        for session in result['sessions']:
            if session['sessionHandle'] == session_id:
                return session['cloudRunUrl']
    else:
        return None
    
def get_random_url_from_user_and_session(user_id,session_id):
    query = {"userId": user_id}
    result = slicer_sessions.find_one(query)
    if result is not None:
        for session in result['sessions']:
            if session['sessionHandle'] == session_id:
                return session['subDomain']
    else:
        return None


def create_data_dirs(Bucket:str, userid:str, campaignid:str, tierid:str):
    logger.info("Creating the data directories inside s3")
    
    base_key = f"{userid}_data/campaign_{campaignid}/tier_{tierid}/stls/"

    try:
        s3_client.put_object(Bucket=Bucket, Key=base_key)
    except Exception as e:
        logger.error(f"Error: {e}")
        raise Exception("Something went wrong while creating data directories in s3")
    
    logger.info("Data Directories (stls) created successfully")

    base_key = f"{userid}_data/campaign_{campaignid}/tier_{tierid}/gcodes/"

    try:
        s3_client.put_object(Bucket=Bucket, Key=base_key)
    except Exception as e:
        logger.error(f"Error: {e}")
        raise Exception("Something went wrong while creating data directories in s3")
    
    logger.info("Data Directories (gcodes) created successfully")



def transfer_stls_to_s3(Bucket:str, userid:str, campaignid:str, tierid:str, urllist:List[str]):
    logger.info("Transferring the stls to s3")
    base_key = f"{userid}_data/campaign_{campaignid}/tier_{tierid}/stls/"
    for url in urllist:
        parsed_url = urlparse(url)
        source_bucket = parsed_url.netloc.split('.')[0]
        source_key = parsed_url.path.lstrip('/')
        destination_key = base_key + source_key.split('/')[-1]

        try:
            s3_client.copy_object(Bucket=Bucket, CopySource={'Bucket': source_bucket, 'Key': source_key}, Key=destination_key)
            logger.debug(f'File copied from {source_bucket}/{source_key} to {Bucket}/{destination_key}')
        
        except Exception as e:
            logger.error(f"Error copying file from {url}: {e}")
            raise Exception(f"Error copying file from {url}: {e}")

    logger.info("STL files transferred successfully")



def create_config_dirs_in_s3(Bucket, userid):
    print("Creating the config directories inside s3")

    key = f"{userid}_configs/"

    try:
        s3_client.put_object(Bucket=Bucket, Key=key)
    
    except NoCredentialsError:
        logger.error("No AWS credentials found")
        raise Exception("No AWS credentials found")
    
    except Exception as e:
        logger.error("Error: ", e)
        raise Exception("something went wrong while creating config directories in s3")
    
    logger.info("Config Directories created successfully")

def get_existing_url(userid,sessionid):
    try:
        existing_url = gcp_slicer_db_actions.get_existing_url(userid,sessionid)
    except Exception as e:
        logger.error(f"something went wrong while getting existing url from database {e}")
        raise Exception("something went wrong while getting existing url from database")
    return existing_url

def check_if_session_present(userid,sessionid):
    try:
        return gcp_slicer_db_actions.check_if_session_present(userid,sessionid)
    except Exception as e:
        logger.error(f"something went wrong while checking the session {e}")
        raise Exception("something went wrong while checking the session")

def delete_session_from_db(userid,sessionid):
    try:
        gcp_slicer_db_actions.delete_session_from_db(userid,sessionid)
    except Exception as e:
        logger.error(f"something went wrong while deleting the session {e}")
        raise Exception("something went wrong while deleting the session")


async def get_stls_from_model_service(request_id:str,
                                      userid:str,
                                      session_payload:str,
                                      modelId:str,
                                      campId: Union[str,None],
                                      tierId: Union[str,None]) -> List[str]:
    
    '''
    This function retrieves a list of STL files from the model service based on the model ID.
    '''
    params = {"campId":campId,"tierId":tierId}

    url = f"{read_yaml.campagin_service_base_url}/api/v1/model/{modelId}/model-files"
    try:
        response = await inter_service_calls_services.m2m_request("GET","campaign",url,request_id,params=params,user_id=userid,session=session_payload)
    except Exception as e:
        logger.error(f"something went wrong while getting stls from model service {e}")
        raise Exception(f"something went wrong while getting stls from model service {e}")
    
    camp_name = response["campaignName"]
    tier_name = response["tierName"]
    model_name = response["modelName"]
    urllist = response["modelStls"]


    return camp_name,tier_name,model_name,urllist
    
    

def get_running_services(userid):
    try:
        sessions =  gcp_slicer_db_actions.get_running_services(userid)
    except Exception as e:
        logger.error(f"something went wrong while getting running services {e}")
        raise Exception("something went wrong while getting running services")
    if sessions:
        return sessions
    else:
        raise Exception("No running services found")
    
def get_all_sessions():
    try:
        sessions =  gcp_slicer_db_actions.get_all_sessions()
    except Exception as e:
        logger.error(f"something went wrong while getting all sessions {e}")
        raise Exception("something went wrong while getting all sessions")
    if sessions:
        return sessions
    else:
        raise Exception("No sessions found")