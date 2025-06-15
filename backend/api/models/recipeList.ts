import mongoose, { Schema } from 'mongoose';
import { IRecipeList } from '../types/recipe';

const RecipeSchema: Schema = new Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true },
  recipes: [
    {
      recipeId: { type: String, required: true },
      name: { type: String, required: true },
    },
  ],
});

const RecipeList = mongoose.model<IRecipeList>('RecipeList', RecipeSchema);

export default RecipeList;
