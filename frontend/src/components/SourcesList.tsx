import type { Source } from "@/types/document";

type SourcesListProps = {
  sources: Source[];
};

export function SourcesList({ sources }: SourcesListProps) {
  if (sources.length === 0) {
    return null;
  }

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold">Sources utilisées</h2>

      <div className="mt-4 grid gap-4">
        {sources.map((source) => (
          <article
            key={`${source.page}-${source.chunk_index}`}
            className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5"
          >
            <div className="mb-3 text-sm text-neutral-400">
              Page {source.page} — chunk {source.chunk_index} — score{" "}
              {source.score.toFixed(2)}
            </div>

            <p className="line-clamp-6 text-sm leading-6 text-neutral-300">
              {source.text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}