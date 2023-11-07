from typing import List
from fastapi import APIRouter, Depends,Request, status, Response,Form
from controllers import authentication_controllers
from db.models.UserDetails import UserDetails
from db.models.Username import Username
from db.models.SignupDetails import SignupDetails
from db.models.ChangePassword import ChangePassword
from db.models.ChangeEmail import ChangeEmail
from db.models.UserEmail import UserEmail
from db.models.EmailRequest import Email
from db.models.Session import SessionResponse
from slowapi.errors import RateLimitExceeded
from utils.utils import get_email_from_request,email_limiter
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded


router = APIRouter(prefix="")
limiter = Limiter(key_func=get_remote_address)


# Not to review
@router.get('/',tags=["test"])
async def index(request: Request):
    res = await authentication_controllers.index(request)
    return res

# Not to review
@router.get('/test',tags=["test"])
async def test(request: Request,response:Response):
    res = await authentication_controllers.test(request,response)
    return res


#User API
@router.get('/verify-signup-email/{user_id}', status_code=status.HTTP_202_ACCEPTED,tags=["Account Settings"])
async def verify_signup_email(token:str,user_id:str):
    res = await authentication_controllers.verify_signup_email(token,user_id)
    return res

#User API
@router.get('/add-to-known-device-list/{user_id}',tags=["authentication"])
async def add_to_known_device_list(user_id:str,device: str, request: Request):
    res = await authentication_controllers.add_to_known_device_list(user_id,device,request)
    return res
   

#User API
@router.get('/verified-email',tags=["authentication"])
async def check_is_verified_mail(request: Request):
    res = await authentication_controllers.check_is_verified_mail(request)
    return res
    

#User API
@router.put('/user-details', response_description="Add user details", status_code=status.HTTP_202_ACCEPTED)
async def add_details(request: Request, data: UserDetails):
    res = await authentication_controllers.add_details(request,data)
    return res
    

#Not required now
@router.post('/username', status_code=status.HTTP_201_CREATED,tags=["authentication"])
async def add_username(request:Request, username:Username):
    res = await authentication_controllers.add_username(request,username)
    return res

@router.put('/user/signup-details',status_code=status.HTTP_201_CREATED,tags=["authentication"])
async def add_signup_details(request:Request, signup_details:SignupDetails):
    res = await authentication_controllers.add_signup_details(request,signup_details)
    return res

#User API
@router.get('/sessions',status_code=status.HTTP_200_OK,tags=["authentication"], response_model=List[SessionResponse])
async def get_sessions(request:Request):
    res= await authentication_controllers.get_sessions(request)
    return res


#User API
@router.delete('/sessions/{session_handle}',status_code=status.HTTP_200_OK,tags=["authentication"])
async def revoke_session(session_handle: str, request: Request, response:Response):
    res = await authentication_controllers.revoke_session(session_handle,request,response)
    return res


#User API
@router.delete('/sessions',status_code=status.HTTP_200_OK,tags=["authentication"])
async def revoke_all_sessions(request:Request,response:Response):
    res = await authentication_controllers.revoke_all_sessions(request,response)
    return res


#User API
@router.post('/signout',status_code=status.HTTP_200_OK,tags=["authentication"])
async def sign_out(request:Request,response:Response):
    res = await authentication_controllers.sign_out(request,response)
    return res


#Only called by the user service after 30 days of account deletion or must be called by userAdmin
@router.delete("/account/{user_id}", status_code=status.HTTP_202_ACCEPTED,tags=["authentication"])
async def permanently_delete(user_id: str, request:Request,response: Response):
    res = await authentication_controllers.permanently_delete(user_id,request, response)


#User API
@router.put('/password',response_description="Change the password",status_code=status.HTTP_202_ACCEPTED,tags=["Account Settings"])
async def change_password(request:Request,password:ChangePassword,response:Response):
    res = await authentication_controllers.change_password(request,password,response)
    return res

#User API
@router.put('/email',response_description="Change the Email", status_code=status.HTTP_202_ACCEPTED,tags=["Account Settings"])
async def change_email(request:Request,email:ChangeEmail):
    res = await authentication_controllers.change_email(request,email)
    return res

@router.post('/resend-change-email-verification-email/{email}',status_code=status.HTTP_202_ACCEPTED,tags=["Account Settings"])
@limiter.limit("5/minute")
async def resend_change_email_verification_email(request:Request,email:str):
    res = await authentication_controllers.resend_change_email_verification_email(email,request)
    return res

#User API (Change Email)
@router.get('/verify-email/{user_id}', status_code=status.HTTP_202_ACCEPTED,tags=["Account Settings"])
async def verify_email(request:Request,token:str,user_id:str):
    res = await authentication_controllers.verify_email(request,token,user_id)
    return res


@router.delete('/cancel-email-change-request/{email}',status_code=status.HTTP_202_ACCEPTED,tags=["Account Settings"])
async def cancel_email_change_request(request:Request,email:str):
    res = await authentication_controllers.cancel_email_change_request(request,email)
    return res

#As email verification is mandatory for user so this api can only be called via support to ikarus nest for sending the verification email, not called by user directly
@router.post('/send-verification-email/{email}',status_code=status.HTTP_202_ACCEPTED,tags=["Account Settings"])
async def send_verification_email(request:Request,email):
    res = await authentication_controllers.send_verification_email(email,request)
    return res

#Only users with the UserAdmin role should be able to call this API
@router.get('/manually-verify-email/{user_id}', status_code=status.HTTP_200_OK,tags=["Account Settings"])
async def manually_verify_email(user_id:str,request:Request):
    res = await authentication_controllers.manually_verify_email(user_id,request)
    return res

#Only users with the UserAdmin role should be able to call this API
@router.get('/manually-unverify-email/{user_id}',status_code=status.HTTP_200_OK,tags=["Account Settings"])
async def manually_unverify_email(user_id:str,request:Request):
    res = await authentication_controllers.manually_unverify_email(user_id,request)
    return res


@router.put("/forget-password",status_code=status.HTTP_202_ACCEPTED,tags=["Account Settings"])
@limiter.limit("5/minute")
async def forget_password(request: Request,email: str = Depends(get_email_from_request)):
    res = await authentication_controllers.forget_password(request, email)
    return res


@router.get("/reset-password/{user_id}")
async def reset_password_form(user_id:str, token: str, request: Request,tags=["Account Settings"]):
    return await authentication_controllers.reset_password_form(user_id,token,request)


@router.post("/reset-password-confirm",tags=["Account Settings"])
async def reset_password_confirm(user_id:str = Form(...), token: str = Form(...), password: str = Form(...)):
    return await authentication_controllers.reset_password_confirm(user_id,token,password)


    