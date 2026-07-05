from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models.user import User, UserRole
from services import analytics_service

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/me")
def get_my_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return role-specific impact analytics for the authenticated user."""
    if current_user.role == UserRole.DONOR:
        return analytics_service.get_donor_analytics(db, current_user)
    elif current_user.role == UserRole.VOLUNTEER:
        return analytics_service.get_volunteer_analytics(db, current_user)
    elif current_user.role == UserRole.NGO:
        return analytics_service.get_ngo_analytics(db, current_user)
    else:  # ADMIN
        return analytics_service.get_admin_analytics(db)
