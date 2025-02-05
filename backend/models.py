from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as SQLEnum, Text, JSON, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .database import Base
import uuid
import enum

class CVStatus(str, enum.Enum):
    PROCESSING = "PROCESSING"
    CRAFTED = "CRAFTED"

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String(255), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    organization = relationship("Organization", back_populates="user", uselist=False)
    cvs = relationship("CV", back_populates="user")
    templates = relationship("Template", back_populates="user")

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    logo_url = Column(Text, nullable=True)
    primary_color = Column(String(7), default="#2563eb")
    secondary_color = Column(String(7), default="#1e40af")
    font = Column(String(255), default="Inter")
    cv_template_url = Column(Text, nullable=True)
    theme = Column(String(10), default="light")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="organization")

class CV(Base):
    __tablename__ = "cvs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_url = Column(Text, nullable=False)
    status = Column(SQLEnum(CVStatus), default=CVStatus.PROCESSING)
    parsed_data = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="cvs")

class Template(Base):
    __tablename__ = "templates"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    layout = Column(String(50), nullable=False)  # '1-column' or '2-column'
    sections = Column(JSON, nullable=False)  # Array of section objects
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="templates")
