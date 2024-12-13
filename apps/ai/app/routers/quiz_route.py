from fastapi import APIRouter
from app.services.quiz_service import handle_generate_quizzes
from app.models.ai_models import Request

router = APIRouter()

@router.post("/generate-quizzes")
async def generate_quizzes(request: Request):
    quizzes = handle_generate_quizzes(request.note_content, request.num_quizzes)
    return {"Quizzes": quizzes}
