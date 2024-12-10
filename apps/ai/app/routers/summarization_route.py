from fastapi import APIRouter
from app.services.summarization_service import handle_summarize
from app.models.ai_models import NoteContent

router = APIRouter()

@router.post("/summarize")
async def summarize(note_content: NoteContent):
    summary = handle_summarize(note_content.note_content)
    return {"Summary": summary}
