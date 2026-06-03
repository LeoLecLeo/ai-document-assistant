"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

import { useRotatingLoadingText } from "@/hooks/useRotatingLoadingText";

type LoadingButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingText?: ReactNode;
  loadingMessages?: readonly string[];
  showSpinner?: boolean;
};

function LoadingLabel({
  messages,
  fallback,
}: {
  messages: readonly string[];
  fallback: ReactNode;
}) {
  const rotatingText = useRotatingLoadingText(messages);

  return (
    <span
      aria-live="polite"
      className="min-w-0 max-w-full truncate whitespace-nowrap"
    >
      {rotatingText || fallback}
    </span>
  );
}

export function LoadingButton({
  loading = false,
  loadingText = "Traitement en cours...",
  loadingMessages = [],
  showSpinner = true,
  className = "",
  children,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={["relative min-w-0 overflow-hidden", className]
        .filter(Boolean)
        .join(" ")}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]"
        >
          <span className="animate-button-shimmer absolute inset-y-0 -left-[60%] w-[50%] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </span>
      )}

      <span className="relative z-10 inline-flex min-w-0 max-w-full items-center justify-center gap-2">
        {loading ? (
          <>
            {showSpinner && (
              <Loader2
                className="size-4 shrink-0 animate-spin"
                aria-hidden="true"
              />
            )}

            <LoadingLabel
              messages={loadingMessages}
              fallback={loadingText}
            />
          </>
        ) : (
          children
        )}
      </span>
    </button>
  );
}