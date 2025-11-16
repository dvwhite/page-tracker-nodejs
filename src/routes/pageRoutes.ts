import { Router } from 'express';
import { getPages } from '../controllers/pageController';

const router = Router();

router.get('/track-pages', getPages);

export default router;