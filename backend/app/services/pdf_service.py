from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile
from pypdf import PdfReader


async def save_pdf_file(file: UploadFile, upload_dir: str) -> tuple[str, Path]:
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise ValueError("Only PDF files are supported.")

    document_id = uuid4().hex
    upload_path = Path(upload_dir)
    upload_path.mkdir(parents=True, exist_ok=True)

    stored_filename = f"{document_id}.pdf"
    file_path = upload_path / stored_filename

    content = await file.read()
    file_path.write_bytes(content)

    return document_id, file_path

def extract_text_from_pdf(file_path: Path) -> tuple[int, list[str], str]:
    reader = PdfReader(str(file_path))

    pages_text: list[str] = []

    for page in reader.pages:
        text = page.extract_text() or ""
        pages_text.append(text.strip())

    full_text = "\n\n".join(pages_text).strip()

    return len(reader.pages), pages_text, full_text
