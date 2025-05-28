import app from './app';
import config from './config/config';

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

// For Vercel serverless functions
export default app;
