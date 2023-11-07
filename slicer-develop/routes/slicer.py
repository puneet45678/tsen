from fastapi import APIRouter, Depends, HTTPException
from supertokens_python.recipe.session.framework.fastapi import verify_session
from supertokens_python.recipe.session import SessionContainer
from services import slicer_services
import docker
import redis
import random
import os
import shutil

redis_host = "localhost"
redis_port = 6379
redis_password = ""


redis_client = redis.Redis(host=redis_host, port=redis_port, password=redis_password)
router = APIRouter(tags=['Slicer'], prefix="")


@router.get("/current-user")
async def current_user(session: SessionContainer = Depends(verify_session())):
    user_id = session.user_id
    return {"current_user": user_id}

@router.post("/slice-now/")
def start_container(campId:str, tierId:str, session: SessionContainer = Depends(verify_session())):
    environment = {'CAMPAIGNID': campId, 'TIERID':tierId}
    userid = session.user_id
    client = docker.from_env()
    container_name = f"{userid}_superslicer"
    volume_name = f"{userid}_superslicer_data"

    path = os.path.join(os.getcwd(), "volumes\\" + volume_name)
    if not os.path.exists(path):
        os.mkdir(path)

    data_path = os.path.join(path, "slicer_data")
    if not os.path.exists(data_path):
        os.mkdir(data_path)

    config_path = os.path.join(path, "configs")
    if not os.path.exists(config_path):
        os.mkdir(config_path)

    volumes = {data_path: {"bind": "/slic3r/data", "mode": "rw"}, config_path: {"bind": "/configs/.config/SuperSlicer"}}

    try:
        container = client.containers.get(container_name)
        if container.status == "running":
            port = redis_client.get(container_name)
            # slicer_services.run_command(userid, command)
            # raise HTTPException(status_code=409, detail="Container is already running")
            return {"status": "Container already running", "container_id": container.id,
                    "port": int(port), "url": f"http://localhost:{int(port)}"}
        else:
            container.start()
            port = redis_client.get(container_name)
            return {"status": "Container Resumed", "container_id": container.id,
                    "port": int(port),"url": f"http://localhost:{int(port)}"}

    except docker.errors.NotFound:
        # Get a random port number between 9000 and 9999
        port = random.randint(9000, 9999)
        while redis_client.exists(str(port)):
            print(port)
            port = random.randint(9000, 9999)

        # Store the port number in Redis
        redis_client.set(str(port), container_name)
        redis_client.set(container_name, str(port))

        container = client.containers.run(
            "superslicer",
            detach=True,
            name=container_name,
            ports={8080: port},
            volumes=volumes,
            environment=environment
        )
    return {"status": "New Container Started", "container_id": container.id, "port": int(port), "url": f"http://localhost:{int(port)}"}


@router.get("/start-container")
def start_container(session: SessionContainer = Depends(verify_session())):
    userid = session.user_id
    client = docker.from_env()
    container_name = f"{userid}_superslicer"
    volume_name = f"{userid}_superslicer_data"


    path = os.path.join(os.getcwd(),"volumes\\"+volume_name)
    if not os.path.exists(path):
        os.mkdir(path)

    data_path = os.path.join(path,"slicer_data")
    if not os.path.exists(data_path):
        os.mkdir(data_path)

    config_path = os.path.join(path,"configs")
    if not os.path.exists(config_path):
        os.mkdir(config_path)

    volumes = {data_path: {"bind": "/slic3r/data", "mode": "rw"}, config_path:{"bind":"/configs/.config/SuperSlicer"}}


    try:
        container = client.containers.get(container_name)
        if container.status == "running":
            port = redis_client.get(container_name)
            return {"status": "Container already running", "container_id": container.id,
                    "port": int(port), "url": f"http://localhost:{int(port)}"}
        else:
            container.start()
            port = redis_client.get(container_name)
            return {"status": "Container Resumed", "container_id": container.id,
                    "port": int(port), "url": f"http://localhost:{int(port)}"}

    except docker.errors.NotFound:
        # Get a random port number between 9000 and 9999
        port = random.randint(9000, 9999)
        while redis_client.exists(str(port)):
            print(port)
            port = random.randint(9000, 9999)

        # Store the port number in Redis
        redis_client.set(str(port), container_name)
        redis_client.set(container_name, str(port))

        container = client.containers.run(
            "superslicer",
            detach=True,
            name=container_name,
            ports={8080:port},
            volumes=volumes
        )
    return {"status": "New Container Started", "container_id": container.id, "port": int(port), "url": f"http://localhost:{int(port)}"}



@router.get("/stop-container")
def stop_container(session: SessionContainer = Depends(verify_session())):
    userid = session.user_id
    client = docker.from_env()
    container_name = f"{userid}_superslicer"
    container = client.containers.get(container_name)
    container.stop()
    # container.remove()
    return {"status": "success"}


@router.delete("/delete-container")
def delete_container(session: SessionContainer = Depends(verify_session())):
    userid = session.user_id
    client = docker.from_env()
    container_name = f"{userid}_superslicer"
    volume_name = f"{userid}_superslicer_data"
    container = client.containers.get(container_name)
    if container.status == "running":
        container.stop()
    container.remove()
    path= os.path.join(os.getcwd(),"volumes\\"+volume_name)
    print(path)
    if os.path.exists(path):
        shutil.rmtree(path)

    config_path = os.path.join(path, "configs")
    if  os.path.exists(config_path):
        os.rmdir(config_path)
    port = redis_client.get(container_name)
    redis_client.delete(container_name)
    redis_client.delete(port)
    return {"status": "success"}

@router.get("/run-command/watcher")
def run_command(session: SessionContainer = Depends(verify_session())):
    userid = session.user_id
    cmd = "nohup ../watchers/watcher.sh &"
    try:
        command_output,exit_code = slicer_services.run_command(userid,cmd)
    except Exception as e:
        raise HTTPException(status_code=404,detail=str(e))
    print(cmd)
    print(command_output)
    return {"Output":command_output, "exit_code": exit_code}





