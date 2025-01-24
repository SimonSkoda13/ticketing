import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";
import { currentUserRouter } from "./routes/currentUser";
import { signInRouter } from "./routes/signIn";
import { signUpRouter } from "./routes/signUp";
import { signOutRouter } from "./routes/signOut";
import { errorHandler } from "./middlewares/error-middleware";
import { NotFoundError } from "./errors/NotFoundError";
import cookieSession from "cookie-session";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(cookieSession({ signed: false, secure: true }));

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected to MongoDB database");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000");
  });
};

start();
