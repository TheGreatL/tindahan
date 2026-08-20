from enum import Enum
from pydantic import BaseModel


class DataStatus(str, Enum):
    active="active"
    archived="archived"
    
class MetaResponse(BaseModel):
    currentPage:int = 1
    numberOfItems:int = 10
    hasNextPage:bool = False
    numberOfPages:int = 0