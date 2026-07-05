from database import SessionLocal
from models.user import User, UserRole
from auth import hash_password

db = SessionLocal()

admin_email = "admin@shareplate.com"

existing_admin = db.query(User).filter(
    User.email == admin_email
).first()

if existing_admin:
    print("Admin already exists!")
else:
    admin = User(
        email=admin_email,
        hashed_password=hash_password("admin123"),
        full_name="System Admin",
        phone="9999999999",
        role=UserRole.ADMIN,
        is_active=True
    )

    db.add(admin)
    db.commit()

    print("Admin created successfully!")