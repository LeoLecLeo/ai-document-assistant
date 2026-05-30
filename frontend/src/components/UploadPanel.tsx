import type { UploadResponse } from "@/types/document";

type UploadPanelProps = {
  file: File | null;
  uploadResult: UploadResponse | null;
  isUploading: boolean;
  isDisabled: boolean;
  fileInputKey: number;
  onFileChange: (file: File | null) => void;
  onUpload: () => void;
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
  return (
    <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6">
      <h2 className="text-xl font-semibold">1. Upload du document</h2>

      <input
        key={fileInputKey}
        type="file"
        accept="application/pdf"
        disabled={isUploading || isDisabled}
        onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
        className="mt-6 block w-full rounded-xl border border-neutral-700 bg-neutral-950 p-3 text-sm text-neutral-300 disabled:cursor-not-allowed disabled:opacity-60"
      />

      {file && !uploadResult && (
        <p className="mt-3 text-sm text-neutral-400">
          Fichier sélectionné : <span className="text-white">{file.name}</span>
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={onUpload}
          disabled={isUploading || isDisabled || !file || Boolean(uploadResult)}
          className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? "Analyse en cours..." : "Uploader le PDF"}
        </button>

        {(file || uploadResult) && (
          <button
            onClick={onReset}
            disabled={isUploading || isDisabled}
            className="rounded-full border border-neutral-700 px-5 py-3 text-sm font-semibold text-white transition hover:border-neutral-400 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Nouveau document
          </button>
        )}
      </div>

      {uploadResult && (
        <div className="mt-6 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-neutral-300">
          <p className="mb-3 font-medium text-green-300">Document prêt</p>

          <p>
            <span className="text-white">Fichier :</span>{" "}
            {uploadResult.filename}
          </p>
          <p>
            <span className="text-white">Pages :</span> {uploadResult.pages}
          </p>
          <p>
            <span className="text-white">Chunks :</span> {uploadResult.chunks}
          </p>
        </div>
      )}
    </div>
  );
}