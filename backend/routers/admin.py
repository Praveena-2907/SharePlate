from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.user import User, UserRole
from auth import require_roles

router = APIRouter(prefix="/admin", tags=["Admin"])
@router.get("/pending-users")
def get_pending_users(
    db: Session = Depends(get_db)
):
    users = (
        db.query(User)
        .filter(User.is_active == False)
        .all()
    )
    return [
    {
        "id": user.id,
        "name": user.full_name,
        "email": user.email,
        "role": user.role.value,
        "submittedAt": user.created_at.isoformat() if user.created_at else None
    }
    for user in users
]

   
@router.put("/approve/{user_id}")
def approve_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        return {"error": "User not found"}

    user.is_active = True
    db.commit()

    return {"message": "User approved successfully"}