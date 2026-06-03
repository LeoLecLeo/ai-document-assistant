import { FileText, Library } from "lucide-react";

import type { Source } from "@/types/document";

type SourcesListProps = {
  sources: Source[];
};

function scoreColor(score: number) {
  if (score >= 0.9) return "text-primary";
  if (score >= 0.75) return "text-foreground";
  return "text-muted-foreground";
}

export function SourcesList({ sources }: SourcesListProps) {
  if (sources.length === 0) {
    return null;
  }

  return (
    <section className="min-w-0 max-w-full overflow-x-hidden">
      <div className="mb-4 flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary/60 text-primary">
          <Library className="size-4" aria-hidden="true" />
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold tracking-tight text-foreground">
            Sources
          </h2>
          <p className="break-words text-xs text-muted-foreground">
            {sources.length} passages utilisés pour construire la réponse
          </p>
        </div>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-3">
        {sources.map((source) => (
          <article
            key={`${source.page}-${source.chunk_index}`}
            className="group flex min-w-0 max-w-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/40 p-5 transition-colors hover:border-primary/40 hover:bg-card/70"
          >
            <div className="mb-3 flex min-w-0 items-center justify-between gap-2">
              <span className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <FileText className="size-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">Page {source.page}</span>
              </span>

              <span className="shrink-0 rounded-full border border-border bg-secondary/50 px-2 py-0.5 text-[11px] text-muted-foreground">
                Segment n°{source.chunk_index}
              </span>
            </div>

            <p className="line-clamp-6 min-w-0 flex-1 break-words text-sm leading-relaxed text-foreground/80 [overflow-wrap:anywhere]">
              {source.text}
            </p>

            <div className="mt-4 flex min-w-0 flex-col gap-2 border-t border-border/60 pt-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Pertinence
              </span>

              <div className="flex min-w-0 items-center gap-2">
                <div className="h-1.5 w-14 shrink-0 overflow-hidden rounded-full bg-secondary sm:w-16">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${Math.min(Math.max(source.score, 0), 1) * 100}%`,
                    }}
                  />
                </div>

                <span
                  className={`shrink-0 text-xs font-semibold tabular-nums ${scoreColor(
                    source.score
                  )}`}
                >
                  {source.score.toFixed(2)}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}