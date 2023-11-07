from pydantic import BaseModel,Field
from typing import List, Optional

class UserPermission(BaseModel):
    permissions: List = []