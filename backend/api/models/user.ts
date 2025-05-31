import mongoose, { Document, Schema } from 'mongoose';

interface IRecipe {
  recipeId: string;
  name: string;
}

export interface IUser extends Document {
  id: string;
  googleId: string;
  email: string;
  name: string;
  recipeLists: IRecipe[];
}

const RecipeSchema: Schema = new Schema({
  recipeId: { type: String, required: true },
  name: { type: String, required: true },
});

const UserSchema: Schema = new Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  recipeLists: [RecipeSchema],
});

UserSchema.set('timestamps', true);

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
    return ret;
  },
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
