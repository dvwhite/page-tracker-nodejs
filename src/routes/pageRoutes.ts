import { Router } from 'express';
import { getPages } from '../controllers/pageController';

const router = Router();

router.post('/track-pages', getPages);

export default router;