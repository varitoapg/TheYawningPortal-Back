/* eslint-disable @typescript-eslint/naming-convention */
import { Joi } from "express-validation";

export const characterSchema = {
  body: Joi.object({
    name: Joi.string().required().messages({
      "string.empty": `Name cannot be empty.`,
    }),
    race: Joi.string().required().messages({
      "string.empty": `You must enter your character's race.`,
    }),
    characterClass: Joi.string().required().messages({
      "string.empty": `You must choose a class.`,
    }),
    imageBackup: Joi.string().required(),
    image: Joi.string(),
    speed: Joi.number(),
    strength: Joi.number().min(1).max(20).messages({
      "number.min": `Strength should have a minimum value of {#limit}.`,
      "number.max": `Strength should have a maximum value of {#limit}.`,
    }),
    dexterity: Joi.number().min(1).max(20).messages({
      "number.min": `Dexterity should have a minimum value of {#limit}.`,
      "number.max": `Dexterity should have a maximum value of {#limit}.`,
    }),
    constitution: Joi.number().min(1).max(20).messages({
      "number.min": `Constitution should have a minimum value of {#limit}.`,
      "number.max": `Constitution should have a maximum value of {#limit}.`,
    }),
    intelligence: Joi.number().min(1).max(20).messages({
      "number.min": `Intelligence should have a minimum value of {#limit}.`,
      "number.max": `Intelligence should have a maximum value of {#limit}.`,
    }),
    wisdom: Joi.number().min(1).max(20).messages({
      "number.min": `Wisdom should have a minimum value of {#limit}.`,
      "number.max": `Wisdom should have a maximum value of {#limit}.`,
    }),
    charisma: Joi.number().min(1).max(20).messages({
      "number.min": `Charisma should have a minimum value of {#limit}.`,
      "number.max": `Charisma should have a maximum value of {#limit}.`,
    }),
    background: Joi.string().required().messages({
      "string.empty": `Please, enter your charecter's background.`,
    }),
    details: Joi.string().required().messages({
      "string.empty": `Explain your character's story.`,
    }),
  }),
};
