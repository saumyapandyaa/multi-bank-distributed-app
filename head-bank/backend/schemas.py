from pydantic import BaseModel, HttpUrl
from typing import Optional


class BankRead(BaseModel):
    bank_id: str
    name: Optional[str] = None
    base_url: HttpUrl
    is_active: bool = True
