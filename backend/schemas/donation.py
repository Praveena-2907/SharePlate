from datetime import datetime

from pydantic import BaseModel, ConfigDict

from models.assignment import AssignmentStatus
from models.donation import DonationStatus


class DonationBase(BaseModel):
    food_type: str
    quantity: float
    unit: str
    description: str | None = None
    pickup_address: str
    pickup_time: datetime | None = None
    expiry_time: datetime | None = None


class DonationCreate(DonationBase):
    pass


class DonationUpdate(BaseModel):
    food_type: str | None = None
    quantity: float | None = None
    unit: str | None = None
    description: str | None = None
    pickup_address: str | None = None
    pickup_time: datetime | None = None
    expiry_time: datetime | None = None


class AssignmentSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    ngo_id: int
    volunteer_id: int | None = None
    status: AssignmentStatus
    assigned_at: datetime
    completed_at: datetime | None = None


class DonationOut(DonationBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    donor_id: int
    status: DonationStatus
    created_at: datetime
    assignment: AssignmentSummary | None = None


class AssignVolunteerRequest(BaseModel):
    donation_id: int
    volunteer_id: int
