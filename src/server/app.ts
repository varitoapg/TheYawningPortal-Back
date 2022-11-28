import express from "express";
import cors from "cors";
import morgan from "morgan";
import corsOptions from "./corsOptions.js";
import { generalError, unknownEndpoint } from "./middleware/errors/errors.js";
import userRoutes from "./routers/routes/userRoutes.js";
import usersRouter from "./routers/usersRouter/usersRouter.js";
import charactersRoutes from "./routers/routes/characterRoutes.js";
import auth from "./middleware/auth/auth.js";
import characersRouter from "./routers/charactersRouter/charactersRouter.js";

const { usersRoute } = userRoutes;
const { charactersRoute } = charactersRoutes;

const app = express();

app.use(cors(corsOptions));
app.disable("x-powered-by");
app.use(morgan("dev"));

app.use(express.json());

app.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Pong",
  });

  next();
});

app.use(usersRoute, usersRouter);
app.use(charactersRoute, auth, characersRouter);

app.use(unknownEndpoint);
app.use(generalError);

export default app;
