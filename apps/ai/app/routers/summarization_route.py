from fastapi import APIRouter
from app.services.summarization_service import handle_summarize
from app.models.ai_models import Request

router = APIRouter()

@router.post("/summarize")
async def summarize(request: Request):
    summary = handle_summarize(request.note_content)
    return {"Summary": summary}
