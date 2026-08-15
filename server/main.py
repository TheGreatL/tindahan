from fastapi import FastAPI 

app = FastAPI()


@app.get("/")
async def root():
    return {"message":"Hello Wolrd"}

@app.get("/health")
async def health():
    return {"message": "API is healthy "}   