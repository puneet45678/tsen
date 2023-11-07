from pydantic import BaseModel,Field

class UserDetails(BaseModel):
    username: str = ""
    firstName: str = ""
    lastName: str = ""
