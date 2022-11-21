import express from "express";
import cors from "cors";
import morgan from "morgan";
import corsOptions from "./corsOptions.js";
import { unknownEndpoint } from "./middleware/errors/errors.js";

const app = express();

app.use(cors(corsOptions));
app.disable("x-powered-by");
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res, next) => {
  res.json({
    message: "Pong",
  });

  next();
});

app.use(unknownEndpoint);

export default app;
