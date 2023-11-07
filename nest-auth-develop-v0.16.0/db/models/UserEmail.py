from pydantic import BaseModel

class UserEmail(BaseModel):
    user_id: str = ""
    email: str = ""