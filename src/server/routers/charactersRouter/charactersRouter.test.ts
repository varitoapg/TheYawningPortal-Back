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
import Character from "../../../database/models/Character/Character";

const { secretJwt } = environment;

const { charactersRoute, deleteCharacterRoute } = charactersRoutes;

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

const tokenWithoutCharacters = jwt.sign(
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

  await Character.create(charactersList[0]);
  await Character.create(charactersList[1]);
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
        .query({ characterClass: "all" })
        .expect(200);

      expect(response.body).toHaveProperty("allCharacters");
    });
  });

  describe("When it receives a request with a correct token and a list of characters to find, filtered by a characterClass", () => {
    test("Then it should return a list of characters with the same class", async () => {
      const response = await request(app)
        .get(`${charactersRoute}`)
        .set({
          Authorization: `Bearer ${token}`,
          characters: [charactersList[1]._id, charactersList[0]._id],
        })
        .query({ characterClass: charactersList[1].characterClass })
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
});

describe("Given the endpoint [DELETE]/characters/delete/:idCharacter", () => {
  describe("When it receives a request with a correct token and a correct idCharacter", () => {
    test("Then it should return a status 200", async () => {
      const expectedReturnMessage = "Character deleted!";
      const response = await request(app)
        .delete(
          `${charactersRoute}${deleteCharacterRoute}/${charactersList[0]._id.toString()}`
        )
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty("text", expectedReturnMessage);
    });
  });

  describe("When it receives a request with a correct token of a user without the character", () => {
    test("Then it should return a status 404", async () => {
      await request(app)
        .delete(
          `${charactersRoute}${deleteCharacterRoute}/${charactersList[0]._id.toString()}`
        )
        .set("Authorization", `Bearer ${tokenWithoutCharacters}`)
        .expect(404);
    });
  });
});

describe("Given the endpoint [GET]/characters/:idCharacter", () => {
  describe("When it receives a request with a correct token and idCharacter", () => {
    test("Then it should return a status 200 and a character", async () => {
      const expectedStatus = 200;

      const response = await request(app)
        .get(`${charactersRoute}/${charactersList[1]._id.toString()}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("name", charactersList[1].name);
    });
  });

  describe("When it receives a request with a correct token and wrong idCharacter", () => {
    test("Then it should return a status 404 and an error text 'Character not found'", async () => {
      const expectedStatus = 404;

      const response = await request(app)
        .get(`${charactersRoute}/${charactersList[2]._id.toString()}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error", "Character not found");
    });
  });
});
