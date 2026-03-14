from pydantic import BaseModel, HttpUrl, Field
from typing import Optional

from datetime import datetime


class UrlRequestRecord(BaseModel):
    url: HttpUrl
    preferred_alias: Optional[str] = Field(default=None, min_length=5, max_length=20)
    description: Optional[str] = Field(default=None, max_length=255)


class UrlResponseRecord(BaseModel):
    alias: str
    original_url: str
    short_url: str
    description: Optional[str] = None
    total_clicks: int
    is_active: bool
    created_at: datetime


class UrlListResponse(BaseModel):
    urls: list[UrlResponseRecord]
    total: int

