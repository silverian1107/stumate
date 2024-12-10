from fastapi import FastAPI
from app.routers import summarization_route

app = FastAPI()

app.include_router(summarization_route.router)
