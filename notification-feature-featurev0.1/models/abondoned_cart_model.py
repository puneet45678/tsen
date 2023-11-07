from pydantic import BaseModel, EmailStr

class AbononedCart(BaseModel):
    user_id:str=""
    item_details:dict={""}
    last_updated_date:str=""

