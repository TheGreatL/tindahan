from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from src.database.database import get_db
from src.database.models.base import RecordStatus
from src.database.models.products import ProductModel
from src.feature.products.controller import ProductController
from src.feature.products.schema import (
    ProductCreate,
    ProductListResponse,
    ProductResponse,
    ProductUpdate,
)
from src.schema.index import MetaResponse

router = APIRouter(prefix="/products", tags=["products"])
controller = ProductController()


@router.get("/", response_model=ProductListResponse)
def get_products(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str = "",
    status: RecordStatus = RecordStatus.active,
) -> ProductListResponse:
    products, total = controller.list(
        db, page=page, limit=limit, search=search, status=status
    )
    return ProductListResponse(
        data=[ProductResponse.model_validate(product) for product in products],
        meta=MetaResponse(
            currentPage=page,
            numberOfItems=len(products),
            hasNextPage=page * limit < total,
            numberOfPages=(total + (limit - 1)) // limit,
        ),
    )


@router.get("/{product_name}", response_model=ProductResponse)
def get_product(product_name: str, db: Session = Depends(get_db)) -> ProductModel:
    return controller.get(db, product_name)


@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    new_product: ProductCreate, db: Session = Depends(get_db)
) -> ProductModel:
    return controller.create(db, new_product)


@router.patch("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    data: ProductUpdate,
    db: Session = Depends(get_db),
) -> ProductModel:
    return controller.update(db, product_id, data)


@router.post("/{product_id}/archive", response_model=ProductResponse)
def archive_product(product_id: int, db: Session = Depends(get_db)) -> ProductModel:
    return controller.archive(db, product_id)


@router.post("/{product_id}/restore", response_model=ProductResponse)
def restore_product(product_id: int, db: Session = Depends(get_db)) -> ProductModel:
    return controller.restore(db, product_id)
    