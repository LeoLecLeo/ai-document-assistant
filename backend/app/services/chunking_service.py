from dataclasses import dataclass


@dataclass
class TextChunk:
    text: str
    page: int
    chunk_index: int


def chunk_text(
    text: str,
    page: int,
    start_index: int,
    chunk_size: int = 1000,
    chunk_overlap: int = 200,
) -> list[TextChunk]:
    if chunk_size <= 0:
        raise ValueError("chunk_size must be greater than 0.")

    if chunk_overlap >= chunk_size:
        raise ValueError("chunk_overlap must be smaller than chunk_size.")

    chunks: list[TextChunk] = []
    start = 0
    chunk_index = start_index

    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end].strip()

        if chunk:
            chunks.append(
                TextChunk(
                    text=chunk,
                    page=page,
                    chunk_index=chunk_index,
                )
            )
            chunk_index += 1

        start += chunk_size - chunk_overlap

    return chunks


def chunk_pages(
    pages_text: list[str],
    chunk_size: int = 1000,
    chunk_overlap: int = 200,
) -> list[TextChunk]:
    all_chunks: list[TextChunk] = []
    chunk_index = 0

    for page_number, page_text in enumerate(pages_text, start=1):
        page_chunks = chunk_text(
            text=page_text,
            page=page_number,
            start_index=chunk_index,
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
        )

        all_chunks.extend(page_chunks)
        chunk_index += len(page_chunks)

    return all_chunks