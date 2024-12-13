from transformers import AutoTokenizer
from app.models.ai_models import get_hf_pipeline, SUMMARY_MODEL_ID
from utils.text_splitter import handle_text_splitter_with_huggingface

tokenizer = AutoTokenizer.from_pretrained(SUMMARY_MODEL_ID)

text_splitter = handle_text_splitter_with_huggingface(tokenizer)

hf = get_hf_pipeline(SUMMARY_MODEL_ID, "summarization")

def handle_summarize(content: str):
    try:
        docs = text_splitter.create_documents([content])
        summaries = []

        for doc in docs:
            token_count = len(tokenizer.encode(doc.page_content))
            summary = hf.invoke(doc.page_content, max_length=int(token_count * 0.7), min_length=int(token_count * 0.3))
            summaries.append(summary)

        return " ".join(summaries)
    except Exception as e:
        print(f"Error in service: {e}")
        raise
