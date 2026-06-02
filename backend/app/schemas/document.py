from pydantic import BaseModel, Field


class DocumentUploadResponse(BaseModel):
    document_id: str
    filename: str
    stored_filename: str
    pages: int
    characters: int
    chunks: int
    vision_fallback_used: bool = False
    vision_pages_analyzed: list[int] = Field(default_factory=list)
    extraction_quality_warning: str | None = None


class DocumentChunkResponse(BaseModel):
    text: str
    page: int
    chunk_index: int


class DocumentDetailsResponse(BaseModel):
    document_id: str
    filename: str
    chunks: list[DocumentChunkResponse]