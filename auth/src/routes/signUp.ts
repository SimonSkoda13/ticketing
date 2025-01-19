import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/RequestValidationError";
import { User } from "../models/user";
import { UserAlreadyExistsError } from "../errors/UserAlreadyExistsError";
import { BadRequestError } from "../errors/BadRequestError";

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
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array()); // Removed return statement
    }
    const { email, password } = req.body;

    const existingUser = await User.findOne({
      email,
    });
    if (existingUser) {
      throw new BadRequestError("User already exists!");
    }

    const user = User.build({ email, password });
    await user.save();
  }
);

export { router as signUpRouter };
