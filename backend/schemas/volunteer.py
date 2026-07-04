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
