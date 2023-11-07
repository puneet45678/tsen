from pydantic import BaseModel
from typing import Optional

class EarlyBirdTierEndingSoon(BaseModel):
    time_left:str=""
    seats_left: Optional[str]=""
    campaign_owner_id: str = ""
    campaign_name: str = ""  
    user_ids_list:list=[""] 