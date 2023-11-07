from pydantic import BaseModel


class WebPushContentModel(BaseModel):
    title: str = ""
    body: str = ""
    tokens: list = []
