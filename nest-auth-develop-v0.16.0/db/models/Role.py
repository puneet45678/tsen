from pydantic import BaseModel
from typing import List, Optional

class Role(BaseModel):
    role: Optional[str] = None
    permissions: Optional[List[str]] = None


