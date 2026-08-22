# FastAPI Concepts

## Express Comparison

| Express | FastAPI |
| --- | --- |
| `app.use("/products", router)` | `app.include_router(router)` |
| `router.get("/", handler)` | `@router.get("/")` above a function |
| `req.body` | A Pydantic model parameter |
| Middleware | A dependency such as `Depends(get_db)` |
| `res.status(201).json(data)` | `JSONResponse` or a returned value with `status_code=201` |
| Sequelize/Prisma model | SQLAlchemy model |
| `await db.product.findMany()` | `db.scalars(select(ProductModel)).all()` |

## Database-Backed Product Routes

The current product routes return placeholder data. A database-backed version could look like this:

```python
from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.database.database import get_db
from src.database.models.products import ProductModel
from src.feature.products.schema import Product

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/")
def get_products(db: Session = Depends(get_db)) -> list[ProductModel]:
    statement = select(ProductModel).order_by(ProductModel.id)
    return list(db.scalars(statement).all())


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_product(
    new_product: Product,
    db: Session = Depends(get_db),
) -> ProductModel:
    product = ProductModel(**new_product.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product
```

The request flow is:

1. FastAPI validates the JSON body with Pydantic.
2. `Depends(get_db)` supplies a database session.
3. `ProductModel(**new_product.model_dump())` creates an ORM object.
4. `db.add()` stages the insert.
5. `db.commit()` writes the transaction.
6. `db.refresh()` loads generated values such as `id`.
7. FastAPI serializes the response.

For production APIs, define response schemas with fields such as `id` and `status`, then configure Pydantic with `from_attributes=True`. This keeps database models separate from the public API contract.

## Request Flow

```text
Request
  -> FastAPI route decorator
  -> Pydantic validation
  -> dependency injection (database session)
  -> SQLAlchemy query or transaction
  -> Pydantic response serialization
  -> JSON response
```

FastAPI also generates OpenAPI documentation automatically. Once the server is running, visit `/docs`.

## Organizing Feature Code

For a feature with multiple responsibilities, use this structure:

```text
products/
├── router.py
├── controller.py
├── service.py
├── repository.py
└── schema.py
```

Use this request flow:

```text
router -> controller -> service -> repository -> database
```

`router.py` defines the HTTP endpoint. `controller.py` coordinates the request. `service.py` contains business rules. `repository.py` contains SQLAlchemy queries and persistence. `schema.py` defines API data shapes.

For a small feature, `service.py` can perform simple database operations directly. Add `repository.py` when persistence logic becomes complex or shared; the goal is separation of responsibilities, not adding files by default.
