import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// DATA LAYER: the table definition. Drizzle uses it to build SQL
// and to infer TypeScript types for rows.
export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

// Row shape returned by SELECT.
export type Note = typeof notes.$inferSelect;
// Shape accepted by INSERT (id and timestamps are optional because they have defaults).
export type NewNote = typeof notes.$inferInsert;
