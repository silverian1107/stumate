from fastapi import FastAPI
from app.routers import summarization_route, flashcards_route

app = FastAPI()

app.include_router(summarization_route.router)
app.include_router(flashcards_route.router)
