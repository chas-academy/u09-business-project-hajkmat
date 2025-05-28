import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Listen unconditionally (Vercel will override PORT in production)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
// Export for Vercel
module.exports = app;
