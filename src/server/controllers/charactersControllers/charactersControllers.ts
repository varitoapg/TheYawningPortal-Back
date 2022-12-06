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

  let checkPage;
  let allCharacters;
  let countCharacter;

  const pageOptions = {
    page: +req.query.page || 0,
    limit: 5,
    characterClass: req.query.characterClass as string,
  };
  try {
    if (pageOptions.characterClass === "all") {
      countCharacter = await Character.countDocuments({
        _id: { $in: characters },
      });

      allCharacters = await Character.find({
        _id: { $in: characters },
      })
        .skip(pageOptions.page * pageOptions.limit)
        .limit(pageOptions.limit);
    } else {
      countCharacter = await Character.countDocuments({
        _id: { $in: characters },
        characterClass: pageOptions.characterClass,
      });

      allCharacters = await Character.find({
        _id: { $in: characters },
        characterClass: pageOptions.characterClass,
      })
        .skip(pageOptions.page * pageOptions.limit)
        .limit(pageOptions.limit);
    }

    if (countCharacter === 0) {
      const noMoreCharacters = new CustomError(
        "All characters are loaded",
        "You cannot get more characters",
        404
      );
      next(noMoreCharacters);
      return;
    }

    checkPage = {
      count: countCharacter,
      isPreviousPage: pageOptions.page !== 0,
      isNextPage: countCharacter >= pageOptions.limit * (pageOptions.page + 1),
      totalPages: Math.ceil(countCharacter / pageOptions.limit),
    };
    res.status(200).json({ ...checkPage, allCharacters });
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
    characterClass: classCharacter,
    details,
    name,
    race,
    speed,
    strength,
    constitution,
    dexterity,
    intelligence,
    wisdom,
    charisma,
  } = req.body as CharacterStructure;

  try {
    const newCharacter: CharacterStructure = {
      name,
      characterClass: classCharacter,
      race,
      speed,
      strength,
      constitution,
      dexterity,
      intelligence,
      wisdom,
      charisma,
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

export const getCharacterById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { idCharacter } = req.params;
  try {
    const character = await Character.findById(idCharacter);

    res.status(200).json(character);
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      "Sorry, character not found",
      400
    );
    next(customError);
  }
};

export const editCharacter = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { idCharacter } = req.params;

  const updateCharacter = req.body as CharacterStructure;

  try {
    const updatedCharacter = await Character.findByIdAndUpdate(
      idCharacter,
      { ...updateCharacter },
      {
        returnDocument: "after",
      }
    );

    res.status(201).json({
      character: {
        ...updatedCharacter,
      },
    });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      "Error updating character",
      500
    );
    next(customError);
  }
};
