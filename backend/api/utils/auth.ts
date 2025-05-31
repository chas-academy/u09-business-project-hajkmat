import { IUser } from '../types/auth.d';

export function userToObject(user: IUser | null): Express.User | undefined {
  if (!user) return undefined;

  const userObj = typeof user.toObject === 'function' ? user.toObject() : user;

  return {
    id: userObj._id?.toString() || '',
    googleId: userObj.googleId,
    displayName: userObj.displayName,
    email: userObj.email,
    name: userObj.name,
    recipeLists: userObj.recipeLists || [],
  } as Express.User;
}
