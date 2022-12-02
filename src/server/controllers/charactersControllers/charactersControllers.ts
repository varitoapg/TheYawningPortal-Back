import type { NextFunction, Response } from "express";
import mongoose from "mongoose";
import CustomError from "../../../CustomError/CustomError.js";
import Character from "../../../database/models/Character/Character.js";
import User from "../../../database/models/User/User.js";
import type { CustomRequest } from "../../middleware/auth/types.js";
import type { CharacterStructure } from "./types.js";

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

export const deleteCharacter = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req;
    const { idCharacter } = req.params;
    const user = await User.findById(userId);

    const newOwnedCharacters = user.characters.filter(
      (idToDelete) => idToDelete.toString() !== idCharacter
    );

    if (user.characters.length === newOwnedCharacters.length) {
      const notFoundError = new CustomError(
        "Cannot find the character in this user",
        "Sorry, we cannot find this character",
        404
      );

      next(notFoundError);
      return;
    }

    user.characters = newOwnedCharacters;
    await User.findByIdAndUpdate(userId, user);

    await Character.findByIdAndDelete(idCharacter);
    res.status(200).json({ text: "Character deleted!" });
  } catch (error: unknown) {
    const fatalError = new CustomError(
      (error as Error).message,
      "Sorry, try again later",
      500
    );

    next(fatalError);
  }
};

export const createCharacter = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;

  const {
    image,
    imageBackup,
    background,
    class: classCharacter,
    details,
    name,
    race,
    stats,
  } = req.body as CharacterStructure;

  try {
    const newCharacter: CharacterStructure = {
      name,
      class: classCharacter,
      race,
      stats,
      background,
      details,
      image,
      imageBackup,
      isAlive: true,
      createdBy: new mongoose.Types.ObjectId(userId),
    };

    const newCharacterCreated = await Character.create(newCharacter);

    const user = await User.findById(userId);

    user.characters.push(newCharacterCreated.id);
    await User.findByIdAndUpdate(userId, user);

    res.status(201).json({ text: "Character created!" });
  } catch (error: unknown) {
    const fatalError = new CustomError(
      (error as Error).message,
      "Sorry, your character cannot be created!",
      500
    );

    next(fatalError);
  }
};
