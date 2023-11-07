import boto3
import botocore.exceptions
import httpx
import paramiko
import os
import random
from tempfile import NamedTemporaryFile
import time
import re
from config import read_yaml
import requests
from urllib.parse import quote
from urllib.parse import unquote
import time
from fastapi import HTTPException
import nltk
nltk.download('wordnet')
from typing import Optional
from nltk.corpus import wordnet as wn


from pymongo import MongoClient
from bson import ObjectId
client = MongoClient('mongodb+srv://ikarus-dhruv:pass825131@cluster0.2nsop.mongodb.net/?retryWrites=true&w=majority')
db = client['ikarus-dhruv']
slicer_sessions = db.slicer_sessions


session = boto3.Session(
    aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID",read_yaml.aws_access_key_id),
    aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY",read_yaml.aws_secret_access_key),
    region_name=read_yaml.default_region
)
ecs_client = session.client('ecs')
ec2_client = session.client('ec2')
s3_client = session.client('s3')
s3 = session.resource('s3')
ssm_client = session.client("ssm")

bucket_name = 'slicer-bucket'


class APIResponse:
    def __int__(self):
        self.response = None
        self.responseError=None



def get_environment_variables_object(userid:str,sessionid:str,campId:str,tierId:str,uuid_str:str,access_token:str):

    '''
    This function, get_environment_variables_object, generates a list of environment variable objects for AWS ECS tasks, with each object containing a "name" and "value" key. The variables include identifiers for a campaign, tier, user, and session, an authentication access token, a unique ID for the container, time quantum and idle time check values from a YAML file, and AWS access key ID and secret access key also from the YAML file.
   
    These env variables is passed from python script to our docker container and the the go file is running in the 2nd stage build so we can directly access the env variables
    '''

    environment_variables = [
        {"name": "CAMPAIGNID", "value": campId},
        {"name": "TIERID", "value": tierId},
        {"name": "USERID", "value": userid},
        {"name": "SESSIONID", "value": sessionid},
        {"name": "AUTH_ACCESS_TOKEN", "value": access_token},
        {"name": "IKARUS_NEST_CONTAINER_ID", "value": uuid_str},
        {"name": "TIME_QUANTUM", "value": str(read_yaml.time_quantum)},
        # {"name": "IDLE_TIME_CHECK", "value": str(read_yaml.idle_time_check)},
        {"name": "IDLE_TIME_CHECK", "value": "170000"},
        {"name": "AWS_ACCESS_KEY_ID", "value": read_yaml.aws_access_key_id},
        {"name": "AWS_SECRET_ACCESS_KEY", "value": read_yaml.aws_secret_access_key}
    ]
    return environment_variables


def register_task_defination(campId,tierId,user_id="default",sessionid='default',containerDefinations=[],cpu=read_yaml.default_slicer_cpu,memory=read_yaml.default_slicer_memory, capabilities = ["EC2"],networkMode="bridge"):

    '''
    This function, register_task_defination, registers a new task definition with the AWS ECS service. It sets up the task with provided parameters including campaign ID, tier ID, user ID, session ID, container definitions, CPU, memory, network mode, and task volumes. It then calls the register_task_definition method of the ECS client to register the task definition, and prints the ARN of the registered task definition.
    '''

    print("cpu and memory ",cpu,memory)
    task_definition = {
                "executionRoleArn": "arn:aws:iam::530762056989:role/ecsTaskExecutionRole",
                "containerDefinitions": containerDefinations,
                "memory": memory,
                "taskRoleArn": "arn:aws:iam::530762056989:role/ecsTaskExecutionRole",
                "family": f"{user_id}_{sessionid}_slicer_task",
                "requiresCompatibilities": capabilities,
                "networkMode": networkMode,
                "cpu": cpu,
                "volumes": [
                            {
                            'name': f"{user_id}_{sessionid}_superslicer_volume_data",
                            'efsVolumeConfiguration':
                                {
                                'fileSystemId': read_yaml.file_system_id,
                                 'rootDirectory': f'/slicer/data/{user_id}_data/slicer_data/campaign_{campId}/tier_{tierId}'
                                }
                            },
                            {
                            'name': f"{user_id}_{sessionid}_superslicer_volume_configs",
                            'efsVolumeConfiguration':
                                {
                                'fileSystemId': read_yaml.file_system_id,
                                 'rootDirectory': f'/slicer/data/{user_id}_data/configs'
                                }
                            }
                            ]
                        }
    response = ecs_client.register_task_definition(**task_definition)
    print('Registered task definition: %s' % response['taskDefinition']['taskDefinitionArn'])


def containerDefination(sessionid="default",hostPort=80,containerPort=8080,cpu=int(read_yaml.default_slicer_cpu),environment=[],user_id="default",health_check=False):

    '''
    The containerDefination function creates a container definition for an AWS ECS task. It sets the container name, volumes, entry point, port mappings, command, CPU, environment variables, and image. If the health_check parameter is set to True, it also adds a health check configuration to the container definition.

    '''

    container_name = f"{user_id}_{sessionid}_superslicer"
    data_volume_name = f"{user_id}_{sessionid}_superslicer_volume_data"
    configs_volume_name = f"{user_id}_{sessionid}_superslicer_volume_configs"
    containerDefination=[{
        "entryPoint": [],
        "portMappings": [
        {
          "hostPort": hostPort,
          "protocol": "tcp",
          "containerPort": containerPort
        }
        ],
      "command": [],
      "cpu": cpu,
      "environment": environment,
      'mountPoints': [
                {
                    'sourceVolume': data_volume_name,
                    'containerPath': '/slic3r/data',
                    'readOnly': False
                },
                {
                    'sourceVolume': configs_volume_name,
                    'containerPath': '/configs/.config/SuperSlicer',
                    'readOnly': False
                }
            ],
      "image": "530762056989.dkr.ecr.ap-south-1.amazonaws.com/superslicer:latest",
      "name": container_name
    }]
    if health_check:
        health_check_settings = {
            "healthCheck": {
                "command": [
                    "CMD-SHELL",
                    f"curl -f http://localhost:{containerPort}/health || exit 1"
                ],
                "interval": 30,
                "timeout": 5,
                "retries": 3,
                "startPeriod": 0
            }
        }
        containerDefination[0].update(health_check_settings)

    return containerDefination

def get_latest_revision(task_definition_family):

    '''
    The get_latest_revision function retrieves the latest revision of a task definition family from AWS ECS. It lists all task definitions for the given family, sorted in descending order, and returns the revision number of the most recent one.

    '''

    response = ecs_client.list_task_definitions(familyPrefix=task_definition_family, sort='DESC')
    latest_task_definition_arn = response['taskDefinitionArns'][0]
    return  latest_task_definition_arn.split(':')[-1]

def get_container_overrides(envvar,name):

    '''
    The get_container_overrides function creates a dictionary to override the default environment variables for a container in an AWS ECS task. The new environment variables are provided as an argument to the function. The function returns the dictionary, which can be used when running a task to replace the default environment variables.
    
    '''

    return {"containerOverrides": [{"name": name,"environment": envvar}]}


def get_ip_using_user_session(userid,sessionid,cluster = read_yaml.cluster_name):

    '''
    The get_ip_using_user_session function retrieves the public IP address of an EC2 instance based on user ID and session ID. It uses the describe_container_instances and describe_instances methods of the ECS and EC2 clients respectively to find the instance and its public IP address. If no matching container instance is found, it prints a message and returns None.
    '''

    family = f"{userid}_{sessionid}_slicer_task"
    instance_id = get_ec2_instance_id(cluster, family)
    paginator = ecs_client.get_paginator('list_container_instances')
    for page in paginator.paginate(cluster=cluster):
        for container_instance_arn in page['containerInstanceArns']:
            # Get container instance details
            container_instance_details = ecs_client.describe_container_instances(
                cluster=cluster,
                containerInstances=[container_instance_arn]
            )
            container_instance = container_instance_details['containerInstances'][0]
            # Check if the EC2 instance ID matches the one we're looking for
            if container_instance['ec2InstanceId'] == instance_id:
                # Get EC2 instance details
                instance_details = ec2_client.describe_instances(
                    InstanceIds=[instance_id]
                )
                instance = instance_details['Reservations'][0]['Instances'][0]
                return instance.get('PublicIpAddress')

    print(f"Could not find a container instance for EC2 instance {instance_id} in cluster {cluster}.")
    return None



async def run_task(user_id:str, sessionid, envvar, uuid_str, cluster:str=read_yaml.cluster_name, launchType:str="EC2", count:int=1):


    '''
    The run_task function asynchronously runs an ECS task for a given user ID and session ID, with a given set of environment variables. It checks the status of the task in a loop until it is running or the maximum wait time is exceeded. It then fetches the public IP of the EC2 instance on which the task is running, sets the IP in a database, retrieves the port and sub-domain associated with the user and session from the database, and returns a dictionary with the cluster, task, container, IP, and URL.

    '''

    max_time = 120
    sleep_time = 0
    check_time = 2
    overrides = get_container_overrides(envvar, f"{user_id}_{sessionid}_superslicer")
    taskDefinition = f"{user_id}_{sessionid}_slicer_task"
    version = get_latest_revision(taskDefinition)

    response = ecs_client.run_task(
        cluster=cluster,
        taskDefinition=f"{taskDefinition}:{version}",
        launchType=launchType,
        count=count,
        overrides=overrides
    )

    task_arn = response['tasks'][0]['taskArn']

    # Check the status of the task in a loop
    while sleep_time<max_time:
        try:
            response = ecs_client.describe_tasks(
                cluster=cluster,
                tasks=[task_arn]
            )

            status = response['tasks'][0]['lastStatus']

            if status == 'RUNNING':
                break
            elif status == 'PENDING':
                time.sleep(check_time)  # Wait for 2 seconds before checking again
            else:
                raise Exception(f'Task failed to start, status: {status}')
        except botocore.exceptions.BotoCoreError as e:
            print(f'Error describing task: {e}')
            break
        
        sleep_time+=check_time
        print(f"getting the status of task... {sleep_time}")
    
    if sleep_time>=max_time:
        raise Exception(f"Couldn't make the task to run in alloted {max_time} seconds")
    

    print("getting the public IP of the EC2 instance using containerInstanceArn....")
    ip = get_ip_using_user_session(user_id,sessionid)
    set_ip_in_db(user_id,sessionid,ip)
    print(f"fetching the port stored in databse which is mapped with {user_id} and sessionid {sessionid}...")
    port = get_port_from_database(user_id,sessionid)
    sub_domain = get_sub_domain_from_database(user_id,sessionid)
    container_id = response['tasks'][0]['containers'][0]['containerArn'].split('/')[3]

    base_domain = read_yaml.host_slicer
    url= f"http://{sub_domain}.{base_domain}"

    return {
        "cluster": response['tasks'][0]["clusterArn"].split('/')[1],
        "task": response['tasks'][0]['taskArn'].split('/')[2],
        "container": container_id,
        "ip":ip,
        "url":url
    }

def wait_until_container_healthy(userid, sessionid, check_interval=2, max_wait_time=120):

    '''
    The wait_until_container_healthy function continuously checks the health status of a container for a given user ID and session ID, until it becomes healthy or the maximum wait time is exceeded. It sleeps for a given check interval between checks. If the container becomes healthy, it sets the docker container ID in a database. If the maximum wait time is exceeded, it prints a message.

    '''

    elapsed_time = 0
    while elapsed_time < max_wait_time:
        print("trying......",elapsed_time)
        time.sleep(check_interval)
        container_status = get_container_health_status(userid, sessionid) 
        if container_status == "healthy":
            print(f"Container for user {userid} and session {sessionid} is healthy")
            family = f"{userid}_{sessionid}_slicer_task"
            container_id, ec2_instance_id = get_container_id_ans_ec2_instance_id(read_yaml.cluster_name, family)
            set_docker_container_id_to_db(userid,sessionid,container_id)
            break
        elif container_status == "unhealthy":
            print(f"Container for user {userid} and session {sessionid} is unhealthy")
            break
        elapsed_time += check_interval
    if elapsed_time >= max_wait_time:
        print(f"Container for user {userid} and session {sessionid} did not become healthy within {max_wait_time} seconds")
        # print("Stopping the container.....")
        # stop_container_core(userid,sessionid)


def get_container_health_status(userid, sessionid):

    '''
    The get_container_health_status function checks the health of a container for a given user ID and session ID by sending a GET request to the /health endpoint of the container's URL. If the response is 200 and the response text is "OK", it returns "healthy". Otherwise, it returns "unhealthy". If there is a request exception, it returns "unknown".

    '''

    print("getting container health status.....")
    ip,port,_ = get_ip_and_port_from_db(userid, sessionid)
    container_url = f"http://{ip}:{port}"
    if not container_url:
        return "unknown"
    
    health_url = f"{container_url}/health"
    print(health_url)
    
    try:
        response = requests.get(health_url, timeout=5)
        if response.status_code == 200 and response.text.strip() == "OK":
            return "healthy"
        else:
            return "unhealthy"
    except requests.exceptions.RequestException:
        return "unknown"
    

def get_container_url(userid, sessionid):

    '''
    The get_container_url function fetches the URL of a container for a given user ID and session ID from a MongoDB collection. It returns the URL if found, otherwise it returns None.

    '''

    query = {"userId": userid, "sessions.sessionHandle": sessionid}
    result = slicer_sessions.find_one(query)
    
    if result:
        for session in result["sessions"]:
            if session["sessionHandle"] == sessionid:
                return session["url"]
    return None

def set_ip_in_db(user_id,sessionid,ip):

    '''
    The set_ip_in_db function sets the IP of an EC2 instance in a MongoDB collection for a given user ID and session ID. The method update_one is used to set the IP in the relevant session document.

    '''

    filter_ = {"userId": user_id, "sessions.sessionHandle": sessionid}
    update = {"$set": {"sessions.$.ip": ip}}
    slicer_sessions.update_one(filter_, update).modified_count


def get_port_from_database(user_id,session_handle):

    '''
    The get_port_from_database function fetches the port mapped with a given user ID and session handle from a MongoDB collection. It returns the port if found, otherwise it prints a message indicating no matching document was found.

    '''

    pipeline = [
        {"$match": {"userId": user_id}},
        {"$unwind": "$sessions"},
        {"$match": {"sessions.sessionHandle": session_handle}},
        {"$project": {"_id": 0, "port": "$sessions.port"}}
    ]
    # execute the pipeline and get the result
    result = slicer_sessions.aggregate(pipeline)
    try:
        port = next(result)['port']
        return port
    except StopIteration:
        print("No matching document found")



def get_sub_domain_from_database(user_id,session_handle):

    '''
    The get_sub_domain_from_database function retrieves the sub-domain associated with a given user ID and session handle from a MongoDB collection. It returns the sub-domain if found, otherwise it prints a message indicating no matching document was found.

    '''

    pipeline = [
        {"$match": {"userId": user_id}},
        {"$unwind": "$sessions"},
        {"$match": {"sessions.sessionHandle": session_handle}},
        {"$project": {"_id": 0, "subDomain": "$sessions.subDomain"}}
    ]
    # execute the pipeline and get the result
    result = slicer_sessions.aggregate(pipeline)
    try:
        sub_domain = next(result)['subDomain']
        return sub_domain
    except StopIteration:
        print("No matching document found")


def get_ip_and_port_from_db(userid, sessionid):

    '''
    get_ip_and_port_from_db: This function uses a MongoDB aggregation pipeline to retrieve the IP address, port number, and subdomain related to a specific user session from the database. If no matching document is found, it prints a message indicating this.
    '''

    pipeline = [
        {"$match": {"userId": userid}},
        {"$unwind": "$sessions"},
        {"$match": {"sessions.sessionHandle": sessionid}},
        {"$project": {"_id": 0, "ip": "$sessions.ip", "port": "$sessions.port", "subDomain": "$sessions.subDomain"}}
    ]
    # execute the pipeline and get the result
    result = slicer_sessions.aggregate(pipeline)
    try:
        res = next(result)
        print(res)
        ip, port, sub_domain = res["ip"], res["port"], res["subDomain"]
        return ip, port, sub_domain
    except StopIteration:
        print("No matching document found")


def get_ip_and_port_userid_using_subdomain_from_db(subdomain):

    '''
    get_ip_and_port_userid_using_subdomain_from_db: This function retrieves the IP address, port number, and user ID related to a specific subdomain from the database. If no match is found, it returns None for all three values.

    '''

    query = {"sessions.subDomain": subdomain}
    result = slicer_sessions.find_one(query)
    if result is not None:
        for session in result['sessions']:
            if session['subDomain'] == subdomain:
                return session['ip'], session['port'], result['userId']
    else:
        return None, None, None


def set_container_id_and_url_in_database(user_id,sessionid,container_id,url,status,uuid_str,dockerContainerId):


    '''
    set_container_id_and_url_in_database: This function updates specific fields in the database for a user's session. It can update the session's URL, status, AWS container ID, Ikarus container ID, and Docker container ID. If the URL is not provided, the function only updates the status and container IDs.

    '''

    filter_ = {"userId": user_id, "sessions.sessionHandle": sessionid}
    if url:update = {"$set": {"sessions.$.url": url,"sessions.$.active": status,"sessions.$.awsContainerId": container_id,"sessions.$.ikarusContainerId": uuid_str,"sessions.$.dockerContainerId": dockerContainerId}}
    else:update = {"$set": {"sessions.$.active": status,"sessions.$.awsContainerId": container_id,"sessions.$.ikarusContainerId": uuid_str,"sessions.$.dockerContainerId": dockerContainerId}}
    result = slicer_sessions.update_one(filter_, update).modified_count


def set_docker_container_id_to_db(user_id,sessionid,docker_container_id):

    '''
    set_docker_container_id_to_db: This function updates the Docker container ID for a specific user's session in the database. It does this by performing an update operation on the MongoDB collection.

    '''

    filter_ = {"userId": user_id, "sessions.sessionHandle": sessionid}
    update = {"$set": {"sessions.$.dockerContainerId": docker_container_id}}
    result = slicer_sessions.update_one(filter_, update).modified_count


def get_containerid_from_db(userid,sessionid):

    '''
    get_containerid_from_db: This function retrieves the Docker container ID for a specific user's session from the database. If no matching session is found, it returns None.
    
    '''

    query = {"userId": userid, "sessions.sessionHandle": sessionid}
    result = slicer_sessions.find_one(query)
    
    if result:
        for session in result["sessions"]:
            if session["sessionHandle"] == sessionid:
                return session["dockerContainerId"]
    return None


def get_task_from_container(cluster,user_id,sessionid):

    '''
    This function retrieves the task ID for a specific container running in Amazon ECS. It lists all running tasks in the ECS cluster and finds the one where the container with the specified name is running.
    
    '''

    container_name = f"{user_id}_{sessionid}_superslicer"
    response = ecs_client.list_tasks(cluster=cluster, desiredStatus='RUNNING')
    task_arns = response['taskArns']
    tasks = ecs_client.describe_tasks(cluster=cluster, tasks=task_arns)['tasks']
    # Find the Task ID that the container is running in
    for task in tasks:
        for container in task['containers']:
            if container['name'] == container_name:
                task_id = task['taskArn'].split('/')[-1]
                print(f"Task ID for container {container_name}: {task_id}")
                return task_id


def stop_task(user_id,sessionid,cluster=read_yaml.cluster_name):

    '''
    stop_task: This function stops a running task in the Amazon ECS cluster related to a specific user's session. Before stopping the task, it checks if the task definition is in the list of running tasks. After stopping the task, it sets the URL and container IDs in the database to None and sets the session's status to False.
    '''

    task_definition = f"{user_id}_{sessionid}_slicer_task"
    if task_definition in get_running_tasks():
        task_id=get_task_from_container(cluster=cluster,user_id=user_id,sessionid=sessionid)
        response = ecs_client.stop_task(
        cluster=cluster,
        task=task_id
        )
        print(f'Stopping task {task_id}...')
        set_container_id_and_url_in_database(user_id,sessionid,None,None,False,None,None)
    else:
        print("No running tasks")


def get_active_sessions():

    '''
    This function retrieves all active sessions from the database. It uses a MongoDB aggregation pipeline to filter the sessions where the 'active' field is True.
    
    '''

    pipeline = [
        {
            "$match": {"sessions.active": True}
        },
        {
            "$project": {
                "_id": 0,
                "userId": 1,
                "sessions": {
                    "$filter": {
                        "input": "$sessions",
                        "as": "session",
                        "cond": {
                            "$eq": ["$$session.active", True]
                        }
                    }
                }
            }
        }
    ]

    # Execute the aggregation pipeline
    result = slicer_sessions.aggregate(pipeline)
    return list(result)


def get_current_user_sessions(userid):

    '''
    This function retrieves all sessions associated with a specific user from the database. It performs a find operation on the MongoDB collection with a query for the user ID, and a projection to specify which fields to return.
    
    '''

    query = { "userId": userid}
    
    projection = {
        "_id": 0,
        "userId": 1,
        "sessions.sessionHandle": 1,
        "sessions.url": 1,
        "sessions.ip": 1,
        "sessions.port": 1,
        "sessions.ikarusContainerId": 1
    }

    documents = slicer_sessions.find(query, projection)
    return list(documents)

def get_all_slicer_sessions():

    '''
    This function retrieves all user sessions from the database. It performs a find operation on the MongoDB collection without a query, meaning it will match all documents, and a projection to specify which fields to return.
    
    '''

    query = {}
    
    projection = {
        "_id": 0,
        "userId": 1,
        "sessions.sessionHandle": 1,
        "sessions.url": 1,
        "sessions.ip": 1,
        "sessions.port": 1,
        "sessions.ikarusContainerId": 1
    }

    documents = slicer_sessions.find(query, projection)
    return list(documents)



def get_instance_id_from_user_id_session_id(userid,sessionid,cluster = read_yaml.cluster_name):


    '''
    This function fetches the instance id for the user based on user id and session id. It uses the cluster name from a YAML file and the get_ec2_instance_id(cluster, family) function to fetch the instance id.
    
    '''
    family = f"{userid}_{sessionid}_slicer_task"
    return get_ec2_instance_id(cluster, family)


def create_dir(user_id, campId,tierId, instance_id=read_yaml.efs_instance_id):

    '''
    
    This function creates directories in a specific structure for a given user, campaign, and tier. It performs this operation on the instance id obtained from the YAML file. It uses the ssm_client.send_command function to execute these commands on the instance.
    
    '''

    commands = [
        f"mkdir -p /efs/slicer/data/{user_id}_data",
        f"mkdir -p /efs/slicer/data/{user_id}_data/configs",
        f"mkdir -p /efs/slicer/data/{user_id}_data/slicer_data",
        f"mkdir -p /efs/slicer/data/{user_id}_data/slicer_data/campaign_{campId}",
        f"mkdir -p /efs/slicer/data/{user_id}_data/slicer_data/campaign_{campId}/tier_{tierId}",
        f"mkdir -p /efs/slicer/data/{user_id}_data/slicer_data/campaign_{campId}/tier_{tierId}/stls",
        f"mkdir -p /efs/slicer/data/{user_id}_data/slicer_data/campaign_{campId}/tier_{tierId}/gcodes",
        f"chmod  777 /efs/slicer/data/{user_id}_data/slicer_data/campaign_{campId}/tier_{tierId}/gcodes"
    ]

    print("Going inside the instance to create directories")



    response = ssm_client.send_command(
        InstanceIds=[instance_id],
        DocumentName="AWS-RunShellScript",
        Parameters={"commands": commands}
    )

    print("Directories created\n")




def get_campid_and_tierid_from_db(userid,sessionid):

    '''
     This function fetches the campaign id and tier id from the MongoDB database for a given user and session. If no such session is found, it returns None.
    
    '''

    query = {"userId": userid, "sessions.sessionHandle": sessionid}
    result = slicer_sessions.find_one(query)
    
    if result:
        for session in result["sessions"]:
            if session["sessionHandle"] == sessionid:
                return session["campaignId"],session["tierId"]
    return None


def stop_container_core(userid, sessionid):

    '''
    This function checks if a task is running for the given user and session. If it is, it stops the task using the stop_task(userid, sessionid) function. It uses the get_running_tasks() function to check if the task is running.

    '''

    task_definition = f"{userid}_{sessionid}_slicer_task"
    print(f"\nChecking if task for user with id {userid} is already running....\n")
    if task_definition in get_running_tasks():
        print(f"Task for id {userid} and session {sessionid} already running.....")
        print(f"Stopping the task of user {userid} session {sessionid}.....")
        stop_task(userid, sessionid)
        print(f"Task stopped successfully.....")
        return {"detail": "success"}
    print(f"Task for id {userid} and session {sessionid} is not running.....")
    return HTTPException(status_code=404, detail="Task not running")


async def remove_dir_from_efs(userid,sessionid,instance_id=read_yaml.efs_instance_id):


    '''
    This function deletes directories for a given user and session from the EFS (Elastic File System). It connects to the instance using SSH and executes the rm -rf command to delete the directories.
    
    '''
    print("deleting the directories")
    campId, tierId = get_campid_and_tierid_from_db(userid,sessionid)
    command  = f'sudo rm -rf /efs/slicer/data/{userid}_data/slicer_data/campaign_{campId}'
    ssh_client = paramiko.SSHClient()
    ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh_client.connect(hostname=ec2_client.describe_instances(InstanceIds=[instance_id])['Reservations'][0]['Instances'][0]['PublicIpAddress'], username='ec2-user', key_filename='ikarus-nest-dev-ssh-key.pem')
    ssh_client.exec_command(command)
    ssh_client.close()



def list_task_definitions():

    '''
    This function lists all the task definitions present in the ECS client.
    '''

    print("Watching the list of present task definitions....")
    response = ecs_client.list_task_definitions()
    li=[x.split("/")[1].split(":")[0] for x in response['taskDefinitionArns']]
    return set(li)


def get_random_port_mongodb():

    '''
    This function generates a random port number between 40000 and 65000. It then checks if the port already exists in the MongoDB database. If it does, it generates a new port number. This process continues until a unique port number is found.
    
    '''

    port = random.randint(40000, 65000)
    print(f" Random port :- {port} ")
    print(" Checking if random port existed in database or not...")
    while is_port_exists(port):
        print(f" Oh oh port {port} already exists, looking for another port...")
        port = random.randint(40000, 65000)
    print(f" port {port} is unique, storing this port in database.....\n")
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

    ADJECTIVES,NOUNS = get_adjectives_and_nouns()
    while True:
        adjective = random.choice(ADJECTIVES).replace("_","-").lower()
        noun = random.choice(NOUNS).replace("_","-").lower()
        if len(adjective)<10 and len(noun)<10: break
    return f"{adjective}-{noun}"



def get_random_domain_mongodb():

    '''
     Similar to get_random_port_mongodb(), this function generates a random domain and checks if it already exists in the MongoDB database. If it does, it generates a new domain. This process continues until a unique domain is found.
    
    '''

    domain = generate_random_subdomain()
    print(f" Random doain :- {domain} ")
    print(" Checking if random domain existed in database or not...")
    while is_domain_exists(domain):
        print(f" Oh oh domain {domain} already exists, looking for another domain...")
        domain = generate_random_subdomain()
    print(f" port {domain} is unique, storing this port in database.....\n")
    return domain

def set_slicer_session_data(userid,sessionid,port,sub_domain,campId,tierId):

    '''
    This function sets the session data for a slicer. If the user does not exist, it inserts a new document for the user. If the user exists, it updates the sessions for the user.
    '''

    user = slicer_sessions.find_one({"userId":userid})
    session = {"sessionHandle":sessionid,"port":port,"subDomain":sub_domain,"campaignId":campId,"tierId":tierId,"active":False,"url":None,"awsContainerId":None,"dockerContainerId":None,"ikarusContainerId": None}
    if not user:
        id = slicer_sessions.insert_one({"userId":userid,"sessions":[session]}).inserted_id
    else:
        res = slicer_sessions.update_one({"userId":userid},{"$push": {"sessions": session}}).modified_count
        id = user["_id"]
    return id

def is_port_exists(port):

    '''
    These functions check if the provided port already exists in the MongoDB database.
    '''

    query = {"sessions.port": port}
    result = list(slicer_sessions.find(query))
    return True if result else False

def is_domain_exists(domain):

    '''
    These functions check if the provided domain already exists in the MongoDB database.
    '''

    query = {"sessions.subDomain": domain}
    result = list(slicer_sessions.find(query))
    return True if result else False

def get_running_tasks(cluster_name = read_yaml.cluster_name):


    '''
     This function retrieves a list of all running tasks in a specified cluster. It returns a list of task definition names.
    '''

    print("getting the list of all running tasks....")
    response = ecs_client.list_tasks(cluster=cluster_name, desiredStatus='RUNNING')
    tasks = response['taskArns']
    if not tasks:
        return []
    x = ecs_client.describe_tasks(cluster=cluster_name, tasks = tasks)
    li = [i['taskDefinitionArn'].split("/")[1].split(":")[0] for i in x['tasks']]
    return li


def deregister_task_defination(userid,sessionid):

    '''
    This function deregisters a task definition with a specified user ID and session ID. It removes the task definition from the list of registered task definitions.

    '''

    task_definition_family = f'{userid}_{sessionid}_slicer_task'
    response = ecs_client.list_task_definitions(familyPrefix=task_definition_family)
    for task_definition_arn in response['taskDefinitionArns']:
        ecs_client.deregister_task_definition(taskDefinition=task_definition_arn)
        print("Task def deregisered ....")



def delete_session_from_database(user_id,session_handle):

    '''
    This function deletes a specific session from the database based on the given user ID and session handle. If the sessions list is empty after the deletion, the whole document will be removed from the database.

    '''

    filter = {'userId': user_id, 'sessions.sessionHandle': session_handle}

    # Define the update to remove the session object from the sessions list
    update = {'$pull': {'sessions': {'sessionHandle': session_handle}}}

    # Execute the update operation
    result = slicer_sessions.update_one(filter, update)

    # Check if the update was successful and the session object was removed
    if result.modified_count == 1:
        # Retrieve the updated document
        updated_doc = slicer_sessions.find_one({'userId': user_id})

        # Check if the sessions list is empty or not
        if len(updated_doc['sessions']) == 0:
            # Delete the whole document if the sessions list is empty
            slicer_sessions.delete_one({'userId': user_id})
    else:
        print('No document was updated.')
    print("Port is released")

def get_all_running_tasks(cluster_name = read_yaml.cluster_name):

    '''
    : This function returns a list of all running tasks in a specified cluster along with their details, such as cluster ARN, container instance ARN, container details, and URL.
    
    '''

    response = ecs_client.list_tasks(cluster=cluster_name, desiredStatus='RUNNING')
    tasks = response['taskArns']
    if not tasks:
        return []
    x = ecs_client.describe_tasks(cluster=cluster_name, tasks = tasks)
    response=[]
    for task in x['tasks']:
        dic={'clusterArn': task['clusterArn'],
             'containerInstanceArn': task['containerInstanceArn'],
             'containers' : [{'containerArn':c['containerArn'],
                              'taskArn': c['taskArn'],
                              'name':c['name'],
                              'url': f"http://{read_yaml.host_slicer}:{c['networkBindings'][0]['hostPort']}"} for c in task['containers']]
             }
        response.append(dic)
    return response

def get_status(task_definition):

    '''
     This function checks if the specified task definition is running or not and returns the status as "Running" or "Stopped".
    '''

    running_ids = [x['containers'][0]['name'].split("_")[0] for x in get_all_running_tasks()]
    if task_definition.split("_")[0] in running_ids:
        return "Running"
    else:
        return "Stopped"

def get_all_task_definations():

    '''
    This function retrieves a list of all task definitions and their statuses (running or stopped).
    
    '''

    response = ecs_client.list_task_definitions()
    li = [x.split("/")[1].split(":")[0] for x in response['taskDefinitionArns']]
    li=set(li)
    res=[]
    for x in li:
        if len(x)==36: res.append(x)
    response=[{"task_definition":x, "status":get_status(x)} for x in res]
    return response


def get_ec2_instance_id(cluster, family):

    '''
    This function retrieves the EC2 instance ID associated with a specified cluster and task definition family.
    '''

    print(cluster,family)
    response = ecs_client.list_tasks(cluster=cluster, family=family)
    task_arn = response['taskArns'][0]
    task_response = ecs_client.describe_tasks(cluster=cluster, tasks=[task_arn])
    container_instance_arn = task_response['tasks'][0]['containerInstanceArn']
    container_instance_response = ecs_client.describe_container_instances(cluster=cluster,
                                                                          containerInstances=[container_instance_arn])
    ec2_instance_id = container_instance_response['containerInstances'][0]['ec2InstanceId']
    return ec2_instance_id


def get_container_id_ans_ec2_instance_id(cluster, family,max_wait_time=60, check_interval=2):

    '''
    This function retrieves the container ID and EC2 instance ID associated with a specified cluster and task definition family, waiting for a maximum time and checking at specified intervals.
    '''


    print("family....",family)
    response = ecs_client.list_tasks(cluster=cluster,family=family)
    task_arn = response['taskArns'][0]
    task_response = ecs_client.describe_tasks(cluster=cluster,tasks=[task_arn])
    container_instance_arn = task_response['tasks'][0]['containerInstanceArn']
    container_instance_response = ecs_client.describe_container_instances(cluster=cluster,containerInstances=[container_instance_arn])
    ec2_instance_id = container_instance_response['containerInstances'][0]['ec2InstanceId']
    docker_ps_cmd = f"docker ps --filter label=com.amazonaws.ecs.task-arn={task_arn} --format '{{{{.ID}}}}'"
    response = ssm_client.send_command(InstanceIds=[ec2_instance_id]
                                       ,DocumentName="AWS-RunShellScript",
                                       Parameters={"commands": [docker_ps_cmd] })
    command_id = response["Command"]["CommandId"]
    elapsed_time = 0
    while elapsed_time < max_wait_time:
        time.sleep(check_interval)
        output_response = ssm_client.get_command_invocation(CommandId=command_id, InstanceId=ec2_instance_id)
        status = output_response["Status"]

        if status in ["Success", "Failed"]:
            break

        elapsed_time += check_interval

    output_response = ssm_client.get_command_invocation(CommandId=command_id,InstanceId=ec2_instance_id,)
    container_id = output_response["StandardOutputContent"].strip()
    return container_id,ec2_instance_id



def run_command_on_ec2_using_ssm(ec2_instance_id, command, max_wait_time:int=60, check_interval:int=2):

    '''
    This function runs a specified command on an EC2 instance using AWS Systems Manager (SSM), waiting for a maximum time and checking at specified intervals. It returns the status, standard output, and standard error of the command execution.

    '''
    response = ssm_client.send_command(InstanceIds=[ec2_instance_id],
                                       DocumentName="AWS-RunShellScript",
                                       Parameters={"commands": [command]})
    command_id = response["Command"]["CommandId"]

    elapsed_time = 0
    while elapsed_time < max_wait_time:
        print(f"trying to run command {command}",elapsed_time)
        time.sleep(check_interval)
        output_response = ssm_client.get_command_invocation(CommandId=command_id, InstanceId=ec2_instance_id)
        status = output_response["Status"]

        if status in ["Success", "Failed"]:
            break

        elapsed_time += check_interval

    standard_output = output_response["StandardOutputContent"]
    standard_error = output_response["StandardErrorContent"]
    return status, standard_output, standard_error



def install_aws_cli(instance_id=read_yaml.efs_instance_id):

    '''
    This function installs the AWS CLI on a specified EC2 instance.
    '''
    command = "sudo yum install -y awscli"
    status, standard_output, standard_error = run_command_on_ec2_using_ssm(instance_id, command)
    return status, standard_output, standard_error


from urllib.parse import quote

from urllib.parse import quote

def convert_https_to_s3_url(https_url):
    '''
     This function converts an S3 HTTPS URL to an S3 URL format.
    '''
    match = re.match(r"https://(.+).s3.(.+).amazonaws.com/(.+)", https_url)
    if match:
        bucket_name = match.group(1)
        key = match.group(3)
        key = key.replace("+", "%20")
        encoded_key = quote(key, safe="/")
        s3_url = f"s3://{bucket_name}/{encoded_key}"
        return s3_url
    else:
        raise ValueError("Invalid S3 HTTPS URL")



def upload_stls_to_efs(urllist, userid, campId,tierId):
    # Install AWS CLI on the EC2 instance if not already installed

    '''
    This function uploads STL files from a list of URLs to an EFS path based on the user ID, campaign ID, and tier ID.

    '''
    install_status, install_output, install_error = install_aws_cli()
    if install_status == "Failed":
        print(f"Failed to install AWS CLI: {install_error}")
        return

    for url in urllist:
        filename = url.split("/")[-1]
        print(f"Uploading {filename}")
        efs_path = f"/efs/slicer/data/{userid}_data/slicer_data/campaign_{campId}/tier_{tierId}/stls"
        s3_url = convert_https_to_s3_url(url)
        status, standard_output, standard_error = download_s3_file_to_efs(s3_url, efs_path)
        print(f"Status of upload of {filename}: {status}\n")
        if status == "Failed":
            print(f"reason of failure: {standard_error}")


def download_s3_file_to_efs(s3_url, efs_path, instance_id=read_yaml.efs_instance_id):

    '''
    This function downloads a file from an S3 URL to an EFS path on a specified EC2 instance.
    '''

    decoded_s3_url = unquote(s3_url)
    encoded_efs_path = quote(efs_path, safe=":/")
    command = f"aws s3 cp '{decoded_s3_url}' '{encoded_efs_path}'"
    print(command)
    status, standard_output, standard_error = run_command_on_ec2_using_ssm(instance_id, command)
    return status, standard_output, standard_error



def get_stls_from_campaign_service(campId:str,tierId:str,assets:list,access_token:str):

    '''
    This function retrieves a list of STL files from the campaign service based on the campaign ID, tier ID, and assets. It requires an access token for authentication.

    '''
    api_response = APIResponse()
    api_response.responseError = None
    api_response.response = None
    cookies = {"sAccessToken": access_token}
    url = f"{read_yaml.campagin_service_base_url}/api/v1/{campId}/campaign-rewards?tierId={tierId}"
    try:
        api_response.response = requests.request('GET', url,cookies=cookies).json()
    except Exception as e:
        api_response.responseError="Campaign service Down"
    
    res = api_response
    if res.responseError:
        raise HTTPException(status_code=500,detail=res.responseError) 
    if not assets:
        print(res.response)
        print("No query parameters")
        urllist = [r['location'] for r in res.response[0]]
    else:
        urllist = []
        for r in res.response[0]:
            if r['file_UUID'] in assets: urllist.append(r['location'])
    return urllist


def get_token_from_request_headers(request):
    authorization: Optional[str] = request.headers.get('authorization')
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
    jwks_uri = f"http://app.dev.ikarusnest.org:8000/auth/jwt/jwks.json"
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
