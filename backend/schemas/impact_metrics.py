from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ImpactMetricsOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    donor_id: int | None = None
    ngo_id: int | None = None
    volunteer_id: int | None = None
    meals_rescued: int
    total_donations: int
    total_deliveries: int
    updated_at: datetime
