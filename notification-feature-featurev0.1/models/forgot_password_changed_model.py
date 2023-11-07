from pydantic import BaseModel

class ForgotPasswordCahngedModel(BaseModel):
    user_id:str=""