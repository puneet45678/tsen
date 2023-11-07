
# Ikarus-Nest Cart and Order Service

## Introduction

Welcome to the cart service! This backend service is designed to handle the management of user  carts in an efficient and scalable manner. It provides a seamless experience for adding, updating, and removing items from a user's cart, adding them to save to later, placing the orders and  ensuring a smooth and enjoyable checkout. Built using FastAPI and MongoDB, the cart and orders service leverages the power of Python and the flexibility of a NoSQL database to deliver high-performance and reliable cart functionality. This playbook serves as a comprehensive guide for developers, outlining the necessary setup, configuration, and deployment steps to get the cart service up and running smoothly. Let's dive in and explore the world of this cart service together!


## Prerequisites 

- #### Python
- #### FastAPI
- #### MongoDB


## Getting Started

These instructions will provide you with a copy of the project and guidance on setting it up on your local machine for development and testing purposes.



## Installing
- Clone the repository:
```
git clone https://github.com/ikarus-nest/cart-and-order.git
```
- Navigate into the cloned repository:

```
cd slicer && git checkout develop
```

## Environment Setup

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
- Recommended folder structure:

```
├── cart-service
│   │
│   ├── config
│   │   ├── default_application.yaml
│   │   ├── development_application.yaml
│   │   ├── local_application.yaml
│   │   ├── production_application.yaml
│   │   ├── secrets.yaml
│   │   ├── read_yaml.py
│   │   └── ...
│   │
│   ├── db
│   │   ├── models
│   │   │    ├── model.py
│   │   └── ...
│   ├── logger
│   │   ├── logging.py
│   │   └── ...
│   │
│   ├── logs
│   │   ├── orders.py
│   │   ├── carts.py
│   │   └── ...
│   │
│   ├── routes
│   │   ├── cart.py
│   │   └── ...
│   │
│   ├── services
│   │   ├── cart_db_services.py
│   │   ├── cart_services.py
│   │   └── ...
│   │
│   ├── utils
│   │   ├── utils.py
│   │   └── ...
│   │
│   ├── .dockerignore
│   │
│   ├── .gitignore
│   │
│   ├── Dockerfile
│   │
│   ├── main.py
│   │
│   ├── run.py
│   │
│   ├── requirements.txt
│   │
│   ├── readme.md
│   │
│   └── ...

```

## Configuration

In our cart service, we use configuration files to manage different settings based on the environment in which the application is running. The configuration files are divided into five parts:

- **default_application.yaml**: This file contains configurations that are common for all environments. It includes settings for MongoDB, ports, application name, host, and other general parameters.

- **development_application.yaml**: This file holds configurations specific to the development environment. For example, it may contain the hostname for the development server.

- **local_application.yaml**: This file includes configurations specific to the local environment. It can have settings like the local hostname.

- **production_application.yaml**: This file contains configurations specific to the production environment. It includes settings like the production hostname.

- **secrets.yaml**: This file is used only in non-production environments (local and development) and holds sensitive information. For example, it may store the secret API key.

To read and use these configuration files, we have a read_yaml.py file. It utilizes the ConfZ library to handle the configuration loading process. The MyAppConfig class is derived from ConfZ and serves as our configuration object. It loads the appropriate configuration files based on the APPLICATION_ENV environment variable. If the variable is not set, it defaults to the local environment.

Within the read_yaml.py file, we read the necessary configurations, such as MongoDB credentials, ports, hostnames, and API endpoints, from the configuration object. In production, we retrieve some sensitive information from environment variables for security reasons.

To run the cart service, we have a run.py file. It allows us to start the FastAPI application with a specific environment. By passing the --env argument during execution (e.g., python run.py --env=local), we can specify the desired environment. If no environment is provided, it defaults to the local environment.

Overall, this configuration setup allows us to maintain separate settings for different environments, making it easier to manage and deploy our cart service in various scenarios."

### How this configurations helps in running the service in different environments

When the environment is set to local or development (we can specify it using --env argument), the **secrets.yaml** file comes into the picture. This file is used to store sensitive variables such as **mongo_user_name** and **mongo_pass_word**. The **read_yaml.py** file, as mentioned earlier, reads these variables from the **secrets.yaml** file along with other configuration variables coming from default_application.yaml, development_application.yaml, and local_application.yaml depending on the environment.

However, when the environment is set to production, there is no secrets.yaml file present. Instead, the sensitive variables are obtained from the OS environment. To facilitate this, we provide these environment variables during the Docker build process.

To pass the sensitive variables securely into the Docker image, we use ARG (build-time variable) statements to define the variables (mongo_user_name, mongo_pass_word, mongodb_uri, supertokens_core_api_key). Then, we use ENV statements to set the values of these variables based on the build arguments. This allows us to provide the values during the Docker build process, keeping them separate from the actual code and configuration files.

```
ARG mongo_user_name
ENV mongo_user_name=${mongo_user_name}

ARG mongo_pass_word
ENV mongo_pass_word=${mongo_pass_word}

ARG mongmongodb_uri
ENV mongodb_uri=${mongodb_uri}
```

Finally, the CMD statement specifies the command to be executed when the Docker container is run. In this case, it runs the run.py file with the environment set to production (--env=production).

```
CMD ["python" "run.py" "--env=production"]
```

During the Docker build process, we provide the values for the sensitive variables as build arguments. For example, we can use the --build-arg flag when building the Docker image to pass the values securely. These values are then used within the Docker image as environment variables.

If we are running the service locally then we have to just uses this command
and if we do not specify the --env argument then by default it will take it as local.
```
python run.py
```

Internally run.py uses this command to run the fastAPI application in the local server

```
from uvicorn import run
run("main:app", host="0.0.0.0", port=8004, reload=reload)
```
If the env is set as local and development then reload value will be **True**, otherwise it will be **False**

By following this approach, we can ensure that sensitive variables and secrets are handled securely and appropriately in different environments, while keeping the codebase and configuration files separate from the actual sensitive information.


## Database Setup

Setting up the database is a crucial step in configuring the cart service. In this section, we'll cover the necessary steps to install and configure MongoDB, create a new database, and set up a user specifically for the cart service.

- **Install MongoDB**: Start by installing MongoDB on your system. You can refer to the official MongoDB documentation for detailed instructions on how to install it on your operating system. for local testing you can use mongodb locally and for development and production environments we are using mongodb atlas. I'll suggest you to use mongodb atlas for local environment as well for the sake of consistency.

- **Configure MongoDB**: Once MongoDB is installed, you'll need to configure it to ensure it meets the requirements of the cart service. This includes adjusting settings such as the database path, port number, and any other necessary configuration parameters. Refer to the MongoDB documentation for guidance on how to configure MongoDB for your specific environment.

- **Create a New Database**: With MongoDB up and running, you'll need to create a new database dedicated to the cart service. Choose an appropriate name (you can use more representable name loke carts-db) for the database and execute the necessary commands to create it. You may need administrative access or specific permissions to create databases, so make sure you have the necessary privileges.

- **Create a User**: To secure the cart service and allow it to access the database, it's recommended to create a dedicated user account with restricted privileges. This user will be used for authentication and authorization purposes when interacting with the database. Follow the MongoDB documentation to create a new user and assign the appropriate roles and permissions to ensure the cart service can perform its required operations. Although this step is completely optional and you can even skip it for the local and development environment databases but it is highly recommended to create the specific user with appropriate rights for production environment database.

- **Update Configuration**: Once the database and user are set up, you'll need to update the cart service's configuration file(s) to include the necessary connection parameters. These parameters typically include the MongoDB URI, the database name, and the credentials for the created user. Refer to the configuration files discussed earlier in the playbook to identify where these parameters should be added. For local and dev environments you can add these configurations in secrets file while in production environment these configurations go as environment variables.

- **Create Collections**: After setting up the MongoDB database for the cart service, the next step is to create the necessary collections within the database. Here are the list of collections that are defined in our code and we have to create these collections before running the service.
```
-   carts
-   orders
-   processed-carts
-   save-later
-   user_order_map
```


By following these steps, you'll have a properly configured MongoDB database ready to be used by the cart service. Make sure to test the connection and ensure that the cart service can successfully establish a connection to the database using the provided credentials. This will help validate the correctness of the setup and ensure the cart service can interact with the database as intended. 

*We donot need to provide any seed values to these collections.*

*Remeber to create 2 different databases for production and development/local environments.*

## Other service dependencies
We are developing our application following the microservice architecture, which means that there are other services running that our services depend on in various ways.

- **Auth Service**: All the backend APIs of the cart services are protected by authentication. This means that if the user's authentication session is not present at the frontend, we cannot access the APIs. Additionally, the user's ID is accessed from the session provided by the auth service. Therefore, it is important to run the auth service before running the carts and orders service. The auth service will run as an independent microservice on port **8000**.

- **Supertokens Core**: To run the auth service and transfer sessions across microservices, the cart service and auth service need to be on the same core. Furthermore, Supertokens Core must be run individually before running the cart service. Supertokens Core will run on port **3567**.

- **Campaign Service**: The most important service that needs to run is the campaign service. In some APIs, we make an API call to the campaign service to fetch the campaign ID using the user ID. This can only happen when the campaign service is up and running. The campaign service will run on port **8002**.

- **User Service**: The user service is also mandatory for the proper functioning of the auth service. Without the user service running on port **8001**, the auth service will not work properly in conjunction with the carts and orders service.

## Deployment
Here's a detailed explanation of the deployment steps for both development and production environments:

### Development Environment Deployment (Using EC2)

- **Prepare the EC2 Instance**: Set up an EC2 instance to host the cart service in the development environment. Ensure that the instance is properly configured with the required dependencies such as Python, FastAPI, and MongoDB. You can launch an instance of **t2-micro** category or higher. Select AMI (Amazon machine image) to be **ubuntu** .

- **Clone the Repository**: Clone the repository containing the cart service code onto the EC2 instance. This can be done using the **git clone** command.

- **Configuration Files**: Copy the relevant configuration files, including **default_application.yaml**, **development_application.yaml**, and **secrets.yaml**, to the appropriate location on the EC2 instance. These files should contain the necessary environment-specific configurations, such as database connection details and sensitive information.

- **Install Dependencies**: Install the project dependencies specified in the **requirements.txt** file using the package manager, such as pip. This ensures that all the required libraries and frameworks are installed on the EC2 instance.

- **Start the Service**: Execute the command **python run.py --env=development** on the EC2 instance to start the cart service in the development environment. This command initializes the service with the specified environment variable and begins listening for incoming requests.

- **Verify the Deployment**: Access the cart service API by navigating to the appropriate URL or endpoint on the EC2 instance. Perform thorough testing and validation to ensure that the service is functioning correctly in the development environment.

### Production Environment Deployment (Using ECS):

- **Build the Docker Image**: Create a Dockerfile for the cart service, specifying the necessary dependencies and configurations. Use the provided Dockerfile template to build the image locally. This includes installing the project dependencies, updating the system packages, and copying the code files.

- **Configure Secrets**: Provide the sensitive environment variables, such as mongo_user_name, mongo_pass_word, mongodb_uri, and supertokens_core_api_key, to the ECS deployment. These variables can be passed as build arguments (ARG) and set as environment variables (ENV) within the Dockerfile. Make sure to securely manage and protect these secrets.

- **Build the Docker Image**: Run the command docker build -t cart-service . to build the Docker image using the Dockerfile. This creates a portable and self-contained package containing the cart service and its dependencies.

- **Push the Docker Image**: Push the built Docker image to a container registry, such as Amazon Elastic Container Registry (ECR), to make it accessible for deployment on ECS. This allows ECS to retrieve the image when creating and scaling containers.

- **Configure ECS Cluster**: Set up an ECS cluster for deploying and managing the cart service. This involves defining the desired compute resources, configuring load balancers, and setting up task definitions that specify the container configuration, environment variables, and other parameters.

- **Deploy the Service**: Deploy the cart service to the ECS cluster by creating a task definition that references the Docker image in the container registry. Define the desired service configuration, such as the number of desired tasks, task placement, and auto-scaling policies. ECS will handle the deployment and ensure that the desired number of containers are running and accessible.

- **Monitor and Scale**: Monitor the deployed cart service using ECS and configure scaling policies based on metrics such as CPU utilization, request rates, or other relevant indicators. This ensures that the service can handle varying workloads and remains performant under load.

- **Test and Validate**: Access the cart service in the production environment by using the assigned URL or endpoint. Perform extensive testing, including functional testing, performance testing, and security testing, to ensure that the service is deployed correctly and meets the required quality standards.

By following these deployment steps, you can successfully deploy the cart service in both the development and production environments, providing a stable and reliable platform for your users. In the development environment, deploying on an EC2 instance allows for quick and straightforward deployment by adding the code and secrets.yaml file to the instance and running the appropriate command.

However, in the production environment, the deployment process is slightly different. By leveraging ECS (Elastic Container Service), you can containerize the cart service using Docker and deploy it to a managed cluster. The Dockerfile provided helps build the Docker image, which includes all the dependencies and configurations required for the cart service to run.


### Production Environment Deployment Using Github Workflow (CI/CD Pipeline):

The alternate way of deployment in the production environment using ECS and GitHub Actions provides a streamlined and automated process for continuous deployment. Let's break down the steps involved:

- The GitHub workflow is triggered whenever there is a push to the develop branch, ensuring that changes are deployed automatically to the production environment.

- The workflow starts by configuring the necessary environment variables, including AWS credentials and the required AWS resources.

- The workflow then logs in to Amazon ECR (Elastic Container Registry) to authenticate and gain access to the private container registry where the Docker images are stored.

- It checks if the ECR repository is empty by listing the images. If the repository is empty, a default semantic version tag is set. Otherwise, it retrieves the latest semantic version tag and increments it to generate a new tag for the Docker image.

- The Docker image is built, tagged with the semantic version, and pushed to the Amazon ECR repository. The build process also includes substituting the environment variables defined in the task definition file with the corresponding values.

- The task definition file is modified using envsubst to replace the environment variables with their actual values. This ensures that the task definition references the correct image and environment configuration.

- Previous running tasks in the ECS cluster are stopped to ensure a clean deployment. The family name of the task definition is extracted from the file, and all running tasks with that family name are stopped.

- The modified task definition is registered in ECS, and a new task is launched using the updated definition. This starts the deployment process in the ECS cluster.

- A wait period is introduced to allow time for the task to start and stabilize.

- The status of the running task is checked. If the task is running successfully, the workflow is considered complete, and the process exits with a success status. Otherwise, the process continues, indicating that the task did not start properly.

- Finally, the workflow checks the completion status and exits. If the task is running successfully, the workflow is considered successful. Otherwise, the workflow indicates a failure.

By automating the deployment process using ECS and GitHub Actions, you can ensure that changes pushed to the develop branch are seamlessly deployed to the production environment. The workflow takes care of building Docker images, registering task definitions, and launching tasks, providing a reliable and consistent deployment pipeline.

*Instead of just specifying the secrets in the workflow file, we uses github secrets because GitHub Secrets provides a more secure approach compared to embedding them directly in the workflow files or code repositories. GitHub Secrets are encrypted and can only be accessed by authorized users and actions during the workflow execution*

## Troubleshooting

When running the Cart Service, you may encounter various issues or errors that need to be addressed. This troubleshooting guide provides steps and solutions to help you diagnose and resolve common problems, ensuring smooth operation and functionality of the Cart Service.

- **Check Logs**: Review the logs of the cart service to identify any error messages or warnings. Logs can provide valuable insights into the cause of issues. Use commands like docker logs to access the service logs.

- **Validate Service Dependencies**: Ensure that the cart service's dependencies, such as databases or external services, are running and accessible. Check the connection settings and credentials used by the cart service to interact with these dependencies.

- **Test Connectivity**: Verify the network connectivity between the cart service and its dependencies. Use tools like **ping** or **telnet** to check if the cart service can establish connections with other services or resources.

- **Inspect Configuration**: Double-check the configuration settings for the cart service. Look for any misconfigurations or incorrect values that could be causing issues. Pay attention to environment variables, configuration files, and any dynamic configuration sources.

- **Check Resource Utilization**: Monitor the resource utilization of the server or container running the cart service. High CPU or memory usage can lead to performance problems or crashes. Use monitoring tools or commands like top or docker stats to assess resource consumption.

- **Validate Data Inputs**: Verify that the data inputs received by the cart service are valid and as expected. Incorrect or malformed data can cause errors or unexpected behavior. Validate the data format, data types, and any constraints defined by the cart service.

- **Review Code Changes**: If the issue started after a code change or deployment, review the recent code changes. Look for any potential bugs, regressions, or compatibility issues introduced in the latest version. Use version control tools or code diffing techniques to inspect the changes.

- **Rollback Deployments**: If the issue occurred after a recent deployment, consider rolling back to a previous stable version of the cart service. This can help isolate the problem and restore functionality while investigating the root cause.

- **Test in Isolation**: Test the cart service in isolation from other components or services. By isolating the service, you can identify whether the issue is specific to the cart service or if it's caused by interactions with other services.

## Security

In order to ensure the security and proper functioning of the Cart Service, certain security measures need to be implemented. Two important aspects of security configuration include CORS (Cross-Origin Resource Sharing) policy and Security Group rules.

- **CORS Policy**: Cross-Origin Resource Sharing (CORS) is a security mechanism that allows restricted resources on a web page to be requested from another domain outside the domain from which the resource originated. It is essential to configure CORS policy correctly to control and restrict cross-origin requests to the Cart Service. By defining the allowed origins, methods, headers, and other parameters, CORS policy helps prevent unauthorized access and protect against cross-site scripting attacks. for our cart service in cors policy we will add the list of allowed origins. In case of local testing allowed origin will be http://localhost:3000 , For development the allowed origin will be http://app.dev.ikarusnest.org:3000 and for production it will be just https://ikarusnest.com. If we don't want to specify the host names as domain name then we can also use their ip addresses.

- **Security Group Rules**: Security groups are virtual firewalls that control inbound and outbound traffic for instances in a specific network. To enhance the security of the Cart Service, it is crucial to define appropriate inbound and outbound rules in the security group associated with the server or container hosting the service. Inbound rules control the incoming traffic to the Cart Service, specifying allowed protocols, ports, and IP ranges, while outbound rules regulate the outgoing traffic, determining destinations and permitted protocols. 
    
    - Inbound Rule for Port 8004:

        Allow inbound traffic on port 8004 to ensure access to your service.
            Protocol: TCP Port Range: 8004
            Source: 0.0.0.0/0 (Allow all traffic)
            
    - Inbound Rule for Port 22 (SSH):

        Allow inbound traffic on port 22 only for specific IP addresses that need SSH access.
        Protocol: TCP Port Range: 22
        Source: <IP addresses of authorized users>

    These security group rules help restrict access to your Cart Service and ensure that only authorized traffic is allowed. Please note that it's important to replace <IP addresses of authorized users> with the actual IP addresses or IP ranges of the users who require SSH access. This helps prevent unauthorized SSH connections and strengthens the security of your system. 

These security measures are necessary to safeguard the Cart Service from unauthorized access, malicious attacks, and potential vulnerabilities. By implementing a robust CORS policy and configuring the security group rules effectively, you can ensure that only legitimate requests are allowed, mitigating risks and maintaining the integrity and confidentiality of the data processed by the Cart Service.
