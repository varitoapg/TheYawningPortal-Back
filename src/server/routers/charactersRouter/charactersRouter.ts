import express from "express";
import { validate } from "express-validation";
import multer from "multer";
import path from "path";
import {
  characterSchema,
  characterUpdateSchema,
} from "../../../schemas/characterSchema.js";
import {
  createCharacter,
  deleteCharacter,
  editCharacter,
  getAllCharacters,
  getCharacterById,
} from "../../controllers/charactersControllers/charactersControllers.js";
import handleImage from "../../middleware/handleImage/handleImage.js";
import imageBackupUpload from "../../middleware/imageBackupUpload/imageBackupUpload.js";
import ownedCharacters from "../../middleware/ownedCharacters/ownedCharacters.js";
import charactersRoutes from "../routes/characterRoutes.js";

const {
  deleteCharacterRoute,
  characterIdRoute,
  createCharacterRoute,
  imagesRoute,
  editCharacterRoute,
} = charactersRoutes;

// eslint-disable-next-line new-cap
const characersRouter = express.Router();
const upload = multer({
  dest: path.join(`${imagesRoute}`),
  limits: {
    fileSize: 5000000,
  },
});

characersRouter.get("", ownedCharacters, getAllCharacters);
characersRouter.get(characterIdRoute, getCharacterById);
characersRouter.delete(
  `${deleteCharacterRoute}${characterIdRoute}`,
  deleteCharacter
);

characersRouter.post(
  createCharacterRoute,
  upload.single("image"),
  handleImage,
  imageBackupUpload,
  validate(characterSchema, {}, { abortEarly: false }),
  createCharacter
);

characersRouter.patch(
  `${editCharacterRoute}${characterIdRoute}`,
  upload.single("image"),
  handleImage,
  imageBackupUpload,
  validate(characterUpdateSchema, {}, { abortEarly: false }),
  editCharacter
);
export default characersRouter;
