import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;
