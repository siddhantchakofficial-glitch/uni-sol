import express from 'express';
import { getHeroConfig, updateHeroConfig } from '../controllers/heroController.js';

const router = express.Router();

router.get('/', getHeroConfig);
router.post('/', updateHeroConfig);
router.put('/', updateHeroConfig);

export default router;
