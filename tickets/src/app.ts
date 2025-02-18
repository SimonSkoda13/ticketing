import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { createTicketRouter } from "./routes/new";

import { errorHandler, NotFoundError, currentUser } from "@tickets-com/common";
import cookieSession from "cookie-session";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes";
import { editTicketRouter } from "./routes/edit";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" })
);
app.use(currentUser);
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(editTicketRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
