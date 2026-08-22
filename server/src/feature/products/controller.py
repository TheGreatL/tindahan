from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from src.database.models.base import RecordStatus
from src.database.models.products import ProductModel
from src.feature.products.schema import ProductCreate, ProductUpdate
from src.feature.products.service import ProductService


class ProductController:
	def __init__(self, service: ProductService | None = None) -> None:
		self.service = service or ProductService()

	def create(self, db: Session, data: ProductCreate) -> ProductModel:
		return self.service.create(db, data)

	def get(self, db: Session, product_name: str) -> ProductModel:
		product = self.service.get(db, product_name)
		if product is None:
			raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
		return product

	def get_by_bar_code(self, db: Session, bar_code: str) -> ProductModel:
		product = self.service.get_by_bar_code(db, bar_code)
		if product is None:
			raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
		return product

	def get_by_id(self, db:Session,product_id:int)->ProductModel:
		product = self.service.get_by_id(db, product_id)
		if product is None:
			raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
		return product    

	def list(
		self,
		db: Session,
		*,
		page: int,
		limit: int,
		search: str,
		status: RecordStatus,
	) -> tuple[list[ProductModel], int]:
		return self.service.list(
			db, page=page, limit=limit, search=search, status=status
		)

	def update(
		self, db: Session, product_id: int, data: ProductUpdate
	) -> ProductModel:
		product = self.get_by_id(db, product_id)
		return self.service.update(db, product, data)

	def archive(self, db: Session, product_id: int) -> ProductModel:
		return self.service.archive(db, self.get_by_id(db, product_id))

	def restore(self, db: Session, product_id: int) -> ProductModel:
		return self.service.restore(db, self.get_by_id(db, product_id))
