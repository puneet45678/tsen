from pydantic import BaseModel, EmailStr

class UserRequests3DA(BaseModel):
    user_name:str=""
    user_email:EmailStr=""