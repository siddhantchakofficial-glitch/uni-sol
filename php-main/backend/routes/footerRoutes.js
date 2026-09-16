import express from 'express';
import { getFooterConfig, updateFooterConfig } from '../controllers/footerController.js';

const router = express.Router();

router.get('/', getFooterConfig);
router.post('/', updateFooterConfig);
router.put('/', updateFooterConfig);

export default router;
