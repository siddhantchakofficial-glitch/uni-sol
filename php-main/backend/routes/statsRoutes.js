import express from 'express';
import { getStatsConfig, updateStatsConfig } from '../controllers/statsController.js';

const router = express.Router();

router.get('/', getStatsConfig);
router.put('/', updateStatsConfig);

export default router;
