import express from 'express';
import { getPartnerConfig, updatePartnerConfig } from '../controllers/partnerController.js';

const router = express.Router();

router.get('/', getPartnerConfig);
router.put('/', updatePartnerConfig);

export default router;
