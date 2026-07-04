from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class Volunteer(Base):
    __tablename__ = "volunteers"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    availability: Mapped[str | None] = mapped_column(String(255), nullable=True)
    vehicle_info: Mapped[str | None] = mapped_column(String(255), nullable=True)
    service_area: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user: Mapped["User"] = relationship("User", back_populates="volunteer_profile")
    assignments: Mapped[list["Assignment"]] = relationship(
        "Assignment", back_populates="volunteer", cascade="all, delete-orphan"
    )
