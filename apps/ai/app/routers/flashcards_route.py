from fastapi import APIRouter
from app.services.flashcards_service import handle_generate_flashcards
from app.models.ai_models import Request

router = APIRouter()

@router.post("/generate-flashcards")
async def generate_flashcards(request: Request):
    flashcards = handle_generate_flashcards(request.note_content)
    return {"Flashcards": flashcards}
