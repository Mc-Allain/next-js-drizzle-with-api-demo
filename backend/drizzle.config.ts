import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// Used by the drizzle-kit CLI (npm run db:push / db:studio), not by the running server.
export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url: process.env.DB_FILE_NAME ?? "file:local.db",
  },
});
