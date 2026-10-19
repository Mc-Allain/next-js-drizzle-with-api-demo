"use client";

import type { Note } from "@/lib/types";

type Props = {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
};

// UI COMPONENT: purely presentational. It renders what it is given and
// reports clicks back to the page; it never calls the API itself.
export default function NoteList({ notes, onEdit, onDelete }: Props) {
  if (notes.length === 0) {
    return <p className="muted">No notes yet. Create one above.</p>;
  }

  return (
    <ul className="list">
      {notes.map((note) => (
        <li key={note.id} className="card">
          <div className="row spread">
            <strong>{note.title}</strong>
            <span className="muted small">#{note.id} · updated {note.updatedAt}</span>
          </div>
          {note.content && <p className="content">{note.content}</p>}
          <div className="row">
            <button className="secondary" onClick={() => onEdit(note)}>
              Edit
            </button>
            <button className="danger" onClick={() => onDelete(note.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
