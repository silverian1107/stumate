from transformers import AutoTokenizer
from app.models.ai_models import get_hf_pipeline
from utils.text_splitter import handle_text_splitter

SUMMARY_MODEL_ID = "facebook/bart-large-cnn"

tokenizer = AutoTokenizer.from_pretrained(SUMMARY_MODEL_ID)

text_splitter = handle_text_splitter(tokenizer)

hf = get_hf_pipeline(SUMMARY_MODEL_ID, "summarization")

def handle_summarize(file_content: str):
    docs = text_splitter.create_documents([file_content])
    summaries = []

    for doc in docs:
        token_count = len(tokenizer.encode(doc.page_content))
        summary = hf.invoke(doc.page_content, max_length=int(token_count * 0.7), min_length=int(token_count * 0.3))
        summaries.append(summary)

    return " ".join(summaries)
