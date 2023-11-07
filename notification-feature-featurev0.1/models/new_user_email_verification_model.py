from pydantic import BaseModel, EmailStr

class NewUserEmailVerification(BaseModel):
    user_id:str=""
    user_email:EmailStr=""
    token:str=""
    verificationLink:str=""
    verificationText:str=""