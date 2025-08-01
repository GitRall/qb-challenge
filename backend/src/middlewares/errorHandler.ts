import { Request, Response, NextFunction } from 'express'
import * as z from 'zod'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Fill with more generic error cases
  if (err instanceof z.ZodError) {
    res.status(400).send({ type: 'ValidationError', error: err.issues })
  } else {
    console.error(err)
    res
      .status(500)
      .send({ type: 'InternalServerError', error: 'Internal server error' })
  }
}
