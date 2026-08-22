# Project Structure

The backend is inside the `server` directory:

```text
server/
├── pyproject.toml
├── .env
├── alembic.ini
├── migrations/
│   ├── env.py
│   └── versions/
└── src/
    ├── main.py
    ├── database/
    │   ├── database.py
    │   └── models/
    │       └── products.py
    └── feature/
        ├── auth/
        │   └── router.py
        └── products/
            ├── router.py
            ├── controller.py
            ├── service.py
            ├── repository.py
            └── schema.py
```

## Responsibilities

- `src/main.py`: creates the FastAPI application and registers routers.
- `src/feature/products/router.py`: defines product API endpoints.
- `src/feature/products/controller.py`: coordinates HTTP input, dependencies, and service calls.
- `src/feature/products/service.py`: contains product business rules and use cases.
- `src/feature/products/repository.py`: contains product database queries and persistence operations.
- `src/feature/products/schema.py`: defines Pydantic request and response schemas.
- `src/database/models/products.py`: defines the SQLAlchemy product model.
- `src/database/database.py`: creates the engine, session factory, declarative base, and database dependency.
- `migrations/`: contains Alembic configuration and migration files.
- `.env`: stores local configuration such as `DATABASE_URL`. Do not commit it.

## Python Imports

Python folders are packages and Python files are modules. For example:

```python
from src.database.database import Base
from src.database.models.products import ProductModel
```

The dots refer to folders and modules; they do not require a special framework configuration. The import path must match the location from which the command is run. Commands in this guide are run from `server`, where `src` is the package root.

## Feature Layers

The recommended request flow is:

```text
router -> controller -> service -> repository -> database
```

- Keep `router.py` focused on URL paths, parameters, response schemas, and status codes.
- Let `controller.py` coordinate the request and call the appropriate service operation.
- Put business rules in `service.py`, where they can be reused outside HTTP routes.
- Put SQLAlchemy queries and database writes in `repository.py`.

The repository layer is optional for very small features. It is useful when database queries become complex, reused, or need to be isolated for testing. Do not add a layer that has no meaningful responsibility.
