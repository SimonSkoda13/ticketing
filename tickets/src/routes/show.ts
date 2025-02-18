import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { NotFoundError, RequestValidationError } from "@tickets-com/common";
import mongoose from "mongoose";

const router = express.Router();
router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new RequestValidationError([
      {
        msg: "Invalid ID",
        type: "field",
        location: "params",
        path: "id",
      },
    ]);
  }
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    throw new NotFoundError();
  }

  res.send(ticket).status(200);
});

export { router as showTicketRouter };
