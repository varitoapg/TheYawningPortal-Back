import express from "express";
import { getAllCharacters } from "../../controllers/charactersControllers/charactersControllers.js";
import ownedCharacters from "../../middleware/ownedCharacters/ownedCharacters.js";

// eslint-disable-next-line new-cap
const characersRouter = express.Router();

characersRouter.get("", ownedCharacters, getAllCharacters);

export default characersRouter;
