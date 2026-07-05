from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from models.assignment import Assignment, AssignmentStatus
from models.donation import Donation, DonationStatus
from models.ngo import NGO
from models.user import User, UserRole
from models.volunteer import Volunteer
from schemas.donation import DonationCreate, DonationUpdate
from services import impact_service, notification_service


def _get_donation_or_404(db: Session, donation_id: int) -> Donation:
    donation = (
        db.query(Donation)
        .options(joinedload(Donation.assignment))
        .filter(Donation.id == donation_id)
        .first()
    )
    if donation is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Donation not found")
    return donation


def create_donation(db: Session, donor: User, donation_in: DonationCreate) -> Donation:
    donation = Donation(donor_id=donor.id, **donation_in.model_dump())
    db.add(donation)
    db.commit()
    db.refresh(donation)

    notification_service.notify_ngos_of_new_donation(db, donation)
    db.commit()

    impact_service.record_donation_created(db, donor_id=donor.id)

    return donation


def list_donations(db: Session, current_user: User) -> list[Donation]:
    query = db.query(Donation).options(joinedload(Donation.assignment))

    if current_user.role == UserRole.DONOR:
        query = query.filter(Donation.donor_id == current_user.id)
    elif current_user.role == UserRole.NGO:
        ngo = db.query(NGO).filter(NGO.user_id == current_user.id).first()
        ngo_id = ngo.id if ngo else -1
        query = query.outerjoin(Assignment).filter(
            (Donation.status == DonationStatus.PENDING) | (Assignment.ngo_id == ngo_id)
        )
    elif current_user.role == UserRole.VOLUNTEER:
        volunteer = db.query(Volunteer).filter(Volunteer.user_id == current_user.id).first()
        volunteer_id = volunteer.id if volunteer else -1
        query = query.join(Assignment).filter(Assignment.volunteer_id == volunteer_id)
    # ADMIN sees everything

    return query.order_by(Donation.created_at.desc()).all()


def update_donation(
    db: Session, donation_id: int, donor: User, donation_in: DonationUpdate
) -> Donation:
    donation = _get_donation_or_404(db, donation_id)
    if donation.donor_id != donor.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your donation")
    if donation.status != DonationStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending donations can be edited",
        )

    for field, value in donation_in.model_dump(exclude_unset=True).items():
        setattr(donation, field, value)

    db.commit()
    db.refresh(donation)
    return donation


def delete_donation(db: Session, donation_id: int, donor: User) -> None:
    donation = _get_donation_or_404(db, donation_id)
    if donation.donor_id != donor.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your donation")
    if donation.status != DonationStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending donations can be deleted",
        )

    db.delete(donation)
    db.commit()


def claim_donation(db: Session, donation_id: int, ngo_user: User) -> Donation:
    ngo = db.query(NGO).filter(NGO.user_id == ngo_user.id).first()
    if ngo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="NGO profile not found")

    donation = _get_donation_or_404(db, donation_id)
    if donation.status != DonationStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending donations can be claimed",
        )

    donation.status = DonationStatus.CLAIMED
    assignment = Assignment(donation_id=donation.id, ngo_id=ngo.id, status=AssignmentStatus.ASSIGNED)
    db.add(assignment)
    db.flush()

    notification_service.create_notification(
        db,
        user_id=donation.donor_id,
        title="Donation claimed",
        message="Your donation has been claimed.",
    )

    db.commit()
    db.refresh(donation)
    return donation


def assign_volunteer(db: Session, donation_id: int, volunteer_id: int, ngo_user: User) -> Donation:
    ngo = db.query(NGO).filter(NGO.user_id == ngo_user.id).first()
    if ngo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="NGO profile not found")

    donation = _get_donation_or_404(db, donation_id)
    assignment = donation.assignment
    if assignment is None or assignment.ngo_id != ngo.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You have not claimed this donation",
        )
    if donation.status != DonationStatus.CLAIMED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A volunteer can only be assigned to a claimed donation",
        )

    volunteer = db.query(Volunteer).filter(Volunteer.id == volunteer_id).first()
    if volunteer is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Volunteer not found")

    assignment.volunteer_id = volunteer.id
    donation.status = DonationStatus.ASSIGNED

    notification_service.create_notification(
        db,
        user_id=volunteer.user_id,
        title="New assignment",
        message=(
            f"You have been assigned to collect a donation of {donation.quantity} "
            f"{donation.unit} of {donation.food_type}."
        ),
    )
    notification_service.create_notification(
        db,
        user_id=donation.donor_id,
        title="Volunteer assigned",
        message="A volunteer has been assigned to collect your donation.",
    )

    db.commit()
    db.refresh(donation)
    return donation


def _require_assigned_volunteer(db: Session, donation: Donation, volunteer_user: User) -> Volunteer:
    volunteer = db.query(Volunteer).filter(Volunteer.user_id == volunteer_user.id).first()
    assignment = donation.assignment
    if volunteer is None or assignment is None or assignment.volunteer_id != volunteer.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not assigned to this donation",
        )
    return volunteer


def mark_pickup(db: Session, donation_id: int, volunteer_user: User) -> Donation:
    donation = _get_donation_or_404(db, donation_id)
    _require_assigned_volunteer(db, donation, volunteer_user)

    if donation.status != DonationStatus.ASSIGNED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Donation must be assigned before pickup",
        )

    donation.status = DonationStatus.PICKED_UP
    donation.assignment.status = AssignmentStatus.IN_PROGRESS

    db.commit()
    db.refresh(donation)
    return donation


def mark_transit(db: Session, donation_id: int, volunteer_user: User) -> Donation:
    donation = _get_donation_or_404(db, donation_id)
    _require_assigned_volunteer(db, donation, volunteer_user)

    if donation.status != DonationStatus.PICKED_UP:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Donation must be picked up before it can be marked in transit",
        )

    donation.status = DonationStatus.IN_TRANSIT

    notification_service.create_notification(
        db,
        user_id=donation.donor_id,
        title="Donation in transit",
        message="Your donation is on its way to the NGO.",
    )
    notification_service.create_notification(
        db,
        user_id=donation.assignment.ngo.user_id,
        title="Donation in transit",
        message="The donation you claimed is on its way.",
    )

    db.commit()
    db.refresh(donation)
    return donation


def mark_delivered(db: Session, donation_id: int, volunteer_user: User) -> Donation:
    donation = _get_donation_or_404(db, donation_id)
    _require_assigned_volunteer(db, donation, volunteer_user)

    if donation.status != DonationStatus.IN_TRANSIT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Donation must be in transit before it can be marked delivered",
        )

    donation.status = DonationStatus.DELIVERED
    donation.assignment.status = AssignmentStatus.COMPLETED
    donation.assignment.completed_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(donation)

    impact_service.record_delivery_completed(db, donation)

    return donation
