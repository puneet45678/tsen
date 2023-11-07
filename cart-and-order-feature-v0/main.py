import nest_asyncio
nest_asyncio.apply()
from supertokens_python import SupertokensConfig
from supertokens_python import get_all_cors_headers
from fastapi import FastAPI
from fastapi.requests import Request
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
from supertokens_python.framework.fastapi import get_middleware
from routes import cart, save_for_later, orders, wishlist
from supertokens_python import init, InputAppInfo
from supertokens_python.recipe import session
from config import read_yaml
from logger.logging import get_logger
from supertokens_python.recipe.session.asyncio import get_session
from supertokens_python.framework.fastapi import get_middleware
from supertokens_python.recipe.session.exceptions import (
    UnauthorisedError,
    TokenTheftError,
    TryRefreshTokenError,
)
from config import read_yaml
from typing import List
from fastapi import status
from apscheduler.schedulers.background import BackgroundScheduler
from controllers.cart_controllers import send_abandoned_cart_email
from logger.logging import get_logger
logger = get_logger(__name__)
from supertokens_python.recipe import jwt as jwt_recipe
from jose import jwt
from jose.exceptions import JWTError
from fastapi import HTTPException
from utils.utils import get_key, get_token_from_request_headers
import time
from typing import List

logger = get_logger(__name__)

app = FastAPI()

@app.on_event("startup")
async def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(send_abandoned_cart_email, 'interval', hours=100)
    scheduler.start()

init(
        app_info=InputAppInfo(
        app_name=read_yaml.app_name,
        api_domain=read_yaml.api_domain,
        website_domain=read_yaml.website_domain,
        api_base_path=read_yaml.api_base_path,
        website_base_path=read_yaml.api_base_path),

        supertokens_config=SupertokensConfig(
        connection_uri= read_yaml.supertokens_core_uri,
        api_key=read_yaml.supertokens_core_api_key),
        framework='fastapi',
        recipe_list=[session.init(),jwt_recipe.init()],
        mode='asgi'  

    )
app = FastAPI(title=read_yaml.app_name)

app.add_middleware(get_middleware())
app.add_middleware(
    CORSMiddleware,
    allow_origins=[read_yaml.website_domain],
    allow_credentials=True,
    allow_methods=["GET", "PUT", "POST", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Content-Type"] + get_all_cors_headers(),
)

class State:
    def __init__(self):
        self.x_request_id=None
        self.user_id = None
        self.session = None
        self.auth_call = None


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
    logger.debug(f"Request {request.method} {request.url.path} started at {start_time} with request id {request.state.x_request_id}")

    response = await call_next(request)

    end_time = time.time()
    elapsed_time = end_time - start_time
    logger.debug(f"Request {request.method} {request.url.path} finished at {end_time}, elapsed time: {elapsed_time:.2f} seconds with request id {request.state.x_request_id}")

    return response

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    if request.method != "OPTIONS":
        logger.info(f"Time to execute the api {request.method} {request.url} is {process_time*1000} ms")
    print()
    return response



@app.middleware("http")
async def auth_middleware(request: Request, call_next):

    if (
        request.url.path.startswith("/openapi.json")
        or request.url.path.startswith("/favicon.ico")
        or request.url.path.startswith("/docs")
        or request.url.path.startswith("/auth")
    ):
        response = await call_next(request)
        return response
    # Options is for Preflight requests method

    elif request.method == "OPTIONS" or is_excluded_path(
        request.url.path, request.method, excluded_paths
    ):
        response = await call_next(request)
        return response

    logger.debug(f"Checking for microservice to microservice auth")
    await authenticate_request(request)
    response = await call_next(request)
    return response


@app.middleware("http")
async def session_middleware(request: Request, call_next):
    

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
        logger.debug("Checking for session Auth")
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
    
from utils import utils
@app.middleware("http")
async def set_request_id(request: Request, call_next):
    x_request_id = request.headers.get("X-ikarus-nest-request-id")
    

    if x_request_id is None:
        x_request_id = utils.get_unique_ikarus_request_id()

    logger.info(f"Request ID: {x_request_id}")

    request.state.x_request_id = x_request_id  # Storing the ID in request state
    response = await call_next(request)
    return response



app.include_router(cart.router)
app.include_router(save_for_later.router)
app.include_router(orders.router)
app.include_router(wishlist.router)
