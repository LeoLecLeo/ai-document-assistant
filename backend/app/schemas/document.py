from pydantic import BaseModel


class DocumentUploadResponse(BaseModel):
    document_id: str
    filename: str
    stored_filename: str
    pages: int
    characters: int
    chunks: int


class DocumentChunkResponse(BaseModel):
    text: str
    page: int
    chunk_index: int


class DocumentDetailsResponse(BaseModel):
    document_id: str
    filename: str
    chunks: list[DocumentChunkResponse]