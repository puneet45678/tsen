from pydantic import BaseModel
class PasswordChangedUSerRequest(BaseModel):
    user_id:str=""