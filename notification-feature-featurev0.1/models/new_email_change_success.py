from pydantic import BaseModel, EmailStr

class NewEmailChangeSuccess(BaseModel):
    old_email:EmailStr=""
    new_email:EmailStr=""
    user_id:str=""