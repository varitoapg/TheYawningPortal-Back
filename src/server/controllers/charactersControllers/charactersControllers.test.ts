import type { NextFunction, Response } from "express";
import Character from "../../../database/models/Character/Character";
import {
  getRandomCharacter,
  getRandomCharacterList,
} from "../../../factories/characterFactory";
import type { CustomRequest } from "../../middleware/auth/types";
import { getAllCharacters } from "./charactersControllers";

const listOfCharacters = getRandomCharacterList(4);

let req: Partial<CustomRequest> = {
  characters: [],
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
});
