import { Copy, FileSearch, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

type AnswerPanelProps = {
  answer: string;
  isLoading: boolean;
};

export function AnswerPanel({ answer, isLoading }: AnswerPanelProps) {
  if (isLoading) {
    return (
      <section className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/60 p-6 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_24px_48px_-24px_rgba(0,0,0,0.6)] backdrop-blur-sm sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
            <Sparkles className="size-4 animate-pulse" aria-hidden="true" />
          </div>

          <div>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Réponse IA
            </h2>
            <p className="text-xs text-muted-foreground">
              Analyse des sources et génération de la réponse...
            </p>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          L’assistant analyse les passages pertinents du document.
        </p>
      </section>
    );
  }

  if (!answer) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/80 bg-card/30 px-6 py-14 text-center">
        <div className="flex size-11 items-center justify-center rounded-full border border-border bg-secondary/50 text-muted-foreground">
          <FileSearch className="size-5" aria-hidden="true" />
        </div>

        <p className="text-sm font-medium text-foreground">
          Ta réponse apparaîtra ici
        </p>

        <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
          Ajoute un document et pose une question pour obtenir une réponse IA
          accompagnée des sources utilisées.
        </p>
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/60 p-6 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_24px_48px_-24px_rgba(0,0,0,0.6)] backdrop-blur-sm sm:p-8">
      <div
        className="pointer-events-none absolute -top-24 right-0 size-64 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
            <Sparkles className="size-4" aria-hidden="true" />
          </div>

          <div>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Réponse IA
            </h2>
            <p className="text-xs text-muted-foreground">
              Réponse basée sur les sources du document
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(answer)}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-secondary/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <Copy className="size-3.5" aria-hidden="true" />
          Copier
        </button>
      </div>

      <div className="space-y-4 text-sm leading-relaxed text-foreground/90">
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-4 text-pretty">{children}</p>,
            strong: ({ children }) => (
              <strong className="font-semibold text-foreground">
                {children}
              </strong>
            ),
            ul: ({ children }) => (
              <ul className="mb-4 list-disc space-y-2 pl-6">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-4 list-decimal space-y-2 pl-6">{children}</ol>
            ),
            li: ({ children }) => <li>{children}</li>,
          }}
        >
          {answer}
        </ReactMarkdown>
      </div>
    </section>
  );
}