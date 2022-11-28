import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import type { CharacterWithId } from "../server/controllers/charactersControllers/types.js";
import mongoose from "mongoose";

const characterFactory = Factory.define<CharacterWithId>(() => ({
  _id: new mongoose.Types.ObjectId(),
  background: faker.address.city(),
  class: faker.word.noun(),
  createdBy: new mongoose.Types.ObjectId(),
  details: faker.lorem.paragraph(),
  image: faker.image.nature(),
  imageBackup: faker.image.nature(),
  isAlive: faker.datatype.boolean(),
  name: faker.name.fullName(),
  race: faker.animal.cat(),
  stats: {
    charisma: faker.datatype.number({ max: 20 }),
    constitution: faker.datatype.number({ max: 20 }),
    dexterity: faker.datatype.number({ max: 20 }),
    intelligence: faker.datatype.number({ max: 20 }),
    speed: faker.datatype.number({ max: 50 }),
    strength: faker.datatype.number({ max: 20 }),
    wisdom: faker.datatype.number({ max: 20 }),
  },
}));

export const getRandomCharacter = () => characterFactory.build();

export const getRandomCharacterList = (number: number) =>
  characterFactory.buildList(number);
