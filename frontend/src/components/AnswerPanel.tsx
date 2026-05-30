import ReactMarkdown from "react-markdown";

type AnswerPanelProps = {
  answer: string;
  isLoading: boolean;
};

export function AnswerPanel({ answer, isLoading }: AnswerPanelProps) {
  if (isLoading) {
    return (
      <section className="mt-8 rounded-3xl border border-blue-500/20 bg-blue-500/10 p-6">
        <h2 className="text-xl font-semibold text-white">Réponse</h2>

        <p className="mt-4 text-neutral-300">
          L’assistant analyse les sources et génère une réponse...
        </p>
      </section>
    );
  }

  if (!answer) {
    return null;
  }

  return (
    <section className="mt-8 rounded-3xl border border-neutral-800 bg-neutral-900 p-6">
      <h2 className="text-xl font-semibold">Réponse</h2>

      <div className="mt-4 leading-7 text-neutral-300">
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-4">{children}</p>,
            strong: ({ children }) => (
              <strong className="font-semibold text-white">{children}</strong>
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