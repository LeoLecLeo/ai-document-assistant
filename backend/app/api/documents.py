from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.core.config import settings
from app.schemas.document import DocumentDetailsResponse, DocumentUploadResponse
from app.services.chunking_service import chunk_pages
from app.services.document_store_service import (
    load_document_data,
    save_document_chunks,
)
from app.services.extraction_quality_service import evaluate_extraction_quality
from app.services.pdf_service import (
    extract_text_from_pdf,
    render_pdf_pages_to_base64_images,
    save_pdf_file,
)
from app.services.vector_store_service import index_document_chunks
from app.services.vision_service import describe_pdf_pages_with_vision

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...)):
    try:
        document_id, file_path = await save_pdf_file(
            file=file,
            upload_dir=settings.upload_dir,
            max_file_size_bytes=settings.max_pdf_size_bytes,
        )

        pages, pages_text, text = extract_text_from_pdf(
            file_path=file_path,
            max_pages=settings.max_pdf_pages,
        )

        quality_report = evaluate_extraction_quality(
            pages_text=pages_text,
            empty_page_character_threshold=settings.empty_page_character_threshold,
            weak_page_character_threshold=settings.weak_page_character_threshold,
            min_average_characters_per_page=settings.min_average_characters_per_page,
            max_empty_pages_ratio=settings.max_empty_pages_ratio,
            max_pages_to_analyze=settings.max_vision_pages,
        )

        vision_fallback_used = False
        vision_pages_analyzed: list[int] = []
        extraction_quality_warning: str | None = None

        if (
            settings.enable_vision_fallback
            and quality_report.should_use_vision
            and quality_report.pages_to_analyze
        ):
            try:
                rendered_pages = render_pdf_pages_to_base64_images(
                    file_path=file_path,
                    page_numbers=quality_report.pages_to_analyze,
                    zoom=settings.vision_page_render_zoom,
                )

                vision_descriptions = describe_pdf_pages_with_vision(rendered_pages)

                for page_number, description in vision_descriptions.items():
                    existing_text = pages_text[page_number - 1].strip()

                    vision_text = (
                        f"[Description visuelle générée pour la page {page_number}]\n"
                        f"{description}"
                    )

                    pages_text[page_number - 1] = (
                        f"{existing_text}\n\n{vision_text}".strip()
                        if existing_text
                        else vision_text
                    )

                vision_fallback_used = bool(vision_descriptions)
                vision_pages_analyzed = sorted(vision_descriptions.keys())

            except Exception:
                extraction_quality_warning = (
                    "L'extraction du PDF semble partielle, mais l'analyse visuelle "
                    "automatique n'a pas pu être réalisée."
                )

        text = "\n\n".join(pages_text).strip()

        if not text:
            raise ValueError(
                "Aucun texte exploitable n'a été trouvé dans ce PDF. "
                "Le document est peut-être scanné, composé uniquement d'images, "
                "ou difficile à analyser automatiquement."
            )

        if quality_report.should_use_vision and not vision_fallback_used:
            extraction_quality_warning = extraction_quality_warning or (
                "Le document semble difficile à lire automatiquement. "
                "Certaines pages sont peut-être scannées ou contiennent du texte intégré dans des images."
            )

        chunks = chunk_pages(pages_text)

        if len(chunks) > settings.max_chunks_per_document:
            raise ValueError(
                "Le document contient trop de texte pour cette démo. "
                f"Maximum autorisé : {settings.max_chunks_per_document} segments."
            )

        filename = file.filename or "unknown.pdf"

        save_document_chunks(
            document_id=document_id,
            filename=filename,
            chunks=chunks,
            documents_dir=settings.documents_dir,
        )

        index_document_chunks(
            document_id=document_id,
            filename=filename,
            chunks=chunks,
            chroma_dir=settings.chroma_dir,
        )

        return DocumentUploadResponse(
            document_id=document_id,
            filename=filename,
            stored_filename=Path(file_path).name,
            pages=pages,
            characters=len(text),
            chunks=len(chunks),
            vision_fallback_used=vision_fallback_used,
            vision_pages_analyzed=vision_pages_analyzed,
            extraction_quality_warning=extraction_quality_warning,
        )

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Une erreur est survenue pendant le traitement du PDF.",
        )


@router.get("/{document_id}", response_model=DocumentDetailsResponse)
def get_document(document_id: str):
    try:
        data = load_document_data(
            document_id=document_id,
            documents_dir=settings.documents_dir,
        )

        return DocumentDetailsResponse(**data)

    except FileNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error))