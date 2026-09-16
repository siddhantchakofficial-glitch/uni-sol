import express from 'express';
import { getSection5Config, updateSection5Config } from '../controllers/section5Controller.js';

const router = express.Router();

router.get('/', getSection5Config);
router.post('/', updateSection5Config);
router.put('/', updateSection5Config);

export default router;
