from fastapi import APIRouter, HTTPException

from app.core.config import settings
from app.schemas.question import QuestionRequest, QuestionResponse, SourceChunk
from app.services.document_store_service import (
    increment_document_question_count,
    load_document_data,
)
from app.services.llm_service import generate_answer
from app.services.vector_store_service import search_similar_chunks

router = APIRouter(prefix="/questions", tags=["Questions"])


@router.post("/ask", response_model=QuestionResponse)
def ask_question(payload: QuestionRequest):
    question = payload.question.strip()

    if not question:
        raise HTTPException(status_code=400, detail="La question ne peut pas être vide.")

    if len(question) > settings.max_question_characters:
        raise HTTPException(
            status_code=400,
            detail=(
                "La question est trop longue. "
                f"Maximum autorisé : {settings.max_question_characters} caractères."
            ),
        )

    try:
        load_document_data(
            document_id=payload.document_id,
            documents_dir=settings.documents_dir,
        )

    except FileNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error))

    try:
        increment_document_question_count(
            document_id=payload.document_id,
            documents_dir=settings.documents_dir,
            max_questions=settings.max_questions_per_document,
        )

        relevant_chunks = search_similar_chunks(
            document_id=payload.document_id,
            question=question,
            chroma_dir=settings.chroma_dir,
            limit=3,
        )

        sources = [SourceChunk(**chunk) for chunk in relevant_chunks]

        if not sources:
            return QuestionResponse(
                answer=(
                    "Je n'ai pas trouvé de passage pertinent dans le document "
                    "pour répondre à cette question."
                ),
                sources=[],
            )

        answer = generate_answer(
            question=question,
            sources=relevant_chunks,
        )

        return QuestionResponse(
            answer=answer,
            sources=sources,
        )

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Une erreur est survenue pendant la génération de la réponse.",
        )