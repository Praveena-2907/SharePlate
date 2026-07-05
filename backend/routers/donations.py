from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from auth import get_current_user, require_roles
from database import get_db
from models.user import User, UserRole
from schemas.donation import (
    AssignVolunteerRequest,
    DonationCreate,
    DonationOut,
    DonationUpdate,
)
from services import donation_service

router = APIRouter(tags=["donations"])


@router.get("/donations", response_model=list[DonationOut])
def list_donations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return donation_service.list_donations(db, current_user)


@router.post("/donations", response_model=DonationOut, status_code=status.HTTP_201_CREATED)
def create_donation(
    donation_in: DonationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.DONOR)),
):
    return donation_service.create_donation(db, current_user, donation_in)


@router.patch("/donations/{donation_id}", response_model=DonationOut)
def update_donation(
    donation_id: int,
    donation_in: DonationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.DONOR)),
):
    return donation_service.update_donation(db, donation_id, current_user, donation_in)


@router.delete("/donations/{donation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_donation(
    donation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.DONOR)),
):
    donation_service.delete_donation(db, donation_id, current_user)


@router.post("/donations/{donation_id}/claim", response_model=DonationOut)
def claim_donation(
    donation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.NGO)),
):
    return donation_service.claim_donation(db, donation_id, current_user)


@router.post("/assign-volunteer", response_model=DonationOut)
def assign_volunteer(
    payload: AssignVolunteerRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.NGO)),
):
    return donation_service.assign_volunteer(
        db, payload.donation_id, payload.volunteer_id, current_user
    )


@router.patch("/donations/{donation_id}/pickup", response_model=DonationOut)
def pickup_donation(
    donation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.VOLUNTEER)),
):
    return donation_service.mark_pickup(db, donation_id, current_user)


@router.patch("/donations/{donation_id}/transit", response_model=DonationOut)
def transit_donation(
    donation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.VOLUNTEER)),
):
    return donation_service.mark_transit(db, donation_id, current_user)


@router.patch("/donations/{donation_id}/deliver", response_model=DonationOut)
def deliver_donation(
    donation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.VOLUNTEER)),
):
    return donation_service.mark_delivered(db, donation_id, current_user)
