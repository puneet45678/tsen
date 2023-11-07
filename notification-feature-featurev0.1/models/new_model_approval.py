from pydantic import BaseModel, EmailStr

class ModelApproval(BaseModel):
    user_id:str = ""
    model_name:str=""