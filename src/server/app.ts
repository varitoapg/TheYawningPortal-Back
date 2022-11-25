import express from "express";
import cors from "cors";
import morgan from "morgan";
import corsOptions from "./corsOptions.js";
import { generalError, unknownEndpoint } from "./middleware/errors/errors.js";
import routes from "./routers/routes/routes.js";
import usersRouter from "./routers/usersRouter/usersRouter.js";

const { usersRoute } = routes;
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

app.use(unknownEndpoint);
app.use(generalError);

export default app;
