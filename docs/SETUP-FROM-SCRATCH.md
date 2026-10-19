# How to Set This Up From Scratch

This guide rebuilds the whole project from an empty folder, step by step. The file contents are already in this repo. Each step says which file to create, so you can type it yourself or copy it.

> Just want to run the finished project? See the **Quick start** in the [README](../README.md).

## 0. Prerequisites

| Tool    | Version used | Check with      |
| ------- | ------------ | --------------- |
| Node.js | 20 or newer (built with 24) | `node -v` |
| npm     | comes with Node (built with 11) | `npm -v` |

You also need a code editor and two terminal windows: one for the backend, one for the frontend.

Versions this project was built with: Next.js 16, React 19, Express 5, drizzle-orm 0.45, drizzle-kit 0.31, @libsql/client 0.18.

---

## 1. Create the project folder

```bash
mkdir next-js-drizzle-with-api-demo
```

```bash
cd next-js-drizzle-with-api-demo
```

```bash
mkdir backend frontend docs
```

---

## Part A: Backend (Node + Express + Drizzle)

### A1. Initialise the package

```bash
cd backend
```

```bash
npm init -y
```

### A2. Install dependencies

Runtime packages:

```bash
npm install express cors dotenv drizzle-orm @libsql/client
```

| Package          | Why                                                       |
| ---------------- | --------------------------------------------------------- |
| `express`        | HTTP server and router                                    |
| `cors`           | Lets the browser on port 3000 call the API on port 4000   |
| `dotenv`         | Loads `.env` into `process.env`                           |
| `drizzle-orm`    | The ORM (query builder and schema)                        |
| `@libsql/client` | SQLite driver. Ships prebuilt binaries, so no C++ build tools are needed on Windows. |

Dev-only packages:

```bash
npm install -D typescript tsx drizzle-kit @types/express @types/cors @types/node
```

| Package       | Why                                                        |
| ------------- | ---------------------------------------------------------- |
| `typescript`  | Type checking                                              |
| `tsx`         | Runs `.ts` files directly, with watch mode                 |
| `drizzle-kit` | CLI that creates or updates tables from your schema        |
| `@types/*`    | Type definitions for the JS libraries                      |

### A3. Configure `package.json`

Open `backend/package.json` and set:

```json
{
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "start": "tsx src/index.ts",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

`"type": "module"` turns on ES modules (`import`/`export`). That is why imports inside `src/` end in `.js` even though the files are `.ts`.

### A4. Config files

Create these in `backend/`:

| File                | Purpose                                                    |
| ------------------- | ---------------------------------------------------------- |
| `tsconfig.json`     | TypeScript settings (`strict`, ESNext modules, `noEmit`)   |
| `.env.example`      | Template for the environment variables (committed)         |
| `.env`              | Your local copy: `cp .env.example .env` (not committed)    |
| `.gitignore`        | Ignores `node_modules`, `.env`, `local.db`                 |
| `drizzle.config.ts` | Tells drizzle-kit where the schema and the database are   |

`.env.example`:

```
PORT=4000
DB_FILE_NAME=file:local.db
FRONTEND_ORIGIN=http://localhost:3000
```

`drizzle.config.ts`:

```ts
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  dbCredentials: { url: process.env.DB_FILE_NAME ?? "file:local.db" },
});
```

### A5. Create the source files, bottom layer first

Build from the database upward, so each file only imports things that already exist:

```bash
mkdir -p src/db src/services src/controllers src/routes src/middleware
```

| Order | File                               | What to put in it                                                    |
| ----- | ---------------------------------- | -------------------------------------------------------------------- |
| 1     | `src/db/schema.ts`                 | `sqliteTable("notes", {...})` plus the `Note` / `NewNote` types      |
| 2     | `src/db/index.ts`                  | `export const db = drizzle({ connection: { url }, schema })`         |
| 3     | `src/middleware/errorHandler.ts`   | The `HttpError` class and the `errorHandler(err, req, res, next)` function |
| 4     | `src/services/notes.service.ts`    | `listNotes`, `getNote`, `createNote`, `updateNote`, `deleteNote`     |
| 5     | `src/controllers/notes.controller.ts` | `list`, `getOne`, `create`, `update`, `remove`, plus input validation |
| 6     | `src/routes/notes.routes.ts`       | `router.get/post/put/delete(...)` pointing at the controller         |
| 7     | `src/index.ts`                     | `express()`, `cors`, `express.json()`, mount `/api/notes`, `errorHandler`, `listen` |

The core of the schema:

```ts
export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});
```

### A6. Create the database table

```bash
npm run db:push
```

drizzle-kit reads `schema.ts`, creates `local.db` if it doesn't exist, and runs `CREATE TABLE notes ...`. You should see `[✓] Changes applied`.

### A7. Run and test the backend

```bash
npm run dev
```

You should see `API listening on http://localhost:4000`. Open <http://localhost:4000/api/notes> in a browser. It should show `[]`.

To create a note from a second terminal:

```bash
curl -X POST http://localhost:4000/api/notes -H "Content-Type: application/json" -d "{\"title\":\"Hello\",\"content\":\"From curl\"}"
```

Refresh the browser and the note appears. The backend is done. Leave it running.

---

## Part B: Frontend (Next.js with `"use client"`)

Open a **second terminal** at the project root.

### B1. Initialise and install

```bash
cd frontend
```

```bash
npm init -y
```

```bash
npm install next react react-dom
```

```bash
npm install -D typescript @types/react @types/react-dom @types/node
```

> **Shortcut:** `npx create-next-app@latest frontend` does B1 to B3 for you, adding Tailwind, ESLint and so on. This guide sets it up by hand so you can see the minimum Next.js needs.

### B2. Configure `package.json`

```json
{
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

### B3. Config files

| File                 | Purpose                                                                 |
| -------------------- | ----------------------------------------------------------------------- |
| `tsconfig.json`      | Next.js TypeScript settings, including the `@/*` path alias. Next fills in missing values on the first run. |
| `.env.local.example` | `NEXT_PUBLIC_API_URL=http://localhost:4000` (committed)                 |
| `.env.local`         | Your copy: `cp .env.local.example .env.local` (not committed)           |
| `.gitignore`         | Ignores `node_modules`, `.next`, `.env.local`                           |

Only variables that start with `NEXT_PUBLIC_` are available in browser code. Next.js copies them into the JavaScript bundle at build time.

### B4. Create the source files, bottom layer first

```bash
mkdir app components lib
```

| Order | File                         | What to put in it                                                         |
| ----- | ---------------------------- | ------------------------------------------------------------------------- |
| 1     | `lib/types.ts`               | `Note` and `NoteInput` types, matching the backend JSON                   |
| 2     | `lib/api.ts`                 | A `request()` helper plus `getNotes`, `createNote`, `updateNote`, `deleteNote` |
| 3     | `components/NoteForm.tsx`    | `"use client"`. Controlled inputs, works in both create and edit mode     |
| 4     | `components/NoteList.tsx`    | `"use client"`. Renders notes with Edit and Delete buttons                |
| 5     | `app/globals.css`            | Basic styles                                                              |
| 6     | `app/layout.tsx`             | `<html><body>{children}</body></html>` and imports `globals.css`          |
| 7     | `app/page.tsx`               | `"use client"`. State, `useEffect` to load notes, and the CRUD handlers   |

The key line at the very top of `app/page.tsx`:

```tsx
"use client";
```

Without it, `useState` and `useEffect` would throw an error, because App Router pages are Server Components by default.

### B5. Run the frontend

```bash
npm run dev
```

Open <http://localhost:3000>. You should see the note you created with curl. Try create, edit, and delete.

---

## Part C: Day-to-day commands

| Where       | Command             | What it does                                    |
| ----------- | ------------------- | ----------------------------------------------- |
| `backend/`  | `npm run dev`       | Start the API with auto-restart                 |
| `backend/`  | `npm run db:push`   | Apply `schema.ts` changes to `local.db`         |
| `backend/`  | `npm run db:studio` | Open Drizzle Studio to browse the data          |
| `frontend/` | `npm run dev`       | Start Next.js in dev mode                       |
| `frontend/` | `npm run build`     | Production build (also type-checks)             |

### Exercise: add a field

Try adding a `pinned` boolean to practise the full flow through every layer:

1. `backend/src/db/schema.ts`: add `pinned: integer("pinned", { mode: "boolean" }).notNull().default(false)`.
2. `npm run db:push`.
3. Controller `parseBody`: accept and validate `pinned`.
4. Service: add `pinned` to the `NoteInput` type.
5. `frontend/lib/types.ts`: add `pinned: boolean`.
6. `NoteForm`: add a checkbox. `NoteList`: show a 📌.

---

## Troubleshooting

| Symptom | Cause | Fix |
| ------- | ----- | --- |
| Browser console: `blocked by CORS policy ... 'Access-Control-Allow-Origin' has a value 'http://localhost:3000'` | The frontend is on a different port, for example 3001 because 3000 was taken | Set `FRONTEND_ORIGIN` in `backend/.env` to the real URL, then restart the backend |
| Red banner: `Failed to fetch` | The backend isn't running, or `NEXT_PUBLIC_API_URL` is wrong | Start the backend. Check `frontend/.env.local`, then restart `next dev` |
| `SQLITE_ERROR: no such table: notes` | The table was never created | Run `npm run db:push` in `backend/` |
| Changed `.env` but nothing changed | Env files are read only at startup | Restart that server |
| `useState only works in Client Components` | `"use client"` is missing at the top of the file | Add `"use client";` as the first line |
