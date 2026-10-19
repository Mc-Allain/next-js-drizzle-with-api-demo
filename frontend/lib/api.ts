import type { Note, NoteInput } from "./types";

// API CLIENT LAYER: the only place in the frontend that knows URLs and uses fetch().
// Components call these functions and never build HTTP requests themselves.

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/notes`;

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!res.ok) {
    // The backend sends errors as { error: "message" }.
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed with status ${res.status}`);
  }

  // 204 No Content (DELETE) has no body to parse.
  return (res.status === 204 ? undefined : await res.json()) as T;
}

export function getNotes() {
  return request<Note[]>(BASE_URL);
}

export function createNote(input: NoteInput) {
  return request<Note>(BASE_URL, { method: "POST", body: JSON.stringify(input) });
}

export function updateNote(id: number, input: NoteInput) {
  return request<Note>(`${BASE_URL}/${id}`, { method: "PUT", body: JSON.stringify(input) });
}

export function deleteNote(id: number) {
  return request<void>(`${BASE_URL}/${id}`, { method: "DELETE" });
}
