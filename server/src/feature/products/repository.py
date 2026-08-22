from sqlalchemy import func, select
from sqlalchemy.orm import Session

from src.database.models.products import ProductModel
from src.database.models.base import RecordStatus
from src.feature.products.schema import ProductCreate, ProductUpdate


class ProductRepository:
    def create(self, db: Session, data: ProductCreate) -> ProductModel:
        product = ProductModel(**data.model_dump())
        db.add(product)
        db.commit()
        db.refresh(product)
        return product

    def get_by_id(self, db: Session, product_id: int) -> ProductModel | None:
        return db.scalar(select(ProductModel).where(ProductModel.id == product_id))
    
    def get_by_name(self, db: Session, product_name: str) -> ProductModel | None:
        return db.scalar(select(ProductModel).where(ProductModel.name == product_name))
    
    def get_by_bar_code(self, db: Session, bar_code: str) -> ProductModel | None:
        return db.scalar(select(ProductModel).where(ProductModel.bar_code == bar_code))

    def list(
        self,
        db: Session,
        *,
        offset: int,
        limit: int,
        search: str,
        status: RecordStatus,
    ) -> tuple[list[ProductModel], int]:
        filters = [ProductModel.status == status]
        if search:
            filters.append(ProductModel.name.ilike(f"%{search}%"))

        statement = (
            select(ProductModel)
            .where(*filters)
            .order_by(ProductModel.id)
            .offset(offset)
            .limit(limit)
        )
        count_statement = select(func.count()).select_from(ProductModel).where(*filters)
        return list(db.scalars(statement).all()), db.scalar(count_statement) or 0

    def update(
        self, db: Session, product: ProductModel, data: ProductUpdate
    ) -> ProductModel:
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(product, field, value)
        db.commit()
        db.refresh(product)
        return product

    def set_status(
        self, db: Session, product: ProductModel, status: RecordStatus
    ) -> ProductModel:
        product.status = status
        db.commit()
        db.refresh(product)
        return product
        