import express from 'express';
import authRoutes from './auth';
import recipeListRoutes from './recipeLists';
console.log('Routes file loaded');
const router = express.Router();
router.get('/', (req, res) => {
  res.json({
    message: 'API is working',
    availableRoutes: ['/auth', '/recipe-lists'],
  });
});

router.use('/auth', authRoutes);
router.use('/recipe-lists', recipeListRoutes);

console.log('Auth routes mounted at /auth');

export default router;
