from fastapi import APIRouter
from app.services.quiz_service import handle_generate_quizzes
from app.models.ai_models import NoteContent

router = APIRouter()

@router.post("/generate-quizzes")
async def generate_quizzes(note_content: NoteContent):
    quizzes = handle_generate_quizzes(note_content.note_content)
    return {"Quizzes": quizzes}
