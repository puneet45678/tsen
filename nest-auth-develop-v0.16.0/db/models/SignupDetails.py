from pydantic import BaseModel,Field

class SignupDetails(BaseModel):
    username: str 
    fullName: str 

