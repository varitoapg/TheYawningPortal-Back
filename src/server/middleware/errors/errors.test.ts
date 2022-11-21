import type { Response } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import { generalError, unknownEndpoint } from "./errors.js";

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe("Given an errors middleware", () => {
  describe("And calls unknownEndpoint middleware", () => {
    describe("When it receives a response", () => {
      test("Then it should call the response's status method with 404 and json with message 'Unknown Endpoint", () => {
        const statusCode = 404;
        const publicMessage = "Unknown Endpoint";

        unknownEndpoint(null, res as Response);

        expect(res.status).toHaveBeenCalledWith(statusCode);
        expect(res.json).toHaveBeenCalledWith({ message: publicMessage });
      });
    });
  });

  describe("And invokes generalError middleware", () => {
    describe("When it receives a CustomError with message 'Wrong password', statusCode: 403 and publicMessage 'Wrong credentials'", () => {
      test("Then it should call the response's status method with a 403 and json with the public message", () => {
        const message = "Wrong password";
        const publicMessage = "Wrong credentials";
        const statusCode = 403;

        const unathorizedError = new CustomError(
          message,
          publicMessage,
          statusCode
        );

        generalError(unathorizedError, null, res as Response, null);

        expect(res.status).toHaveBeenCalledWith(statusCode);
        expect(res.json).toHaveBeenCalledWith({ error: publicMessage });
      });
    });

    describe("When it receives an Error with message 'General Error'", () => {
      test("Then it should call the received response method status with 500 and json with 'Fatal error'", () => {
        const errorGeneral = new Error("General Error");
        const statusCode = 500;
        const publicMessage = "Fatal error";

        generalError(errorGeneral as CustomError, null, res as Response, null);

        expect(res.status).toHaveBeenCalledWith(statusCode);
        expect(res.json).toHaveBeenCalledWith({ error: publicMessage });
      });
    });
  });
});
