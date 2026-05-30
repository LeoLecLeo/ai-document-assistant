export type UploadResponse = {
  document_id: string;
  filename: string;
  stored_filename: string;
  pages: number;
  characters: number;
  chunks: number;
};

export type Source = {
  text: string;
  page: number;
  chunk_index: number;
  score: number;
};

export type AskResponse = {
  answer: string;
  sources: Source[];
};