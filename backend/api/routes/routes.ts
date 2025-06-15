import express from 'express';
import authRoutes from './auth';
import recipeListRoutes from './recipeLists';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/recipe-lists', recipeListRoutes);

export default router;
