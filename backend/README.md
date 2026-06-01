# Assistant IA documentaire

Application full-stack permettant d’uploader un PDF, de poser une question en langage naturel et d’obtenir une réponse générée par IA à partir des passages pertinents du document.

## Fonctionnalités

- Upload de documents PDF
- Extraction et découpage du texte
- Recherche sémantique dans le document
- Génération de réponses avec sources citées
- Limites d’usage pour protéger la démo

## Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS

### Backend

- FastAPI
- Python
- OpenAI API
- ChromaDB

## Lancer le backend

```bash
cd backend
python -m uvicorn app.main:app --reload
```