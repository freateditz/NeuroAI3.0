import express from 'express';
import { submitContact } from '../controllers/contactController.js';

const router = express.Router();

// Public route - submit contact form
router.post('/', submitContact);

export default router;
