import { Model, model, Schema } from "mongoose";
import { User } from "../types/User";

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true, index: { unique: true } },
});

export const UserModel: Model<User> = model('User', UserSchema);