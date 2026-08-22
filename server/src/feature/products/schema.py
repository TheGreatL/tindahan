from pydantic import BaseModel, ConfigDict

from src.database.models.base import RecordStatus
from src.schema.index import MetaResponse

class ProductCreate(BaseModel):
    name: str
    bar_code: str
    description: str | None = None
    image: str | None = None


class ProductResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    bar_code: str
    description: str | None = None
    image: str | None = None
    status: RecordStatus


class ProductListResponse(BaseModel):
    data: list[ProductResponse]
    meta: MetaResponse


class ProductUpdate(BaseModel):
    name: str | None = None
    bar_code: str | None = None
    description: str | None = None
    image: str | None = None


# Kept as a short alias for callers that used the original schema name.
Product = ProductCreate

ProductsListResponse = ProductListResponse