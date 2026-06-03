import asyncio
from contextlib import asynccontextmanager, suppress

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.documents import router as documents_router
from app.api.health import router as health_router
from app.api.questions import router as questions_router
from app.core.config import settings
from app.services.storage_cleanup_service import cleanup_expired_documents


def run_storage_cleanup() -> None:
    cleanup_expired_documents(
        upload_dir=settings.upload_dir,
        documents_dir=settings.documents_dir,
        chroma_dir=settings.chroma_dir,
        retention_minutes=settings.document_retention_minutes,
    )


async def storage_cleanup_loop() -> None:
    while True:
        await asyncio.sleep(settings.cleanup_interval_minutes * 60)
        run_storage_cleanup()


@asynccontextmanager
async def lifespan(app: FastAPI):
    run_storage_cleanup()

    cleanup_task = asyncio.create_task(storage_cleanup_loop())

    try:
        yield
    finally:
        cleanup_task.cancel()

        with suppress(asyncio.CancelledError):
            await cleanup_task


app = FastAPI(
    title=settings.app_name,
    description="Backend API for a RAG-based document assistant.",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "https://portfolio-bay-five-70.vercel.app",
        "https://ai-document-assistant-two.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(documents_router)
app.include_router(questions_router)