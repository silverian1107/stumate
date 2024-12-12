from fastapi import APIRouter
from app.services.flashcards_service import handle_generate_flashcards
from app.models.ai_models import NoteContent

router = APIRouter()

@router.post("/generate-flashcards")
async def generate_flashcards(note_content: NoteContent):
    flashcards = handle_generate_flashcards(note_content.note_content)
    return {"Flashcards": flashcards}
