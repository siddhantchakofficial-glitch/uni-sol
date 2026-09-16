import express from 'express';
import { getAboutConfig, updateAboutConfig } from './aboutController.js';

const router = express.Router();

router.get('/', getAboutConfig);
router.post('/', updateAboutConfig);
router.put('/', updateAboutConfig);

export default router;
