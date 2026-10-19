"use client";

// "use client" makes this a Client Component: it runs in the browser, so it can
// use state, effects and event handlers, and it talks to the backend over HTTP.

import { useEffect, useState } from "react";
import NoteForm from "@/components/NoteForm";
import NoteList from "@/components/NoteList";
import * as api from "@/lib/api";
import type { Note, NoteInput } from "@/lib/types";

// PAGE (CONTAINER) LAYER: holds the app state and wires UI events to API calls.
export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editing, setEditing] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // READ: load all notes once when the page first renders.
  useEffect(() => {
    api
      .getNotes()
      .then(setNotes)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // CREATE or UPDATE, depending on whether a note is being edited.
  async function handleSubmit(input: NoteInput) {
    setError(null);
    try {
      if (editing) {
        const updated = await api.updateNote(editing.id, input);
        setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
        setEditing(null);
      } else {
        const created = await api.createNote(input);
        setNotes((prev) => [created, ...prev]);
      }
    } catch (err) {
      setError((err as Error).message);
      throw err; // keep the form's text so the user can fix it
    }
  }

  // DELETE
  async function handleDelete(id: number) {
    if (!confirm("Delete this note?")) return;
    setError(null);
    try {
      await api.deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (editing?.id === id) setEditing(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <main className="container">
      <h1>Notes</h1>
      <p className="muted">Next.js (client) → Express API → Drizzle → SQLite</p>

      {error && <p className="error">{error}</p>}

      <NoteForm editing={editing} onSubmit={handleSubmit} onCancel={() => setEditing(null)} />

      {loading ? (
        <p className="muted">Loading...</p>
      ) : (
        <NoteList notes={notes} onEdit={setEditing} onDelete={handleDelete} />
      )}
    </main>
  );
}
