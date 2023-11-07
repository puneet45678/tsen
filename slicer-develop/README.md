
# AWS Slicer Service


AWS Slicer Service is a backend service designed to manage and control AWS ECS tasks in a user-friendly way. It includes managing AWS ECS tasks such as starting containers, stopping containers, deleting task definitions, and fetching running tasks, user sessions, and all active task definitions. It also facilitates fetching the IP address and port for a given subdomain. This application uses FastAPI framework and provides a set of APIs to interact with.




## Getting Started

These instructions will provide you with a copy of the project and guidance on setting it up on your local machine for development and testing purposes.


## Prerequisites

To run this service, you need to have Python 3.7 or later installed on your machine. If you don't have Python installed, you can download it from the official website: https://www.python.org/downloads/


## Installing
- Clone the repository:

```
git clone https://github.com/ikarus-nest/slicer.git

```
- Navigate into the cloned repository:
```
cd slicer && git checkout develop

```

- Create the virtual environment:
```
python3 -m venv <name-of-your-environment>
```

- Activate the  virtual environment:
```
cd venv && source /<name-of-your-environment>/bin/activate && cd..
```
- Install the required dependencies:
```
pip install -r requirements.txt

```


## API Reference

### Start Container

```http
 GET /start-container
```

This endpoint initiates a new AWS ECS task (container) for the provided user session. It also manages task definitions and environment variables for the user session and the ECS task. If a task definition already exists, it uses it; otherwise, it creates one.

### It uses the following functions:
- **get_environment_variables_object()**: to get the environment variables for the ECS task.
- **get_stls_from_campaign_service()**: to fetch the STL files for the ECS task.
- **get_running_tasks()**: to fetch currently running tasks.
- **stop_container_core()**: to stop a container.
- **delete_task_defination()**: to delete a task definition.
- **create_dir()**: to create directories for a new user.
- **upload_stls_to_efs()**: to upload STL files to EFS.
- **get_random_port_mongodb()**: to fetch a random port.
- **get_random_domain_mongodb()**: to fetch a random subdomain.
- **set_slicer_session_data()**: to set session data for the slicer.
- **register_task_defination()**: to register a task definition.
- **run_task()**: to run the ECS task.
- **set_container_id_and_url_in_database()**: to set the container ID and URL in the database.
- **wait_until_container_healthy()**: to wait until the container is healthy.

### It uses the following query parameters:

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `campId` | `string` | **Required**. ID of the campaign (default: "123"). |
| `tierId` | `string` | **Required**. ID of the tier (default: "456"). |
| `assets` | `list`   | **Required**. List of assets (default: []). |
| `force`  | `bool`   | **Required**. Boolean to force start the container (default: False).|

### Stop Container

```http
  DELETE /stop-container
```

This endpoint stops a running container associated with a user session. It uses the stop_container_core() function to stop the container linked with the given user session.

### Delete Task Definition

```http
  DELETE /task-defination
```
This endpoint deletes an AWS ECS task definition associated with the user session. It first checks if the task definition exists using the list_task_definitions() function, then proceeds to deregister the task definition with deregister_task_defination(), remove the user's directory from the EFS with remove_dir_from_efs(), and finally delete the session data from the database with delete_session_from_database(). If the task definition does not exist, it raises an HTTP 404 error.


### Get Running Sessions

```http
  GET /running-sessions
```
This endpoint fetches a list of all active AWS ECS tasks in the cluster. It uses the get_running_tasks() function to retrieve this list.


### Get Current User Sessions

```http
  GET /my-sessions
```
This endpoint fetches a list of all tasks associated with the current user. It uses the get_current_user_sessions() function to retrieve this list.

### Get All Sessions


```http
  GET /all-sessions
```
This endpoint fetches a list of all active task definitions in the AWS ECS cluster. It uses the get_all_users() function to retrieve this list.


### Get IP and Port



```http
  GET /ip-port
```
This endpoint fetches the IP address and port associated with a given subdomain. It first validates the session and then uses the get_ip_and_port_userid_using_subdomain_from_db() function to fetch the IP and port. If the user ID associated with the subdomain matches the user ID from the session, it returns the IP and port; otherwise, it raises an HTTP 403 error.


### It uses the following query parameters:

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `subdomain` | `string` | **Required**. Subdomain for which to fetch the IP and port. |

## Built With

- #### Python
- #### FastAPI
- #### AWS ECS
- #### MongoDB
