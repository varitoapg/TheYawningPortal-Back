import "../../../loadEnvironment.js";
import chalk from "chalk";
import debugCreator from "debug";
import type { NextFunction, Request, Response } from "express";
import type CustomError from "../../../CustomError/CustomError.js";

const debug = debugCreator("characters:server:middleware:errors");

export const unknownEndpoint = (req: Request, res: Response) => {
  res.status(404).json({ message: "Unknown Endpoint" });
};

export const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction
) => {
  const publicMessage = error.publicMessage || "Fatal error";
  const status = error.statusCode ?? 500;

  debug(chalk.red(error.message));

  res.status(status).json({ error: publicMessage });
};
