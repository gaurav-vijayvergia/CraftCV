from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Organization, User
from ..schemas import OrganizationCreate, Organization as OrganizationSchema
from ..dependencies import get_current_user
import aiofiles
import os
from uuid import uuid4

router = APIRouter()

UPLOAD_DIR = "uploads/organization"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def save_upload_file(file: UploadFile, subfolder: str) -> str:
    file_extension = os.path.splitext(file.filename)[1]
    file_name = f"{uuid4()}{file_extension}"
    folder_path = os.path.join(UPLOAD_DIR, subfolder)
    os.makedirs(folder_path, exist_ok=True)
    file_path = os.path.join(folder_path, file_name)
    
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
    
    return file_path

async def delete_file(file_path: str):
    if os.path.exists(file_path):
        os.remove(file_path)

@router.get("/", response_model=OrganizationSchema)
async def get_organization(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    org = db.query(Organization).filter(Organization.user_id == current_user.id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return org

@router.patch("/", response_model=OrganizationSchema)
async def update_organization(
    org_update: OrganizationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    org = db.query(Organization).filter(Organization.user_id == current_user.id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    for key, value in org_update.model_dump(exclude_unset=True).items():
        setattr(org, key, value)
    
    db.commit()
    db.refresh(org)
    return org

@router.post("/logo", response_model=OrganizationSchema)
async def upload_logo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    org = db.query(Organization).filter(Organization.user_id == current_user.id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    # Delete old logo if exists
    if org.logo_url and os.path.exists(org.logo_url):
        await delete_file(org.logo_url)
    
    file_path = await save_upload_file(file, "logos")
    org.logo_url = file_path
    db.commit()
    db.refresh(org)
    return org

@router.delete("/logo", response_model=OrganizationSchema)
async def delete_logo(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    org = db.query(Organization).filter(Organization.user_id == current_user.id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    if org.logo_url:
        await delete_file(org.logo_url)
        org.logo_url = None
        db.commit()
        db.refresh(org)
    
    return org

@router.post("/template", response_model=OrganizationSchema)
async def upload_template(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    org = db.query(Organization).filter(Organization.user_id == current_user.id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    # Delete old template if exists
    if org.cv_template_url and os.path.exists(org.cv_template_url):
        await delete_file(org.cv_template_url)
    
    file_path = await save_upload_file(file, "templates")
    org.cv_template_url = file_path
    db.commit()
    db.refresh(org)
    return org

@router.delete("/template", response_model=OrganizationSchema)
async def delete_template(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    org = db.query(Organization).filter(Organization.user_id == current_user.id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    if org.cv_template_url:
        await delete_file(org.cv_template_url)
        org.cv_template_url = None
        db.commit()
        db.refresh(org)
    
    return org