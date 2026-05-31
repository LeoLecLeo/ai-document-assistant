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
    <section>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-secondary/60 text-primary">
          <Library className="size-4" aria-hidden="true" />
        </div>

        <div>
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Sources
          </h2>
          <p className="text-xs text-muted-foreground">
            {sources.length} passages utilisés pour construire la réponse
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {sources.map((source) => (
          <article
            key={`${source.page}-${source.chunk_index}`}
            className="group flex flex-col rounded-2xl border border-border/80 bg-card/40 p-5 transition-colors hover:border-primary/40 hover:bg-card/70"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <FileText className="size-3.5" aria-hidden="true" />
                Page {source.page}
              </span>

              <span className="rounded-full border border-border bg-secondary/50 px-2 py-0.5 text-[11px] text-muted-foreground">
                Segment n°{source.chunk_index}
              </span>
            </div>

            <p className="line-clamp-6 flex-1 text-pretty text-sm leading-relaxed text-foreground/80">
              {source.text}
            </p>

            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Pertinence
              </span>

              <div className="flex items-center gap-2">
                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${Math.min(Math.max(source.score, 0), 1) * 100}%`,
                    }}
                  />
                </div>

                <span
                  className={`text-xs font-semibold tabular-nums ${scoreColor(
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