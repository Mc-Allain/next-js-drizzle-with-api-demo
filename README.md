# Next.js + Node + Drizzle: Notes CRUD Demo

> **For reference and study purposes only.** This repository is a learning example, not production-ready software. It has no authentication, and it uses a local SQLite file and only minimal validation.

A small learning project for building a full CRUD app with:

- **Frontend:** Next.js (App Router), rendered in the browser with `"use client"`
- **Backend:** Node.js + Express 5 REST API
- **ORM:** Drizzle ORM on SQLite (a local file, so there is no database server to install)

```
Browser (Next.js, "use client") ──HTTP/JSON──► Express API ──► Drizzle ORM ──► SQLite (local.db)
```

## Docs

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): the layers, the REST API, and the step-by-step program flow for each CRUD action
- [docs/SETUP-FROM-SCRATCH.md](docs/SETUP-FROM-SCRATCH.md): how to rebuild this project from an empty folder

## Quick start

Requires Node.js 20+. Use two terminals.

**Terminal 1: backend**

```bash
cd backend
```

```bash
npm install
```

```bash
cp .env.example .env
```

```bash
npm run db:push
```

```bash
npm run dev
```

The API runs at <http://localhost:4000/api/notes>.

**Terminal 2: frontend**

```bash
cd frontend
```

```bash
npm install
```

```bash
cp .env.local.example .env.local
```

```bash
npm run dev
```

Open <http://localhost:3000>.

> If Next.js starts on a different port (for example 3001), set `FRONTEND_ORIGIN` in `backend/.env` to that URL and restart the backend. Otherwise CORS blocks the requests.

## Project structure

```
backend/
  drizzle.config.ts            drizzle-kit CLI config
  src/
    index.ts                   entry point: Express app, middleware, routes
    routes/notes.routes.ts     URL → controller
    controllers/notes.controller.ts   HTTP in/out + validation
    services/notes.service.ts  business logic + Drizzle queries
    db/schema.ts               table definition (source of truth)
    db/index.ts                Drizzle connection
    middleware/errorHandler.ts errors → JSON responses
frontend/
  app/layout.tsx               root HTML shell
  app/page.tsx                 "use client" page: state + CRUD handlers
  components/NoteForm.tsx      create/edit form
  components/NoteList.tsx      list with Edit/Delete
  lib/api.ts                   all fetch() calls to the backend
  lib/types.ts                 Note type
docs/
  ARCHITECTURE.md
  SETUP-FROM-SCRATCH.md
```
