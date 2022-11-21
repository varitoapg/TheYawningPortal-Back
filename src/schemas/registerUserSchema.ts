import { Joi } from "express-validation";

const registerUserSchema = {
  body: Joi.object({
    username: Joi.string().min(5).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};

export default registerUserSchema;
