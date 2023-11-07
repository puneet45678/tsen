from pydantic import BaseModel, validator, ValidationError
from typing import List, Optional, Union
from uuid import UUID
from datetime import datetime


class Milestone(BaseModel):
    milestoneId: str
    milestoneTitle: str
    milestoneCurrency: Optional[str]
    milestoneThreshold: str
    milestoneDp: str
    modelIds: Optional[List[str]]=[]
    hasUnavailabilityMask: Optional[bool] = True
    blurDp: Optional[bool] = True

    @validator("milestoneTitle")
    def validate_milestone_title(cls, v):
        if len(v) > 250:
            raise ValidationError(
                "milestoneTitle must be less than or equal to 250 characters long"
            )
        return v


class EarlyBird(BaseModel):
    endingDate: datetime
    backers: Optional[List[str]]=[]
    noOfseats: Optional[int]
    amount: str 
    currency: Optional[str]

class Review(BaseModel):
    reviewId : str
    reviewerId : str
class RewardTier(BaseModel):
    tierId: str
    tierTitle: str 
    tierAmount: str 
    tierCurrency: Optional[str]
    tierDescription: str
    tierDp: str 
    isEarlyBird: bool = False
    backers: Optional[List[str]]=[]
    earlyBird: Optional[EarlyBird]
    endingDate: datetime
    modelIds: List[str]=[]
    reviewData : Optional[List[Review]]=[]

    @validator("tierTitle", "tierDescription")
    def validate_reward_tier(cls, v, field):
        max_length = {
            "tierTitle": 250,
            "tierDescription": 20000,
        }.get(field.name, 0)

        if len(v) > max_length:
            raise ValidationError(
                f"{field.name} must be less than or equal to {max_length} characters long"
            )
        return v


class PreMarketing(BaseModel):
    premarketingSignees : Optional[List[str]]=[]
    premarketingTitle: str
    premarketingDp: str 
    premarketingVideo: str 
    premarketingDescription: str
    isDescriptionSame: Optional[bool]

    @validator("premarketingTitle", "premarketingDescription")
    def validate_reward_tier(cls, v, field):
        max_length = {
            "premarketingTitle": 250,
            "premarketingDescription": 20000,
        }.get(field.name, 0)

        if len(v) > max_length:
            raise ValidationError(
                f"{field.name} must be less than or equal to {max_length} characters long"
            )
        return v


class Faqs(BaseModel):
    faqId: str 
    question: str
    answer: str 


class Story(BaseModel):
    storyDescription: Optional[str]
    faqs: Optional[List[Faqs]]=[]

    @validator("storyDescription")
    def validate_story_description(cls, v):
        if len(v) > 20000:
            raise ValidationError(
                "storyDescription must be less than or equal to 20000 characters long"
            )
        return v

    # @validator("faqs")
    # def validate_faqs(cls, v):
    #     if len(v) > 50:
    #         raise ValidationError(
    #             "faqs list must contain less than or equal to 50 objects"
    #         )
    #     return v

class PrintImage(BaseModel):    
    imageUrl: Optional[str]
    imageId: Optional[str]
    croppedUrl: Optional[str] 
    imageName: Optional[str]

class Basics(BaseModel):
    campaignTitle: str 
    category: str 
    shortDescription: str 
    basicsImages: Optional[List[PrintImage]] 
    coverImage: Optional[str]
    coverVideo: Optional[str]
    launchDate: Optional[datetime] = datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ')
    tags: list[str]=[]
    endingOn: Optional[datetime] = datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ')
    metaTitle: Optional[str]
    metaDesc: Optional[str]
    metaImage: Optional[str]

    @validator("campaignTitle", "shortDescription")
    def validate_basics(cls, v, field):
        max_length = {
            "campaignTitle": 250,
            "shortDescription": 500,
        }.get(field.name, 0)

        if len(v) > max_length:
            raise ValidationError(
                f"{field.name} must be less than or equal to {max_length} characters long"
            )
        return v

    @validator("tags")
    def validate_tags(cls, v):
        if len(v) > 5:
            raise ValidationError(
                "tags list must contain less than or equal to 5 objects"
            )
        return v

################################### UPDATES ################################################
class CampaignUpdates(BaseModel):
    updateId: str
    updateTitle: str 
    updateDescription : str
    updateTime : datetime
    comments : Optional[List[str]]=[]

    @validator("updateTitle", "updateDescription")
    def validate_updates(cls, v, field):
        max_length = {
            "updateTitle": 250,
            "updateDescription": 1000, #confirm this limit
        }.get(field.name, 0)

        if len(v) > max_length:
            raise ValidationError(
                f"{field.name} must be less than or equal to {max_length} characters long"
            )
        return v

###############################################################################################
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

class Campaign(BaseModel):
    userId: Optional[str]
    createdOn: datetime
    endedOn: Optional[datetime]
    # raisedTotal: Optional[float]
    updatedOn: Optional[datetime]
    adminModified: Optional[bool]
    statusOfCampaign: Optional[str]
    #reviewIds: Optional[List[str]]
    commentIds: Optional[List[str]]
    updates: Optional[List[CampaignUpdates]]
    likedBy: Optional[List[str]]
    basics: Optional[Basics]
    premarketing: Optional[PreMarketing]
    milestone: Optional[List[Milestone]]
    rewardAndTier: Optional[List[RewardTier]]
    story: Optional[Story]
    reported : Optional[bool]
    wishlistedBy : Optional[List[str]]

class BasicCampaign(BaseModel):
    updates: Optional[List[CampaignUpdates]]
    basics: Basics
    premarketing: Optional[PreMarketing]
    milestone: Optional[List[Milestone]]
    rewardAndTier:List[RewardTier]
    story: Optional[Story]
class Tag(BaseModel):
    id: str
    tag: str


class ImageCrop(BaseModel):
    width: int
    height: int
    x: int
    y: int

class ItemDetails(BaseModel):
    tier : Optional[List[str]]
    model : Optional[List[str]]
    milestone : Optional[List[str]]

class TierIds(BaseModel):
    tierIds: List[str]

class CampaignIds(BaseModel):
    campaignIds: List[str]

class TierId(BaseModel):
    tierId: str

class ModelFilesResponse(BaseModel):
    campaignName: Union[str,None]
    tierName: Union[str,None]
    modelId : str
    modelName : str
    modelStls : List[str]

class TiersResponseCart(BaseModel):
    itemId : Optional[str]
    itemName : Optional[str]
    itemDp : Optional[str]
    artistName :Optional[str]
    artistDp : Optional[str]
    campaignId : Optional[str]
    reviewId : Optional[str]
