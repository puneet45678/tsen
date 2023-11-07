from pydantic import BaseModel,EmailStr
from enum import Enum
class CampaignApprovalModel(BaseModel):
    campaign_user_id:str=""
    campaign_name: str=""
    action:str=""
    campaign_comments:str=""


class ActionEnum(Enum):
    campaign_approved = "approve"
    campaign_rejected = "reject"   