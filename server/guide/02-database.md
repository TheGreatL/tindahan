# Database Setup

## Packages

The server uses these packages:

| Package | Purpose |
| --- | --- |
| `sqlalchemy` | ORM and SQL toolkit |
| `psycopg[binary]` | PostgreSQL driver |
| `python-dotenv` | Loads `.env` configuration |
| `fastapi[standard]` | Web framework and development tools |
| `alembic` | Database schema migrations |

SQLAlchemy does not install PostgreSQL. PostgreSQL must be installed and running separately, and the `tindahan` database must exist.

## Environment Configuration

Create `server/.env` with your local connection details:

```env
DATABASE_URL=postgresql+psycopg://postgres:your_password@localhost:5432/tindahan
```

The URL contains the database type, driver, username, password, host, port, and database name. Do not commit `.env` to Git.

`src/database/database.py` loads this value with `load_dotenv()` and raises an error if `DATABASE_URL` is missing.

## SQLAlchemy Base and Sessions

```python
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass
```

- `engine` manages communication with PostgreSQL.
- `SessionLocal` creates database sessions.
- `Base` is the parent class for SQLAlchemy models.
- `Base.metadata` contains the tables registered by imported models.
- `pool_pre_ping=True` checks pooled connections before use.

The FastAPI database dependency creates and closes one session per request:

```python
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

Use it in a route with dependency injection:

```python
from fastapi import Depends
from sqlalchemy.orm import Session

from src.database.database import get_db


@router.get("/")
def get_products(db: Session = Depends(get_db)):
    return []
```

## Database Setup Commands

Create the PostgreSQL database if it does not exist:

```powershell
psql -U postgres -c "CREATE DATABASE tindahan;"
```

Then run commands from `server`:

```powershell
uv run alembic upgrade head
```

When troubleshooting a connection error, check PostgreSQL, the database name, credentials, host, port, and the `.env` file loaded by the process.
