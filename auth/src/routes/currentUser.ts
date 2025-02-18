import express, { Request, Response } from "express";
import { currentUser, requireAuth } from "@tickets-com/common";

const router = express.Router();

router.get(
  "/api/users/current-user",
  currentUser,
  requireAuth,
  (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
