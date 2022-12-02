import express from "express";
import multer from "multer";
import path from "path";
import {
  deleteCharacter,
  getAllCharacters,
} from "../../controllers/charactersControllers/charactersControllers.js";
import handleImage from "../../middleware/handleImage/handleImage.js";
import imageBackupUpload from "../../middleware/imageBackupUpload/imageBackupUpload.js";
import ownedCharacters from "../../middleware/ownedCharacters/ownedCharacters.js";
import charactersRoutes from "../routes/characterRoutes.js";

const { deleteCharacterRoute, characterIdRoute, createCharacterRoute } =
  charactersRoutes;

// eslint-disable-next-line new-cap
const characersRouter = express.Router();
const upload = multer({
  dest: path.join("assets/images"),
  limits: {
    fileSize: 5000000,
  },
});

characersRouter.get("", ownedCharacters, getAllCharacters);
characersRouter.delete(
  `${deleteCharacterRoute}${characterIdRoute}`,
  deleteCharacter
);

characersRouter.post(
  createCharacterRoute,
  upload.single("image"),
  handleImage,
  imageBackupUpload
);

export default characersRouter;
