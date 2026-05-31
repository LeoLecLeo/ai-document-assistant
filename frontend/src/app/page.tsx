"use client";

import { useState } from "react";

import { AnswerPanel } from "@/components/AnswerPanel";
import { ErrorMessage } from "@/components/ErrorMessage";
import { PageHeader } from "@/components/PageHeader";
import { QuestionPanel } from "@/components/QuestionPanel";
import { SourcesList } from "@/components/SourcesList";
import { UploadPanel } from "@/components/UploadPanel";
import { askQuestion, uploadDocument } from "@/lib/api";
import type { Source, UploadResponse } from "@/types/document";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [error, setError] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [isAsking, setIsAsking] = useState(false);

  function handleFileChange(nextFile: File | null) {
    setFile(nextFile);
    setUploadResult(null);
    setQuestion("");
    setAnswer("");
    setSources([]);
    setError("");
  }

  function handleReset() {
    setFile(null);
    setFileInputKey((currentKey) => currentKey + 1);
    setUploadResult(null);
    setQuestion("");
    setAnswer("");
    setSources([]);
    setError("");
  }

  async function handleUpload(selectedFile?: File | null) {
    if (isUploading || isAsking) {
      return;
    }

    const fileToUpload = selectedFile ?? file;

    if (!fileToUpload) {
      setError("Choisis un fichier PDF avant d'uploader.");
      return;
    }

    setFile(fileToUpload);
    setError("");
    setAnswer("");
    setSources([]);
    setIsUploading(true);

    try {
      const data = await uploadDocument(fileToUpload);
      setUploadResult(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue."
      );
    } finally {
      setIsUploading(false);
    }
  }

  async function handleAsk() {
    if (isAsking || isUploading) {
      return;
    }

    if (!uploadResult?.document_id) {
      setError("Upload d'abord un PDF.");
      return;
    }

    if (!question.trim()) {
      setError("Écris une question avant de l'envoyer.");
      return;
    }

    setError("");
    setAnswer("");
    setSources([]);
    setIsAsking(true);

    try {
      const data = await askQuestion(uploadResult.document_id, question);
      setAnswer(data.answer);
      setSources(data.sources);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue."
      );
    } finally {
      setIsAsking(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(60%_100%_at_50%_0%,oklch(0.72_0.13_215/0.12),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-5xl px-6 py-16 sm:py-24">
        <PageHeader />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <UploadPanel
            file={file}
            uploadResult={uploadResult}
            isUploading={isUploading}
            isDisabled={isAsking}
            fileInputKey={fileInputKey}
            onFileChange={handleFileChange}
            onUpload={handleUpload}
            onReset={handleReset}
          />

          <QuestionPanel
            question={question}
            isAsking={isAsking}
            isDisabled={isUploading}
            canAsk={Boolean(uploadResult?.document_id)}
            onQuestionChange={setQuestion}
            onAsk={handleAsk}
          />
        </div>

        <div className="mt-8">
          <ErrorMessage message={error} />
        </div>

        <div className="mt-8">
          <AnswerPanel answer={answer} isLoading={isAsking} />
        </div>

        <div className="mt-12">
          <SourcesList sources={sources} />
        </div>
      </div>
    </main>
  );
}