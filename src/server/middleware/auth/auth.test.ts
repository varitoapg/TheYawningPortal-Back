import type { NextFunction, Request } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import CustomError from "../../../CustomError/CustomError";
import auth from "./auth";
import type { CustomRequest } from "./types";

const req: Partial<Request> = {};

const next = jest.fn();

describe("Given the auth middleware", () => {
  describe("When it receives a request without Authorzation header and a next function", () => {
    test("Then it should call next with a CustomError with status code 401 and public message 'Missing token'", () => {
      const expectedError = new CustomError(
        "Authorization header missing",
        "Missing token",
        401
      );

      req.header = jest.fn().mockReturnValueOnce(undefined);

      auth(req as CustomRequest, null, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When ti receives a request with Authorization but it doesn't start with Bearer", () => {
    test("Then it should call next with a CustomError with status code 401 and a public message 'Missing bearer in Authorization header'", () => {});
    const expectedError = new CustomError(
      "Missing bearer in Authorization header",
      "Missing token",
      401
    );

    req.header = jest.fn().mockReturnValueOnce("test");

    auth(req as CustomRequest, null, next as NextFunction);

    expect(next).toHaveBeenCalledWith(expectedError);
  });

  describe("When ti receives a request with Authorization, starts with Bearer and a token", () => {
    test("Then it should add the userIde to the request", () => {});
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1cGVyQWRtaW4iLCJpZCI6IjYzODM1ODY3ZmRjMmFhNGVjNGI4MjhkOCIsImlhdCI6MTY2OTY0OTU3MywiZXhwIjoxNjY5ODIyMzczfQ.2ZM29Yd3qDHp2gKTP-nlRDpB77nw7VR8OxMzzd3pNxg";

    req.header = jest.fn().mockReturnValueOnce(`Bearer ${token}`);

    const userId = new mongoose.Types.ObjectId();

    jwt.verify = jest.fn().mockReturnValueOnce({ id: userId });
    auth(req as CustomRequest, null, next as NextFunction);

    expect(next).toHaveBeenCalled();
    expect(req).toHaveProperty("userId", userId);
  });
});
