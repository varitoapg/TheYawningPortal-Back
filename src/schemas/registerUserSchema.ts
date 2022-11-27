/* eslint-disable @typescript-eslint/naming-convention */
import { Joi } from "express-validation";

const registerUserSchema = {
  body: Joi.object({
    username: Joi.string().min(5).required().messages({
      "string.empty": `Your username cannot be empty`,
      "string.min": `Your username should have a minimum length of {#limit}`,
      "any.required": `Username is a required field`,
    }),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required().messages({
      "string.empty": `Your password cannot be empty`,
      "string.min": `Your password should have a minimum length of {#limit}`,
      "any.required": `Password is a required field`,
    }),
  }),
};

export default registerUserSchema;
