# AI Document Assistant — Backend

Backend FastAPI pour une application d'assistant IA sur documents.

## Fonctionnalités actuelles

- Vérification de santé de l'API avec `GET /health`
- Upload de PDF avec `POST /documents/upload`
- Extraction de texte depuis PDF
- Découpage du texte en chunks
- Sauvegarde locale des chunks en JSON
- Récupération d'un document par `GET /documents/{document_id}`
- Recherche simple de passages pertinents avec `POST /questions/ask`
- Génération d'embeddings avec OpenAI
- Indexation des chunks dans Chroma
- Recherche sémantique par similarité vectorielle
- Génération de réponses avec un LLM
- Réponses basées uniquement sur les sources retrouvées

## Stack

- Python
- FastAPI
- Uvicorn
- pypdf
- Pydantic
- python-dotenv
- pydantic-settings
- OpenAI API
- ChromaDB

## Lancer le backend

Depuis le dossier `backend` :

```cmd
.venv\Scripts\activate
python -m uvicorn app.main:app --reload
```
