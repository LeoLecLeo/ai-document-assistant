import { ArrowLeft, FileText, SearchCheck, Sparkles } from "lucide-react";

const portfolioUrl =
  process.env.NEXT_PUBLIC_PORTFOLIO_URL ?? "http://localhost:3000";

export function PageHeader() {
  return (
    <header>
      <div className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-6">
          <a href={portfolioUrl} className="flex min-w-0 items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>

            <span className="truncate text-sm font-semibold tracking-tight text-foreground">
              Léo Lecuyer
              <span className="hidden text-muted-foreground sm:inline">
                {" "}
                / Assistant IA documentaire
              </span>
            </span>
          </a>

          <a
            href={portfolioUrl}
            className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border border-border/80 bg-secondary/40 px-3 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:bg-secondary/70 hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Retour au portfolio</span>
            <span className="sm:hidden">Retour</span>
          </a>
        </div>
      </div>

      <div className="h-16" aria-hidden="true" />

      <div className="mx-auto max-w-2xl text-center">
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
            <FileText className="size-4" aria-hidden="true" />
            Support PDF
          </span>

          <span className="inline-flex items-center gap-2">
            <Sparkles className="size-4" aria-hidden="true" />
            Réponse IA
          </span>

          <span className="inline-flex items-center gap-2">
            <SearchCheck className="size-4" aria-hidden="true" />
            Sources citées
          </span>
        </div>
      </div>
    </header>
  );
}