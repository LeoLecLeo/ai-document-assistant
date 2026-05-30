from pydantic import BaseModel


class QuestionRequest(BaseModel):
    document_id: str
    question: str


class SourceChunk(BaseModel):
    text: str
    page: int
    chunk_index: int
    score: float


class QuestionResponse(BaseModel):
    answer: str
    sources: list[SourceChunk]