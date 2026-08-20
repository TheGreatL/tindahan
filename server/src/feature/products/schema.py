from pydantic import BaseModel

from src.schema.index import MetaResponse

class Product(BaseModel):
    name:str
    description:str |None = None
    image:str |None = None
    
    

class ProductsListResponse(BaseModel):
    data: list[Product]
    meta:MetaResponse