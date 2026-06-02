import base64
from pathlib import Path
from uuid import uuid4

import fitz
from fastapi import UploadFile
from pypdf import PdfReader


async def save_pdf_file(
    file: UploadFile,
    upload_dir: str,
    max_file_size_bytes: int,
) -> tuple[str, Path]:
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise ValueError("Seuls les fichiers PDF sont acceptés.")

    content = await file.read()

    if len(content) > max_file_size_bytes:
        max_size_mb = max_file_size_bytes // (1024 * 1024)
        raise ValueError(
            f"Le fichier est trop volumineux. Taille maximale autorisée : {max_size_mb} Mo."
        )

    document_id = uuid4().hex
    upload_path = Path(upload_dir)
    upload_path.mkdir(parents=True, exist_ok=True)

    stored_filename = f"{document_id}.pdf"
    file_path = upload_path / stored_filename

    file_path.write_bytes(content)

    return document_id, file_path


def extract_text_from_pdf(
    file_path: Path,
    max_pages: int,
) -> tuple[int, list[str], str]:
    reader = PdfReader(str(file_path))
    pages_count = len(reader.pages)

    if pages_count > max_pages:
        raise ValueError(
            f"Le document contient trop de pages. Maximum autorisé : {max_pages} pages."
        )

    pages_text: list[str] = []

    for page in reader.pages:
        text = page.extract_text() or ""
        pages_text.append(text.strip())

    full_text = "\n\n".join(pages_text).strip()

    return pages_count, pages_text, full_text


def render_pdf_pages_to_base64_images(
    file_path: Path,
    page_numbers: list[int],
    zoom: float,
) -> dict[int, str]:
    if not page_numbers:
        return {}

    rendered_pages: dict[int, str] = {}

    document = fitz.open(file_path)

    try:
        matrix = fitz.Matrix(zoom, zoom)

        for page_number in page_numbers:
            page_index = page_number - 1

            if page_index < 0 or page_index >= len(document):
                continue

            page = document.load_page(page_index)
            pixmap = page.get_pixmap(matrix=matrix, alpha=False)
            png_bytes = pixmap.tobytes("png")

            rendered_pages[page_number] = base64.b64encode(png_bytes).decode("utf-8")

    finally:
        document.close()

    return rendered_pages