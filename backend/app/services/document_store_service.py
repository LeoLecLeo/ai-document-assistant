import json
from dataclasses import asdict
from pathlib import Path

from app.services.chunking_service import TextChunk


def save_document_chunks(
    document_id: str,
    filename: str,
    chunks: list[TextChunk],
    documents_dir: str,
) -> Path:
    documents_path = Path(documents_dir)
    documents_path.mkdir(parents=True, exist_ok=True)

    document_path = documents_path / f"{document_id}.json"

    data = {
        "document_id": document_id,
        "filename": filename,
        "chunks": [asdict(chunk) for chunk in chunks],
    }

    document_path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    return document_path

def load_document_data(document_id: str, documents_dir: str) -> dict:
    document_path = Path(documents_dir) / f"{document_id}.json"

    if not document_path.exists():
        raise FileNotFoundError(f"Document '{document_id}' was not found.")

    return json.loads(document_path.read_text(encoding="utf-8"))