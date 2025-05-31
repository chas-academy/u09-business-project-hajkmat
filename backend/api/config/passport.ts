import passport, { Profile } from 'passport';
import { Strategy as GoogleStrategy, VerifyCallback } from 'passport-google-oauth20';
import User, { IUser } from '../models/user';

// Type-safe environment variables
declare const process: {
  env: {
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    [key: string]: string | undefined;
  };
};

// Validate environment variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('Missing Google OAuth credentials in environment variables');
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
      try {
        // Check if user already exists in the database
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          return done(null, user.toObject() as any);
        } else {
          // If not, create a new user
          // Safely access email if available
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';

          user = await new User({
            googleId: profile.id,
            displayName: profile.displayName,
            email: email,
          }).save();
          return done(null, user.toObject() as any);
        }
      } catch (err) {
        return done(err as Error, undefined);
      }
    },
  ),
);

// Serialize user to store in session
passport.serializeUser((user: any, done: (err: any, id?: any) => void) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done: (err: any, user?: any) => void) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return done(new Error('User not found'), undefined);
    }
    // Convert to plain object to resolve type conflicts
    return done(null, user.toObject() as any);
  } catch (err) {
    return done(err as Error, undefined);
  }
});

export default passport;
