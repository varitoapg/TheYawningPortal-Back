import { createClient } from "@supabase/supabase-js";
import type { NextFunction, Response } from "express";
import path from "path";
import fs from "fs/promises";
import environment from "../../../loadEnvironment.js";
import type { CustomRequest } from "../auth/types.js";
import type { CharacterStructure } from "../../controllers/charactersControllers/types.js";
import CustomError from "../../../CustomError/CustomError.js";

const { supabaseUrl, supabaseKey, supabaseBucket } = environment;

const supabase = createClient(supabaseUrl, supabaseKey);

export const bucket = supabase.storage.from(supabaseBucket);

const imageBackupUpload = async (
  req: CustomRequest<
    Record<string, unknown>,
    Record<string, unknown>,
    CharacterStructure
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const imagePath = path.join("assets/images", req.file.originalname);
    await fs.rename(path.join("assets/images", req.file.filename), imagePath);

    const filenameImage = await fs.readFile(imagePath);

    await bucket.upload(
      req.file.originalname + req.file.filename,
      filenameImage
    );

    const {
      data: { publicUrl },
    } = bucket.getPublicUrl(req.file.originalname);

    req.body.image = imagePath;
    req.body.imageBackup = publicUrl;

    next();
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      "Something goes wrong uploading your image",
      400
    );

    next(customError);
  }
};

export default imageBackupUpload;
