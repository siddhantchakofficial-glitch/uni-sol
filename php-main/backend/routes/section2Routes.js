import express from 'express';
import { getSection2Config, updateSection2Config } from '../controllers/section2Controller.js';

const router = express.Router();

router.get('/', getSection2Config);
router.post('/', updateSection2Config);
router.put('/', updateSection2Config);

export default router;
