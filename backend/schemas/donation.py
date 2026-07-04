from datetime import datetime

from pydantic import BaseModel, ConfigDict

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


class DonationOut(DonationBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    donor_id: int
    status: DonationStatus
    created_at: datetime
