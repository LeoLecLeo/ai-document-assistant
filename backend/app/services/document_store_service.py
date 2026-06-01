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


def get_document_usage_path(document_id: str, documents_dir: str) -> Path:
    documents_path = Path(documents_dir)
    documents_path.mkdir(parents=True, exist_ok=True)

    return documents_path / f"{document_id}.usage.json"


def load_document_usage(document_id: str, documents_dir: str) -> dict:
    usage_path = get_document_usage_path(document_id, documents_dir)

    if not usage_path.exists():
        return {
            "document_id": document_id,
            "question_count": 0,
        }

    return json.loads(usage_path.read_text(encoding="utf-8"))


def increment_document_question_count(
    document_id: str,
    documents_dir: str,
    max_questions: int,
) -> int:
    usage = load_document_usage(document_id, documents_dir)
    current_count = int(usage.get("question_count", 0))

    if current_count >= max_questions:
        raise ValueError(
            "Limite atteinte pour cette démo. "
            "Tu as déjà posé le nombre maximum de questions pour ce document."
        )

    next_count = current_count + 1

    usage_path = get_document_usage_path(document_id, documents_dir)
    usage_path.write_text(
        json.dumps(
            {
                "document_id": document_id,
                "question_count": next_count,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    return next_count