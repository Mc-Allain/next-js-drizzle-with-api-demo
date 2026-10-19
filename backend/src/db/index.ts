import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema.js";

// DATA LAYER: one shared Drizzle instance connected to a local SQLite file.
export const db = drizzle({
  connection: { url: process.env.DB_FILE_NAME ?? "file:local.db" },
  schema,
});
