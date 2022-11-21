import { Schema, model } from "mongoose";

export const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  characters: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
});

const User = model("User", userSchema, "users");

export default User;
