import type { NextFunction, Response } from "express";
import mongoose from "mongoose";
import CustomError from "../../../CustomError/CustomError";
import Character from "../../../database/models/Character/Character";
import User from "../../../database/models/User/User";
import {
  getRandomCharacter,
  getRandomCharacterList,
} from "../../../factories/characterFactory";
import { getRandomUserWithId } from "../../../factories/usersFactory";
import type { CustomRequest } from "../../middleware/auth/types";
import { deleteCharacter, getAllCharacters } from "./charactersControllers";

const listOfCharacters = getRandomCharacterList(4);

const idToFind = new mongoose.Types.ObjectId();
const user = getRandomUserWithId();
user.characters = [...user.characters, idToFind];

let req: Partial<CustomRequest> = {
  characters: [],
  params: {},
};

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

describe("Given the charactersController controller", () => {
  describe("And it invokes getAllCharacters controller", () => {
    describe("When it receives a request with a list of ObjectsId", () => {
      test("Then it should return an object with the characters with the ID of the array", async () => {
        req = {
          characters: [listOfCharacters[0]._id, listOfCharacters[1]._id],
        };

        Character.find = jest
          .fn()
          .mockReturnValueOnce([listOfCharacters[0], listOfCharacters[1]]);

        await getAllCharacters(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          allCharacters: [listOfCharacters[0], listOfCharacters[1]],
        });
      });
    });

    describe("When it receives a request and finding characters throws an error", () => {
      test("Then next should be called with a general error", async () => {
        const error = new Error();

        const character = getRandomCharacter();
        req = {
          characters: [character._id],
        };

        Character.find = jest.fn().mockRejectedValueOnce(error);

        await getAllCharacters(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith(error);
      });
    });
  });

  describe("And it invokes deleteCharacter controller", () => {
    describe("When it receives a request with an userId and characterId by params", () => {
      test("Then it should call response's method status with 200 and json with Character deleted!", async () => {
        req.params = { idCharacter: idToFind.toString() };

        User.findById = jest.fn().mockResolvedValueOnce(user);

        Character.findByIdAndDelete = jest
          .fn()
          .mockResolvedValueOnce({ text: "Character deleted!" });

        User.findByIdAndUpdate = jest.fn();

        await deleteCharacter(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ text: "Character deleted!" });
      });
    });

    describe("When it receives a request with an userId and characterId that is not int user's characters", () => {
      test("Then it should call next with a CustomError with status 404", async () => {
        const notFoundError = new CustomError(
          "Cannot find the character in this user",
          "Sorry, we cannot find this character",
          404
        );
        user.characters = [];
        req.params = { idCharacter: idToFind.toString() };

        User.findById = jest.fn().mockResolvedValueOnce(user);

        await deleteCharacter(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith(notFoundError);
      });
    });

    describe("When it receives a request with an userId and rejects an error", () => {
      test("Then it should call next with a CustomError with message 'Sorry, try again later'", async () => {
        const fatalError = new CustomError("", "Sorry, try again later", 500);
        req.params = { idCharacter: idToFind.toString() };

        User.findById = jest.fn().mockRejectedValueOnce(fatalError);

        await deleteCharacter(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith(fatalError);
      });
    });
  });
});
