import type { NextFunction, Response } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import User from "../../../database/models/User/User.js";
import type { CustomRequest } from "../auth/types.js";

const ownedCharacters = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;
  try {
    const userProperties = await User.findById(userId).select("characters");

    if (!userProperties) {
      const error = new CustomError(
        "No characters in this user",
        "There is no characters",
        404
      );

      next(error);
    }

    req.characters = userProperties.characters;

    next();
  } catch (error: unknown) {
    const characterError = new CustomError(
      (error as Error).message,
      "There is no characters",
      401
    );

    next(characterError);
  }
};

export default ownedCharacters;
