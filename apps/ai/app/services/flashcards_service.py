from app.models.ai_models import nlp, qg_pipeline, qa_pipeline
from utils.text_splitter import handle_text_splitter

text_splitter = handle_text_splitter()

def handle_generate_flashcards(content: str):
    try:
        docs = text_splitter.create_documents([content])
        flashcards = []
        unique_flashcards = set()

        for doc in docs:
            spacy_doc = nlp(doc.page_content)
            ents = list(set([ent.text for ent in spacy_doc.ents]))
            for ent in ents:
                doc_highlight = str(spacy_doc).replace(ent, f"<hl>{ent}<hl>")
                front = qg_pipeline(doc_highlight)[0]['generated_text']
                back = qa_pipeline({'question': front,'context': str(spacy_doc)})["answer"]

                flashcard = (front, back)
                if flashcard not in unique_flashcards:
                    unique_flashcards.add(flashcard)
                    flashcards.append({"front": front, "back": back})

        return flashcards
    except Exception as e:
        print(f"Error in service: {e}")
        raise