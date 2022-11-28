import type { NextFunction } from "express";
import type { Types } from "mongoose";
import mongoose from "mongoose";
import CustomError from "../../../CustomError/CustomError";
import User from "../../../database/models/User/User";
import type { CustomRequest } from "../auth/types";
import ownedCharacters from "./ownedCharacters";

const req: Partial<CustomRequest> = {};

const next = jest.fn();

describe("Given the ownedCharacters", () => {
  describe("When it receives a request with userId and a next function", () => {
    test("Then it shoud add characters of the user to the request ", async () => {
      const characters: Types.ObjectId[] = [new mongoose.Types.ObjectId()];

      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({ characters }),
      });
      await ownedCharacters(req as CustomRequest, null, next as NextFunction);

      expect(next).toHaveBeenCalled();
      expect(req).toHaveProperty("characters", characters);
    });
  });

  describe("When it receives a request with userId and a next function, but there aren't characters in the user", () => {
    test("Then it shoud next a CustomError with 404 ", async () => {
      const expectedError = new CustomError(
        "No characters in this user",
        "There is no characters",
        404
      );

      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue(undefined),
      });
      await ownedCharacters(req as CustomRequest, null, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
