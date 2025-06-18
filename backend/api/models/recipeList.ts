import mongoose, { Schema, Document, Types } from 'mongoose';
import { IRecipeDocument } from './recipe';

// Interface for RecipeList document with explicit ID typing
export interface IRecipeListDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  userId: Types.ObjectId | string;
  recipes: Types.ObjectId[] | IRecipeDocument[];
}

// RecipeList schema
const RecipeListSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Recipe',
      },
    ],
  },
  { timestamps: true },
);

// Create compound index for finding lists by userId
RecipeListSchema.index({ userId: 1, name: 1 });

export default mongoose.model<IRecipeListDocument>('RecipeList', RecipeListSchema);
