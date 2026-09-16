import express from 'express';
import { getSection3Config, updateSection3Config } from '../controllers/section3Controller.js';

const router = express.Router();

router.get('/', getSection3Config);
router.post('/', updateSection3Config);
router.put('/', updateSection3Config);

export default router;
