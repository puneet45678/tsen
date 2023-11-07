from fastapi import UploadFile
from pydantic import BaseModel

class NotificationDataModel(BaseModel):
    image: UploadFile
    content: str
    title: str