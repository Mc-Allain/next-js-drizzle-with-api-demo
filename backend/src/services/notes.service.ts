import { desc, eq, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { notes, type NewNote, type Note } from "../db/schema.js";

// SERVICE LAYER: business logic + database access through Drizzle.
// It knows nothing about HTTP (no req/res here), so it is easy to reuse and test.

type NoteInput = Pick<NewNote, "title" | "content">;

export async function listNotes(): Promise<Note[]> {
  return db.select().from(notes).orderBy(desc(notes.id));
}

export async function getNote(id: number): Promise<Note | undefined> {
  const [note] = await db.select().from(notes).where(eq(notes.id, id));
  return note;
}

export async function createNote(data: NoteInput): Promise<Note> {
  const [note] = await db.insert(notes).values(data).returning();
  return note;
}

export async function updateNote(id: number, data: Partial<NoteInput>): Promise<Note | undefined> {
  const [note] = await db
    .update(notes)
    .set({ ...data, updatedAt: sql`(CURRENT_TIMESTAMP)` })
    .where(eq(notes.id, id))
    .returning();
  return note;
}

export async function deleteNote(id: number): Promise<boolean> {
  const deleted = await db.delete(notes).where(eq(notes.id, id)).returning({ id: notes.id });
  return deleted.length > 0;
}
