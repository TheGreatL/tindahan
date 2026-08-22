from sqlalchemy import String, Text,Enum
from sqlalchemy.orm import Mapped, mapped_column
from src.database.models.base import RecordStatus
from src.database.database import Base


class ProductModel(Base):
    __tablename__ = "products_tbl"

    id: Mapped[int] = mapped_column(primary_key=True,autoincrement="auto")
    name: Mapped[str] = mapped_column(String(100), nullable=False,unique=True)
    bar_code: Mapped[str] = mapped_column(String(50),nullable=False,unique=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    image: Mapped[str | None] = mapped_column(String(500), nullable=True)
    status: Mapped[RecordStatus] = mapped_column(Enum(RecordStatus),nullable=False,default=RecordStatus.active)
    
    def __repr__(self) -> str:
        return f"ProductModel(id={self.id!r}, name={self.name!r}),bar_code={self.bar_code!r}"