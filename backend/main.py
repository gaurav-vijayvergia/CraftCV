from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, cv, organization, template
from .database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CraftCV API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(cv.router, prefix="/api/cv", tags=["cv"])
app.include_router(organization.router, prefix="/api/organization", tags=["organization"])
app.include_router(template.router, prefix="/api/template", tags=["template"])
