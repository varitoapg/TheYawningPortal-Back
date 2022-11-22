import bcrypt from "bcryptjs";
import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import CustomError from "../../../CustomError/CustomError";
import User from "../../../database/models/User/User";
import type { UserRegisterCredentials } from "./types";
import { userRegister } from "./userControllers";

beforeEach(() => {
  jest.clearAllMocks();
});

const testUser: UserRegisterCredentials = {
  username: "userTest",
  password: "password",
  email: "test@test.com",
};

const req: Partial<Request> = {
  body: testUser,
};

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

describe("Given the controller userRegister", () => {
  describe("When it receives a request with username 'userTest', a password 'password' and an email 'test@test.com'", () => {
    test("Then the response's method status should be called with a 201 and its json's method with the details of the user", async () => {
      req.body = testUser;
      const testHashedPassword = "hashedPassword";
      const id = new mongoose.Types.ObjectId();
      const expectedStatus = 201;
      const expectedDetails = {
        id: id.toString(),
        username: testUser.username,
        email: testUser.email,
      };

      bcrypt.hash = jest.fn().mockResolvedValue(testHashedPassword);

      User.create = jest
        .fn()
        .mockResolvedValue({ ...testUser, _id: id.toString() });

      await userRegister(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedDetails);
    });
  });

  describe("When it receives an username that already exists", () => {
    test("Then it should call response's method status with a 409 and a message 'This username already exists' ", async () => {
      const customError = new CustomError(
        "username",
        "This username already exists",
        409
      );

      bcrypt.hash = jest.fn().mockResolvedValue(testUser.password);
      User.create = jest.fn().mockRejectedValue(new Error("username"));

      await userRegister(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it receives an email that already exists", () => {
    test("Then it should call response's method status with a 409 and a message 'This username already exists' ", async () => {
      const customError = new CustomError(
        "email",
        "This email already exists",
        409
      );

      User.create = jest.fn().mockRejectedValueOnce(new Error("email"));

      await userRegister(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it receives an error", () => {
    test("Then it should call response's method status with a 500 and a message 'Fatal error' ", async () => {
      const customError = new CustomError("", "Fatal error", 500);

      User.create = jest.fn().mockRejectedValueOnce(new Error());

      await userRegister(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});
