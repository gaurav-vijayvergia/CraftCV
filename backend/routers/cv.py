from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import CV, User
from ..schemas import CVCreate, CV as CVSchema, BulkCVUpload, CVUpdate
from ..dependencies import get_current_user
import aiofiles
import os
from uuid import uuid4

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def save_upload_file(file: UploadFile) -> str:
    file_extension = os.path.splitext(file.filename)[1]
    file_name = f"{uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, file_name)
    
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
    
    return file_path

@router.post("/upload", response_model=List[CVSchema])
async def upload_cvs(
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    uploaded_cvs = []
    for file in files:
        file_path = await save_upload_file(file)
        cv = CV(
            user_id=current_user.id,
            original_filename=file.filename,
            file_url=file_path
        )
        db.add(cv)
        uploaded_cvs.append(cv)
    
    db.commit()
    for cv in uploaded_cvs:
        db.refresh(cv)
    
    return uploaded_cvs

@router.get("/", response_model=List[CVSchema])
async def get_cvs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(CV).filter(CV.user_id == current_user.id).all()

@router.patch("/{cv_id}", response_model=CVSchema)
async def update_cv_status(
    cv_id: str,
    cv_update: CVUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cv = db.query(CV).filter(CV.id == cv_id, CV.user_id == current_user.id).first()
    if not cv:
        raise HTTPException(status_code=404, detail="CV not found")
    
    cv.status = cv_update.status
    db.commit()
    db.refresh(cv)
    return cv