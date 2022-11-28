import type { InferSchemaType, Types } from "mongoose";
import type { characterSchema } from "../../../database/models/Character/Character";

export type CharacterStructure = InferSchemaType<typeof characterSchema>;

export interface CharacterWithId extends CharacterStructure {
  _id: Types.ObjectId;
}
