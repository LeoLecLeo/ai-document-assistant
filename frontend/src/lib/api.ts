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
  return (
    "Impossible de contacter le backend. Vérifie que le serveur FastAPI est bien lancé sur http://127.0.0.1:8000."
  );
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
  documentId: string,
  question: string
): Promise<AskResponse> {
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