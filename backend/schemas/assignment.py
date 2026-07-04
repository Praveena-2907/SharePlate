from datetime import datetime

from pydantic import BaseModel, ConfigDict

from models.assignment import AssignmentStatus


class AssignmentBase(BaseModel):
    donation_id: int
    ngo_id: int
    volunteer_id: int | None = None


class AssignmentCreate(AssignmentBase):
    pass


class AssignmentOut(AssignmentBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: AssignmentStatus
    assigned_at: datetime
    completed_at: datetime | None = None
