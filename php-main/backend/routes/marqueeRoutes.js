import express from 'express';
import { getMarqueeConfig, updateMarqueeConfig } from '../controllers/marqueeController.js';

const router = express.Router();

router.get('/', getMarqueeConfig);
router.put('/', updateMarqueeConfig);

export default router;
