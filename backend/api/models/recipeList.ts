import mongoose, { Schema, Document } from 'mongoose';

interface IRecipe {
  recipeId: string;
  name: string;
}

interface IRecipeList extends Document {
  userId: string;
  recipes: IRecipe[];
}

const RecipeSchema: Schema = new Schema({
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
