from pydantic import BaseModel,Field,validator
from typing import Optional , List
from datetime import datetime
from enum import Enum


class RatingEnum(int,Enum):
    ONE_STAR = 1
    TWO_STARS = 2
    THREE_STARS = 3
    FOUR_STARS = 4
    FIVE_STARS = 5

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

class ImageData(BaseModel):
    imageUrl : str
    imageUUID : str

class Attributes(BaseModel):
    feedbackQuestion1 : RatingEnum
    feedbackQuestion2 : RatingEnum
    feedbackQuestion3 : RatingEnum

class Review(BaseModel):
    reviewerId : Optional[str]
    text : Optional[str]
    reviewImages : Optional[List[ImageData]]
    rating : Optional[RatingEnum]
    feedback : Optional[Attributes]
    updateTime : Optional[datetime]
    reported : Optional[bool]
    reportData : Optional[List[ReportData]]
    foundHelpfulBy : Optional[List[str]]
    @validator("text","reviewImages" ,pre=True)
    def check_lengths(cls, v, field):
        max_length = {
            "text": 1000,
            "reviewImages": 8,
        }.get(field.name, 0)

        if v and len(v) > max_length:
            raise ValueError(
                f"{field.name} must be less than or equal to {max_length} characters long"
            )
        return v

    
class ReviewUpdate(BaseModel):
    text : Optional[str]
    rating : Optional[RatingEnum]
    updateTime: Optional[datetime]
    feedback : Optional[Attributes]
    @validator("text",pre=True)
    def check_lengths(cls, v, field):
        max_length = {
            "text": 1000,
        }.get(field.name, 0)

        if v and len(v) > max_length:
            raise ValueError(
                f"{field.name} must be less than or equal to {max_length} characters long"
            )
        return v

    
class UpdateReviewModel(BaseModel):
    text : Optional[str]
    rating : Optional[RatingEnum]
    updateTime: Optional[datetime]
    feedback : Optional[Attributes]
    @validator("text",pre=True)
    def check_lengths(cls, v, field):
        max_length = {
            "text": 1000,
        }.get(field.name, 0)

        if v and len(v) > max_length:
            raise ValueError(
                f"{field.name} must be less than or equal to {max_length} characters long"
            )
        return v
class UpdateReviewCampaign(BaseModel):
    text : Optional[str]
    updateTime: Optional[datetime]
    feedback : Optional[Attributes]
    @validator("text",pre=True)
    def check_lengths(cls, v, field):
        max_length = {
            "text": 1000,
        }.get(field.name, 0)

        if v and len(v) > max_length:
            raise ValueError(
                f"{field.name} must be less than or equal to {max_length} characters long"
            )
        return v

class ReviewIds(BaseModel):
    reviewIds : List[str]