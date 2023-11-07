from pydantic import BaseModel, EmailStr

class UnkownDeviceLogin(BaseModel):
    user_id:str=""
    device_fingerprint_cookie:str=""
    email_info:dict={""}