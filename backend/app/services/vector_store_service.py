from typing import Any

import chromadb

from app.services.chunking_service import TextChunk
from app.services.embedding_service import embed_text, embed_texts


COLLECTION_NAME = "document_chunks"


def get_chroma_client(chroma_dir: str):
    return chromadb.PersistentClient(path=chroma_dir)


def get_chunks_collection(chroma_dir: str):
    client = get_chroma_client(chroma_dir)

    return client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"description": "Document chunks indexed for semantic search"},
    )


def index_document_chunks(
    document_id: str,
    filename: str,
    chunks: list[TextChunk],
    chroma_dir: str,
) -> int:
    if not chunks:
        return 0

    collection = get_chunks_collection(chroma_dir)

    texts = [chunk.text for chunk in chunks]
    embeddings = embed_texts(texts)

    ids = [f"{document_id}-{chunk.chunk_index}" for chunk in chunks]

    metadatas: list[dict[str, Any]] = [
        {
            "document_id": document_id,
            "filename": filename,
            "page": chunk.page,
            "chunk_index": chunk.chunk_index,
        }
        for chunk in chunks
    ]

    collection.add(
        ids=ids,
        documents=texts,
        embeddings=embeddings,
        metadatas=metadatas,
    )

    return len(chunks)


def search_similar_chunks(
    document_id: str,
    question: str,
    chroma_dir: str,
    limit: int = 3,
) -> list[dict[str, Any]]:
    collection = get_chunks_collection(chroma_dir)

    question_embedding = embed_text(question)

    results = collection.query(
        query_embeddings=[question_embedding],
        n_results=limit,
        where={"document_id": document_id},
    )

    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    chunks: list[dict[str, Any]] = []

    for text, metadata, distance in zip(documents, metadatas, distances):
        chunks.append(
            {
                "text": text,
                "page": metadata["page"],
                "chunk_index": metadata["chunk_index"],
                "score": 1 / (1 + distance),
            }
        )

    return chunks