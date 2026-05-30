from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.core.config import settings
from app.schemas.document import DocumentDetailsResponse, DocumentUploadResponse
from app.services.pdf_service import extract_text_from_pdf, save_pdf_file
from app.services.chunking_service import chunk_pages
from app.services.document_store_service import (
    load_document_data,
    save_document_chunks,
)
from app.services.vector_store_service import index_document_chunks

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...)):
    try:
        document_id, file_path = await save_pdf_file(file, settings.upload_dir)
        pages, pages_text, text = extract_text_from_pdf(file_path)
        chunks = chunk_pages(pages_text)

        save_document_chunks(
            document_id=document_id,
            filename=file.filename or "unknown.pdf",
            chunks=chunks,
            documents_dir=settings.documents_dir,
        )

        index_document_chunks(
            document_id=document_id,
            filename=file.filename or "unknown.pdf",
            chunks=chunks,
            chroma_dir=settings.chroma_dir,
        )

        return DocumentUploadResponse(
            document_id=document_id,
            filename=file.filename or "unknown.pdf",
            stored_filename=Path(file_path).name,
            pages=pages,
            characters=len(text),
            chunks=len(chunks),
        )

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing the PDF.",
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