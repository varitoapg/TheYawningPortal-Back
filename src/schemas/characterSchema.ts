import { Joi } from "express-validation";

const characterSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    race: Joi.string().required(),
    class: Joi.string().required(),
    imageBackup: Joi.string().required(),
    stats: {
      speed: Joi.number().required(),
      strength: Joi.number().required(),
      dexterity: Joi.number().required(),
      constitution: Joi.number().required(),
      intelligence: Joi.number().required(),
      wisdom: Joi.number().required(),
      charisma: Joi.number().required(),
    },
    brackground: Joi.string().required(),
    details: Joi.string().required(),
  }),
};

export default characterSchema;
