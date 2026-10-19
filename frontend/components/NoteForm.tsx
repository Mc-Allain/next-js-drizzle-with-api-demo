"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Note, NoteInput } from "@/lib/types";

type Props = {
  editing: Note | null; // null = create mode, a note = edit mode
  onSubmit: (input: NoteInput) => Promise<void>;
  onCancel: () => void;
};

// UI COMPONENT: owns only the form's input state. It reports what the user
// typed through onSubmit and lets the page decide whether that is a create or update.
export default function NoteForm({ editing, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  // When the user clicks "Edit" on a note, copy its values into the form.
  useEffect(() => {
    setTitle(editing?.title ?? "");
    setContent(editing?.content ?? "");
  }, [editing]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); // stop the browser from reloading the page
    setSaving(true);
    try {
      await onSubmit({ title, content });
      setTitle("");
      setContent("");
    } catch {
      // The page already shows the error; keep the typed text so the user can retry.
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card form">
      <h2>{editing ? `Edit note #${editing.id}` : "New note"}</h2>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Content"
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="row">
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : editing ? "Update" : "Create"}
        </button>
        {editing && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
