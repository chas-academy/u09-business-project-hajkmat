import passport, { Profile } from 'passport';
import { Strategy as GoogleStrategy, VerifyCallback } from 'passport-google-oauth20';
import User from '../models/user';
import { userToObject } from '../utils/auth';

function createNewUser(profile: Profile) {
  return new User({
    googleId: profile.id,
    displayName: profile.displayName,
    email: profile.emails && profile.emails[0] ? profile.emails[0].value : '',
  }).save();
}

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
      callbackURL: 'http://localhost:5173/api/auth/google/callback',
      scope: ['profile', 'email'],
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
      try {
        // Check if user already exists in the database
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          return done(null, userToObject(user));
        } else {
          // If not, create a new user
          // Safely access email if available
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';

          user = await new User({
            googleId: profile.id,
            displayName: profile.displayName,
            name: profile.displayName,
            email: email,
          }).save();
          return done(null, userToObject(user));
        }
      } catch (err) {
        return done(err as Error, undefined);
      }
    },
  ),
);

// Serialize user to store in session
// Use Express.User instead of UserObject to match Passport's expectations
passport.serializeUser((user: Express.User, done: (err: Error | null, id?: string) => void) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(
  (id: string, done: (err: Error | null, user?: Express.User | null) => void) => {
    User.findById(id)
      .then((user) => {
        if (!user) {
          return done(new Error('User not found'), null);
        }
        // Convert Mongoose document to UserObject using your helper function
        return done(null, userToObject(user));
      })
      .catch((err) => {
        return done(err, null);
      });
  },
);

export default passport;
