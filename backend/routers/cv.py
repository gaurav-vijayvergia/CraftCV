from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import CV, User
from ..schemas import CVCreate, CV as CVSchema
from ..dependencies import get_current_user

router = APIRouter()

@router.post("/", response_model=CVSchema)
async def create_cv(
    cv: CVCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_cv = CV(**cv.model_dump(), user_id=current_user.id)
    db.add(db_cv)
    db.commit()
    db.refresh(db_cv)
    return db_cv

@router.get("/", response_model=List[CVSchema])
async def get_cvs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(CV).filter(CV.user_id == current_user.id).all()

@router.patch("/{cv_id}/status")
async def update_cv_status(
    cv_id: str,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cv = db.query(CV).filter(CV.id == cv_id, CV.user_id == current_user.id).first()
    if not cv:
        raise HTTPException(status_code=404, detail="CV not found")
    
    cv.status = status
    db.commit()
    return {"success": True}