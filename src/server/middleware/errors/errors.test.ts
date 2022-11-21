import type { Response } from "express";
import { unknownEndpoint } from "./errors.js";

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe("Given an errors middleware", () => {
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
