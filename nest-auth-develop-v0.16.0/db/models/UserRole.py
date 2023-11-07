from pydantic import BaseModel

class UserRole(BaseModel):
    role: str = ""