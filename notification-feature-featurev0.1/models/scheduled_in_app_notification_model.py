from pydantic import BaseModel
from enum import Enum
from typing import Dict

class VerbEnums(Enum):
    your_milestone_unlocked="your_milestone_unlocked"
    your_campaign_backed = "your_campaign_backed"
    your_campaign_published = "your_campaign_published"
    your_model_approved = "your_model_approved"
    your_model_rejected = "your_model_rejected"
    campaign_you_signed_up_for_published="campaign_you_signed_up_for_published"
    your_campaign_approved = "your_campaign_approved"
    your_campaign_rejected = "your_campaign_rejected"
    your_purchase_completed = "your_purchase_completed"
    premarket_signup_your_campaign = "premarket_signup_your_campaign"
    commented_on_your_campaign = "commented_on_your_campaign"
    liked_your_campaign = "liked_your_campaign"
    commented_on_your_model = "commented_on_your_model"
    liked_your_model = "liked_your_model"
    bought_your_model = "bought_your_model"
    replied_to_your_comment = "replied_to_your_comment"
    liked_your_comment = "liked_your_comment"
    liked_your_portfolio_project = "liked_your_portfolio_project"
    started_following_you = "started_following_you"
    your_campaign_ended = "your_campaign_ended"
    like = "like"
    follow = "follow"

class ScheduledInAppNotification(BaseModel):
    user_id:str=""
    verb:VerbEnums
    notification_data:dict={}

