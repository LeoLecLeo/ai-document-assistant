import { FileText, SearchCheck, Sparkles } from "lucide-react";

export function PageHeader() {
  return (
    <header className="mx-auto max-w-2xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
        <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
        Assistant IA documentaire
      </span>

      <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Interroge tes documents.
      </h1>

      <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
        Upload un PDF, pose une question en langage naturel, et obtiens une
        réponse précise basée sur les passages exacts de ton document.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <FileText className="size-4" />
          Support PDF
        </span>
        <span className="inline-flex items-center gap-2">
          <Sparkles className="size-4" />
          Réponse IA
        </span>
        <span className="inline-flex items-center gap-2">
          <SearchCheck className="size-4" />
          Sources citées
        </span>
      </div>
    </header>
  );
}