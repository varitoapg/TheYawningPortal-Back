/* eslint-disable @typescript-eslint/naming-convention */
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import request from "supertest";
import type { Types } from "mongoose";
import mongoose from "mongoose";
import connectDatabase from "../../../database/connectDatabase";
import environment from "../../../loadEnvironment";
import { getRandomUserWithId } from "../../../factories/usersFactory";
import type { UserTokenPayload } from "../../controllers/userControllers/types";
import app from "../../app";
import charactersRoutes from "../routes/characterRoutes";
import { getRandomCharacterList } from "../../../factories/characterFactory";
import User from "../../../database/models/User/User";

const { secretJwt } = environment;

const { charactersRoute } = charactersRoutes;

const charactersList = getRandomCharacterList(3);
const user = {
  ...getRandomUserWithId(),
  characters: [charactersList[1]._id, charactersList[0]._id],
};

const userWithoutCharacters = {
  ...getRandomUserWithId(),
  characters: [] as Types.ObjectId[],
};

let server: MongoMemoryServer;

const token = jwt.sign(
  { username: user.username, id: user._id.toString() } as UserTokenPayload,
  secretJwt,
  {
    expiresIn: "2d",
  }
);

const tokeWithoutCharacters = jwt.sign(
  {
    username: userWithoutCharacters.username,
    id: userWithoutCharacters._id.toString(),
  } as UserTokenPayload,
  secretJwt,
  {
    expiresIn: "2d",
  }
);

beforeAll(async () => {
  server = await MongoMemoryServer.create();

  await connectDatabase(server.getUri());

  await User.create(user);
  await User.create(userWithoutCharacters);
});

afterAll(async () => {
  await mongoose.disconnect();

  await server.stop();
});

describe("Given the endpoint [GET]/characters", () => {
  describe("When it receives a request with a correct token and a list of characters to find", () => {
    test("Then it should return a list of characters", async () => {
      const response = await request(app)
        .get(`${charactersRoute}`)
        .set({
          Authorization: `Bearer ${token}`,
          characters: [charactersList[1]._id, charactersList[0]._id],
        })
        .expect(200);

      expect(response.body).toHaveProperty("allCharacters");
    });
  });

  describe("When it receives a request with a wrong token and a list of characters to find", () => {
    test("Then it should return response's method status with 401", async () => {
      await request(app)
        .get(`${charactersRoute}`)

        .set({
          Authorization: `Bearer wrong`,
          characters: [charactersList[1]._id, charactersList[0]._id],
        })
        .expect(401);
    });
  });

  describe("When it receives a request with a correct token and a empty list of characters to find", () => {
    test("Then it should return response's method status with 404", async () => {
      const response = await request(app)
        .get(`${charactersRoute}`)
        .set({
          Authorization: `Bearer ${tokeWithoutCharacters}`,
          characters: [],
        })
        .expect(404);

      expect(response.body).toHaveProperty(
        "error",
        "Sorry, but you still not have any character"
      );
    });
  });
});
