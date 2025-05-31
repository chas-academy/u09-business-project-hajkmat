import dotenv from 'dotenv';

dotenv.config();

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      MONGODB_URI?: string;
      GOOGLE_CLIENT_ID?: string;
      GOOGLE_CLIENT_SECRET?: string;
      SESSION_SECRET?: string;
    }
  }
}

const env = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || '',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  SESSION_SECRET: process.env.SESSION_SECRET || 'your_default_session_secret',
};

export default env;
