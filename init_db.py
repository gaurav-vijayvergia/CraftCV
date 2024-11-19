from alembic import command
from alembic.config import Config
from backend.database import engine
from backend.models import Base

def init_db():
    # Create an Alembic configuration object
    alembic_cfg = Config("alembic.ini")
    
    try:
        # Create all tables using SQLAlchemy models
        print("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully!")
        
        # Stamp the database with the latest migration version
        print("Stamping database with current migration version...")
        command.stamp(alembic_cfg, "head")
        print("Database migration version stamped successfully!")
        
    except Exception as e:
        print(f"Error initializing database: {str(e)}")
        raise

if __name__ == "__main__":
    init_db()