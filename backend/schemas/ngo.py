from datetime import datetime

from pydantic import BaseModel, ConfigDict


class NGOBase(BaseModel):
    organization_name: str
    registration_number: str | None = None
    address: str | None = None
    description: str | None = None


class NGOCreate(NGOBase):
    user_id: int


class NGOOut(NGOBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    created_at: datetime
