import { Schema, model } from "mongoose";

export const characterSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  race: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  imageBackup: {
    type: String,
  },
  speed: {
    type: Number,
    required: true,
  },
  strength: {
    type: Number,
    required: true,
  },
  dexterity: {
    type: Number,
    required: true,
  },
  constitution: {
    type: Number,
    required: true,
  },
  intelligence: {
    type: Number,
    required: true,
  },
  wisdom: {
    type: Number,
    required: true,
  },
  charisma: {
    type: Number,
    required: true,
  },
  background: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
});

const Character = model("Character", characterSchema, "characters");

export default Character;
