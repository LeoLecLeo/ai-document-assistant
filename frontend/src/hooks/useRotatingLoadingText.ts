"use client";

import { useEffect, useState } from "react";

export function useRotatingLoadingText(
  messages: readonly string[],
  intervalMs = 2200
) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (messages.length <= 1 || messageIndex >= messages.length - 1) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setMessageIndex((currentIndex) =>
        Math.min(currentIndex + 1, messages.length - 1)
      );
    }, intervalMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [messageIndex, intervalMs, messages.length]);

  if (messages.length === 0) {
    return "";
  }

  return messages[Math.min(messageIndex, messages.length - 1)] ?? "";
}