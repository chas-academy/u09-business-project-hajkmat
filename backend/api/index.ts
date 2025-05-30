import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import connectDB from './database/db';
import routes from './routes/routes';
import cors from 'cors';
import passport from 'passport';
import './config/passport';

// Load environment variables
dotenv.config();

// Initialize express app
const app: Express = express();
const port: number = parseInt(process.env.PORT || '3000', 10);

// Middleware
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

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
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

connectDB();

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

export default app;
