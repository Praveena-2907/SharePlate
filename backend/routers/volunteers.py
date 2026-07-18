from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from auth import require_roles
from database import get_db
from models.assignment import Assignment, AssignmentStatus
from models.user import User, UserRole
from models.volunteer import Volunteer
from schemas.volunteer import VolunteerAvailabilityOut, VolunteerAvailabilityUpdate

router = APIRouter(prefix="/volunteers", tags=["volunteers"])

ACTIVE_ASSIGNMENT_STATUSES = (AssignmentStatus.ASSIGNED, AssignmentStatus.IN_PROGRESS)
AVAILABLE_VALUE = "available"


def _to_availability_out(volunteer: Volunteer) -> VolunteerAvailabilityOut:
    return VolunteerAvailabilityOut(
        id=volunteer.id,
        user_id=volunteer.user_id,
        full_name=volunteer.user.full_name,
        availability=volunteer.availability,
        is_available=volunteer.availability == AVAILABLE_VALUE,
    )


def _get_current_volunteer_or_404(db: Session, user: User) -> Volunteer:
    volunteer = (
        db.query(Volunteer)
        .options(joinedload(Volunteer.user))
        .filter(Volunteer.user_id == user.id)
        .first()
    )
    if volunteer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Volunteer profile not found",
        )
    return volunteer


@router.get("/me", response_model=VolunteerAvailabilityOut)
def get_my_availability(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.VOLUNTEER)),
):
    volunteer = _get_current_volunteer_or_404(db, current_user)
    return _to_availability_out(volunteer)


@router.patch("/me/availability", response_model=VolunteerAvailabilityOut)
def update_my_availability(
    payload: VolunteerAvailabilityUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.VOLUNTEER)),
):
    volunteer = _get_current_volunteer_or_404(db, current_user)
    volunteer.availability = AVAILABLE_VALUE if payload.is_available else None
    db.commit()
    db.refresh(volunteer)
    return _to_availability_out(volunteer)


@router.get("/available", response_model=list[VolunteerAvailabilityOut])
def list_available_volunteers(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.NGO)),
):
    busy_volunteer_ids = (
        db.query(Assignment.volunteer_id)
        .filter(
            Assignment.volunteer_id.isnot(None),
            Assignment.status.in_(ACTIVE_ASSIGNMENT_STATUSES),
        )
        .subquery()
    )

    volunteers = (
        db.query(Volunteer)
        .options(joinedload(Volunteer.user))
        .filter(
            Volunteer.availability == AVAILABLE_VALUE,
            Volunteer.id.notin_(busy_volunteer_ids),
        )
        .order_by(Volunteer.id.asc())
        .all()
    )
    return [_to_availability_out(volunteer) for volunteer in volunteers]