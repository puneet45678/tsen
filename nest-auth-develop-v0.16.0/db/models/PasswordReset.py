from pydantic import BaseModel

class PasswordReset(BaseModel):
    token: str
    password: str
