from openai import OpenAI

from app.core.config import settings


def get_openai_client() -> OpenAI:
    if not settings.openai_api_key:
        raise ValueError("OPENAI_API_KEY is not configured.")

    return OpenAI(api_key=settings.openai_api_key)


def embed_text(text: str) -> list[float]:
    if not text.strip():
        raise ValueError("Text cannot be empty.")

    client = get_openai_client()

    response = client.embeddings.create(
        model=settings.embedding_model,
        input=text,
    )

    return response.data[0].embedding


def embed_texts(texts: list[str]) -> list[list[float]]:
    cleaned_texts = [text for text in texts if text.strip()]

    if not cleaned_texts:
        raise ValueError("Texts cannot be empty.")

    client = get_openai_client()

    response = client.embeddings.create(
        model=settings.embedding_model,
        input=cleaned_texts,
    )

    return [item.embedding for item in response.data]