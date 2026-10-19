import type { Request, Response } from "express";
import * as notesService from "../services/notes.service.js";
import { HttpError } from "../middleware/errorHandler.js";

// CONTROLLER LAYER: translates HTTP <-> service calls.
// Reads params/body, validates input, calls the service, picks the status code.

function parseId(req: Request): number {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, "id must be a positive integer");
  return id;
}

// partial = true for updates (every field optional), false for creates (title required).
function parseBody(body: unknown, partial: boolean) {
  const { title, content } = (body ?? {}) as { title?: unknown; content?: unknown };
  const data: { title?: string; content?: string } = {};

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      throw new HttpError(400, "title must be a non-empty string");
    }
    data.title = title.trim();
  } else if (!partial) {
    throw new HttpError(400, "title is required");
  }

  if (content !== undefined) {
    if (typeof content !== "string") throw new HttpError(400, "content must be a string");
    data.content = content;
  }

  return data;
}

export async function list(_req: Request, res: Response) {
  res.json(await notesService.listNotes());
}

export async function getOne(req: Request, res: Response) {
  const note = await notesService.getNote(parseId(req));
  if (!note) throw new HttpError(404, "Note not found");
  res.json(note);
}

export async function create(req: Request, res: Response) {
  const data = parseBody(req.body, false);
  const note = await notesService.createNote({ title: data.title!, content: data.content ?? "" });
  res.status(201).json(note);
}

export async function update(req: Request, res: Response) {
  const id = parseId(req);
  const note = await notesService.updateNote(id, parseBody(req.body, true));
  if (!note) throw new HttpError(404, "Note not found");
  res.json(note);
}

export async function remove(req: Request, res: Response) {
  const deleted = await notesService.deleteNote(parseId(req));
  if (!deleted) throw new HttpError(404, "Note not found");
  res.status(204).end();
}
