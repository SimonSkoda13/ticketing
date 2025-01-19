import { CustomError } from "./CustomError";

export class UserAlreadyExistsError extends CustomError {
  statusCode = 400;

  constructor() {
    super("User already exists");

    this.statusCode = 400;

    // Only because we are extending a built-in class
    Object.setPrototypeOf(this, UserAlreadyExistsError.prototype);
  }

  serializeErrors() {
    return [{ message: "User already exists" }];
  }
}
