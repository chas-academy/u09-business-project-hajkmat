import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import connectDB from './database/db';
import routes from './routes/routes';
import cors from 'cors';
import session from 'express-session'; 
import passport from 'passport';
import './config/passport';

// Load environment variables
dotenv.config();

// Initialize express app
const app: Express = express();
const port: number = parseInt(process.env.PORT || '3000', 10);

// CORS configuration
const allowedOrigins = {
  origin:
    process.env.NODE_ENV === 'production' ? 'https://hajkmat.netlify.app' : 'http://localhost:5173',
  credentials: true,
};

// Apply CORS
app.use(cors(allowedOrigins));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware for Oauth
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_default_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'Server is running' });
});

// Routes
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'HAJKMAT' });
});

app.use('/api', routes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
  });

export default app;
