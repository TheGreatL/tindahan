# Tindahan FastAPI Guide

This folder contains focused notes for the Tindahan FastAPI backend. Start with the project structure, then read the topic that matches the work you are doing.

## Topics

- [01 - Project Structure](01-structure.md): folders, feature layers, responsibilities, and Python import paths.
- [02 - Database Setup](02-database.md): PostgreSQL configuration, SQLAlchemy sessions, and the `Base` class.
- [03 - SQLAlchemy Models](03-models.md): model classes, API schemas, and how model imports register tables.
- [04 - Alembic Migrations](04-migrations.md): configuring Alembic, generating migrations, and applying them.
- [05 - FastAPI Concepts](05-fastapi.md): Express comparisons, feature layers, and database-backed product routes.

## Quick Reference

Run commands from the `server` directory:

```powershell
uv run alembic revision --autogenerate -m "describe the change"
uv run alembic upgrade head
uv run alembic check
```

The current database model imports are:

```python
from src.database.database import Base
from src.database.models.products import ProductModel
```

Alembic needs every SQLAlchemy model module imported before it reads `Base.metadata`. The folder and filename are conventions; the import and `Base` inheritance are what register a model.
