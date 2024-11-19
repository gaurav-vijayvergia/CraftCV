from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import CV, User
from ..schemas import CVCreate, CV as CVSchema, BulkCVUpload, CVUpdate
from ..dependencies import get_current_user
from ..services.cv_parser import CVParser
import aiofiles
import os
from uuid import uuid4
import json

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

cv_parser = CVParser()

async def save_upload_file(file: UploadFile) -> str:
    file_extension = os.path.splitext(file.filename)[1]
    file_name = f"{uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, file_name)
    
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
    
    return file_path

async def delete_file(file_path: str):
    if os.path.exists(file_path):
        os.remove(file_path)

@router.post("/upload", response_model=List[CVSchema])
async def upload_cvs(
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    uploaded_cvs = []
    for file in files:
        try:
            # Save the file
            file_path = await save_upload_file(file)
            
            # Parse the CV using LLM
            parsed_data = await cv_parser.parse_cv(file_path)
            
            # Create CV record with parsed data
            cv = CV(
                user_id=current_user.id,
                original_filename=file.filename,
                file_url=file_path,
                parsed_data=parsed_data
            )
            db.add(cv)
            uploaded_cvs.append(cv)
            
        except Exception as e:
            # If parsing fails, still save the CV but without parsed data
            cv = CV(
                user_id=current_user.id,
                original_filename=file.filename,
                file_url=file_path
            )
            db.add(cv)
            uploaded_cvs.append(cv)
            print(f"Error processing CV {file.filename}: {str(e)}")
    
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

@router.get("/{cv_id}/parsed-data")
async def get_cv_parsed_data(
    cv_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cv = db.query(CV).filter(CV.id == cv_id, CV.user_id == current_user.id).first()
    if not cv:
        raise HTTPException(status_code=404, detail="CV not found")
    
    if not cv.parsed_data:
        raise HTTPException(status_code=404, detail="No parsed data available for this CV")
    
    return cv.parsed_data

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

@router.delete("/{cv_id}")
async def delete_cv(
    cv_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cv = db.query(CV).filter(CV.id == cv_id, CV.user_id == current_user.id).first()
    if not cv:
        raise HTTPException(status_code=404, detail="CV not found")
    
    # Delete the file
    if cv.file_url:
        await delete_file(cv.file_url)
    
    # Delete from database
    db.delete(cv)
    db.commit()
    
    return {"success": True}