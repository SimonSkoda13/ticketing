import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/user";
import { BadRequestError, validateRequest } from "@tickets-com/common";
import { Password } from "../services/password";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/sign-in",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({
      email,
    });
    if (!existingUser) {
      throw new BadRequestError("User doesn't exists!");
    }
    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );

    if (!passwordsMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    if (!process.env.JWT_KEY) {
      throw new Error("JWT_KEY must be defined");
    }

    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existingUser);
    next();
  }
);

export { router as signInRouter };
