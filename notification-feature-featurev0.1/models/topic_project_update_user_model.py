from pydantic import BaseModel

class Topic_update_user_model(BaseModel):
    user_id:str = ""
    campaign_id:str=""