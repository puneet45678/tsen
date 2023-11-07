from pydantic import BaseModel

class YourCampaignEnded(BaseModel):
    campaign_owner_id: str=""
    campaign_name:str=""
    backer_numbers:int
    funds_raised_amount:int