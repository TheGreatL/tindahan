# SQLAlchemy Models

## API Schemas Versus Database Models

`src/feature/products/schema.py` contains Pydantic schemas for API data. The SQLAlchemy model is separate because it describes database data.

The current model is in `src/database/models/products.py`:

```python
from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from src.database.database import Base


class ProductModel(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    image: Mapped[str | None] = mapped_column(String(500), nullable=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="active")
```

## Important Concepts

- `__tablename__` is the database table name.
- `Mapped[type]` declares the Python type expected by SQLAlchemy.
- `mapped_column()` defines a database column.
- `primary_key=True` makes `id` unique.
- `nullable=False` requires a value.
- `String(100)` creates a limited-length string column.
- `Text` is useful for longer text.

## How Models Are Registered

SQLAlchemy does not identify models from filenames. A model is registered when Python imports the module and executes the class definition that inherits from `Base`.

Alembic must import every model module before reading `Base.metadata`:

```python
from src.database.database import Base
from src.database.models.products import ProductModel

target_metadata = Base.metadata
```

`ProductModel` is not used directly in `env.py`; the import loads the class and registers the `products` table. For multiple models, import each model module or create a `src/database/models/__init__.py` that imports them all.

## Verify Registration

This check does not connect to PostgreSQL:

```powershell
cd server
uv run python -c "from src.database.database import Base; from src.database.models.products import ProductModel; print(sorted(Base.metadata.tables))"
```

Expected output includes:

```text
['products']
```
