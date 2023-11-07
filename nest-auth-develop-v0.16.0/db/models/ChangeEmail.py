from pydantic import BaseModel,Field

class ChangeEmail(BaseModel):
    currentPassword: str = ""
    newEmail: str = ""