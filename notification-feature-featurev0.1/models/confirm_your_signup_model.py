from pydantic import BaseModel

class ConfirmYourSignup(BaseModel):
    user_id:str=""
    user_email:str=""
    verification_link:str=""