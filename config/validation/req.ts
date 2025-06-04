import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

exports.validateReq = (req: Request, res: Response, next: NextFunction) => {
  // form validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  next();
};
