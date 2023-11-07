from pydantic import BaseModel, EmailStr
from enum import Enum

class ContactList(BaseModel):
    email_id:EmailStr = ""
    list_names:list=[]

class EmailListName(Enum):
    promotional = "promotional"
    offers = "offers"
    new_features = "new_features"