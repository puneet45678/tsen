from pydantic import BaseModel
from enum import Enum
from typing import Dict

class VerbEnum(Enum):
    artist_you_follow_published_campaign="artist_you_follow_published_campaign"
    artist_you_follow_published_model="artist_you_follow_published_model"
    campaign_about_to_end="campaign_about_to_end"
    campaign_you_backed_reached_milestone="campaign_you_backed_reached_milestone"
    campaign_you_backed_new_updates="campaign_you_backed_new_updates"
    campaign_early_bird_ending_soon="campaign_early_bird_ending_soon"

class InAppNotificationMultipleUsers(BaseModel):
    user_id_list:list=[""]
    notification_data:dict={}
    owner_user_name:str=""
    verb:VerbEnum

