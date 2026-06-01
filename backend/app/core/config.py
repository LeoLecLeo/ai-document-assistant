from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "AI Document Assistant API"
    app_env: str = "development"

    upload_dir: str = "storage/uploads"
    chroma_dir: str = "storage/chroma"
    documents_dir: str = "storage/documents"

    openai_api_key: str = ""
    embedding_model: str = "text-embedding-3-small"
    llm_model: str = "gpt-4.1-mini"

    max_pdf_size_mb: int = 5
    max_pdf_pages: int = 30
    max_chunks_per_document: int = 120
    max_question_characters: int = 1000
    max_questions_per_document: int = 10

    @property
    def max_pdf_size_bytes(self) -> int:
        return self.max_pdf_size_mb * 1024 * 1024

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )


settings = Settings()