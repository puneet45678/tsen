from pydantic import BaseModel, EmailStr

class ForgotPasswordModel(BaseModel):
    user_email:EmailStr = ""
    user_id:str=""
    token:str=""