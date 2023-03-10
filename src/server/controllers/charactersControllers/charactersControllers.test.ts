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
import {
  createCharacter,
  deleteCharacter,
  editCharacter,
  getAllCharacters,
  getCharacterById,
} from "./charactersControllers";

const listOfCharacters = getRandomCharacterList(4);

const idToFind = new mongoose.Types.ObjectId();
const user = getRandomUserWithId();
user.characters = [...user.characters, idToFind];

let req: Partial<CustomRequest> = {
  characters: [],
  params: {},
  query: { page: "0", characterClass: "all" },
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
          ...req,
          characters: [listOfCharacters[0]._id, listOfCharacters[1]._id],
        };

        const expectedPage = {
          count: 2,
          isNextPage: false,
          isPreviousPage: false,
        };

        Character.countDocuments = jest.fn().mockResolvedValueOnce(2);
        Character.find = jest.fn().mockReturnValueOnce({
          skip: jest.fn().mockReturnValue({
            limit: jest
              .fn()
              .mockReturnValue([listOfCharacters[0], listOfCharacters[1]]),
          }),
        });

        await getAllCharacters(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          ...expectedPage,
          allCharacters: [listOfCharacters[0], listOfCharacters[1]],
        });
      });
    });

    describe("When it receives a request and finding characters throws an error", () => {
      test("Then next should be called with a general error", async () => {
        const error = new Error();

        const character = getRandomCharacter();
        req = {
          ...req,
          characters: [character._id],
        };

        Character.countDocuments = jest.fn().mockResolvedValueOnce(1);
        Character.find = jest.fn().mockReturnValueOnce({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockRejectedValueOnce(error),
          }),
        });

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

  describe("And it invokes createCharacter controller", () => {
    describe("When it receives an object with character information in the body of the request", () => {
      test("Then should call response's method status with a 201 and json with text 'Character created!'", async () => {
        const expectedStatus = 201;
        const user = getRandomUserWithId();
        const newCharacter = getRandomCharacter();
        req.body = newCharacter;
        User.findById = jest.fn().mockResolvedValue(user);
        User.findByIdAndUpdate = jest.fn().mockResolvedValue([]);

        Character.create = jest.fn().mockReturnValue(newCharacter);

        await createCharacter(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(res.status).toHaveBeenCalledWith(expectedStatus);
        expect(res.json).toHaveBeenCalledWith({ text: "Character created!" });
      });
    });

    describe("When it receives an object with character information in the body of the request and rejects an error", () => {
      test("Then should call next with a custom error", async () => {
        const fatalError = new CustomError(
          "",
          "Sorry, your character cannot be created!",
          500
        );

        User.findById = jest.fn().mockRejectedValueOnce(fatalError);

        await createCharacter(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith(fatalError);
      });
    });
  });

  describe("And it invokes getCharacterById controller", () => {
    describe("When it's called with a correct idCharacter", () => {
      test("Then it should call response's method status with 200 and json with character", async () => {
        req.params = { idCharacter: idToFind.toString() };

        Character.findById = jest
          .fn()
          .mockResolvedValueOnce(listOfCharacters[0]);

        await getCharacterById(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(listOfCharacters[0]);
      });
    });

    describe("When it's called without a  idCharacter", () => {
      test("Then it should call next with a custom error", async () => {
        req.params = { idCharacter: "" };

        Character.findById = jest.fn().mockRejectedValueOnce(new Error(""));
        const customError = new CustomError("", "Character not found", 400);

        await getCharacterById(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith(customError);
      });
    });
  });

  describe("And it invokes editCharacter controller", () => {
    describe("When its called with a correct idCharacter and new character information", () => {
      test("Then it should call response's method status with 201", async () => {
        req.params = { idCharacter: idToFind.toString() };
        const newCharacter = getRandomCharacter();
        const expectedStatus = 201;

        Character.findByIdAndUpdate = jest
          .fn()
          .mockReturnValueOnce(newCharacter);

        await editCharacter(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(res.status).toHaveBeenCalledWith(expectedStatus);
      });
    });

    describe("When its called with an incorrect idCharacter", () => {
      test("Then it should call next with a customError", async () => {
        const customError = new CustomError(
          "",
          "Error updating character",
          500
        );

        Character.findByIdAndUpdate = jest
          .fn()
          .mockRejectedValueOnce(customError);

        await editCharacter(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith(customError);
      });
    });
  });
});
