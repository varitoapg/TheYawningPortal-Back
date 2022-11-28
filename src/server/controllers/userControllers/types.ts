import type { Types } from "mongoose";

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
