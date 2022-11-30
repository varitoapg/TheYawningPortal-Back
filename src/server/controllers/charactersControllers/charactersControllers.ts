import type { NextFunction, Response } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import Character from "../../../database/models/Character/Character.js";
import type { CustomRequest } from "../../middleware/auth/types.js";

export const getAllCharacters = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { characters } = req;
  try {
    const allCharacters = await Character.find({
      _id: { $in: characters },
    });

    res.status(200).json({ allCharacters });
  } catch (error: unknown) {
    next(error);
  }
};
