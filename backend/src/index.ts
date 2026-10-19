import "dotenv/config";
import express from "express";
import cors from "cors";
import notesRouter from "./routes/notes.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

// ENTRY POINT: builds the Express app, wires middleware and routes, starts listening.
const app = express();
const PORT = Number(process.env.PORT ?? 4000);

app.use(cors({ origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000" })); // let the Next.js app call us
app.use(express.json()); // parse JSON request bodies into req.body

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});
app.use("/api/notes", notesRouter);

app.use(errorHandler); // must come after the routes

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
