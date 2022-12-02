import type { NextFunction } from "express";
import fs from "fs/promises";
import CustomError from "../../../CustomError/CustomError";
import { getRandomCharacter } from "../../../factories/characterFactory";
import type { CustomRequest } from "../auth/types";
import handleImage from "./handleImage";

const newCharacter = getRandomCharacter();

const req: Partial<CustomRequest> = {
  body: newCharacter,
};

const next: NextFunction = jest.fn();

const file: Partial<Express.Multer.File> = {
  filename: "characterImage",
  originalname: "characterImageOriginal",
};

let mockedFile = jest.fn();

beforeAll(async () => {
  await fs.writeFile("assets/images/testCharacter", "testCharacter");
});

beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock("sharp", () => () => ({
  resize: jest.fn().mockReturnValue({
    webp: jest.fn().mockReturnValue({
      toFormat: jest.fn().mockReturnValue({
        toFile: mockedFile,
      }),
    }),
  }),
}));

describe("Given the handleImage middleware", () => {
  describe("When it receives a request with a correct file", () => {
    test("Then it should resize the image and call next", async () => {
      const expectedFile = "characterImageOriginal.webp";
      req.file = file as Express.Multer.File;

      await handleImage(req as CustomRequest, null, next);

      expect(next).toHaveBeenCalled();
      expect(req.file.filename).toBe(expectedFile);
    });
  });

  describe("When it receives a request with an invalid file", () => {
    test("Then next should be called with a CustomError", async () => {
      mockedFile = jest.fn().mockRejectedValue(new Error());

      const newError = new CustomError(
        "Error formating image",
        "Sorry, your image is not valid",
        400
      );

      await handleImage(req as CustomRequest, null, next);

      expect(next).toBeCalledWith(newError);
    });
  });
});
