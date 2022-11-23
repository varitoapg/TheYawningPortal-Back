import bcrypt from "bcryptjs";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import connectDatabase from "../../../database/connectDatabase.js";
import User from "../../../database/models/User/User.js";
import { getRandomUserRegister } from "../../../factories/usersFactory.js";
import environment from "../../../loadEnvironment.js";
import app from "../../app.js";
import type {
  LoginUser,
  UserRegisterCredentials,
} from "../../controllers/userControllers/types.js";
import routes from "../routes/routes.js";

let server: MongoMemoryServer;
const registerData: UserRegisterCredentials = getRandomUserRegister();
const notHashedPassword = registerData.password;
const { salt } = environment;
const { registerRoute, usersRoute, loginRoute } = routes;

beforeAll(async () => {
  server = await MongoMemoryServer.create();

  await connectDatabase(server.getUri());

  const hashedPassword = await bcrypt.hash(registerData.password, salt);
  await User.create({ ...registerData, password: hashedPassword });
});

afterAll(async () => {
  await mongoose.disconnect();

  await server.stop();
});

describe("Given a POST /users/register endpoint", () => {
  describe("When it receives a request with user details that are not in the database", () => {
    test("Then it should return a response with its method status with a 201", async () => {
      const newuser: UserRegisterCredentials = getRandomUserRegister();
      const expectedStatus = 201;

      const response = await request(app)
        .post(`${usersRoute}${registerRoute}`)
        .send(newuser)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("username");
      expect(response.body).toHaveProperty("email");
    });
  });

  describe("When it receives a request with username that already exists in the database", () => {
    test("Then it should return a response with its method status with a 409", async () => {
      const repeatedUsername: UserRegisterCredentials = getRandomUserRegister();
      repeatedUsername.username = registerData.username;
      const expectedStatus = 409;

      await request(app)
        .post(`${usersRoute}${registerRoute}`)
        .send(repeatedUsername)
        .expect(expectedStatus);
    });
  });

  describe("When it receives a request with email that already exists in the database", () => {
    test("Then it should return a response with its method status with a 409", async () => {
      const repeatedUsername: UserRegisterCredentials = getRandomUserRegister();
      repeatedUsername.email = registerData.email;
      const expectedStatus = 409;

      await request(app)
        .post(`${usersRoute}${registerRoute}`)
        .send(repeatedUsername)
        .expect(expectedStatus);
    });
  });

  describe("When it receives a request with username that doesn't fit username requeriments", () => {
    test("Then it should return a response with its method status with a 400", async () => {
      const wrongUsername: UserRegisterCredentials = getRandomUserRegister();
      wrongUsername.username = "a";
      const expectedStatus = 400;

      await request(app)
        .post(`${usersRoute}${registerRoute}`)
        .send(wrongUsername)
        .expect(expectedStatus);
    });
  });

  describe("When it receives a request with email that doesn't fit email requeriments", () => {
    test("Then it should return a response with its method status with a 400", async () => {
      const wrongEmail: UserRegisterCredentials = getRandomUserRegister();
      wrongEmail.username = "a";
      const expectedStatus = 400;

      await request(app)
        .post(`${usersRoute}${registerRoute}`)
        .send(wrongEmail)
        .expect(expectedStatus);
    });
  });

  describe("When it receives a request with no user details in the body", () => {
    test("Then it should respond with a status 400", async () => {
      const expectedStatus = 400;

      await request(app)
        .post(`${usersRoute}${registerRoute}`)
        .expect(expectedStatus);
    });
  });
});

describe("Given a POST /users/login endpoint", () => {
  describe(`When it receives a request with username ${registerData.username} and password ${notHashedPassword}`, () => {
    test("Then it should return a response with 200 status", async () => {
      const loginData: LoginUser = {
        username: registerData.username,
        password: registerData.password,
      };
      const expectedStatus = 200;

      await request(app)
        .post(`${usersRoute}${loginRoute}`)
        .send(loginData)
        .expect(expectedStatus);
    });
  });

  describe(`Whet it receives a request with username ${registerData.username} and wrong password 'password'`, () => {
    test("Then it should return a response with 401 status", async () => {
      const loginData: LoginUser = {
        username: registerData.username,
        password: "password",
      };
      const expectedStatus = 401;

      await request(app)
        .post(`${usersRoute}${loginRoute}`)
        .send(loginData)
        .expect(expectedStatus);
    });
  });

  describe(`When it receives a request with wrong username 'notAdmin' and a correct password '${notHashedPassword}'`, () => {
    test("Then it should return a response with 401 status", async () => {
      const loginData: LoginUser = {
        username: "notAdmin",
        password: registerData.password,
      };
      const expectedStatus = 401;

      await request(app)
        .post(`${usersRoute}${loginRoute}`)
        .send(loginData)
        .expect(expectedStatus);
    });
  });

  describe(`When it receives a request with short username 'bad' and a correct password '${notHashedPassword}'`, () => {
    test("Then it should return a response with 400 status", async () => {
      const loginData: LoginUser = {
        username: "bad",
        password: registerData.password,
      };
      const expectedStatus = 400;

      await request(app)
        .post(`${usersRoute}${loginRoute}`)
        .send(loginData)
        .expect(expectedStatus);
    });
  });

  describe(`When it receives a request with an username '${registerData.username}' and a short password 'bad'`, () => {
    test("Then it should return a response with 400 status", async () => {
      const loginData: LoginUser = {
        username: registerData.username,
        password: "bad",
      };
      const expectedStatus = 400;

      await request(app)
        .post(`${usersRoute}${loginRoute}`)
        .send(loginData)
        .expect(expectedStatus);
    });
  });
});
