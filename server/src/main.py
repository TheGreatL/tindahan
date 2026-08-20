
from fastapi import FastAPI
from src.feature.auth.router import router as authRouter
from src.feature.products.router import router as productsRouter
app = FastAPI(title="Tindahan API", version="1.0.0")


@app.get("/")
async def root():
    return {"message":"Hello Wolrd"}

@app.get("/health")
async def health():
    return {"message": "API is healthy "}   

app.include_router(authRouter)
app.include_router(productsRouter)