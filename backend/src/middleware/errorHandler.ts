import type { NextFunction, Request, Response } from "express";

// An error that carries the HTTP status code to send back.
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

// Express 5 forwards errors thrown in async handlers here automatically.
// The 4-argument signature is how Express recognises an error handler.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
