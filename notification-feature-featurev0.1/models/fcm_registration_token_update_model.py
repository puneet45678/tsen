from pydantic import BaseModel

class UpdateRegistrationToken(BaseModel):
    device_id: str=""
    registration_token: str=""