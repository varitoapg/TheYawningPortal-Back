import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import environment from "../../../loadEnvironment.js";
import User from "../../../database/models/User/User.js";
import type { UserRegisterCredentials } from "./types.js";
import CustomError from "../../../CustomError/CustomError.js";

const { salt } = environment;

export const userRegister = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserRegisterCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  const { username, password, email } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    res.status(201).json({
      username: newUser.username,
      email: newUser.email,
      id: newUser._id.toString(),
    });
  } catch (error: unknown) {
    if ((error as Error).message.includes("username")) {
      const customError = new CustomError(
        (error as Error).message,
        "This username already exists",
        409
      );

      next(customError);
      return;
    }

    if ((error as Error).message.includes("email")) {
      const customError = new CustomError(
        (error as Error).message,
        "This email already exists",
        409
      );

      next(customError);
      return;
    }

    const customError = new CustomError(
      (error as Error).message,
      "Fatal error",
      500
    );

    next(customError);
  }
};
