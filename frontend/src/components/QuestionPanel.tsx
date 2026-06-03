"use client";

import { Lock, MessageCircleQuestion, Send } from "lucide-react";

import { LoadingButton } from "@/components/LoadingButton";

type QuestionPanelProps = {
  question: string;
  isAsking: boolean;
  isDisabled: boolean;
  canAsk: boolean;
  onQuestionChange: (question: string) => void;
  onAsk: () => void;
};

const SUGGESTIONS = [
  "Résume le document",
  "Quelles sont les consignes importantes ?",
  "Liste les points clés",
];

export function QuestionPanel({
  question,
  isAsking,
  isDisabled,
  canAsk,
  onQuestionChange,
  onAsk,
}: QuestionPanelProps) {
  const textareaDisabled = !canAsk || isAsking || isDisabled;
  const suggestionDisabled = !canAsk || isAsking || isDisabled;
  const askButtonDisabled = isDisabled || !canAsk || !question.trim();

  return (
    <section className="flex h-full flex-col rounded-2xl border border-border/80 bg-card/60 p-6 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_24px_48px_-24px_rgba(0,0,0,0.6)] backdrop-blur-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-secondary/60 text-primary">
          <MessageCircleQuestion className="size-4" aria-hidden="true" />
        </div>

        <div>
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Poser une question
          </h2>
          <p className="text-xs text-muted-foreground">
            Les réponses s’appuient sur tes sources
          </p>
        </div>
      </div>

      <div className="relative flex-1">
        <textarea
          value={question}
          disabled={textareaDisabled}
          onChange={(event) => onQuestionChange(event.target.value)}
          placeholder={
            canAsk
              ? "Pose une question sur ton document..."
              : "Ajoute d’abord un document pour poser une question"
          }
          className="h-full min-h-40 w-full resize-none rounded-xl border border-border bg-background/40 p-3 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
        />

        {!canAsk && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-background/30">
            <span className="flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs text-muted-foreground">
              <Lock className="size-3.5" aria-hidden="true" />
              Aucun document disponible
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            disabled={suggestionDisabled}
            onClick={() => onQuestionChange(suggestion)}
            className="cursor-pointer rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <LoadingButton
        type="button"
        onClick={onAsk}
        disabled={askButtonDisabled}
        loading={isAsking}
        loadingText="Génération en cours"
        className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Send className="size-4" aria-hidden="true" />
        Obtenir une réponse
      </LoadingButton>
    </section>
  );
}