
Ikarus NEST Auth
=======

# STEPS TO RUN AUTH SYSTEM

Please follow the step by step instruction in order to run the authentication system locally.


## Installation

## Setup the Core
Run the following docker command to set up the core for supertokens:


```bash
docker run -p 3567:3567 --name rds-core -e MYSQL_CONNECTION_URI="mysql://<mysql-db-password>@<mysql-db-host>:3306/supertokens" -e MYSQL_TABLE_NAMES_PREFIX="ikarus_nest"  -d registry.supertokens.io/supertokens/supertokens-mysql
```
Now to check the core works properly on your system run the following command in terminal 
  ```bash
curl http://localhost:3567/
```
If this command returns hello, then core works properly in your system.

Note: This step is only required when you want to run the individual core locally. If you want to use the shared hosted core that has been used by all our microservices then this step is not required. Instead of http://localhost:3567/ , we have to use http://15.207.107.101:3567/

## Setup the Auth-Backend Service

Run git clone command

```bash
git clone -b develop https://github.com/ikarus-nest/nest-auth.git
cd nest-auth
```
  Create the virtual environment (Windows)
  ```bash
virtualenv venv
```
  Activate the environment (Windows)
  ```bash
.\venv\Scripts\activate
```
Install the requirements
```bash
pip install -r requirements.txt
```
Now If you want to run the auth system in local environment or dev server (on EC2 instance just for testing), then we need to add the secrets.yaml file inside the config directory. For secrets.yaml, contact the owner of the service



If you are running the local core (from step I), then in /config/local_application.yaml you have to change the host_core to localhost

```bash
host_core: localhost  #Inside /config/local_application.yaml
```
from
```bash
host_core: 15.207.107.101
```

After installing the requirements and adding the secrets file, run the following command to run the auth backend service on the port 8000
```bash
python run.py 
```
If you want to run in dev server then use 
```bash
python run.py --env=development
```

You can also use this command to run the service, but by this you can't able to specify the environmet 
```bash
uvicorn main:app --reload --port 8000 
```

