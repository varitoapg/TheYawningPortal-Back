import express from "express";
import { validate } from "express-validation";
import registerUserSchema from "../../../schemas/registerUserSchema.js";
import { userRegister } from "../../controllers/userControllers/userControllers.js";
import routes from "../routes/routes.js";

const { registerRoute } = routes;

// eslint-disable-next-line new-cap
const usersRouter = express.Router();

usersRouter.post(
  registerRoute,
  validate(registerUserSchema, {}, { abortEarly: false }),
  userRegister
);

export default usersRouter;
