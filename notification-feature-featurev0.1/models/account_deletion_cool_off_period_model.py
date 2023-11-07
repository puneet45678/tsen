from pydantic import BaseModel

class AccountDeletionCoolOffPeriod(BaseModel):
    user_name:str = ""
    user_email:str = ""
    deletion_request_date:str=""
    final_deletion_date:str=""