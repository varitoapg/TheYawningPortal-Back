import express from "express";
import { validate } from "express-validation";
import registerUserSchema from "../../../schemas/registerUserSchema.js";
import {
  loginUser,
  userRegister,
} from "../../controllers/userControllers/userControllers.js";
import userRoutes from "../routes/userRoutes.js";

const { registerRoute, loginRoute } = userRoutes;

// eslint-disable-next-line new-cap
const usersRouter = express.Router();

usersRouter.post(
  registerRoute,
  validate(registerUserSchema, {}, { abortEarly: false }),
  userRegister
);

usersRouter.post(loginRoute, loginUser);

export default usersRouter;
