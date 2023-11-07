from fastapi import FastAPI
from config import read_yaml
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from routes import fcm_device_router
from routes import fcm_web_push_router
from config.read_yaml import config_yaml as con
from routes import brevo_email_router
import nest_asyncio
from routes import admin_panel_router
nest_asyncio.apply()
from supertokens_python import SupertokensConfig
from supertokens_python import get_all_cors_headers
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from supertokens_python.framework.fastapi import get_middleware
from supertokens_python import init, InputAppInfo
from supertokens_python.recipe import session
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
import time
from typing import List
from fastapi.requests import Request
from fastapi.responses import JSONResponse
from supertokens_python import init, InputAppInfo, SupertokensConfig
from supertokens_python.recipe import session
from logger.logging import get_db_action_Logger
from supertokens_python.recipe.session.asyncio import get_session
from supertokens_python.framework.fastapi import get_middleware
from supertokens_python.recipe.session.exceptions import (
    UnauthorisedError,
    TokenTheftError,
    TryRefreshTokenError,
)
from supertokens_python.recipe import jwt as jwt_recipe
from jose import jwt
from jose.exceptions import JWTError
from fastapi import HTTPException
from utils.utils import get_key, get_token_from_request_headers,get_unique_ikarus_request_id,get_unique_ikarus_guest_id

from typing import List

from config import read_yaml
logger = get_db_action_Logger(__name__)

app = FastAPI()

init(
        app_info=InputAppInfo(
        app_name=con.auth["app_name"],
        api_domain= read_yaml.AUTH_DOMAIN,
        website_domain=read_yaml.WEBSITE_DOMAIN,
        api_base_path=con.auth["api_base_path"],
        website_base_path=con.auth["website_base_path"]),

        supertokens_config=SupertokensConfig(
        connection_uri= con.auth["supertokens_core_uri"] ,
        api_key=con.auth["user_management_dashboard_api_key"]),
        framework=con.auth["auth-framework"],
        recipe_list=[session.init(),jwt_recipe.init()],
        mode=con.auth["auth-mode"]  

    )


app.client = MongoClient(con.mongodb["mongodb_uri"])
app.database = app.client[con.mongodb["user_name"]]

app.add_middleware(get_middleware())
app.add_middleware(
    CORSMiddleware,
    allow_origins=con.cors["allowed_origins"],
    allow_credentials=True,
    allow_methods=con.cors["allowed_methods"],
    allow_headers=con.cors["allowed_headers"] + get_all_cors_headers(),
)

class State:
    def __init__(self):
        self.user_id = None
        self.session = None
        self.auth_call = None
        self.x_request_id = None

excluded_paths = read_yaml.EXCLUDED_APIS

def is_excluded_path(path: str, method: str, excluded_paths: List[dict]) -> bool:
    for excluded in excluded_paths:
        excluded_path = excluded["path"]
        if method != excluded["method"]:
            continue

        if "{" in excluded_path and "}" in excluded_path:
            path_parts = path.split("/")
            excluded_parts = excluded_path.split("/")
            if len(path_parts) == len(excluded_parts):
                match = True
                for part, excluded_part in zip(path_parts, excluded_parts):
                    if excluded_part and (
                        excluded_part[0] != "{" or excluded_part[-1] != "}"
                    ):
                        if part != excluded_part:
                            match = False
                            break
                if match:
                    return True
        elif path == excluded_path:
            return True

    return False

@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    start_time = time.time()
    logger.debug(f"Request {request.method} {request.url.path} started at {start_time}")

    response = await call_next(request)

    end_time = time.time()
    elapsed_time = end_time - start_time
    logger.debug(
        f"Request {request.method} {request.url.path} ,finished at {end_time}, elapsed time: {elapsed_time:.2f} seconds"
    )
    logger.debug(f" {response} started at {start_time}")
    return response

@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    logger.debug(f"Checking for microservice to microservice auth")
    if (
        request.url.path.startswith("/openapi.json")
        or request.url.path.startswith("/favicon.ico")
        or request.url.path.startswith("/docs")
    ):
        response = await call_next(request)
        return response
    # Options is for Preflight requests method

    elif request.method == "OPTIONS" or is_excluded_path(
        request.url.path, request.method, excluded_paths
    ):
        response = await call_next(request)
        return response
    
                                                               
    await authenticate_request(request)
    response = await call_next(request)
    return response


@app.middleware("http")
async def session_middleware(request: Request, call_next):
    logger.debug("Checking for session Auth")

    if (
        request.url.path.startswith("/openapi.json")
        or request.url.path.startswith("/favicon.ico")
        or request.url.path.startswith("/docs")
    ):
        response = await call_next(request)
        return response
    # Options is for Prefloght requests method

    elif request.method == "OPTIONS" or is_excluded_path(
        request.url.path, request.method, excluded_paths
    ):
        response = await call_next(request)
        return response

    if not hasattr(request, "state"):
        request.state = State()

    try:
        session = await get_session(request)

    except UnauthorisedError:

        if request.headers.get('Authorization'):
            logger.debug("Authoization header found")
            request.state.auth_call = "microservice_to_microservice"
            response = await call_next(request)
            return response

        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"detail": "Session not found"},
        )
    except TokenTheftError:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"detail": "token theft detected"},
        )
    except TryRefreshTokenError:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"detail": "Refresh Token Expired"},
        )

    userId = session.get_user_id()

    request.state.user_id = userId
    request.state.session = session
    request.state.auth_call = "user_to_microservice"
    logger.debug("Auth type: User to microservice")
    response = await call_next(request)
    return response


async def authenticate_request(request:Request):
    if request.state.auth_call == "user_to_microservice":
        logger.debug("Auth Type: user to microservice")
        return
    
    logger.debug("Auth Type: microservice to microservice")
    jwt_token = get_token_from_request_headers(request)

    try:
        header = jwt.get_unverified_header(jwt_token)
    except Exception as e:
        logger.error(e)
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"detail": "Unable to get headers from Token"},
        )
    

    rsa_key = await get_key(header)

    try:
        payload = jwt.decode(jwt_token, rsa_key, algorithms=['RS256'])
        request.state.user_id = payload.get("userId",None)
        request.state.session = payload.get("session",None)
        
    except JWTError as e:
        print("Invalid Token")
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"detail": "Invalid Token"},
        )  
    else:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"detail": "Unauthorized"},
        )

@app.middleware("http")
async def set_request_id(request: Request, call_next):
    x_request_id = request.headers.get("X-ikarus-nest-request-id")
    

    if x_request_id is None:
        x_request_id = get_unique_ikarus_request_id()

    logger.info(f"Request ID: {x_request_id}")

    request.state.x_request_id = x_request_id  # Storing the ID in request state
    response = await call_next(request)
    return response


app.include_router(brevo_email_router.router)
app.include_router(fcm_web_push_router.router)
app.include_router(fcm_device_router.router)
app.include_router(admin_panel_router.router)
