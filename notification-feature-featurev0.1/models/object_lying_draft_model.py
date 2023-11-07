from pydantic import BaseModel

class ObjectLyingInDraft(BaseModel):
    user_id:str=""
    draft_product_item_name:str=""
    draft_product_item_type:str=""