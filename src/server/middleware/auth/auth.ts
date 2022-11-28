import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import CustomError from "../../../CustomError/CustomError.js";
import environment from "../../../loadEnvironment.js";
import type { UserTokenPayload } from "../../controllers/userControllers/types.js";
import type { CustomRequest } from "./types.js";

const { secretJwt } = environment;

const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.header("Authorization");

    if (!authorizationHeader) {
      const error = new CustomError(
        "Authorization header missing",
        "Missing token",
        401
      );

      next(error);
      return;
    }

    if (!authorizationHeader.startsWith("Bearer ")) {
      const error = new CustomError(
        "Missing bearer in Authorization header",
        "Missing token",
        401
      );

      next(error);
    }

    const token = authorizationHeader.replace(/^Bearer\s*/, "");

    const user = jwt.verify(token, secretJwt) as UserTokenPayload;

    req.userId = user.id;

    next();
  } catch (error: unknown) {
    const authError = new CustomError(
      (error as Error).message,
      "Invalid token",
      401
    );

    next(authError);
  }
};

export default auth;
