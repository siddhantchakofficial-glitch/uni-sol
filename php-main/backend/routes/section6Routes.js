import express from 'express';
import { getSection6Config, updateSection6Config } from '../controllers/section6Controller.js';

const router = express.Router();

router.get('/', getSection6Config);
router.post('/', updateSection6Config);
router.put('/', updateSection6Config);

export default router;
