from langchain_huggingface.llms import HuggingFacePipeline
from pydantic import BaseModel

class NoteContent(BaseModel):
    note_content: str

def get_hf_pipeline(model_id: str, task: str) -> HuggingFacePipeline:
    return HuggingFacePipeline.from_model_id(
        model_id=model_id,
        task=task,
    )
