from pydantic import BaseModel

class CampaignEndingSoon(BaseModel):
    time_left:str=""
    campaign_owner_id: str = ""
    campaign_name: str = ""   
    pre_marketing_signees_user_ids_list:list = [""]
    wishlisted_user_ids_list:list = [""]