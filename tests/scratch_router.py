

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from backend.db.database import SessionLocal
from backend.core import get_current_user, require_role, hashing_mdp
from backend.models import User

router = APIRouter()

@router.get("/scratch/whoami")
def whoami(user: User = Depends(get_current_user)):
    return {"username": user.username, "role": user.role}  # à toi : renvoie username et role de `user`

@router.get("/scratch/admin-only")
def admin_only(user: User = Depends(require_role("admin"))):
    return {"message": f"Bienvenue {user.username}"}

@router.get("/scratch/staff-only")
def staff_only(user: User = Depends(require_role("admin", "staff"))):
    return {"message": f"Bienvenue {user.username}"}

class UserLogin(BaseModel) :
    username: str
    password: str

@router.post("/scratch/admin", status_code=201)
def post_adm():
    try:
        db = SessionLocal()
        adm = db.query(User).filter_by(username="admin123").first()
        if adm:
            raise HTTPException(status_code=400, detail="Resource déjà existante")
        db.add(User(
            first_name="John",
            last_name="Harbackle",
            username="admin123",
            hashed_password=hashing_mdp("Admin@123456"),
            role="admin"
        ))
        db.commit()
    finally:
        db.close()


@router.delete("/scratch/admin", status_code=204)
def supp_adm():
    try:
        db = SessionLocal()
        adm = db.query(User).filter_by(username="admin123").first()
        if adm:
            db.delete(adm)
            db.commit()
        else :
            raise HTTPException(status_code=404, detail="Resource non existante")
    finally:
        db.close()

@router.post("/scratch/staff", status_code=201)
def getPost_staff():
    try:
        db = SessionLocal()
        staff = db.query(User).filter_by(username="staff123").first()
        if staff:
            raise HTTPException(status_code=400, detail="Resource déjà existante")
        db.add(User(
            first_name="Johnny",
            last_name="Babackle",
            username="staff123",
            hashed_password=hashing_mdp("Staff@123456"),
            role="staff"
        ))
        db.commit()
    finally:
        db.close()

@router.delete("/scratch/staff", status_code=204)
def supp_staff():
    try:
        db = SessionLocal()
        staff = db.query(User).filter_by(username="staff123").first()
        if staff:
            db.delete(staff)
            db.commit()
        else :
            raise HTTPException(status_code=404, detail="Resource non existante")
    finally:
        db.close()