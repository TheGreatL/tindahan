from fastapi import APIRouter
from src.schema.index import DataStatus, MetaResponse
from src.feature.products.schema import ProductsListResponse,Product
router = APIRouter(prefix="/products",tags=['products'])


@router.get("/",response_model=ProductsListResponse)
async def get_products(limit:int = 10,
                       page:int = 1,
                       search:str = "",
                       status:DataStatus = DataStatus.active)->ProductsListResponse:
    
    return ProductsListResponse(
        data=[],
        meta=MetaResponse(
            currentPage= page,
            hasNextPage=True,
            numberOfItems=limit,
            numberOfPages=10
        )
    )
    
@router.post("/")
async def create_product(newProduct:Product):
    newProduct.model_dump()
    return {"message":"product created"}
    