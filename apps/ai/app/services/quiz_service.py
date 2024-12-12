from app.models.ai_models import nlp, qg_pipeline, qa_pipeline
from utils.text_splitter import handle_text_splitter
import random

text_splitter = handle_text_splitter()

def handle_generate_quizzes(file_content: str):
    docs = text_splitter.create_documents([file_content])
    quizzes = []
    unique_quizzes = set()

    for doc in docs:
        spacy_doc = nlp(doc.page_content)
        ents = list(set([ent.text for ent in spacy_doc.ents]))
        for ent in ents:
            doc_highlight = str(spacy_doc).replace(ent, f"<hl>{ent}<hl>")
            question = qg_pipeline(doc_highlight)[0]['generated_text']
            answer = qa_pipeline({'question': question, 'context': str(spacy_doc)})['answer']

            if (question, answer) not in unique_quizzes:
                distractors = random.sample([e for e in ents if e != ent], min(len(ents)-1, 3))
                question_type = random.choice(["multiple_choice", "short_answer"])
                if question_type == "multiple_choice":
                    choices = [answer] + distractors
                    random.shuffle(choices)
                    correct_answers = [answer]
                    quizzes.append({
                        "question": question,
                        "type": "multiple_choice",
                        "choices": choices,
                        "correct_answer": correct_answers
                    })
                elif question_type == "short_answer":
                    quizzes.append({
                        "question": question,
                        "type": "short_answer",
                        "correct_answer": answer
                    })
                unique_quizzes.add((question, answer))

    return quizzes