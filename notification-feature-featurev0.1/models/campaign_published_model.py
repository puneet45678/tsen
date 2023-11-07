from pydantic import BaseModel

class CampaignPublished(BaseModel):
    campaign_owner_user_id:str=""
    campaign_name:str=""
    campaign_description:str=""
    early_bird_description:str=""
    pre_marketing_signees_user_id_list:list=[""]
    