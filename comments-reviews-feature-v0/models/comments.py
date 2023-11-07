from pydantic import BaseModel,Field , validator
from typing import Optional , List
from datetime import datetime
from enum import Enum
class CommentInput(BaseModel):   
  data: str
  campaignId: str 
  commentBy : str 
  class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "data":{},
                "campaignId":"", 
                "commentBy":""
            }
        } 

class ReportData(BaseModel):
    reportedBy : str
    reportReason : str = ""
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
class commentReviewsDb(BaseModel):
    comment : str
    commentImage : Optional[str]
    pin:bool
    commentBy:str
    replies: Optional[List[str]]
    likedBy: Optional[List[str]]
    lastEdited:datetime = Field(..., description="UTC datetime of the comment")
    creationDate: datetime = Field(..., description="UTC datetime of the comment")
    reported : bool
    reportData : Optional[List[ReportData]]

class ReplyDB(BaseModel):
    replyComment : str
    replyImage : Optional[str]
    replyBy : str  
    replyTo : Optional[str]
    lastEdited: datetime
    creationDate: datetime
    likedBy: Optional[List[str]]
    reported : bool
    reportData : Optional[List[ReportData]] 
class CommentResponse(BaseModel):
    data: dict    
    uniqueCommentId: str
    likes: int
    path: str
    lastEdited: datetime
    sentiment: str
    commentBy: str
    creationDate: datetime
    replies: int
    pin:bool
    
    
class ReplyInput(BaseModel):
    data: str
    replyBy : str 
    class Config:
            allow_population_by_field_name = True
            schema_extra = {
                "example": {
                    "data":"",
                    "replyBy":""
                }
            } 
        
    
class ReplyResponse(BaseModel):
    data: dict
    uniqueReplyId: str
    likes: int
    lastEdited: datetime
    creationDate: datetime
    replyBy:str 
    
    
class CommentFor(str,Enum):
    CAMPAIGN = "campaign"
    MODEL = "model"
    PORTFOLIO = "portfolio"
    UPDATE = "update"

class CommentIds(BaseModel):
    commentIds : Optional[List[str]]
      
class ReplyIds(BaseModel):
    replyIds : Optional[List[str]]