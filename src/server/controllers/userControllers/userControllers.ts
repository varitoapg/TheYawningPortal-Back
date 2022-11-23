import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import environment from "../../../loadEnvironment.js";
import User from "../../../database/models/User/User.js";
import type {
  LoginUser,
  UserRegisterCredentials,
  UserTokenPayload,
} from "./types.js";
import CustomError from "../../../CustomError/CustomError.js";
import { loginError } from "../../../CustomError/types.js";

const { salt, secretJwt } = environment;

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

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body as LoginUser;
  try {
    const user = await User.findOne({ username });

    if (!user) {
      next(loginError.userNotFound);
      return;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      next(loginError.incorrectPassword);
      return;
    }

    const tokenPayload: UserTokenPayload = {
      username,
      id: user._id.toString(),
    };

    const token = jwt.sign(tokenPayload, secretJwt, {
      expiresIn: "2d",
    });

    res.status(200).json({ token });
  } catch (error: unknown) {
    next(error);
  }
};
