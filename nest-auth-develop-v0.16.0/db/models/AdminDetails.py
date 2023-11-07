from pydantic import BaseModel
from typing import List, Optional
from db.models.Role import Role

class AdminDetails(BaseModel):
    user_id: Optional[str] = None
    email: Optional[str] = None
    roles: Optional[List[Role]] = None