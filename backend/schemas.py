from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from .models import CVStatus

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    username: Optional[str] = None

class OrganizationBase(BaseModel):
    logo_url: Optional[str] = None
    primary_color: str = "#2563eb"
    secondary_color: str = "#1e40af"
    font: str = "Inter"
    cv_template_url: Optional[str] = None

class OrganizationCreate(OrganizationBase):
    pass

class Organization(OrganizationBase):
    id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class CVBase(BaseModel):
    original_filename: str
    file_url: str

class CVCreate(CVBase):
    pass

class CV(CVBase):
    id: str
    user_id: str
    status: CVStatus
    created_at: datetime

    class Config:
        from_attributes = True