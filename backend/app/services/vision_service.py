from app.core.config import settings
from app.services.llm_service import get_openai_client


def describe_pdf_page_with_vision(
    page_number: int,
    image_base64: str,
) -> str:
    client = get_openai_client()

    response = client.responses.create(
        model=settings.vision_model,
        max_output_tokens=settings.max_vision_output_tokens,
        input=[
            {
                "role": "system",
                "content": (
                    "Tu es un assistant chargé de rendre une page PDF visuelle "
                    "exploitable par un système de recherche documentaire. "
                    "Tu dois transcrire le texte visible quand il existe, puis décrire "
                    "les schémas, tableaux, graphiques ou éléments importants. "
                    "Ne fabrique pas d'information. Si une information est illisible, dis-le."
                ),
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": (
                            f"Analyse la page {page_number} de ce PDF. "
                            "Retourne une transcription ou description claire en français. "
                            "Structure la réponse avec les éléments importants de la page."
                        ),
                    },
                    {
                        "type": "input_image",
                        "image_url": f"data:image/png;base64,{image_base64}",
                    },
                ],
            },
        ],
    )

    return response.output_text.strip()


def describe_pdf_pages_with_vision(
    rendered_pages: dict[int, str],
) -> dict[int, str]:
    descriptions: dict[int, str] = {}

    for page_number, image_base64 in rendered_pages.items():
        description = describe_pdf_page_with_vision(
            page_number=page_number,
            image_base64=image_base64,
        )

        if description:
            descriptions[page_number] = description

    return descriptions