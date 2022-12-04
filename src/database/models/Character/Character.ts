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
  characterClass: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  imageBackup: {
    type: String,
    required: true,
  },
  speed: {
    type: Number,
  },
  strength: {
    type: Number,
  },
  dexterity: {
    type: Number,
  },
  constitution: {
    type: Number,
  },
  intelligence: {
    type: Number,
  },
  wisdom: {
    type: Number,
  },
  charisma: {
    type: Number,
  },
  background: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  isAlive: {
    type: Boolean,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const Character = model("Character", characterSchema, "characters");

export default Character;
