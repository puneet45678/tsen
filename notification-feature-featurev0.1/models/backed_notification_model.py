from pydantic import BaseModel

class Backed_Notification(BaseModel):
    campaign_owner_user_id: str = ""
    campaign_name: str = ""
    first_backer:bool = False
    backer_number: int 
    funds_raised_amount:int
    
