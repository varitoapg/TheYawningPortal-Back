import { Joi } from "express-validation";

export const characterSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    race: Joi.string().required(),
    characterClass: Joi.string().required(),
    imageBackup: Joi.string().required(),
    image: Joi.string(),
    speed: Joi.number(),
    strength: Joi.number(),
    dexterity: Joi.number(),
    constitution: Joi.number(),
    intelligence: Joi.number(),
    wisdom: Joi.number(),
    charisma: Joi.number(),
    background: Joi.string().required(),
    details: Joi.string().required(),
  }),
};
