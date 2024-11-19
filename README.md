# CraftCV - CV Management System

A modern web application for managing and branding CVs/resumes with organization-specific templates.

## Features

- User Authentication (Login/Signup)
- Bulk CV Upload
- CV Status Management
- Organization Settings
  - Logo Upload
  - CV Template Upload
  - Theme Customization
  - Font Selection
  - Color Scheme Management

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Zustand for state management
- Axios for API communication
- React Router for navigation
- React Dropzone for file uploads
- Lucide React for icons

### Backend
- FastAPI (Python)
- SQLAlchemy ORM
- MySQL Database
- JWT Authentication
- File Upload Handling

## Prerequisites

- Node.js 18+
- Python 3.8+
- MySQL 8.0+
- pip (Python package manager)

## Installation

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
VITE_API_URL=http://localhost:8000/api
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

### Backend Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file:
```env
DATABASE_URL=mysql://user:password@localhost/craftcv
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
UPLOAD_DIR=uploads
```

4. Initialize database:
```bash
mysql -u root -p
CREATE DATABASE craftcv;
```

5. Start the server:
```bash
uvicorn backend.main:app --reload
```

## Project Structure

### Frontend
```
src/
├── components/
│   ├── auth/
│   ├── cv/
│   └── settings/
├── services/
├── store/
└── lib/
```

### Backend
```
backend/
├── routers/
├── models/
├── schemas/
└── dependencies/
```

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Create new user
- POST `/api/auth/token` - Login user

### CV Management
- POST `/api/cv/upload` - Upload multiple CVs
- GET `/api/cv` - List all CVs
- PATCH `/api/cv/{cv_id}` - Update CV status

### Organization
- GET `/api/organization` - Get organization settings
- PATCH `/api/organization` - Update organization settings
- POST `/api/organization/logo` - Upload logo
- POST `/api/organization/template` - Upload CV template

## Development

### Frontend Development
```bash
npm run dev
```

### Backend Development
```bash
uvicorn backend.main:app --reload
```

## Production Deployment

### Frontend Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist` directory to your web server

### Backend Deployment

1. Install production server:
```bash
pip install gunicorn
```

2. Start the server:
```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker backend.main:app
```

## Environment Variables

### Frontend
- `VITE_API_URL`: Backend API URL

### Backend
- `DATABASE_URL`: MySQL connection string
- `SECRET_KEY`: JWT secret key
- `ALGORITHM`: JWT algorithm
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time
- `UPLOAD_DIR`: Directory for file uploads

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License