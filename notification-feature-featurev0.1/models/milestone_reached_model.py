from pydantic import BaseModel

class MilestoneReached(BaseModel):
    campaign_owner_user_id:str=""
    campaign_name:str=""
    milestone_name:str=""
    Milestone_reached_date: str=""
    backers_user_ids_list:list=[""]
    milestone_rewards:list=[""]