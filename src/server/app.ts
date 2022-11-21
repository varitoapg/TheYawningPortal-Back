import express from "express";
import cors from "cors";
import morgan from "morgan";
import corsOptions from "./corsOptions.js";

const app = express();

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.disable("x-powered-by");

export default app;
