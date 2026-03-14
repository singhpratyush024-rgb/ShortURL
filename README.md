# ShortURL 🔗

A fast, lightweight, and modern URL shortener built with Python and FastAPI.

![Python](https://img.shields.io/badge/Python-3.12-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.135-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue)
![Redis](https://img.shields.io/badge/Redis-7-red)
![Docker](https://img.shields.io/badge/Docker-Compose-blue)
![Tests](https://img.shields.io/badge/Tests-26%20passing-brightgreen)
![Coverage](https://img.shields.io/badge/Coverage-44%25-yellow)

## Features

- 🚀 High-performance link shortening
- ⚡ Redis caching for lightning-fast redirects
- 🔒 API token authentication on health endpoints
- 📊 Click tracking and analytics
- 🛡️ Rate limiting to prevent abuse
- 🎛️ Admin dashboard for managing links
- 🐳 Docker Compose setup — one command and you're live
- 🧪 Unit and integration tests with coverage reporting
- 🗄️ Alembic database migrations
- 🔗 Custom aliases for your links

## Screenshots

### Homepage
![Homepage](images/homepage.png)

### URL Shortening
![Result](images/result.png)

### Admin Dashboard
![Admin](images/admin.png)

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.12, FastAPI |
| Database | PostgreSQL 17, SQLModel, SQLAlchemy |
| Cache | Redis 7 |
| Migrations | Alembic |
| Admin | SQLAdmin |
| Rate Limiting | SlowAPI |
| Testing | Pytest, pytest-cov |
| Containerization | Docker, Docker Compose |

## Project Structure
```
shorturl/
├── app/
│   ├── admin/          # Admin dashboard
│   ├── api/            # API routes (v1 + health checks)
│   ├── core/           # Config and rate limiting
│   ├── databases/      # Models, DB manager, Redis, serializers
│   ├── errors/         # Custom error classes
│   ├── utils/          # URL code generator
│   ├── loggers.py      # Logging configuration
│   ├── router.py       # Main redirect router
│   └── main.py         # Application entry point
├── alembic/            # Database migrations
├── frontend/           # HTML, CSS, JS
├── tests/              # Test suite
├── docker-compose.yml
├── Dockerfile
└── requirements.txt
```

## Getting Started

### Prerequisites

- Python 3.12+
- Docker and Docker Compose

### With Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/singhpratyush024-rgb/ShortURL.git
cd ShortURL
```

2. Create your `.env` file:
```bash
cp .env.example .env
```

3. Fill in your `.env` values:
```env
BASE_URL=http://localhost:8000

POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=shorturl
POSTGRES_USER=shorturluser
POSTGRES_PASSWORD=yourpassword
DATABASE_URL=postgresql://shorturluser:yourpassword@postgres:5432/shorturl

REDIS_CACHE_HOST=redis-cache
REDIS_CACHE_PORT=6379
REDIS_CACHE_URL=redis://redis-cache:6379/0

APP_API_TOKEN=your-secret-token
ADMIN_URL=/your-secret-admin-path
```

4. Start everything:
```bash
docker compose up --build
```

5. Open your browser:
```
http://localhost:8000
```

### Without Docker

1. Create and activate virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run database migrations:
```bash
alembic upgrade head
```

4. Start the app:
```bash
uvicorn app.main:app --reload --port 8000
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/v1.0/minify` | Shorten a URL | No |
| `GET` | `/api/v1.0/{alias}` | Get original URL | No |
| `GET` | `/{alias}` | Redirect to original URL | No |
| `GET` | `/health/psql` | PostgreSQL health check | API Token |
| `GET` | `/health/redis` | Redis health check | API Token |
| `GET` | `/health/redis_rw` | Redis read/write check | API Token |
| `GET` | `/health/redis_data` | List all Redis keys | API Token |

### Example Request
```bash
curl -X POST http://localhost:8000/api/v1.0/minify \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.example.com/very/long/url"}'
```

### Example Response
```json
{
  "minified_url": "http://localhost:8000/xK9mP2"
}
```

## Admin Dashboard

Access the admin panel at your secret admin URL:
```
http://localhost:8000/{ADMIN_URL}
```

The admin panel lets you view, edit, and delete all shortened URLs.

## Running Tests
```bash
# Run all tests
pytest tests/ -v

# Run with coverage report
pytest tests/ -v --cov=app --cov-report=term-missing
```

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `BASE_URL` | Base URL of the app | `http://localhost:8000` |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `REDIS_CACHE_URL` | Redis connection string | `redis://localhost:6379/0` |
| `APP_API_TOKEN` | API token for health endpoints | Auto-generated |
| `ADMIN_URL` | Secret admin panel path | Auto-generated |
| `LOG_LEVEL` | Logging level (10=DEBUG, 30=WARNING) | `30` |

## License

MIT License — feel free to use this project for personal or commercial purposes.