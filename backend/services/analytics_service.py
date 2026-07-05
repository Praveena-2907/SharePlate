import calendar
from datetime import datetime, timezone

from sqlalchemy import extract, func
from sqlalchemy.orm import Session

from models.assignment import Assignment, AssignmentStatus
from models.donation import Donation, DonationStatus
from models.impact_metrics import ImpactMetrics
from models.ngo import NGO
from models.user import User, UserRole
from models.volunteer import Volunteer


def _last_6_months() -> list[tuple[int, int]]:
    now = datetime.now(timezone.utc)
    result = []
    for i in range(5, -1, -1):
        month = now.month - i
        year = now.year
        while month <= 0:
            month += 12
            year -= 1
        result.append((year, month))
    return result


def _month_label(year: int, month: int) -> str:
    return f"{calendar.month_abbr[month]} '{str(year)[2:]}"


def _get_impact(db: Session, **filters) -> ImpactMetrics | None:
    q = db.query(ImpactMetrics)
    for k, v in filters.items():
        q = q.filter(getattr(ImpactMetrics, k) == v)
    return q.first()


# ---------------------------------------------------------------------------
# Donor
# ---------------------------------------------------------------------------
def get_donor_analytics(db: Session, user: User) -> dict:
    metrics = _get_impact(db, donor_id=user.id, ngo_id=None, volunteer_id=None)

    status_counts: dict = dict(
        db.query(Donation.status, func.count(Donation.id))
        .filter(Donation.donor_id == user.id)
        .group_by(Donation.status)
        .all()
    )
    total = sum(status_counts.values())

    monthly_trend = []
    for year, month in _last_6_months():
        donations_count = (
            db.query(func.count(Donation.id))
            .filter(
                Donation.donor_id == user.id,
                extract("year", Donation.created_at) == year,
                extract("month", Donation.created_at) == month,
            )
            .scalar()
            or 0
        )
        meals = (
            db.query(func.coalesce(func.sum(Donation.quantity), 0))
            .filter(
                Donation.donor_id == user.id,
                Donation.status == DonationStatus.DELIVERED,
                extract("year", Donation.created_at) == year,
                extract("month", Donation.created_at) == month,
            )
            .scalar()
            or 0
        )
        monthly_trend.append(
            {
                "month": _month_label(year, month),
                "donations": donations_count,
                "meals": int(float(meals)),
            }
        )

    return {
        "role": "donor",
        "total_donations": total,
        "delivered_donations": status_counts.get(DonationStatus.DELIVERED, 0),
        "pending_donations": status_counts.get(DonationStatus.PENDING, 0),
        "meals_donated": metrics.meals_rescued if metrics else 0,
        "food_waste_reduced_kg": float(metrics.food_waste_reduced_kg) if metrics else 0.0,
        "monthly_trend": monthly_trend,
    }


# ---------------------------------------------------------------------------
# Volunteer
# ---------------------------------------------------------------------------
def get_volunteer_analytics(db: Session, user: User) -> dict:
    volunteer = db.query(Volunteer).filter(Volunteer.user_id == user.id).first()

    months = _last_6_months()
    if volunteer:
        metrics = _get_impact(db, volunteer_id=volunteer.id, donor_id=None, ngo_id=None)
        deliveries_completed = metrics.total_deliveries if metrics else 0
        meals_delivered = metrics.meals_rescued if metrics else 0

        active_count = (
            db.query(func.count(Assignment.id))
            .filter(
                Assignment.volunteer_id == volunteer.id,
                Assignment.status.in_([AssignmentStatus.ASSIGNED, AssignmentStatus.IN_PROGRESS]),
            )
            .scalar()
            or 0
        )

        monthly_trend = []
        for year, month in months:
            count = (
                db.query(func.count(Assignment.id))
                .join(Donation, Assignment.donation_id == Donation.id)
                .filter(
                    Assignment.volunteer_id == volunteer.id,
                    Donation.status == DonationStatus.DELIVERED,
                    extract("year", Donation.created_at) == year,
                    extract("month", Donation.created_at) == month,
                )
                .scalar()
                or 0
            )
            monthly_trend.append({"month": _month_label(year, month), "deliveries": count})
    else:
        deliveries_completed = 0
        meals_delivered = 0
        active_count = 0
        monthly_trend = [{"month": _month_label(y, m), "deliveries": 0} for y, m in months]

    return {
        "role": "volunteer",
        "deliveries_completed": deliveries_completed,
        "meals_delivered": meals_delivered,
        "active_deliveries": active_count,
        "monthly_trend": monthly_trend,
    }


# ---------------------------------------------------------------------------
# NGO
# ---------------------------------------------------------------------------
def get_ngo_analytics(db: Session, user: User) -> dict:
    ngo = db.query(NGO).filter(NGO.user_id == user.id).first()

    months = _last_6_months()
    if ngo:
        metrics = _get_impact(db, ngo_id=ngo.id, donor_id=None, volunteer_id=None)
        donations_claimed = metrics.total_donations if metrics else 0
        donations_delivered = metrics.total_deliveries if metrics else 0
        volunteers_managed = (
            db.query(func.count(func.distinct(Assignment.volunteer_id)))
            .filter(Assignment.ngo_id == ngo.id, Assignment.volunteer_id.isnot(None))
            .scalar()
            or 0
        )

        monthly_trend = []
        for year, month in months:
            claimed = (
                db.query(func.count(Assignment.id))
                .filter(
                    Assignment.ngo_id == ngo.id,
                    extract("year", Assignment.assigned_at) == year,
                    extract("month", Assignment.assigned_at) == month,
                )
                .scalar()
                or 0
            )
            delivered = (
                db.query(func.count(Assignment.id))
                .join(Donation, Assignment.donation_id == Donation.id)
                .filter(
                    Assignment.ngo_id == ngo.id,
                    Donation.status == DonationStatus.DELIVERED,
                    extract("year", Donation.created_at) == year,
                    extract("month", Donation.created_at) == month,
                )
                .scalar()
                or 0
            )
            monthly_trend.append(
                {"month": _month_label(year, month), "claimed": claimed, "delivered": delivered}
            )
    else:
        donations_claimed = 0
        donations_delivered = 0
        volunteers_managed = 0
        monthly_trend = [
            {"month": _month_label(y, m), "claimed": 0, "delivered": 0} for y, m in months
        ]

    return {
        "role": "ngo",
        "donations_claimed": donations_claimed,
        "donations_delivered": donations_delivered,
        "volunteers_managed": volunteers_managed,
        "monthly_trend": monthly_trend,
    }


# ---------------------------------------------------------------------------
# Admin
# ---------------------------------------------------------------------------
def get_admin_analytics(db: Session) -> dict:
    platform = _get_impact(db, donor_id=None, ngo_id=None, volunteer_id=None)

    total_meals = platform.meals_rescued if platform else 0
    total_food_kg = float(platform.food_waste_reduced_kg) if platform else 0.0
    total_deliveries = platform.total_deliveries if platform else 0

    active_ngos = db.query(func.count(NGO.id)).scalar() or 0
    active_volunteers = db.query(func.count(Volunteer.id)).scalar() or 0
    total_donors = (
        db.query(func.count(User.id)).filter(User.role == UserRole.DONOR).scalar() or 0
    )
    total_donations_db = db.query(func.count(Donation.id)).scalar() or 0

    status_counts: dict = dict(
        db.query(Donation.status, func.count(Donation.id)).group_by(Donation.status).all()
    )
    total_all = sum(status_counts.values()) or 1
    delivered_count = status_counts.get(DonationStatus.DELIVERED, 0)
    success_rate = round((delivered_count / total_all) * 100, 1)

    monthly_trend = []
    for year, month in _last_6_months():
        created = (
            db.query(func.count(Donation.id))
            .filter(
                extract("year", Donation.created_at) == year,
                extract("month", Donation.created_at) == month,
            )
            .scalar()
            or 0
        )
        delivered_m = (
            db.query(func.count(Donation.id))
            .filter(
                Donation.status == DonationStatus.DELIVERED,
                extract("year", Donation.created_at) == year,
                extract("month", Donation.created_at) == month,
            )
            .scalar()
            or 0
        )
        monthly_trend.append(
            {"month": _month_label(year, month), "donations": created, "delivered": delivered_m}
        )

    recent_donations = (
        db.query(Donation).order_by(Donation.created_at.desc()).limit(10).all()
    )
    activities = [
        {
            "text": f"{d.food_type} — {int(d.quantity)} {d.unit}",
            "status": d.status.value,
            "time": d.created_at.isoformat(),
        }
        for d in recent_donations
    ]

    status_distribution = [
        {
            "name": "Delivered",
            "value": status_counts.get(DonationStatus.DELIVERED, 0),
            "color": "#22C55E",
        },
        {
            "name": "In Transit",
            "value": (
                status_counts.get(DonationStatus.IN_TRANSIT, 0)
                + status_counts.get(DonationStatus.PICKED_UP, 0)
            ),
            "color": "#3B82F6",
        },
        {
            "name": "Pending",
            "value": status_counts.get(DonationStatus.PENDING, 0),
            "color": "#FBBF24",
        },
        {
            "name": "Processing",
            "value": (
                status_counts.get(DonationStatus.CLAIMED, 0)
                + status_counts.get(DonationStatus.ASSIGNED, 0)
            ),
            "color": "#8B5CF6",
        },
        {
            "name": "Cancelled",
            "value": status_counts.get(DonationStatus.CANCELLED, 0),
            "color": "#9CA3AF",
        },
    ]

    return {
        "role": "admin",
        "total_meals_rescued": total_meals,
        "total_food_saved_kg": total_food_kg,
        "active_ngos": active_ngos,
        "active_volunteers": active_volunteers,
        "total_donors": total_donors,
        "total_donations": total_donations_db,
        "delivered_donations": total_deliveries,
        "success_rate": success_rate,
        "monthly_trend": monthly_trend,
        "status_distribution": status_distribution,
        "recent_activities": activities,
    }
