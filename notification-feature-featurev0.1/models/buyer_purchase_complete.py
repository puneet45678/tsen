from pydantic import BaseModel

class BuyerPurchaseCompleted(BaseModel):
    product_bought_name:str=""
    order_details:str=""