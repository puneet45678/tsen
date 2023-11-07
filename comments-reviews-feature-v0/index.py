from fastapi import FastAPI , APIRouter , HTTPException 
import re
from starlette.responses import Response, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from routes import comments, reviews_ratings
from pymongo import MongoClient
from config.read_yaml import config
from typing import List
from fastapi import FastAPI 
from supertokens_python import SupertokensConfig ,supertokens
from supertokens_python.recipe import thirdpartyemailpassword, session , dashboard , usermetadata , userroles
from starlette.middleware.cors import CORSMiddleware
from supertokens_python import init, InputAppInfo 
import argparse , uvicorn
from supertokens_python.recipe.session.asyncio import get_session
from fastapi.requests import Request
from fastapi import status
from logger.logging import getLogger
import time
from supertokens_python.recipe.session.exceptions import (
    UnauthorisedError , TokenTheftError , TryRefreshTokenError
    
)
from scheduler.scheduler import scheduler , site 
from commentReviewsDb.dbclient import client
from jose import jwt
from jose.exceptions import JWTError
from supertokens_python.recipe import jwt as jwt_recipe
from utils.utils import get_key, get_token_from_request_headers
from utils import utils
logger= getLogger(__name__)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.cors["allowed_origins"],
    allow_credentials=True,
    allow_methods=config.cors["allowed_methods"],
    allow_headers=config.cors["allowed_headers"],
)

supertokens_config = SupertokensConfig(
    connection_uri=config.supertokens["connection_uri"],
    api_key=config.supertokens["api_key"],
)

init(
    app_info=InputAppInfo(
        app_name=config.auth["app_name"],
        api_domain=config.auth["api_domain"],
        website_domain=config.auth["website_domain"],
        api_base_path=config.auth["api_base_path"],
        website_base_path=config.auth["api_base_path"],
    ),
    supertokens_config=supertokens_config,
    framework="fastapi",
    recipe_list=[session.init(),jwt_recipe.init()],
    mode="asgi",
)

print("allow_origins", config.cors["allowed_origins"])
print("api_domain", config.auth["api_domain"])
print("website_domain", config.auth["website_domain"])


class State:
    def __init__(self):
        self.user_id = None
        self.session = None
        self.auth_call = None
        self.x_request_id = None

excluded_paths = config.excluded_apis


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


@app.on_event("startup")
async def startup():
    site.mount_app(app)
    scheduler.start()
    print("start")


@app.on_event("shutdown")
async def shutdown_scheduler():
    print("stop the client ")
    scheduler.shutdown()
    client.close()


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
        print("Endpoint in excluded path")
        request.state.user_id = "GUEST_USER"
        response = await call_next(request)
        return response

    if not hasattr(request, "state"):
        request.state = State()

    try:
        session = await get_session(request)

    except UnauthorisedError:
        if request.headers.get("Authorization"):
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


async def authenticate_request(request: Request):
    if request.state.auth_call == "user_to_microservice":
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
        payload = jwt.decode(jwt_token, rsa_key, algorithms=["RS256"])
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
        x_request_id = utils.get_unique_ikarus_request_id()
    logger.info(f"Request ID: {x_request_id}")
    request.state.x_request_id = x_request_id  # Storing the ID in request state
    response = await call_next(request)
    return response

app.include_router(comments.router)
app.include_router(reviews_ratings.router)





