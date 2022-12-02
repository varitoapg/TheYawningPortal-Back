import type { Request } from "express";
import type { Types } from "mongoose";
import type * as core from "express-serve-static-core";

export interface CustomRequest<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any
> extends Request<P, ResBody, ReqBody> {
  userId: string;
  characters?: Types.ObjectId[];
}
