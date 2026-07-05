from sqlalchemy.orm import Session

from fastapi import HTTPException, status

from models.notification import Notification
from models.user import User, UserRole


def create_notification(db: Session, user_id: int, title: str, message: str) -> Notification:
    notification = Notification(user_id=user_id, title=title, message=message)
    db.add(notification)
    return notification


def notify_ngos_of_new_donation(db: Session, donation) -> None:
    ngo_user_ids = [row[0] for row in db.query(User.id).filter(User.role == UserRole.NGO).all()]
    for user_id in ngo_user_ids:
        create_notification(
            db,
            user_id=user_id,
            title="New donation available",
            message=(
                f"A new donation of {donation.quantity} {donation.unit} of "
                f"{donation.food_type} is available for pickup."
            ),
        )


def list_notifications_for_user(db: Session, user: User) -> list[Notification]:
    return (
        db.query(Notification)
        .filter(Notification.user_id == user.id)
        .order_by(Notification.created_at.desc())
        .all()
    )


def mark_notification_read(db: Session, notification_id: int, user: User) -> Notification:
    notification = (
        db.query(Notification)
        .filter(Notification.id == notification_id, Notification.user_id == user.id)
        .first()
    )
    if notification is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")

    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification
