from typing import Any

from openai import OpenAI

from app.core.config import settings


def get_openai_client() -> OpenAI:
    if not settings.openai_api_key:
        raise ValueError("OPENAI_API_KEY is not configured.")

    return OpenAI(api_key=settings.openai_api_key)


def format_sources_for_prompt(sources: list[dict[str, Any]]) -> str:
    formatted_sources = []

    for index, source in enumerate(sources, start=1):
        formatted_sources.append(
            f"[Source {index} | page {source['page']} | chunk {source['chunk_index']}]\n"
            f"{source['text']}"
        )

    return "\n\n---\n\n".join(formatted_sources)


def generate_answer(question: str, sources: list[dict[str, Any]]) -> str:
    if not question.strip():
        raise ValueError("Question cannot be empty.")

    if not sources:
        return (
            "Je n'ai pas trouvé de passage suffisamment pertinent dans le document "
            "pour répondre à cette question."
        )

    client = get_openai_client()
    context = format_sources_for_prompt(sources)

    response = client.responses.create(
        model=settings.llm_model,
        input=[
            {
                "role": "system",
                "content": (
                    "Tu es un assistant IA spécialisé dans l'analyse de documents. "
                    "Réponds uniquement à partir des sources fournies. "
                    "Si les sources ne permettent pas de répondre, dis clairement "
                    "que l'information n'est pas présente dans le document. "
                    "Réponds en français, de manière claire et structurée. "
                    "Ne fabrique aucune information."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Question : {question}\n\n"
                    f"Sources disponibles :\n\n{context}\n\n"
                    "Réponds à la question en t'appuyant uniquement sur ces sources."
                ),
            },
        ],
    )

    return response.output_text