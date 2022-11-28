import type { Request } from "express";
import type { Types } from "mongoose";

export interface CustomRequest extends Request {
  userId: string;
  characters?: Types.ObjectId[];
}
