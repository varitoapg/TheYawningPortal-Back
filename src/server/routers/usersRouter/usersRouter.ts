import express from "express";
import { validate } from "express-validation";
import loginUserSchema from "../../../schemas/loginUserSchema.js";
import registerUserSchema from "../../../schemas/registerUserSchema.js";
import {
  loginUser,
  userRegister,
} from "../../controllers/userControllers/userControllers.js";
import routes from "../routes/routes.js";

const { registerRoute, loginRoute } = routes;

// eslint-disable-next-line new-cap
const usersRouter = express.Router();

usersRouter.post(
  registerRoute,
  validate(registerUserSchema, {}, { abortEarly: false }),
  userRegister
);

usersRouter.post(
  loginRoute,
  validate(loginUserSchema, {}, { abortEarly: false }),
  loginUser
);

export default usersRouter;
