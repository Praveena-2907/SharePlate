from sqlalchemy.orm import Session

from models.donation import Donation
from models.impact_metrics import ImpactMetrics


def _get_or_create_row(
    db: Session,
    donor_id: int | None = None,
    ngo_id: int | None = None,
    volunteer_id: int | None = None,
) -> ImpactMetrics:
    row = (
        db.query(ImpactMetrics)
        .filter(
            ImpactMetrics.donor_id == donor_id,
            ImpactMetrics.ngo_id == ngo_id,
            ImpactMetrics.volunteer_id == volunteer_id,
        )
        .first()
    )
    if row is None:
        row = ImpactMetrics(donor_id=donor_id, ngo_id=ngo_id, volunteer_id=volunteer_id)
        db.add(row)
        db.flush()
    return row


def record_donation_created(db: Session, donor_id: int) -> None:
    platform_row = _get_or_create_row(db)
    platform_row.total_donations += 1

    donor_row = _get_or_create_row(db, donor_id=donor_id)
    donor_row.total_donations += 1

    db.commit()


def record_delivery_completed(db: Session, donation: Donation) -> None:
    assignment = donation.assignment
    meals = int(donation.quantity)
    waste_kg = float(donation.quantity)

    scopes = [
        {},
        {"donor_id": donation.donor_id},
    ]
    if assignment is not None:
        if assignment.ngo_id is not None:
            scopes.append({"ngo_id": assignment.ngo_id})
        if assignment.volunteer_id is not None:
            scopes.append({"volunteer_id": assignment.volunteer_id})

    for scope in scopes:
        row = _get_or_create_row(db, **scope)
        row.meals_rescued += meals
        row.total_deliveries += 1
        row.food_waste_reduced_kg = float(row.food_waste_reduced_kg) + waste_kg
        row.community_reach += 1

    db.commit()
