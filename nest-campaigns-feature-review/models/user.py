from pydantic import BaseModel,Field
from typing import Optional



class updates(BaseModel):
    actionContent: str = Field(...)
    mediaLink: str = Field(...)

class Keys(BaseModel):
    keystore: list[dict] | None = None
    campaignId: str | None = None

    class config:
        allow_population_by_field_name = True
        schema_extra = {
            
            "campaignId" : "xyz",
            "keystore" : [
            
                {"tier":"1", "key":"my_merchant_key_"}
            ]
        }   
    
   
    
    



