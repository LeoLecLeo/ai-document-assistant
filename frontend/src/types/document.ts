export type UploadResponse = {
  document_id: string;
  filename: string;
  stored_filename: string;
  pages: number;
  characters: number;
  chunks: number;
  vision_fallback_used?: boolean;
  vision_pages_analyzed?: number[];
  extraction_quality_warning?: string | null;
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