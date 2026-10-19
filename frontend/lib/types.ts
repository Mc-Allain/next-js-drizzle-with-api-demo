// Mirrors the JSON the backend returns (see backend/src/db/schema.ts).
export type Note = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

// What the UI sends when creating or updating a note.
export type NoteInput = {
  title: string;
  content: string;
};
