from datetime import datetime

from pydantic import BaseModel, ConfigDict


class VolunteerBase(BaseModel):
    availability: str | None = None
    vehicle_info: str | None = None
    service_area: str | None = None


class VolunteerCreate(VolunteerBase):
    user_id: int


class VolunteerOut(VolunteerBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    created_at: datetime


class VolunteerAvailabilityUpdate(BaseModel):
    is_available: bool


class VolunteerAvailabilityOut(BaseModel):
    id: int
    user_id: int
    full_name: str
    availability: str | None = None
    is_available: bool
