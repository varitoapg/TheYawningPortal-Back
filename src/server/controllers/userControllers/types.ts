import type { InferSchemaType, Types } from "mongoose";
import type { userSchema } from "../../../database/models/User/User";

export interface UserRegisterCredentials {
  username: string;
  password: string;
  email: string;
}

export interface UserRegistered {
  username: string;
  _id: Types.ObjectId;
  characters: Types.ObjectId[];
}

export interface LoginUser {
  username: string;
  password: string;
}

export interface UserTokenPayload {
  username: string;
  id: string;
}

export type UserStructure = InferSchemaType<typeof userSchema>;

export interface UserWithId extends UserStructure {
  _id: Types.ObjectId;
}
