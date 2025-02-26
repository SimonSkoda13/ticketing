import express, { Request, Response } from "express";
import { Order } from "../models/order";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  const tickets = await Order.find({});

  res.send(tickets);
});

export { router as indexOrderRouter };
