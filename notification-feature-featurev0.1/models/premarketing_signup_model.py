from pydantic import BaseModel

class PremarketingSignupModel(BaseModel):
    campaing_owner_user_id: str = ""
    campaign_name: str = ""
    premarket_signee_numbers:int