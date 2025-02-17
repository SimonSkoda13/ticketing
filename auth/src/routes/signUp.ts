import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/user";
import { BadRequestError, validateRequest } from "@tickets-com/common";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/sign-up",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log("email", email);

    const existingUser = await User.findOne({
      email,
    });
    if (existingUser) {
      throw new BadRequestError("User already exists!");
    }

    if (!process.env.JWT_KEY) {
      throw new Error("JWT_KEY must be defined");
    }

    const user = User.build({ email, password });
    await user.save();
    console.log("process.env.JWT_KEY", user.id);

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signUpRouter };
