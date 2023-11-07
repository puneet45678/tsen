from pydantic import BaseModel,Field
class Session:
    def __init__(self,sessionHandle: str,userId: str ,createdTime:str ,expiresOn: str):
        self.sessionHandle=sessionHandle
        self.userId = userId
        self.createdTime=createdTime
        self.expiresOn=expiresOn


class SessionResponse(BaseModel):
    sessionHandle: str
    createdTime: str
    expiresOn: str
    device: str
    browser: str
    location: str
  
