import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import type {
  UserRegisterCredentials,
  UserWithId,
} from "../server/controllers/userControllers/types.js";
import mongoose from "mongoose";

const userRegisterFactory = Factory.define<UserRegisterCredentials>(() => ({
  username: faker.internet.userName(),
  password: faker.internet.password(),
  email: faker.internet.email(),
}));

const userWithIdFactory = Factory.define<UserWithId>(() => ({
  username: faker.internet.userName(),
  password: faker.internet.password(),
  email: faker.internet.email(),
  _id: new mongoose.Types.ObjectId(),
  characters: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
}));

export const getRandomUserRegister = () => userRegisterFactory.build();
export const getRandomUserWithId = () => userWithIdFactory.build();
