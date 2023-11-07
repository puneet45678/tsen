from pydantic import BaseModel

class DeleteRegistrationToken(BaseModel):
    device_id:str=""
