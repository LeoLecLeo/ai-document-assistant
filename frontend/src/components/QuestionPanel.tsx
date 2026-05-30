type QuestionPanelProps = {
  question: string;
  isAsking: boolean;
  isDisabled: boolean;
  canAsk: boolean;
  onQuestionChange: (question: string) => void;
  onAsk: () => void;
};

export function QuestionPanel({
  question,
  isAsking,
  isDisabled,
  canAsk,
  onQuestionChange,
  onAsk,
}: QuestionPanelProps) {
  return (
    <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6">
      <h2 className="text-xl font-semibold">2. Pose une question</h2>

      <textarea
        value={question}
        disabled={!canAsk || isAsking || isDisabled}
        onChange={(event) => onQuestionChange(event.target.value)}
        placeholder={
          canAsk
            ? "Exemple : quelles sont les consignes pour le mémoire ?"
            : "Upload d'abord un PDF pour poser une question."
        }
        className="mt-6 min-h-32 w-full rounded-xl border border-neutral-700 bg-neutral-950 p-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
      />

      <button
        onClick={onAsk}
        disabled={isAsking || isDisabled || !canAsk || !question.trim()}
        className="mt-4 rounded-full bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isAsking ? "Réponse en cours..." : "Poser la question"}
      </button>

      {!canAsk && (
        <p className="mt-3 text-sm text-neutral-500">
          Le document doit être analysé avant de pouvoir poser une question.
        </p>
      )}
    </div>
  );
}