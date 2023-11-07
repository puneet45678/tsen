from pydantic import BaseModel

class MarketplacePurchase(BaseModel):
    model_id:str = ""
    model_owner_user_id:str = ""
    model_name:str = ""
    buyer_number:str = ""
    