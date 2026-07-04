import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class AssignmentStatus(str, enum.Enum):
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Assignment(Base):
    __tablename__ = "assignments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    donation_id: Mapped[int] = mapped_column(
        ForeignKey("donations.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    ngo_id: Mapped[int] = mapped_column(ForeignKey("ngos.id", ondelete="CASCADE"), nullable=False)
    volunteer_id: Mapped[int | None] = mapped_column(
        ForeignKey("volunteers.id", ondelete="SET NULL"), nullable=True
    )
    status: Mapped[AssignmentStatus] = mapped_column(
        Enum(AssignmentStatus), default=AssignmentStatus.ASSIGNED, nullable=False, index=True
    )
    assigned_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    donation: Mapped["Donation"] = relationship("Donation", back_populates="assignment")
    ngo: Mapped["NGO"] = relationship("NGO", back_populates="assignments")
    volunteer: Mapped["Volunteer"] = relationship("Volunteer", back_populates="assignments")
