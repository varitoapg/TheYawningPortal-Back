import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import type { UserRegisterCredentials } from "../server/controllers/userControllers/types.js";

const userRegisterFactory = Factory.define<UserRegisterCredentials>(() => ({
  username: faker.internet.userName(),
  password: faker.internet.password(),
  email: faker.internet.email(),
}));

export const getRandomUserRegister = () => userRegisterFactory.build();
