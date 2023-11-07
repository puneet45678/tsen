from pydantic import BaseModel

class RegisterDevice(BaseModel):
    device_id: str=""
    registration_token: str=""