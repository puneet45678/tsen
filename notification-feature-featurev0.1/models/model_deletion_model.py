from pydantic import BaseModel

class ModelDeletion(BaseModel):
    model_name:str=""
    buyers_user_id_list:list=[]
    deletion_request_date:str=""
    final_deletion_date:str=""

class ModelDeletionOwner(BaseModel):
    model_name:str=""
    owner_user_id: str=""
    deletion_request_date:str=""
    final_deletion_date:str=""