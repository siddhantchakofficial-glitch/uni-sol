import express from 'express';
import { getSection4Config, updateSection4Config } from '../controllers/section4Controller.js';

const router = express.Router();

router.get('/', getSection4Config);
router.post('/', updateSection4Config);
router.put('/', updateSection4Config);

export default router;
