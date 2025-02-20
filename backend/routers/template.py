from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Template, User
from ..schemas import Template as TemplateSchema, TemplateCreate
from ..dependencies import get_current_user

router = APIRouter()

@router.post("/", response_model=TemplateSchema)
async def create_template(
    template: TemplateCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # If this is the first template or marked as default, unset other default templates
    if template.is_default or db.query(Template).filter(Template.user_id == current_user.id).count() == 0:
        db.query(Template).filter(Template.user_id == current_user.id).update({"is_default": False})
        template.is_default = True

    db_template = Template(
        user_id=current_user.id,
        name=template.name,
        layout=template.layout,
        sections=[section.model_dump() for section in template.sections],
        is_default=template.is_default
    )
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template

@router.get("/", response_model=List[TemplateSchema])
async def get_templates(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Template).filter(Template.user_id == current_user.id).all()

@router.get("/{template_id}", response_model=TemplateSchema)
async def get_template(
    template_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    template = db.query(Template).filter(
        Template.id == template_id,
        Template.user_id == current_user.id
    ).first()
    
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    return template

@router.patch("/{template_id}/set-default", response_model=TemplateSchema)
async def set_default_template(
    template_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    template = db.query(Template).filter(
        Template.id == template_id,
        Template.user_id == current_user.id
    ).first()
    
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    # Unset other default templates
    db.query(Template).filter(Template.user_id == current_user.id).update({"is_default": False})
    
    # Set this template as default
    template.is_default = True
    db.commit()
    db.refresh(template)
    
    return template

@router.delete("/{template_id}")
async def delete_template(
    template_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    template = db.query(Template).filter(
        Template.id == template_id,
        Template.user_id == current_user.id
    ).first()
    
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    db.delete(template)
    db.commit()
    
    return {"success": True}