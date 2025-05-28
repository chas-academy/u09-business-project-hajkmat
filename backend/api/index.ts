import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import connectDB from './database/db';
import routes from './routes/routes';
import cors from 'cors';

// Load environment variables
dotenv.config();

// Initialize express app
const app: Express = express();
const port: number = parseInt(process.env.PORT || '3000', 10);

// Middleware
app.use(express.json());
app.use(cors());

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

// Start server (conditionally for testing)
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  });
}

// Export for tests and serverless functions
export default app;
// Export for Vercel
module.exports = app;
