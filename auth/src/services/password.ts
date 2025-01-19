import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

/**
 * The Password class provides static methods for hashing and comparing passwords.
 */
export class Password {
  /**
   * Compares a stored hashed password with a supplied plain text password.
   *
   * @param storedPassword - The hashed password stored in the database, in the format 'hashedPassword.salt'.
   * @param suppliedPassword - The plain text password to compare.
   * @returns A promise that resolves to a boolean indicating whether the passwords match.
   */
  static compare = async (
    storedPassword: string,
    suppliedPassword: string
  ): Promise<boolean> => {
    const [hashedPassword, salt] = storedPassword.split(".");
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buf.toString("hex") === hashedPassword;
  };

  /**
   * Hashes a plain text password using a randomly generated salt.
   *
   * @param password - The plain text password to hash.
   * @returns A promise that resolves to a string containing the hashed password and salt, in the format 'hashedPassword.salt'.
   */
  static toHash = async (password: string): Promise<string> => {
    const salt = randomBytes(8).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString("hex")}.${salt}`;
  };
}
