import type { NextFunction, Response } from "express";
import path from "path";
import sharp from "sharp";
import type { CustomRequest } from "../auth/types.js";
import CustomError from "../../../CustomError/CustomError.js";
import charactersRoutes from "../../routers/routes/characterRoutes.js";

const { imagesRoute } = charactersRoutes;

const handleImage = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { filename, originalname } = req.file;
  if (!req.file) {
    next();
    return;
  }

  try {
    const imagePath = `${path.basename(
      originalname,
      path.extname(originalname)
    )}`;

    await sharp(path.join(imagesRoute, filename))
      .resize(200, 200, { fit: "cover", position: "top" })
      .webp({ quality: 92 })
      .toFormat("webp")
      .toFile(path.join(imagesRoute, `${imagePath}.webp`));

    req.file.filename = `${imagePath}.webp`;

    next();
  } catch {
    const formatError = new CustomError(
      "Error formating image",
      "Sorry, your image is not valid",
      400
    );

    next(formatError);
  }
};

export default handleImage;
