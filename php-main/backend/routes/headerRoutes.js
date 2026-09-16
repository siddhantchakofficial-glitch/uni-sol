import express from 'express';
import {
  getHeaderConfig,
  createHeaderConfig,
  updateHeaderConfig,
  deleteHeaderConfig
} from '../controllers/headerController.js';

const router = express.Router();

router.get('/', getHeaderConfig);
router.post('/', createHeaderConfig);
router.put('/', updateHeaderConfig);
router.delete('/', deleteHeaderConfig);

export default router;
