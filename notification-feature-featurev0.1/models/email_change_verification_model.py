from pydantic import BaseModel, EmailStr

class NewEmailVerification(BaseModel):
    user_id:str=""
    user_email:str=""
    token:str=""