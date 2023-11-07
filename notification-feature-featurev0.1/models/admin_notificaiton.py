from pydantic import EmailStr, BaseModel
from enum import Enum

class AdminNotification(BaseModel):
    admin_email:EmailStr=""
    notification_type:str=""
    user_id:str=""

class AdminType(Enum):
    super_admin="super_admin"
    user_admin="user_admin"
    content_admin="content_admin"
    marketing_admin="marketing_admin"
    campaign_admin="campaign_admin"
    model_admin="model_admin"

## more enums would get added  as we proceed further with what type of admin notifications we want
class notification_type(Enum):
    user_asked_account_deletion="user_asked_account_deletion"
    user_is_reported = "user_is_reported"