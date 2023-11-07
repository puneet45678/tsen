from pydantic import BaseModel,EmailStr

class AccountDeletionInitializerModel(BaseModel):
    user_name:str=""
    user_email:EmailStr=""
    account_deletion_link:str=""
    