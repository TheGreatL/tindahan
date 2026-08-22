from sqlalchemy.orm import Session

from src.database.models.base import RecordStatus
from src.database.models.products import ProductModel
from src.feature.products.repository import ProductRepository
from src.feature.products.schema import ProductCreate, ProductUpdate


class ProductService:
	def __init__(self, repository: ProductRepository | None = None) -> None:
		self.repository = repository or ProductRepository()

	def create(self, db: Session, data: ProductCreate) -> ProductModel:
		return self.repository.create(db, data)

	def get(self, db: Session, product_name: str) -> ProductModel | None:
		return self.repository.get_by_name(db, product_name)

	def get_by_id(self, db: Session, product_id: int) -> ProductModel | None:
		return self.repository.get_by_id(db, product_id)

	def list(
		self,
		db: Session,
		*,
		page: int,
		limit: int,
		search: str,
		status: RecordStatus,
	) -> tuple[list[ProductModel], int]:
		offset = (page - 1) * limit
		return self.repository.list(
			db, offset=offset, limit=limit, search=search, status=status
		)

	def update(
		self, db: Session, product: ProductModel, data: ProductUpdate
	) -> ProductModel:
		return self.repository.update(db, product, data)

	def archive(self, db: Session, product: ProductModel) -> ProductModel:
		return self.repository.set_status(db, product, RecordStatus.achived)

	def restore(self, db: Session, product: ProductModel) -> ProductModel:
		return self.repository.set_status(db, product, RecordStatus.active)
