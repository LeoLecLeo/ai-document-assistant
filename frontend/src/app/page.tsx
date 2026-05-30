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

  async function handleUpload() {
    if (isUploading || isAsking) {
      return;
    }

    if (!file) {
      setError("Choisis un fichier PDF avant d'uploader.");
      return;
    }

    setError("");
    setAnswer("");
    setSources([]);
    setIsUploading(true);

    try {
      const data = await uploadDocument(file);
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
    <main className="min-h-screen bg-neutral-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <PageHeader />

        <section className="grid gap-6 md:grid-cols-2">
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
        </section>

        <ErrorMessage message={error} />

        <AnswerPanel answer={answer} isLoading={isAsking} />

        <SourcesList sources={sources} />
      </div>
    </main>
  );
}