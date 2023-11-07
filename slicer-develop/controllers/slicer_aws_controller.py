from fastapi import HTTPException,status
from supertokens_python.recipe.session.asyncio import get_session
from fastapi.requests import Request
from services import slicer_aws_services
import time
import uuid
from config import read_yaml
from typing import Optional
from jose import jwt
from jose.exceptions import JWTError
from supertokens_python.recipe.session.asyncio import get_session

def current_user(request,session):
    user_id = session.user_id
    access_token = request.cookies.get("sAccessToken", "")
    return {"current_user": user_id,
            "accessToken": access_token}


async def test_route(request):

    jwt_token = slicer_aws_services.get_token_from_request_headers(request)
    header = jwt.get_unverified_header(jwt_token)
    rsa_key =await slicer_aws_services.get_key(header)
    try:
        payload = jwt.decode(jwt_token, rsa_key, algorithms=['RS256'])
        # Do something with payload and you can return the response as microservices auth is successful..

        return  payload
    except JWTError as e:
        print("Invalid Token")
        raise HTTPException(status_code=401, detail='Invalid token') from e


async def start_container(request,session,campId,tierId,assets,force):


    '''
    
    The start_container function is an asynchronous function that initiates a new container for a given user session. It first reads the user and session identifiers, creates a task definition based on these, and retrieves the access token from the request cookies. A unique identifier string is also generated using a timestamp.

    Environment variables specific to the session are created using these identifiers, the campaign ID, the tier ID, and the access token. The function then fetches a list of STL files from the campaign service based on the campaign ID, tier ID, and provided assets.

    Next, the function checks whether a task for the current user and session is already running. If such a task is found and the 'force' parameter is set to True, the existing container is stopped and its task definition deleted. If 'force' is False, the function returns a message stating that the task is already running, along with a URL for accessing the running container.

    If the task is not already running, the function checks whether a task definition for the current user and session already exists. If not, it initiates the process of creating a new task definition. This includes the following steps:

        1. Creating directories on the EC2 instance for the new user.
        2. Uploading the STL files to the EFS that is mounted on the EC2 instance.
        3. Assigning a random port between 40000 and 65000 for the container to use.
        4. Assigning a random subdomain for the container.
        5. Adding the slicer session data to the database.
        6. Defining the container definitions for the new task.
        7. Registering the new task definition in ECS.

    If the task definition already exists, the function initiates a new task from that definition. Once the task is started successfully, the container ID and URL are stored in the database. The function then waits until the container is healthy before returning the response, which includes the container ID and URL.

    '''


    userid = session.user_id
    sessionid = session.session_handle
    task_definition = f"{userid}_{sessionid}_slicer_task"
    access_token = request.cookies.get("sAccessToken", "")
    timestamp = time.time()
    uuid_str = str(uuid.uuid1(node=int(timestamp * 1000)))
    environment_variables = slicer_aws_services.get_environment_variables_object(userid,sessionid,campId,tierId,uuid_str,access_token)
        
    urllist = slicer_aws_services.get_stls_from_campaign_service(campId,tierId,assets,access_token)
    print(urllist)

    print(f"\nChecking if task for user with id {userid} and session {sessionid} is already running....")

    current_running_tasks = slicer_aws_services.get_running_tasks()

    if task_definition in current_running_tasks:
        if force:
            slicer_aws_services.stop_container_core(userid, sessionid)
            await delete_task_defination(session)
        else:
            print(f"Task for id {userid} and its session {sessionid} already running.....")
            port = slicer_aws_services.get_port_from_database(userid,sessionid)
            sub_domain = slicer_aws_services.get_sub_domain_from_database(userid,sessionid)
            random_url = f"http://{sub_domain}.{read_yaml.host_slicer}"
            return {"detail":"already running","url":random_url}


    print(f"Task is not already running, now checking if task definition is already present for the user with id {userid} and sesion {sessionid} ....")
    if task_definition not in slicer_aws_services.list_task_definitions():
        print(f"Oh No!! task definition not is already present, So lets create it.....\n")
        print("Step1: Create the directories for new user inside the EC2 instance....")
        slicer_aws_services.create_dir(userid,campId,tierId)
        print(f"Created all the directories for user {userid} inside EC2 instance and EFS(mounted with EC2\n")
        print(f"Uploading stls to efs using given stl\n")
        if campId and tierId: slicer_aws_services.upload_stls_to_efs(urllist,userid,campId,tierId)
        print("Step2: Looking for the random port between 40000 and 65000 that can be assigned....")
        host_port = slicer_aws_services.get_random_port_mongodb()
        print("Step3: Looking for the random subdomain that can be assigned....")
        sub_domain = slicer_aws_services.get_random_domain_mongodb()
        print("Step4: Adding slicer data to database....")
        slicer_aws_services.set_slicer_session_data(userid,sessionid,host_port,sub_domain,campId,tierId)
        print("Step5: Defining the container definitions....")
        cdf = slicer_aws_services.containerDefination(sessionid=sessionid,hostPort=host_port,user_id=userid)
        print("Step6: Registering the task definition in ECS....\n")
        slicer_aws_services.register_task_defination(campId,tierId,user_id=userid,sessionid=sessionid,containerDefinations=cdf)


    print(f"Task definiton for user {userid} and session {sessionid} already present, so running the new task from that definition....")
    response = await slicer_aws_services.run_task(userid,sessionid,environment_variables,uuid_str)
    print(f"Task for id {userid} ran successfuly")
    slicer_aws_services.set_container_id_and_url_in_database(userid,sessionid,response["container"],response["url"],True,uuid_str,None)
    print(f"Adding url and containerids to database")
    print(response)
    slicer_aws_services.wait_until_container_healthy(userid,sessionid)
    return response


async def stop_container(request):

    '''
     This function stops a running container associated with the given session. It retrieves the user ID and the session handle from the session and uses them to stop the corresponding container using the stop_container_core method from the slicer_aws_services module.
    
    '''

    session = await get_session(request, session_required=False)
    if session is not None:
        print("Session  present")
        userid = session.user_id
        sessionid = session.session_handle
        return slicer_aws_services.stop_container_core(userid, sessionid)

    else:
        jwt_token = slicer_aws_services.get_token_from_request_headers(request)
        print("token" , jwt_token)

        try:
            header = jwt.get_unverified_header(jwt_token)
        except Exception as e:
            raise HTTPException(status_code=401, detail=str(e))
        
        rsa_key =await slicer_aws_services.get_key(header)
        
        try:
            payload = jwt.decode(jwt_token, rsa_key, algorithms=['RS256'])
            # Do something with payload and you can return the response as microservices auth is successful..
            print(payload)
            source = payload["source"]
            if source == "easy-novnc-service":
                userid = payload["userid"]
                sessionid = payload["sessionid"]
                return slicer_aws_services.stop_container_core(userid, sessionid)
            else:
                raise HTTPException(status_code=401, detail='Call from wrong micro-service')
        
        except JWTError as e:
            print("Invalid Token")
            raise HTTPException(status_code=401, detail='Invalid token') from e
        

async def delete_task_defination(session):


    '''
    This asynchronous function deletes a task definition associated with the given session. It first checks if a task definition exists for the user ID and session handle retrieved from the session. If not, it raises an HTTP 404 error. If the task definition exists, it deletes the associated directory from EFS, deregisters the task definition, and deletes the session from the database. The function returns a success message upon completion.
    
    '''
    userid = session.user_id
    sessionid=session.session_handle
    task_definition = f"{userid}_{sessionid}_slicer_task"
    print(f"Checking if task definition is already present for the user with id {userid} ....\n")

    if task_definition not in slicer_aws_services.list_task_definitions():
        print(f"Task definition not registered for this user {userid} and session {sessionid} ....\n")
        raise HTTPException(status_code=404,detail="Task definition not registered for this user")
         
         
    await slicer_aws_services.remove_dir_from_efs(userid,sessionid)
    print(f"\nTask definition present, deregistering the task def for user {userid} and session {sessionid}")
    slicer_aws_services.deregister_task_defination(userid,sessionid)
    print(f"Releasing the port for user {userid} and session {sessionid}")
    # slicer_aws_services.release_port_from_redis(userid,sessionid)
    slicer_aws_services.delete_session_from_database(userid,sessionid)
    return {"Successfully deregistered"}


def get_running_tasks(session):

    '''
    This function returns a list of all currently running tasks in the AWS ECS cluster. It uses the get_active_sessions method from the slicer_aws_services module to retrieve the list.
    
    '''
    print(f"Getting lst of all running tasks in AWS ECS cluster")
    response = slicer_aws_services.get_active_sessions()
    # response = slicer_aws_services.get_all_running_tasks()
    return response

def get_current_user_sessions(session):

    '''
    This function retrieves a list of all tasks associated with the current user. It uses the get_current_user_sessions method from the slicer_aws_services module, passing in the user ID retrieved from the session.
    
    '''

    print(f"Getting lst of all tasks of current user")
    response = slicer_aws_services.get_current_user_sessions(session.user_id)
    # response = slicer_aws_services.get_all_running_tasks()
    return response


def get_all_users(session):

    '''
    This function retrieves a list of all active task definitions in the AWS ECS cluster. It uses the get_all_slicer_sessions method from the slicer_aws_services module to retrieve this list.
    '''

    print(f"Getting lst of all active task definitions in AWS ECS cluster")
    response = slicer_aws_services.get_all_slicer_sessions()
    # response = slicer_aws_services.get_all_task_definations()
    return response

async def get_ip_and_port(request,response,subdomain):
    
    '''
     This asynchronous function retrieves the IP address and port associated with the provided subdomain. It first retrieves the session associated with the request. If no session exists, it raises an HTTP 401 error. The function then retrieves the IP address, port, and user ID associated with the subdomain from the database. If the user ID matches the ID from the session, the function adds the IP address and port to the response headers and returns them. If the IDs do not match, the function raises an HTTP 403 error.

    '''
    session = await get_session(request)
    userid = session.user_id
    sessionid = session.session_handle

    if session is None:
        raise HTTPException(status_code=401,detail="Unauthorized")

    ip,port,userid_db = slicer_aws_services.get_ip_and_port_userid_using_subdomain_from_db(subdomain)
    print(ip,port,userid_db)
    if userid_db == userid:
        response.headers["X-Slicer-Ip"]=f"{ip}:{port}"
        return f"{ip}:{port}"
    else:
        raise HTTPException(status_code=403,detail="forbidden")
    
