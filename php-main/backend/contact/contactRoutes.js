import express from 'express';
import { getContactConfig, updateContactConfig, submitMessage, getMessages, deleteMessage, markMessageRead } from './contactController.js';

const router = express.Router();

// Configuration routes
router.get('/', getContactConfig);
router.post('/', updateContactConfig);
router.put('/', updateContactConfig);

// Messages / Enquiries routes
router.post('/message', submitMessage);
router.get('/message', getMessages);
router.put('/message/:id/read', markMessageRead);
router.delete('/message/:id', deleteMessage);

export default router;
