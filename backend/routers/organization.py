from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Organization, User
from ..schemas import OrganizationCreate, Organization as OrganizationSchema
from ..dependencies import get_current_user

router = APIRouter()

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