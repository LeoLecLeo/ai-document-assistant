from contextlib import suppress
from pathlib import Path
from time import time

from app.services.vector_store_service import delete_document_chunks


def delete_document_data(
    document_id: str,
    upload_dir: str,
    documents_dir: str,
    chroma_dir: str,
) -> None:
    """Supprime tous les fichiers temporaires liés à un document."""
    upload_path = Path(upload_dir) / f"{document_id}.pdf"
    document_path = Path(documents_dir) / f"{document_id}.json"
    usage_path = Path(documents_dir) / f"{document_id}.usage.json"

    for path in (upload_path, document_path, usage_path):
        with suppress(FileNotFoundError):
            path.unlink()

    with suppress(Exception):
        delete_document_chunks(document_id=document_id, chroma_dir=chroma_dir)


def cleanup_expired_documents(
    upload_dir: str,
    documents_dir: str,
    chroma_dir: str,
    retention_minutes: int,
) -> int:
    """Supprime les documents temporaires trop anciens."""
    if retention_minutes <= 0:
        return 0

    documents_path = Path(documents_dir)

    if not documents_path.exists():
        return 0

    cutoff_timestamp = time() - (retention_minutes * 60)
    deleted_count = 0

    for document_path in documents_path.glob("*.json"):
        if document_path.name.endswith(".usage.json"):
            continue

        if document_path.stat().st_mtime > cutoff_timestamp:
            continue

        document_id = document_path.stem

        delete_document_data(
            document_id=document_id,
            upload_dir=upload_dir,
            documents_dir=documents_dir,
            chroma_dir=chroma_dir,
        )

        deleted_count += 1

    return deleted_count