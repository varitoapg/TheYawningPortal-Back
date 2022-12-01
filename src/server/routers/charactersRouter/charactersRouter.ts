import express from "express";
import {
  deleteCharacter,
  getAllCharacters,
} from "../../controllers/charactersControllers/charactersControllers.js";
import ownedCharacters from "../../middleware/ownedCharacters/ownedCharacters.js";
import charactersRoutes from "../routes/characterRoutes.js";

const { deleteCharacterRoute, characterIdRoute } = charactersRoutes;

// eslint-disable-next-line new-cap
const characersRouter = express.Router();

characersRouter.get("", ownedCharacters, getAllCharacters);
characersRouter.delete(
  `${deleteCharacterRoute}${characterIdRoute}`,
  deleteCharacter
);

export default characersRouter;
