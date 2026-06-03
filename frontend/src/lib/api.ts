import type { AskResponse, UploadResponse } from "@/types/document";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

async function getErrorMessage(response: Response, fallbackMessage: string) {
  try {
    const data = await response.json();

    if (typeof data.detail === "string") {
      return data.detail;
    }

    return fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

function getNetworkErrorMessage() {
  return "Impossible de contacter le backend. Vérifie que le serveur FastAPI est bien lancé sur http://127.0.0.1:8000.";
}

function isValidDocumentId(
  documentId: string | null | undefined
): documentId is string {
  return typeof documentId === "string" && documentId.length > 0;
}

export function getDocumentCleanupUrl(
  documentId: string | null | undefined
): string {
  if (!isValidDocumentId(documentId)) {
    throw new Error("Aucun document à nettoyer.");
  }

  return `${API_URL}/documents/${encodeURIComponent(documentId)}/cleanup`;
}

export async function cleanupDocument(
  documentId: string | null | undefined
): Promise<void> {
  if (!isValidDocumentId(documentId)) {
    return;
  }

  try {
    const response = await fetch(getDocumentCleanupUrl(documentId), {
      method: "POST",
      keepalive: true,
    });

    if (!response.ok && response.status !== 404) {
      throw new Error("Erreur pendant le nettoyage du document.");
    }
  } catch {
    // Nettoyage best-effort côté navigateur.
    // Le backend garde aussi une suppression automatique par expiration.
  }
}

export async function uploadDocument(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${API_URL}/documents/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const message = await getErrorMessage(
        response,
        "Erreur pendant l'upload du document."
      );

      throw new Error(message);
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(getNetworkErrorMessage());
    }

    throw error;
  }
}

export async function askQuestion(
  documentId: string | null | undefined,
  question: string
): Promise<AskResponse> {
  if (!isValidDocumentId(documentId)) {
    throw new Error("Upload d'abord un PDF.");
  }

  try {
    const response = await fetch(`${API_URL}/questions/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        document_id: documentId,
        question,
      }),
    });

    if (!response.ok) {
      const message = await getErrorMessage(
        response,
        "Erreur pendant la génération de réponse."
      );

      throw new Error(message);
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(getNetworkErrorMessage());
    }

    throw error;
  }
}