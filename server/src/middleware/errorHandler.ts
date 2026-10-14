import type { ErrorRequestHandler, Request, Response } from 'express';
import mongoose from 'mongoose';
import type { ApiError } from '@todo/shared';

export function notFoundRoute(req: Request, res: Response<ApiError>) {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
}

export const errorHandler: ErrorRequestHandler = (err, req, res: Response<ApiError>, _next) => {
  if (err instanceof mongoose.Error.ValidationError) {
    const errors: Record<string, string> = {};
    for (const [field, e] of Object.entries(err.errors)) {
      errors[field] = e.message;
    }
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: 'Invalid todo id' });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON body' });
  }

  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server' });
};
