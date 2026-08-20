from fastapi import APIRouter

router = APIRouter(prefix="/auth",tags=['auth'])


@router.post("/register")
def register():
    return {"message":"Resgister"}

@router.post("/login")
def login(username:str,password:str):
    
    return {"message":"Login","username":username,"password":password}

