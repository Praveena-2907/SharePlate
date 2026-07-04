from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class ImpactMetrics(Base):
    __tablename__ = "impact_metrics"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    donor_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=True
    )
    ngo_id: Mapped[int | None] = mapped_column(ForeignKey("ngos.id", ondelete="CASCADE"), nullable=True)
    volunteer_id: Mapped[int | None] = mapped_column(
        ForeignKey("volunteers.id", ondelete="CASCADE"), nullable=True
    )
    meals_rescued: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_donations: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_deliveries: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    donor: Mapped["User"] = relationship("User")
    ngo: Mapped["NGO"] = relationship("NGO")
    volunteer: Mapped["Volunteer"] = relationship("Volunteer")
