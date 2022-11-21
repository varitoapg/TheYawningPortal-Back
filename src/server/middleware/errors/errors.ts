import "../../../loadEnvironment.js";
import type { Request, Response } from "express";

export const unknownEndpoint = (req: Request, res: Response) => {
  res.status(404).json({ message: "Unknown Endpoint" });
};
