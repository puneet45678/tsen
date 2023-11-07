from pydantic import BaseModel,Field
class ChangePassword(BaseModel):
    currentPassword: str = ""
    newPassword: str = ""
