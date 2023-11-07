from pydantic import BaseModel, validator, root_validator, ValidationError
from typing import List,Union
import datetime
from typing import Optional
from enum import Enum


class PurchaseCart(BaseModel):
    cartId: str
    

class Item_type(Enum):
    TIER = "TIER"
    MODEL = "MODEL"
    MILESTONE = "MILESTONE"


class Wishlist_Item(Enum):
    MODEL = "MODEL"
    CAMPAIGN = "CAMPAIGN"

class ItemRequest(BaseModel):
    itemId: str
    itemType: Item_type
    quantity: Optional[int] = 1

class ItemRequestWithoutQuantity(BaseModel):
    itemId: str
    itemType: Item_type

class WishlistItemRequest(BaseModel):
    itemId: str
    itemType: Wishlist_Item

class SaveLaterItem(BaseModel):
    itemId: str
    itemType: Item_type
    itemName: Optional[str]
    itemDp: Optional[str]
    artistName: Optional[str]
    artistDp: Optional[str]
    quantity: Optional[int]
    addedOn: datetime.datetime
    lastUpdated: datetime.datetime

class SaveLater(BaseModel):
    userId: str
    createdAt: datetime.datetime
    lastUpdated: datetime.datetime
    items: List[SaveLaterItem]


class Item(BaseModel):
    itemId: str
    itemType: Item_type
    itemName: Optional[str]
    itemDp: Optional[str]
    artistName: Optional[str]
    artistDp: Optional[str]
    price: float
    quantity: Optional[int]
    alreadyOdered: bool
    currency: Optional[str]  
    addedOn: datetime.datetime
    lastUpdated: datetime.datetime

class ProcessedItem(BaseModel):
    itemId: str
    itemType: Item_type
    price: float
    quantity: int
    currency: Optional[str]  
    addedOn: datetime.datetime
    lastUpdated: datetime.datetime

    
class Cart(BaseModel):
    cartId: str
    userId: str
    createdAt: datetime.datetime
    updatedAt: datetime.datetime
    items: List[Item]


class ProcessedCart(BaseModel):
    cartId: str
    userId: str
    createdAt: datetime.datetime
    updatedAt: datetime.datetime
    items: List[ProcessedItem]

class WishlistItemModel(BaseModel):
    itemId: str
    itemType: Wishlist_Item
    itemName: Optional[str]
    itemCurrency: Optional[str]
    itemPrice: float
    itemDp: Optional[str]
    artistName: Optional[str]
    artistDp: Optional[str]
    addedOn: datetime.datetime
    lastUpdated: datetime.datetime  


class WishlistItemCampaign(BaseModel):
    itemId: str
    itemType: Wishlist_Item
    itemName: Optional[str]
    statusOfCampaign: str
    amountRaised: float
    itemDp: Optional[str]
    endDate: datetime.datetime
    noOfBackers: int
    noOfRewardTiers: int
    artistName: Optional[str]
    artistDp: Optional[str]
    addedOn: datetime.datetime
    lastUpdated: datetime.datetime  

    
class Wishlist(BaseModel):
    wishlistId: str
    userId: str
    createdAt: datetime.datetime
    updatedAt: datetime.datetime
    items: List[Union[WishlistItemModel, WishlistItemCampaign]]


class ItemReview(BaseModel):
    reviewId: str
    reviewText: str
    rating: Optional[int]
    feedBackAnswers: List[int]
    



class OrderItem(BaseModel):
    itemId: str
    itemType: Item_type
    itemName: Optional[str]
    itemDp: Optional[str]
    artistName: Optional[str]
    artistDp: Optional[str]
    price: float
    quantity: Optional[int]
    campaignId: Optional[str]
    reviewId: Union[str,None]
    rating: Optional[int]

    # class Config:
    #     orm_mode = True

    # @validator('campaignId',pre=True)
    # def remove_campaign_id(cls,v,values):
    #     if values["itemType"] != Item_type.TIER:
    #         return None
    #     return v
    
    # @validator('rating',pre=True)
    # def remove_rating(cls,v,values):
    #     if values["itemType"] != Item_type.MODEL:
    #         return None
    #     return v
    
    # class Config:
    #     orm_mode = True
    #     fields = {
    #         'campaignId': {'exclude': True},
    #         'rating': {'exclude': True},
    #     }

class Order(BaseModel):
    orderId: str
    orderValue: float
    timeOfOrder: datetime.datetime
    items: List[OrderItem]
  
class PurchasedModel(BaseModel):
    userId: str
    modelId: str
    quantity: Optional[str]
    modelName: Optional[str]
    modelDp: Optional[str]
    artistName: Optional[str]
    artistDp: Optional[str]
    timeOfPurchase: datetime.datetime


class PurchasedCampaign(BaseModel):
    userId: str
    campaignId: str
    campaignName: Optional[str]
    campaignDp: Optional[str]
    artistName: Optional[str]
    artistDp: Optional[str]
    tiersCount: int

    

class PurchasedTier(BaseModel):
    userId: str
    tierId: str
    tierName: Optional[str]
    tierDp: Optional[str]
    artistName: Optional[str]
    artistDp: Optional[str]
    modelsCount: int



# 2d909108-af92-45cb-b873-a5b5de3aa474
# 647ef8a250a09d480e9babb4
