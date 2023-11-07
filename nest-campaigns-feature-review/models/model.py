from typing import List, Optional
from pydantic import BaseModel, Field, validator
from uuid import UUID
from datetime import datetime
from enum import Enum

class Approvalstatus(str,Enum):
    DRAFT = "Draft"
    IN_REVIEW = "In_Review"
    SUBMITTED = "Submitted"
    APPROVED = "Approved"
    REJECTED = "Rejected"
    LIVE = "Live"
    ALL = "all"
    # Add more print materials as needed“Draft” ,”underreview”   “Approved”, “Rejected ,”cancelled”)


class PrintMaterial(str,Enum):
    PLASTIC = "Plastic"
    RESIN = "Resin"
    COMPOSITE_MATERIAL = "Composite Material"
    CERAMIC = "Ceramic"

class Visibility(str,Enum):
    PRIVATE = "private"
    PUBLIC = "public"


class InputVisibility(str,Enum):
    PUBLIC = "public"
    PRIVATE = "private"
    ALL = "all"


class License(BaseModel):
    licenseLogoUrl: str
    licenseName: str
    #licenseDescription: str
    licenseUrl: str


class PrintImage(BaseModel):
    imageName: str
    imageUrl: str
    imageId: str
    croppedUrl: Optional[str]


class Campaign(BaseModel):
    campaignId: str
    tierId: str


class Dimensions(BaseModel):
    modelHeight: Optional[int]
    modelWidth: Optional[int]
    modelLength: Optional[int]

    @validator("modelHeight","modelWidth","modelLength")
    def validate_dimensions(cls,value,field):
        try:
            if value <= 0:
                return {f"{field} can never be less than 0 check your dimensions" }
        except:
            raise ValueError("invalid format for dimensions check the values")



class Scale(BaseModel):
    minScale: Optional[int]
    maxScale: Optional[int]


class PrintTime(BaseModel):
    hours: Optional[int]
    minutes: Optional[int]



class ModelUrl(BaseModel):
    stl: str
    glb: Optional[str]

class Remixes(BaseModel):
    siteUrl: str
    imageUrl: str

class ReportData(BaseModel):
    reportedBy : str
    reportReason : str
    reportedOn : datetime
    @validator("reportReason",pre=True)
    def check_lengths(cls, v, field):
        max_length = {
            "reportReason": 500,
        }.get(field.name, 0)

        if v and len(v) > max_length:
            raise ValueError(
                f"{field.name} must be less than or equal to {max_length} characters long"
            )
        return v

class Currency(str, Enum):
    USD = "USD"
    CAD = "CAD"
    EUR = "EUR"
    GBP = "GBP"
    AUD = "AUD"    

class FileData(BaseModel):
    filePath: str
    fileSize: int
    fileName: str
class ModelFiles(BaseModel):
    stlFiles: List[FileData]
    glbFiles: List[FileData]

class Review(BaseModel):
    reviewId : str
    reviewerId : str
class Model(BaseModel):
    userId: Optional[str]
    modelName: Optional[str]
    adminModified: Optional[bool] = False
    uploadDatetime: Optional[datetime]
    updatedAt: Optional[datetime]
    coverImage: Optional[str]
    categoryId: Optional[str] 
    shortDescription: Optional[str]
    description: Optional[str]
    modelFileUrl: Optional[ModelUrl]
    modelFiles: Optional[ModelFiles]
    NSFW: Optional[bool] = False
    price: Optional[str] 
    currency: Optional[str]
    printDetails: Optional[str]
    supportNeeded: Optional[bool]
    dimensions: Optional[Dimensions]
    scale: Optional[Scale]
    timetoPrint: Optional[PrintTime]
    deprecated: Optional[bool]
    approvalStatus: Optional[Approvalstatus]
    visibility: Optional[Visibility]
    printMaterial: Optional[PrintMaterial]
    materialQuantity: Optional[int]
    licenseId: Optional[str]
    modelImages: Optional[List[PrintImage]]
    remixes: Optional[List[Remixes]]
    tagIds: Optional[List[str]]
    campaigns: Optional[List[Campaign]]
    commentIds: Optional[List[str]]
    reviewData: Optional[List[Review]]
    buyers: Optional[List[str]]
    likedBy : Optional[List[str]]
    reported : Optional[bool] = False
    reportData : Optional[List[ReportData]]

class DraftModel(BaseModel):
    modelName: Optional[str]
    shortDescription: Optional[str] 
    description: Optional[str]
    modelFileUrl: Optional[ModelUrl]
    NSFW: Optional[bool] = False
    coverImage: Optional[str]
    price: Optional[str]
    modelImages : Optional[List[PrintImage]]=[]
    categoryId: Optional[str]
    licenseId: Optional[str]
    printDetails: Optional[str]
    supportNeeded: Optional[bool] = False
    dimensions: Optional[Dimensions]
    scale: Optional[Scale]
    timetoPrint: Optional[PrintTime]
    visibility: Optional[Visibility] = Visibility.PRIVATE.value
    printMaterial: Optional[PrintMaterial]
    materialQuantity: Optional[int]
    remixes: Optional[List[Remixes]]=[]
    tagIds: Optional[List[str]]=[]


class SubmitModel(BaseModel):
    #required fields while model uploading
    modelName: str
    shortDescription: str 
    description: str
    NSFW: bool = False
    coverImage: str
    price: str
    modelFileUrl : ModelUrl
    modelImages : List[PrintImage]
    categoryId: str
    licenseId: str
    #optional fields
    printDetails: Optional[str]
    supportNeeded: Optional[bool] = False
    dimensions: Optional[Dimensions]
    scale: Optional[Scale]
    timetoPrint: Optional[PrintTime]
    visibility: Optional[Visibility] = Visibility.PRIVATE.value
    printMaterial: Optional[PrintMaterial]
    materialQuantity: Optional[int]
    remixes: Optional[List[Remixes]]
    tagIds: Optional[List[str]]

    @validator("materialQuantity")
    def validate_material_quantity(cls,value):
        try:
            if value <= 0:
                return {f"material quantity must be greater than 0"}
        except ValueError:
            raise ValueError("Invalid material quantity format. must be an integrer value ")
        
    @validator("price")
    def validate_price(cls, value):
        try:
            price_as_float = float(value)
            if price_as_float <= 0:
                return {f"Price must be greater than 0"}
        except ValueError:
            raise ValueError("Invalid price format. Price must be a numeric value as a string.")

        return value

    @validator("tagIds" ,"modelImages", "remixes" ,pre=True)
    def check_lengths_list(cls, v, field):
        max_length = {
            "tagIds": 5,
            "modelImages": 20,
            "remixes": 5,

        }.get(field.name, 0)

        if v and len(v) > max_length:
            raise ValueError(f"{field.name} must be less than or equal to {max_length} ")
            
        return v
    @validator("modelName", "description", "printDetails", "shortDescription",pre=True)
    def check_lengths(cls, v, field):
        max_length = {
            "modelName": 250,
            "description": 20000,
            "printDetails": 20000,
            "shortDescription":250,
        }.get(field.name, 0)

        if v and len(v) > max_length:
            raise ValueError(
                f"{field.name} must be less than or equal to {max_length} characters long"
            )
        return v
    


class ModelResponse(Model):
    modelId: str
    tags: List[str]


class TriggerType(Enum):
    APPROVAL = "approval"
    VISIBILITY = "visibility"
    DELETION = "deletion"


class StateFor(Enum):
    CAMPAIGN = "campaign"
    MODEL = "model"
    USER = "user"

class Approval(BaseModel):
    approvalStatus: Approvalstatus
    comment: str
    approvedBy: str


class StateValue(BaseModel):
    approval: Optional[Approval]
    visibility: Optional[Visibility]


class State(BaseModel):
    triggerType: TriggerType
    stateFor: StateFor
    stateDateTime: datetime
    id: Optional[str]
    oldValue:Optional[str]
    newValue:Optional[str]
    comment: Optional[str]
    triggerdBy: Optional[str]


class ImageCrop(BaseModel):
    width: int
    height: int
    x: int
    y: int


class ModelIds(BaseModel):
    modelIds: List[str]

class TagIds(BaseModel):
    tagIds: List[str]

class ModelResponseCart(BaseModel):
    itemId : Optional[str]
    itemName : Optional[str]
    itemDp : Optional[str]
    itemCurrency : Optional[str]
    itemPrice : Optional[str]
    artistName : Optional[str]
    artistDp : Optional[str]
    reviewId : Optional[str]
    rating : Optional[str]