import mongoose, { Schema, Document, Types } from 'mongoose';

// Interface for Recipe document with explicit ID typing
export interface IRecipeDocument extends Document {
  _id: Types.ObjectId;
  externalId: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  diets: string[];
  dishTypes: string[];
  cuisines: string[];
}

// Recipe schema
const RecipeSchema: Schema = new Schema(
  {
    externalId: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    readyInMinutes: { type: Number, required: true },
    servings: { type: Number, required: true },
    sourceUrl: { type: String, required: true },
    diets: [{ type: String }],
    dishTypes: [{ type: String }],
    cuisines: [{ type: String }],
  },
  { timestamps: true },
);

// Create an index on externalId for faster lookups
RecipeSchema.index({ externalId: 1 });

export default mongoose.model<IRecipeDocument>('Recipe', RecipeSchema);
