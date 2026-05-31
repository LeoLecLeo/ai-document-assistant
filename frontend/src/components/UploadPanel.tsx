"use client";

import { type ChangeEvent, type DragEvent, useRef, useState } from "react";
import { CheckCircle2, FileText, FileUp, RotateCcw, Upload } from "lucide-react";

import type { UploadResponse } from "@/types/document";

type UploadPanelProps = {
  file: File | null;
  uploadResult: UploadResponse | null;
  isUploading: boolean;
  isDisabled: boolean;
  fileInputKey: number;
  onFileChange: (file: File | null) => void;
  onUpload: (selectedFile?: File | null) => void;
  onReset: () => void;
};

export function UploadPanel({
  file,
  uploadResult,
  isUploading,
  isDisabled,
  fileInputKey,
  onFileChange,
  onUpload,
  onReset,
}: UploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const isInteractionDisabled = isUploading || isDisabled;

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.currentTarget.files?.item(0) ?? null;

    if (!selectedFile) {
      return;
    }

    onFileChange(selectedFile);
  }

  function getSelectedFileFromInput() {
    return inputRef.current?.files?.item(0) ?? null;
  }

  function resetNativeInputValue() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();

    if (isInteractionDisabled) {
      return;
    }

    setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    if (isInteractionDisabled) {
      return;
    }

    const droppedFile = event.dataTransfer.files?.item(0);

    if (!droppedFile) {
      return;
    }

    const isPdf =
      droppedFile.type === "application/pdf" ||
      droppedFile.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      resetNativeInputValue();
      onFileChange(null);
      return;
    }

    resetNativeInputValue();
    onFileChange(droppedFile);
  }

  return (
    <section className="flex h-full flex-col rounded-2xl border border-border/80 bg-card/60 p-6 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_24px_48px_-24px_rgba(0,0,0,0.6)] backdrop-blur-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-secondary/60 text-primary">
          <FileUp className="size-4" aria-hidden="true" />
        </div>

        <div>
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Ajouter un document
          </h2>
          <p className="text-xs text-muted-foreground">Document PDF</p>
        </div>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`group relative flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border border-dashed px-6 py-10 text-center transition-colors ${
          isInteractionDisabled
            ? "cursor-not-allowed opacity-60"
            : isDragging
              ? "border-primary/70 bg-primary/10"
              : "border-border bg-background/40 hover:border-primary/50 hover:bg-secondary/30"
        }`}
      >
        <div className="flex size-12 items-center justify-center rounded-full border border-border bg-secondary/60 text-muted-foreground transition-colors group-hover:text-primary">
          <Upload className="size-5" aria-hidden="true" />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            {file ? file.name : "Sélectionne un PDF à analyser"}
          </p>
          <p className="text-xs text-muted-foreground">
            Sur ordinateur, tu peux aussi glisser-déposer ton fichier ici.
          </p>
        </div>

        <label
          className={`relative inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 ${
            isInteractionDisabled
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer"
          }`}
        >
          Choisir un fichier

          <input
            key={fileInputKey}
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            disabled={isInteractionDisabled}
            onClick={(event) => {
              event.currentTarget.value = "";
            }}
            onChange={handleInputChange}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
            aria-label="Choisir un fichier PDF"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => onUpload(file ?? getSelectedFileFromInput())}
          disabled={isUploading || isDisabled || Boolean(uploadResult)}
          className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Upload className="size-4" aria-hidden="true" />
          {isUploading ? "Analyse en cours..." : "Uploader et indexer"}
        </button>

        {(file || uploadResult) && (
          <button
            type="button"
            onClick={onReset}
            disabled={isUploading || isDisabled}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary/60 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Nouveau document
          </button>
        )}
      </div>

      {uploadResult && (
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-primary/25 bg-primary/10 p-4">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <FileText className="size-4" aria-hidden="true" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {uploadResult.filename}
            </p>
            <p className="text-xs text-muted-foreground">
              {uploadResult.pages} pages · {uploadResult.chunks} segments prêts
            </p>
          </div>

          <span className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            <CheckCircle2 className="size-3.5" aria-hidden="true" />
            Prêt
          </span>
        </div>
      )}
    </section>
  );
}