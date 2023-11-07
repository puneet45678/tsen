from pydantic import BaseModel,Field
class Username(BaseModel):
    username: str = ""
