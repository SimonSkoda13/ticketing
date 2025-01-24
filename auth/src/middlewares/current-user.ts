import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY
    ) as UserPayload;
    req.currentUser = payload;
  } catch (err) {
    console.error("Error verifying JWT:", err);
  }

  next();
};
