import docker
import os
import redis
redis_host = "localhost"
redis_port = 6379
redis_password = ""
redis_client = redis.Redis(host=redis_host, port=redis_port, password=redis_password)
import shutil


def stop_container(userid):
    client = docker.from_env()
    container_name = f"{userid}_superslicer"
    if container_name in client.containers.list():
        container = client.containers.get(container_name)
        container.stop()
        print("container stopped")

def delete_container(userid):
    client = docker.from_env()
    container_name = f"{userid}_superslicer"
    if container_name in client.containers.list():
        volume_name = f"{userid}_superslicer_data"
        container = client.containers.get(container_name)
        if container.status == "running":
            container.stop()
        container.remove()
        path = os.path.join(os.getcwd(), "volumes\\" + volume_name)
        print(path)
        # if os.path.exists(path):
        #     os.rmdir(path)
        if os.path.exists(path): shutil.rmtree(path)
        print("deleted container")
        port = redis_client.get(container_name)
        redis_client.delete(container_name)
        redis_client.delete(port)

def run_command(userid,command):
    client = docker.from_env()
    container_name = f"{userid}_superslicer"
    try:
        container = client.containers.get(container_name)
    except Exception as e:
        print("No running container")
        raise Exception("No running containers")
    output = container.exec_run(command,user='root')
    command_output = output.output.decode('utf-8').strip()
    exit_code = output.exit_code
    print(command)
    print(command_output)
    return (command_output,exit_code)
