import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const validateReq = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // form validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array() });
  }

  next();
};
