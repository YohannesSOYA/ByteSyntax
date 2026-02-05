from pydantic import BaseModel
from typing import Optional

class AdminUpdate(BaseModel):
    username: Optional[str] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
