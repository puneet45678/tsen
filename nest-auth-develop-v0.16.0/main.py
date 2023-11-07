import nest_asyncio
nest_asyncio.apply()
from supertokens_python import get_all_cors_headers
from fastapi import FastAPI,Request, BackgroundTasks
from starlette.middleware.cors import CORSMiddleware
from supertokens_python.framework.fastapi import get_middleware
from routes import authentication, authorization
from supertokens_python import init, InputAppInfo
from config import read_yaml,supertokens_config
from services import middleware_services,roles_permissions_services,jwt_services
import time
from services import middleware_services,roles_permissions_services,jwt_services
from supertokens_python.recipe.session.asyncio import get_session
from supertokens_python.recipe.session.exceptions import (
    UnauthorisedError,
    TokenTheftError,
    TryRefreshTokenError,
    InvalidClaimsError,
    ClaimValidationError

)
from supertokens_python.recipe.emailverification import EmailVerificationClaim
from supertokens_python.recipe.session import SessionContainer
from config.read_yaml import responses
import httpx
from fastapi.responses import JSONResponse,PlainTextResponse
from fastapi import status
from starlette.responses import Response
from starlette.middleware.base import BaseHTTPMiddleware
from logger.logging import get_logger
from typing import List 

logger = get_logger(__name__)

from jose import jwt
from jose.exceptions import JWTError
from fastapi import HTTPException
from utils.utils import get_key, get_token_from_request_headers
import uuid
from utils import utils
from utils.utils import cache

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from routes.authentication import limiter
# or use this decorator above the funvtion whose response we wants to cache @cached(cache ={}) 

init(
    app_info=supertokens_config.APP_INFO,
    supertokens_config=supertokens_config.supertokens_config,
    framework='fastapi',
    recipe_list=supertokens_config.recipe_list,
    mode='asgi'   # use wsgi if you are running using gunicorn
)

app = FastAPI(title=read_yaml.app_name)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)




app.add_middleware(get_middleware())
app.add_middleware(
    CORSMiddleware,
    allow_origins=read_yaml.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "PUT", "POST", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Content-Type"] + get_all_cors_headers(),
)



@app.on_event("startup")
async def check_roles_permissions():
    await roles_permissions_services.define_startup_roles()
    


    
class State:
    def __init__(self):
        self.user_id = None
        self.session = None
        self.auth_call = None
        self.x_request_id= None


excluded_paths = read_yaml.EXCLUDED_APIS
email_verification_excluded_path = read_yaml.EMAIL_VERIFICATION_EXCLUDED_APIS


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
async def delete_middleware(request: Request, call_next):
    try:
        res = await middleware_services.delete_user_using_dashboard(request)
    
    except Exception as e:
        logger.error(e)
        if str(e) == "Unauthorized":
            return JSONResponse(
                status_code= responses.UNAUTHORIZED.CODE,
                content={"detail": responses.UNAUTHORIZED.MESSAGE},
            )
        elif str(e) == "User service url not found":
            return JSONResponse(
                status_code=responses.INTERNAL_SERVER_ERROR.CODE,
                content={"detail": responses.INTERNAL_SERVER_ERROR.MESSAGE},
            )
        elif str(e) == "Internal server error":
            return JSONResponse(
                status_code=responses.INTERNAL_SERVER_ERROR.CODE,
                content={"detail": responses.INTERNAL_SERVER_ERROR.MESSAGE},
            )
        else:
            return JSONResponse(
                status_code=responses.INTERNAL_SERVER_ERROR.CODE,
                content={"detail": responses.INTERNAL_SERVER_ERROR.MESSAGE},
            )


    return await call_next(request)





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




# @app.middleware("http")
# async def auth_middleware(request: Request, call_next):

#     if (
#         request.url.path.startswith("/openapi.json")
#         or request.url.path.startswith("/favicon.ico")
#         or request.url.path.startswith("/docs")
#         or request.url.path.startswith("/auth")
#     ):
#         response = await call_next(request)
#         return response
#     # Options is for Preflight requests method

#     elif request.method == "OPTIONS" or is_excluded_path(
#         request.url.path, request.method, excluded_paths
#     ):
#         response = await call_next(request)
#         return response

#     logger.debug(f"Checking for microservice to microservice auth")
#     await authenticate_request(request)
#     response = await call_next(request)
#     return response


@app.middleware("http")
async def check_for_offline_request(request: Request, call_next):
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
    if request.state.auth_call == "user_to_microservice":
        session = request.state.session
        session_handle = session.get_handle()
        force_refreshed_handles = cache.get("force_refreshed_handles") or []
        if session_handle in force_refreshed_handles:
            logger.debug("Forcing the session refresh for the user's session")
            cache["force_refreshed_handles"].remove(session_handle)
            return JSONResponse(
                status_code=responses.REFRESH_TOKEN_EXPIRED.CODE,
                content={"detail": responses.REFRESH_TOKEN_EXPIRED.MESSAGE},
            )
    response = await call_next(request)
    return response


@app.middleware("http")
async def session_middleware(request: Request, call_next):
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

    if not hasattr(request, "state"):
        request.state = State()

    logger.debug("Checking for session Auth")
    try:
        if is_excluded_path(request.url.path, request.method, email_verification_excluded_path):
            logger.debug("Email verification excluded path")
            session: SessionContainer = await get_session(request, 
                                                          override_global_claim_validators= lambda global_validators, session, user_context: [validators for validators in global_validators if validators.id != EmailVerificationClaim.key])
        
        else:
            session: SessionContainer = await get_session(request)

    except UnauthorisedError:

        if request.headers.get('Authorization'):
            logger.debug("Authorization header found")
            request.state.auth_call = "microservice_to_microservice"
            await authenticate_request(request)
            response = await call_next(request)
            return response

        return JSONResponse(
            status_code=responses.UNAUTHORIZED.CODE,
            content={"detail": responses.UNAUTHORIZED.MESSAGE},
        )
    
    except TokenTheftError:
        return JSONResponse(
            status_code= responses.TOKEN_THEFT_DETECTED.CODE,
            content={"detail": responses.TOKEN_THEFT_DETECTED.MESSAGE},
        )
    except TryRefreshTokenError:
        return JSONResponse(
            status_code=responses.REFRESH_TOKEN_EXPIRED.CODE,
            content={"detail": responses.REFRESH_TOKEN_EXPIRED.MESSAGE},
        )
    
    except InvalidClaimsError as error:
        errors = [ClaimValidation.to_json() for ClaimValidation in error.payload ]
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"detail":{"Invalid Claims": errors}},
        )
    
    except Exception as e:
        logger.error(e)
        return JSONResponse(
            status_code=responses.INTERNAL_SERVER_ERROR.CODE,
            content={"detail": responses.INTERNAL_SERVER_ERROR.MESSAGE},
        )


    userId = session.get_user_id()
    request.state.user_id = userId
    request.state.session = session
    request.state.auth_call = "user_to_microservice"
    logger.debug("Auth type: User to microservice")
    response = await call_next(request)
    return response


async def authenticate_request(request:Request):
    # if request.state.auth_call == "user_to_microservice":
    #     return
    
    logger.debug("Auth Type: microservice to microservice")
    jwt_token = get_token_from_request_headers(request)

    try:
        header = jwt.get_unverified_header(jwt_token)
    except Exception as e:
        logger.error(e)
        return JSONResponse(
            status_code=responses.HEADERS_NOT_FOUND_FROM_TOKEN,
            content={"detail": responses.HEADERS_NOT_FOUND_FROM_TOKEN_MESSAGE},
        )
    

    rsa_key = await get_key(header)

    try:
        payload = jwt.decode(jwt_token, rsa_key, algorithms=['RS256'])
        request.state.user_id = payload.get("userId",None)
        request.state.session = payload.get("session",None)
        
    except JWTError as e:
        print("Invalid Token")
        return JSONResponse(
            status_code=responses.INVALID_TOKEN.CODE,
            content={"detail": responses.INVALID_TOKEN.MESSAGE},
        )  
    else:
        return JSONResponse(
            status_code=responses.UNAUTHORIZED.CODE,
            content={"detail": responses.UNAUTHORIZED.MESSAGE},
        )



# #TODO: Add thi middleware function to the nest app. This cookie will not be created from fastapi backend
# @app.middleware("http")
# async def add_guest_session_cookie(request: Request, call_next):
#     logger.debug("Checking if access cookie is present")
#     access_cookie = request.cookies.get("sAccessToken",None)
#     guest_cookie = request.cookies.get("st-guest-session",None)
    
#     if not access_cookie:
#         if not guest_cookie:
#             payload = {
#                 "guest_id": utils.get_unique_ikarus_guest_id()
#             }
#             print("Adding_guest_session_cookie")
#             response = await call_next(request)
#             response.set_cookie(key="st-guest-session",value=await jwt_services.create_jwt(payload))
#         else:
#             response = await call_next(request)
#     else:
#         response = await call_next(request)
#         if guest_cookie:
#             response.delete_cookie(key="st-guest-session")
#         else:
#             logger.debug("No guest session available")
#     return response




@app.middleware("http")
async def set_request_id(request: Request, call_next):
    x_request_id = request.headers.get("X-ikarus-nest-request-id")
    

    if x_request_id is None:
        x_request_id = utils.get_unique_ikarus_request_id()

    logger.info(f"Request ID: {x_request_id}")

    request.state.x_request_id = x_request_id  # Storing the ID in request state
    response = await call_next(request)
    return response



app.include_router(authentication.router)
app.include_router(authorization.router)
