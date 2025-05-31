import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types/user';

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
