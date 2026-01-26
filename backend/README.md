# Cybercrime Investigation Dashboard - Backend API

FastAPI backend for the cybercrime investigation dashboard.

## Features

- **FastAPI** - Modern, fast Python web framework
- **SQLAlchemy** - Database ORM
- **JWT Authentication** - Secure token-based auth
- **CORS Support** - Configured for frontend integration
- **Auto-generated API Docs** - Swagger UI at `/api/docs`
- **Type Safety** - Pydantic models for validation

## Setup

### 1. Create Virtual Environment

**Option A: venv in backend folder (Recommended)**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
```

**Option B: venv in root folder (Shared)**
```bash
cd C:\Users\Yashika\cybercrime
python -m venv venv
venv\Scripts\activate
cd backend
```

**Linux/Mac:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Create a `.env` file:
```bash
cp .env.example .env
```

Edit `.env` with your configuration (especially `SECRET_KEY`).

### 4. Run the Server

```bash
# Development mode (with auto-reload)
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 3000
```

The API will be available at:
- **API**: `http://localhost:3000`
- **Docs**: `http://localhost:3000/api/docs`
- **ReDoc**: `http://localhost:3000/api/redoc`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and get token
- `GET /api/v1/auth/me` - Get current user

### Cases
- `GET /api/v1/cases` - List all cases
- `GET /api/v1/cases/{id}` - Get case by ID
- `POST /api/v1/cases` - Create new case

### Wallets
- `GET /api/v1/wallets` - List wallets
- `GET /api/v1/wallets/{id}` - Get wallet by ID
- `POST /api/v1/wallets` - Create wallet entry

### Transactions
- `GET /api/v1/transactions` - List transactions
- `GET /api/v1/transactions/{id}` - Get transaction by ID
- `POST /api/v1/transactions` - Create transaction entry

### Evidence
- `GET /api/v1/evidence` - List evidence
- `GET /api/v1/evidence/{id}` - Get evidence by ID
- `POST /api/v1/evidence` - Create evidence entry

### Risk Assessment
- `GET /api/v1/risk` - Get risk scores
- `POST /api/v1/risk` - Create risk score

### Audit Log
- `GET /api/v1/audit` - Get audit log entries

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/     # API route handlers
│   │       └── schemas.py     # Pydantic models
│   ├── core/
│   │   ├── config.py          # Settings
│   │   └── security.py        # Auth utilities
│   └── db/
│       ├── database.py        # DB connection
│       └── models.py          # SQLAlchemy models
├── main.py                    # FastAPI app entry point
├── requirements.txt           # Dependencies
└── .env                       # Environment variables
```

## Development

### Database Migrations

```bash
# Initialize Alembic (if needed)
alembic init alembic

# Create migration
alembic revision --autogenerate -m "Description"

# Apply migration
alembic upgrade head
```

### Code Formatting

```bash
black .
```

### Linting

```bash
flake8 .
```

### Testing

```bash
pytest
```

## Troubleshooting

### Installation Issues

**If pydantic installation fails:**
```bash
# Try installing an older version with pre-built wheels
pip install pydantic==2.3.0 pydantic-settings==2.0.3
```

**If you get Rust/Cargo errors:**
The requirements.txt uses versions with pre-built wheels. If issues persist, try installing packages in batches (see README setup section).

**If you get "module not found" errors:**
Make sure your virtual environment is activated (you should see `(venv)` in your prompt).

## Integration with Frontend

The backend is configured to work with the React frontend:
- CORS is enabled for `http://localhost:5173`
- API endpoints are prefixed with `/api/v1`
- JWT tokens for authentication

## Security Notes

- Change `SECRET_KEY` in production
- Use environment variables for sensitive data
- Enable HTTPS in production
- Implement rate limiting
- Add input validation and sanitization
