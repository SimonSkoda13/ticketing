import mongoose from "mongoose";
import { Password } from "../services/password";

// Define the attributes that a user document will have
interface UserProps {
  email: string;
  password: string;
}

// Props for type checking
interface UserModel extends mongoose.Model<UserDoc> {
  build(props: UserProps): UserDoc;
}

// Props for user document, now typescript knows what attributes a user document will have
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

/**
 * Defines the schema for the User model.
 *
 * Properties:
 * - email: A required string representing the user's email address.
 * - password: A required string representing the user's password.
 */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

/**
 * Middleware function that hashes the user's password before saving it to the database.
 */
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});
userSchema.statics.build = (props: UserProps) => {
  return new User(props);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
