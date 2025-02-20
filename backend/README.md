# CraftCV Backend

FastAPI backend for the CraftCV application.

## Features

- JWT Authentication
- File Upload Management
- MySQL Database Integration
- Organization Settings
- CV Status Management

## Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your settings
```

4. Initialize database:
```bash
mysql -u root -p
CREATE DATABASE craftcv;
```

5. Start development server:
```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

## Project Structure

```
backend/
├── main.py           # Application entry point
├── config.py         # Configuration settings
├── database.py       # Database connection
├── dependencies.py   # FastAPI dependencies
├── security.py       # Authentication utilities
├── models/          # SQLAlchemy models
├── routers/         # API routes
└── schemas/         # Pydantic models
```

## API Documentation

Available at `/docs` when server is running.

### Authentication
- POST `/api/auth/signup`
- POST `/api/auth/token`

### CV Management
- POST `/api/cv/upload`
- GET `/api/cv`
- PATCH `/api/cv/{cv_id}`

### Organization
- GET `/api/organization`
- PATCH `/api/organization`
- POST `/api/organization/logo`
- POST `/api/organization/template`

## Database Migrations

Using SQLAlchemy for schema management:

```python
# Create tables
from backend.database import engine
from backend.models import Base
Base.metadata.create_all(bind=engine)
```

## File Storage

Files are stored in the following structure:
```
uploads/
├── cvs/
├── logos/
└── templates/
```

## Production Deployment

1. Install production server:
```bash
pip install gunicorn
```

2. Start server:
```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker backend.main:app
```

## Environment Variables

Required environment variables:
```env
DATABASE_URL=mysql://user:password@localhost/craftcv
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
UPLOAD_DIR=uploads
```

## Testing

Run tests with pytest:
```bash
pytest
```

## Security

- JWT token authentication
- Password hashing with bcrypt
- File upload validation
- SQL injection protection via SQLAlchemy

## Error Handling

Standardized error responses:
```json
{
  "detail": "Error message"
}
```

## Logging

Using Python's built-in logging:
```python
import logging
logging.basicConfig(level=logging.INFO)
```

## Performance

- Database connection pooling
- Async file operations
- JWT token caching

## Maintenance

1. Update dependencies:
```bash
pip install -r requirements.txt --upgrade
```

2. Backup database:
```bash
mysqldump -u root -p craftcv > backup.sql
```

3. Monitor logs:
```bash
tail -f backend.log
```
