from pydantic import BaseModel


class ModelRejection(BaseModel):
    user_id: str = ""
    model_name: str = ""
    admin_rejection_comments:str=""
