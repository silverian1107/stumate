from langchain_huggingface.llms import HuggingFacePipeline
from pydantic import BaseModel
from transformers import pipeline
from typing import Optional
import spacy

SUMMARY_MODEL_ID = "facebook/bart-large-cnn"
QG_MODEL_ID = "valhalla/t5-base-qg-hl"
QA_MODEL_ID = "deepset/roberta-base-squad2"

class Request(BaseModel):
    note_content: str
    num_quizzes: Optional[int] = None

def get_hf_pipeline(model_id: str, task: str) -> HuggingFacePipeline:
    return HuggingFacePipeline.from_model_id(
        model_id=model_id,
        task=task,
    )

nlp = spacy.load("en_core_web_lg")
qg_pipeline = pipeline("text2text-generation", model=QG_MODEL_ID)
qa_pipeline = pipeline("question-answering", model=QA_MODEL_ID)
