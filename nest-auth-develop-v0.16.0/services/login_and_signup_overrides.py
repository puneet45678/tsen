from fastapi.responses import Response
from fastapi import HTTPException, Request
from supertokens_python.recipe.emailpassword.interfaces import APIInterface
import jwt
from config import read_yaml

from supertokens_python.recipe.thirdpartyemailpassword.interfaces import APIInterface, ThirdPartyAPIOptions, \
    EmailPasswordAPIOptions, ThirdPartySignInUpPostOkResult, EmailPasswordSignInPostOkResult, \
    EmailPasswordSignUpPostOkResult, EmailPasswordSignUpOkResult, EmailPasswordSignUpEmailAlreadyExistsError, EmailPasswordSignInPostWrongCredentialsError, \
    ThirdPartySignInUpOkResult, RecipeInterface, EmailPasswordSignInOkResult

from supertokens_python.recipe.thirdparty.provider import Provider,RedirectUriInfo
from supertokens_python.recipe.usermetadata.asyncio import update_user_metadata,get_user_metadata
from supertokens_python.recipe.emailpassword.types import FormField
from supertokens_python.recipe.thirdparty.types import RawUserInfoFromProvider
from typing import List, Union
from services import supertokens_auth_services, routes_db_services, roles_permissions_services, jwt_services
from supertokens_python.asyncio import create_user_id_mapping
from supertokens_python.recipe.thirdpartyemailpassword.asyncio import get_users_by_email
from db.models.User import User
from typing import Dict, Any
from supertokens_python.types import GeneralErrorResponse
from supertokens_python.recipe.dashboard.interfaces import UserPutAPIEmailAlreadyExistsErrorResponse
from supertokens_python.asyncio import delete_user
from typing import Optional
import httpx
from logger.logging import get_logger
from supertokens_python.recipe.thirdpartyemailpassword.asyncio import get_user_by_id
from supertokens_python.recipe.session.asyncio import get_all_session_handles_for_user, update_session_data_in_database, get_session_information
from config.read_yaml import responses

logger = get_logger(__name__)


def send_custom_response(error:str,
                         api_options:ThirdPartyAPIOptions,
                         message:str,
                         status_code: int,
                         hateoas_url:str = None) ->GeneralErrorResponse:
    
    api_options.response.set_status_code(status_code)

    if hateoas_url is not None:
        api_options.response.set_json_content({"message": message, "hateoasUrl": hateoas_url})
    else:
        api_options.response.set_json_content({"message": message})

    #This return statement doesnot have any effect on the response this is just for the reason because function signagure is expecting this return type
    #This return statement is just to avoid the error , the return type can be union of GeneralErrorResponse, EmailPasswordSignInPostOkResult, EmailPasswordSignInPostWrongCredentialsError)

    return GeneralErrorResponse(f"{error}")




def override_thirdpartyemailpassword_functions(original_implementation: RecipeInterface):
    original_sign_in_up = original_implementation.thirdparty_sign_in_up
    original_emailpassword_sign_up = original_implementation.emailpassword_sign_up
    original_emailpassword_sign_in = original_implementation.emailpassword_sign_in

    async def thirdparty_sign_in_up(
            third_party_id: str,
            third_party_user_id: str,
            email: str,
            oauth_tokens: Dict[str, Any],
            raw_user_info_from_provider: RawUserInfoFromProvider,
            tenant_id: str,
            user_context: Dict[str, Any]
    ):
        print("Thirdparty_Signinup")
                
        try:
            request = user_context["_default"]["request"].request
            x_request_id = request.state.x_request_id
            print("x_request_id", x_request_id)        
        except Exception as e:
            logger.error(str(e))
            raise Exception("Failed to get x_request_id")
            

        existing_users = await get_users_by_email(tenant_id,email,user_context)
        

        if (len(existing_users) == 0):
            # this means this email is new so we allow sign up
            result = await original_sign_in_up(third_party_id, third_party_user_id, email, oauth_tokens, raw_user_info_from_provider,tenant_id,user_context)
            if isinstance(result, ThirdPartySignInUpOkResult):

                newUser = User(result.user.user_id,
                               result.user.email, result.user.time_joined)
                uid = result.user.user_id
                
                if result.created_new_user:
                    user_context["_default"]["is_new_user"]= True

                    # print("New user signed Up", result.user.email)
                    logger.info(f"New User with Email {newUser.email} signed up")
                            
                    try:
                        response = await routes_db_services.add_user_to_external_db(newUser, x_request_id)
                    
                    except Exception as e:
                        logger.error(str(e))
                        await delete_user(newUser.userid)
                        logger.info(f"User {newUser.email} is deleted from database ")
                        logger.debug(f"User {newUser.email} is deleted")
                        raise Exception("Failed to add user to user db")
                    

                    user_id = response["userId"]
                    # print("Added to database")
                    logger.debug(
                        f"User {result.user.email} added to to mongoDb Database")
                    result.user.user_id = user_id

                    try:
                        await create_user_id_mapping(uid, user_id, force=True)
                    
                    except Exception as e:
                        logger.error(f"Failed to create user mapping. Error: {e}")
                        logger.info(f"Deleting user {newUser.email} from database")
                        await delete_user(newUser.userid)

                        try: 
                            await routes_db_services.remove_user_from_external_db(user_id,x_request_id)
                        
                        except Exception as e:
                            logger.error(str(e))
                            logger.debug(f"User {newUser.email} can't be deleted")
                        
                        logger.info(f"User {newUser.email} is deleted from user database ")

                        logger.debug(f"User {newUser.email} is deleted because Mapping can't be created")
                        raise Exception("Failed to create user mapping")


        
                    logger.debug(
                        f"UserId {uid} mapped with mongoId {user_id}")
                    
                    try:
                        full_name = await supertokens_auth_services.get_full_name_from_thirdpary_response(user_id, result)
                        user_context["_default"]["user_info"] = {"full_name":full_name}

                    except Exception as e:
                        logger.error(str(e))
                        logger.debug(f"Failed to get first and last name from thirdparty response")        
                        raise Exception("Failed to get thirdparty response")
                    

                    logger.info("Adding Initial roles")


                    try:
                        await roles_permissions_services.add_authorized_3DP_user_role(user_id, result.user.email,tenant_id)
                    
                    except Exception as e:
                        logger.error(f"Failed to add role. Error: {e}")
                        logger.info(f"Deleting user {newUser.email} from database")
                        raise Exception("Failed to add initial roles")
                    
                    logger.info("Initial Startup Roles added successfully")
                    
                return result
        
        else:
            user_context["_default"]["is_new_user"]= False
            existing_user_id = existing_users[0].user_id

            if existing_users[0].third_party_info is None:
                # this means that the user is trying to sign in with thirdparty but the email already exists in custom method
                logger.error(f"Cannot sign in using {email} email already exists using custom method")
                raise Exception("Email already exists using custom method")

            else:
                suspended_check_resonse_from_user_service = await routes_db_services.check_for_suspendend_user(x_request_id,existing_user_id)
                if suspended_check_resonse_from_user_service["canLogin"] == False:
                    logger.error(f"User {email} is suspended")
                    raise Exception("User is suspended")
            

        for user in existing_users:
            if user.third_party_info is not None:
                if user.third_party_info.id == third_party_id and user.third_party_info.user_id == third_party_user_id:
                    # this means we are trying to sign in with the same social login. So we allow it
                    return await original_sign_in_up(third_party_id, third_party_user_id, email, oauth_tokens, raw_user_info_from_provider,tenant_id,user_context)

        logger.error(f"Cannot sign up using {email} email already exists")
        raise Exception("Email already exists")


    async def emailpassword_sign_up(
        email: str,
        password: str,
        tenant_id: str,
        user_context: Dict[str, Any]
    ):
        
        logger.debug("Email Signup api called")
        existing_users = await get_users_by_email(tenant_id,email, user_context)
        logger.debug(f"Email {email}")
        logger.debug(f"Existing Users {existing_users}")
        
        if (len(existing_users) == 0):

            result = await original_emailpassword_sign_up(email, password, tenant_id, user_context)

            if isinstance(result, EmailPasswordSignUpOkResult):
                uid = result.user.user_id
                newUser = User(uid, result.user.email, result.user.time_joined)
                logger.info(f"New User with Email {newUser.email} signed up")
                
                try:
                    request = user_context["_default"]["request"].request
                    x_request_id = request.state.x_request_id
                    print("x_request_id", x_request_id)
                
                except Exception as e:
                    logger.error(str(e))
                    raise Exception("Failed to get x_request_id")
                        
                try:
                    response = await routes_db_services.add_user_to_external_db(newUser, x_request_id)
                
                except Exception as e:
                    logger.error(str(e))
                    await delete_user(newUser.userid)
                    logger.info(f"User {newUser.email} is deleted from database ")
                    logger.debug(f"User {newUser.email} is deleted")
                    raise Exception("Failed to add user to user db")
                

                user_id = response["userId"]
        
                logger.debug(
                    f"User {result.user.email} added to to mongoDb Database")
                
                result.user.user_id = user_id

                try:
                    await create_user_id_mapping(uid, user_id, force=False)
                
                except Exception as e:
                    logger.error(f"Failed to create user mapping. Error: {e}")
                    logger.info(f"Deleting user {newUser.email} from database")
                    await delete_user(newUser.userid)

                    try: 
                        await routes_db_services.remove_user_from_external_db(user_id,x_request_id)
                    
                    except Exception as e:
                        logger.error(str(e))
                        logger.debug(f"User {newUser.email} is deleted")
                        
                    logger.info(f"User {newUser.email} is deleted from user database ")
                    
                    logger.debug( f"User {newUser.email} is deleted because Mapping can't be created")
                    raise Exception("Failed to create user mapping")

                
                logger.debug(
                    f"UserId {uid} mapped with mongoId {user_id}")
                logger.info("Adding Initial roles")

                try:
                    await roles_permissions_services.add_role(user_id,"Guest",tenant_id)
          
                except Exception as e:
                    logger.error(f"Failed to add role. Error: {e}")
                    logger.info(f"Deleting user {newUser.email} from database")
                    raise Exception("Failed to add initial roles")

                return result
            return result

        
        elif existing_users[0].third_party_info is not None:
            logger.error(f"Cannot sign up using {email} email already exists")
            raise Exception("Email already exists using thirdparty")

        logger.error(f"Cannot sign up using {email} email already exists")
        raise Exception("Email already exists")
    

    async def emailpassword_sign_in(email: str,
                                    password: str,
                                    tenant_id: str, 
                                    user_context: Dict[str, Any]):
        
        print("Email Signin api called")
        result = await original_emailpassword_sign_in(email, password, tenant_id, user_context)
        if isinstance(result, EmailPasswordSignInOkResult):
            user_id = result.user.user_id

            if "_default" not in user_context:
                return result

            request = user_context["_default"]["request"].request
            x_request_id = request.state.x_request_id
            print("x_request_id", x_request_id)

            try:
                suspended_check_resonse_from_user_service = await routes_db_services.check_for_suspendend_user(x_request_id,user_id)
            except Exception as e:
                logger.error(str(e))
                raise Exception("Failed to get suspended check from user service")
            
            if suspended_check_resonse_from_user_service["canLogin"] == False:
                logger.error(f"User {email} is suspended")
                raise Exception(f"User is suspended")    
        return result
        

    original_implementation.emailpassword_sign_up = emailpassword_sign_up
    original_implementation.thirdparty_sign_in_up = thirdparty_sign_in_up
    original_implementation.emailpassword_sign_in = emailpassword_sign_in

    return original_implementation

    
def override_thirdpartyemailpassword_apis(original_implementation: APIInterface):
    original_thirdparty_sign_in_up_post = original_implementation.thirdparty_sign_in_up_post
    original_emailpassword_sign_in_post = original_implementation.emailpassword_sign_in_post
    original_emailpassword_sign_up_post = original_implementation.emailpassword_sign_up_post

    async def thirdparty_sign_in_up_post(
        provider: Provider,
        redirect_uri_info: Optional[RedirectUriInfo],
        oauth_tokens: Optional[Dict[str, Any]],
        tenant_id: str,
        api_options: ThirdPartyAPIOptions,
        user_context: Dict[str, Any]
    ):
        

        # call the default behaviour as show below

        request:Request = user_context["_default"]["request"].request

        try:  
            result = await original_thirdparty_sign_in_up_post(provider, redirect_uri_info, oauth_tokens, tenant_id, api_options, user_context)
       
        except Exception as e:

            if str(e) == "Email already exists":
                return send_custom_response(error = e, api_options = api_options, message = responses.EMAIL_ALREADY_EXISTS.MESSAGE, status_code = responses.EMAIL_ALREADY_EXISTS.CODE)

            elif str(e) == "Email already exists using custom method":
                return send_custom_response(error = e, api_options = api_options, message = responses.EMAIL_ALREADY_EXISTS_USING_SOCIAL.MESSAGE, status_code = responses.EMAIL_ALREADY_EXISTS_USING_SOCIAL.CODE)
                

            elif str(e)=="Failed to add user to user db":
                return send_custom_response(error = e, api_options = api_options,message= responses.FAILED_TO_ADD_USER_TO_USER_DB.MESSAGE, status_code = responses.FAILED_TO_ADD_USER_TO_USER_DB.CODE)

            elif str(e)=="Failed to create user mapping":
                return send_custom_response(error = e, api_options = api_options, message = responses.FAILED_TO_CREATE_USER_MAPPING.MESSAGE, status_code = responses.FAILED_TO_CREATE_USER_MAPPING.CODE)
                
            elif str(e)=="Failed to add thirdparty response":
                return send_custom_response(error = e, api_options = api_options, message = responses.FAILED_TO_GET_THIRDPARTY_RESPONSE.MESSAGE, status_code = responses.FAILED_TO_GET_THIRDPARTY_RESPONSE.CODE)
                
            
            elif str(e)=="Failed to add initial roles":
                #SEND HATEOAS RESPONSE
                return send_custom_response(error = e, api_options = api_options, message= responses.FAILED_TO_ADD_INITIAL_ROLES.MESSAGE, status_code=responses.FAILED_TO_ADD_INITIAL_ROLES.CODE,  hateoas_url = f"{read_yaml.api_domain}/signup-roles")
                
            
            elif str(e)=="User is suspended":
                return send_custom_response(error = e, api_options = api_options, message= responses.SUSPENDED_USER.MESSAGE, status_code=responses.SUSPENDED_USER.CODE)
    
            else:
                logger.error(e)
                return send_custom_response(error = e, api_options = api_options, message = responses.INTERNAL_SERVER_ERROR.MESSAGE, status_code = responses.INTERNAL_SERVER_ERROR.CODE)
            


        if isinstance(result, ThirdPartySignInUpPostOkResult):
            session_handle = result.session.session_handle
            user_id = result.user.user_id
            request:Request = user_context["_default"]["request"].request
            x_request_id = request.state.x_request_id
            email = result.user.email
            
            logger.debug("Adding the session information to database")
            try:
                session_info = supertokens_auth_services.get_info_from_request(email, request)
                session_info = supertokens_auth_services.session_info_operation(session_info,request.headers)
                await update_session_data_in_database(session_handle, session_info)

            except Exception as e:
                logger.error(str(e))
                #SEND HATEOAS RESPONSE
                return send_custom_response(error = e, api_options = api_options, message = responses.INTERNAL_SERVER_ERROR.MESSAGE, status_code = responses.INTERNAL_SERVER_ERROR.CODE, hateoas_url = f"{read_yaml.api_domain}/session-info")


            logger.debug(f"getting the device fingerprint cookie from frontend")
            try:
                request = user_context["_default"]["request"].request
                x_request_id = request.state.x_request_id
                print("x_request_id", x_request_id)
            except Exception as e:
                logger.error(str(e))
            
            
            if result.created_new_user:

                logger.info("New User", result.created_new_user)
                logger.debug("Adding the device fingerprint to database")

                try:
                    device_fingerprint_cookie = user_context["_default"]["request"].get_cookie(read_yaml.fingerprint_cookie)
                    supertokens_auth_services.set_device_fingerprint_to_db(
                    user_id, device_fingerprint_cookie)
                
                except Exception as e:
                    logger.error(str(e))
                    #SEND HATEOAS RESPONSE
                    return send_custom_response(error = e, api_options = api_options, message = responses.INTERNAL_SERVER_ERROR.MESSAGE, status_code = responses.INTERNAL_SERVER_ERROR.CODE, hateoas_url = f"{read_yaml.api_domain}/device-fingerprint")
                   

            else:

                logger.debug("User Already Existed")
                logger.debug("Checking if device is known or not")


                try:
                    device_fingerprint_cookie = user_context["_default"]["request"].get_cookie(read_yaml.fingerprint_cookie)
                    known_device = supertokens_auth_services.check_for_known_device(user_id, device_fingerprint_cookie)
                
                except Exception as e:
                    logger.error(str(e))
                    return send_custom_response(error = e, api_options = api_options, message = responses.INTERNAL_SERVER_ERROR.MESSAGE, status_code = responses.INTERNAL_SERVER_ERROR.CODE)


                if not known_device:
                    logger.debug("The current decice is not known")
                    try:
                        email_info = supertokens_auth_services.get_info_from_request(result.user.email, api_options.request.request)
                        logger.debug("Email Info", email_info)
                        await supertokens_auth_services.send_email_regarding_unknown_device(user_id, device_fingerprint_cookie, email_info, request)

                    except Exception as e:
                        logger.error(str(e))
                        #SEND HATEOAS RESPONSE
                        return send_custom_response(error = e, api_options = api_options, message =responses.INTERNAL_SERVER_ERROR.MESSAGE, status_code = responses.INTERNAL_SERVER_ERROR.CODE, hateoas_url = f"{read_yaml.api_domain}/email-regarding-unknown-device")


                else:
                    logger.debug("Device is known")

        return result


    async def emailpassword_sign_in_post(form_fields: List[FormField],
                                         tenant_id:str,
                                         api_options: EmailPasswordAPIOptions, 
                                         user_context: Dict[str, Any]):
        
        # call the default behaviour as show below

        request:Request = user_context["_default"]["request"].request

        try:
            result = await original_emailpassword_sign_in_post(form_fields,tenant_id, api_options, user_context)
        
        except Exception as e:
            
            if str(e) == "User is suspended":                 
                return send_custom_response(error = e, api_options = api_options, message = responses.SUSPENDED_USER.MESSAGE , status_code = responses.SUSPENDED_USER.CODE)


        if isinstance(result, EmailPasswordSignInPostOkResult):
            email = result.user.email
            logger.debug(f"User from email {email} signed In")
            session_handle = result.session.session_handle
            user_id = result.user.user_id
            request:Request = user_context["_default"]["request"].request
            
            logger.debug("Adding the session information to database")
            try:
                session_info = supertokens_auth_services.get_info_from_request(email, request)
                session_info = supertokens_auth_services.session_info_operation(session_info,request.headers)
                await update_session_data_in_database(session_handle, session_info)

            except Exception as e:
                logger.error(str(e))
                #SEND HATEOAS RESPONSE
                return send_custom_response(error = e, api_options = api_options, message = responses.INTERNAL_SERVER_ERROR.MESSAGE, status_code = responses.INTERNAL_SERVER_ERROR.CODE, hateoas_url = f"{read_yaml.api_domain}/session-info")
                

            logger.debug(f"getting the device fingerprint cookie from frontend")
            

            try:
                device_fingerprint_cookie = user_context["_default"]["request"].get_cookie(read_yaml.fingerprint_cookie)
                known_device = supertokens_auth_services.check_for_known_device(user_id, device_fingerprint_cookie)
            

            except Exception as e:
                logger.error(str(e))
                return send_custom_response(error = e, api_options = api_options, message = responses.INTERNAL_SERVER_ERROR.MESSAGE, status_code = responses.INTERNAL_SERVER_ERROR.CODE)
            

            if not known_device:
                logger.debug("Unknown device")
                try:
                    email_info = supertokens_auth_services.get_info_from_request(result.user.email, api_options.request.request)
                    await supertokens_auth_services.send_email_regarding_unknown_device(user_id, device_fingerprint_cookie, email_info, request)
                
                except Exception as e:
                    logger.error(str(e))
                    #SEND HATEOAS RESPONSE
                    return send_custom_response(error = e, api_options = api_options, message =responses.INTERNAL_SERVER_ERROR.MESSAGE, status_code = responses.INTERNAL_SERVER_ERROR.CODE, hateoas_url = f"{read_yaml.api_domain}/email-regarding-unknown-device")
                  
                logger.debug("Email Info", email_info)
                
            else:
                logger.debug("Device is known")

        elif isinstance(result, EmailPasswordSignInPostWrongCredentialsError):
            return send_custom_response(error = "Wrong Credentials", api_options = api_options, message =responses.WRONG_CREDENTIALS.MESSAGE, status_code = responses.WRONG_CREDENTIALS.CODE)
            

        return result


    async def emailpassword_sign_up_post(
        form_fields: List[FormField],
        tenant_id: str,
        api_options: EmailPasswordAPIOptions,
        user_context: Dict[str, Any]
    ):
        logger.debug("Email Signup post api called")
        try:
            result = await original_emailpassword_sign_up_post(form_fields, tenant_id,api_options, user_context)
        
        except Exception as e:
            if str(e)=="Email already exists":
                return send_custom_response(error = e, api_options = api_options, message = responses.EMAIL_ALREADY_EXISTS.MESSAGE, status_code = responses.EMAIL_ALREADY_EXISTS.CODE)
            
            elif str(e)=="Email already exists using thirdparty":
                return send_custom_response(error = e, api_options = api_options,message=responses.EMAIL_ALREADY_EXISTS_USING_SOCIAL.MESSAGE, status_code = responses.EMAIL_ALREADY_EXISTS_USING_SOCIAL.CODE)
               
            elif str(e)=="Failed to add user to user db":
                return send_custom_response(error = e, api_options = api_options, message = responses.FAILED_TO_ADD_USER_TO_USER_DB.MESSAGE, status_code = responses.FAILED_TO_ADD_USER_TO_USER_DB.CODE)

            elif str(e)=="Failed to create user mapping":
                return send_custom_response(error = e, api_options = api_options, message = responses.FAILED_TO_CREATE_USER_MAPPING.MESSAGE, status_code = responses.FAILED_TO_CREATE_USER_MAPPING.CODE)

            elif str(e)=="Failed to add initial roles":
                #SEND HATEOAS RESPONSE
                return send_custom_response(error = e, api_options = api_options, message = responses.FAILED_TO_ADD_INITIAL_ROLES.MESSAGE, status_code = responses.FAILED_TO_ADD_INITIAL_ROLES.CODE, hateoas_url = f"{read_yaml.api_domain}/signup-roles")
                
            else:
                logger.error(e)
                return send_custom_response(error = e, api_options = api_options, message = responses.INTERNAL_SERVER_ERROR.MESSAGE, status_code = responses.INTERNAL_SERVER_ERROR.CODE)


        if isinstance(result, EmailPasswordSignUpPostOkResult):
            email = result.user.email
            session_handle = result.session.session_handle
            user_id = result.user.user_id
            
            try:
                request:Request = user_context["_default"]["request"].request
                x_request_id = request.state.x_request_id
                print("x_request_id", x_request_id)
            
            except Exception as e:
                logger.error(str(e))
                return send_custom_response(error = e, api_options = api_options, message = responses.INTERNAL_SERVER_ERROR.MESSAGE, status_code = responses.INTERNAL_SERVER_ERROR.CODE)
            

            logger.debug("Adding the session information to database")
            

            try:
                session_info = supertokens_auth_services.get_info_from_request(email, request)
                session_info = supertokens_auth_services.session_info_operation(session_info,request.headers)
                await update_session_data_in_database(session_handle, session_info)
                
            
            except Exception as e:
                logger.error(str(e))
                #SEND HATEOAS RESPONSE
                return send_custom_response(error = e, api_options = api_options, message = responses.INTERNAL_SERVER_ERROR.MESSAGE, status_code = responses.INTERNAL_SERVER_ERROR.CODE, hateoas_url = f"{read_yaml.api_domain}/session-info")
             
        
            logger.debug(f"getting the device fingerprint cookie from frontend and Adding the device fingerprint to database")
           
            try:
                device_fingerprint_cookie = user_context["_default"]["request"].get_cookie( read_yaml.fingerprint_cookie)
                supertokens_auth_services.set_device_fingerprint_to_db(user_id, device_fingerprint_cookie)
            except Exception as e:
                logger.error(str(e))
                #SEND HATEOAS RESPONSE
                return send_custom_response(error = e, api_options = api_options, message = responses.INTERNAL_SERVER_ERROR.MESSAGE, status_code = responses.INTERNAL_SERVER_ERROR.CODE, hateoas_url = f"{read_yaml.api_domain}/device-fingerprint")
            
            
            #Sending the email verification email
            try:
                await supertokens_auth_services.send_verification_email(result.user.user_id, result.user.email,request,tenant_id)
            
            except Exception as e:
                logger.error(str(e))
                #SEND HATEOAS RESPONSE
                return send_custom_response(error = e, api_options = api_options, message = responses.INTERNAL_SERVER_ERROR.MESSAGE, status_code = responses.INTERNAL_SERVER_ERROR.CODE, hateoas_url = f"{read_yaml.api_domain}/email-verification")                    

        return result
    
    original_implementation.thirdparty_sign_in_up_post = thirdparty_sign_in_up_post
    original_implementation.emailpassword_sign_in_post = emailpassword_sign_in_post
    original_implementation.emailpassword_sign_up_post = emailpassword_sign_up_post
    return original_implementation


def override_functions(original_implementation: RecipeInterface):
    # https://supertokens.com/docs/python/0.12.X/recipe/session/recipe_implementation.html#supertokens_python.recipe.session.recipe_implementation.RecipeImplementation.create_new_session
    original_implementation_create_new_session = original_implementation.create_new_session
    get_jwt_payload = jwt_services.get_jwt_payload

    async def get_key(header):
        jwks_uri = f"{read_yaml.api_domain}{read_yaml.api_base_path}/jwt/jwks.json"
        async with httpx.AsyncClient() as client:
            response = await client.get(jwks_uri)
            jwks_client = response.json()
        rsa_key = {}
        for key in jwks_client['keys']:
            if key['kid'] == header['kid']:
                rsa_key = {
                    'kty': key['kty'],
                    'kid': key['kid'],
                    'use': key['use'],
                    'n': key['n'],
                    'e': key['e']
                }
        return rsa_key


    async def get_jwt_payload(jwt_token):
        try:
            header = jwt.get_unverified_header(jwt_token)
        except Exception as e:
            logger.error(e)
            raise Exception(str(e))

        rsa_key = await get_key(header)
        # rsa_key_pem = utils.rsa_jwk_to_pem(rsa_key)
        try:
            payload = jwt.decode(jwt_token, rsa_key, algorithms=['RS256'])
            print("payload", payload)
            return payload
        except Exception as e:
            logger.error(e)
            raise Exception(str(e))
        


    async def create_new_session(
        user_id: str,
        access_token_payload: Optional[Dict[str, Any]],
        session_data_in_database: Optional[Dict[str, Any]],
        disable_anti_csrf: Optional[bool],
        tenant_id: str,
        user_context: Dict[str, Any],
    ):
        logger.debug(f"Creating the new session for Id {user_id}")
        user_info= await get_user_by_id(user_id,user_context=user_context)
        email = user_info.email
        third_party_info = user_info.third_party_info
        logger.debug(f"user_context {user_context['_default']}")
        full_name = None
        if third_party_info:
            if user_context["_default"]["is_new_user"]:
                if "full_name" in user_context["_default"]["user_info"]:
                    full_name = user_context["_default"]["user_info"]["full_name"]
                
    
        if access_token_payload is None:
                access_token_payload = {}

        if third_party_info:   
            access_token_payload["third_party_info"]={}
            access_token_payload["third_party_info"]["user_id"] = third_party_info.user_id
            access_token_payload["third_party_info"]["id"] = third_party_info.id
        
        else:
            metadataResult = await get_user_metadata(user_id)
            email_change_request = metadataResult.metadata.get("emailChangeRequest")
            if email_change_request:
                access_token_payload["isChangeEmailRequested"] = True
                access_token_payload["newEmail"] = email_change_request["newEmail"]


        access_token_payload["user_info"]={}
        access_token_payload["user_info"]["email"] = email

        if full_name:
            access_token_payload["user_info"]["full_name"] = full_name


    #     logger.debug(f"Creating the new session for Id {user_id}")
    #     logger.debug("Getting the guest-session token from frontend request")
    #     guest_jwt = user_context["_default"]["request"].get_cookie("st-guest-session")
    #     logger.debug(f"Guest-Session {guest_jwt}")
    #     if guest_jwt is not None:
    #         try:
    #             logger.debug("Getting guest payload from guest-session token")
    #             jwt_payload = await get_jwt_payload(guest_jwt)
    #         except Exception as e:
    #             #TODO: Change this
    #             jwt_payload = {"guest_id": "Something went wrong"}
    #             logger.error(str(e))
    # #TODO: Create another cookie from frontend which stores all the guest payload and st-guest-session  token identity
    #     # This goes in the access token, and isest's session id to access t availble to read on the frontend.
    #         if access_token_payload is None:
    #             access_token_payload = {}
    #         logger.debug("Transferring the guoken payload")
    #         logger.debug(f"guest_payload {jwt_payload}")
    #         access_token_payload["guest-id"] = jwt_payload["guest_id"]
            #TODO: Make the api calls


        return await original_implementation_create_new_session(user_id, access_token_payload, session_data_in_database, disable_anti_csrf, tenant_id,user_context)

    original_implementation.create_new_session = create_new_session
    return original_implementation
