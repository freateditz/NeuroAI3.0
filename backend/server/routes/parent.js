import express from 'express';
import { protect, requireRole } from '../middleware/auth.js';
import {
  linkStudent,
  getChildren,
  getChildProgress,
  getStudentInvite,
} from '../controllers/parentController.js';

const router = express.Router();

// Student route to get their own invite code
router.get('/invite', protect, requireRole(['student']), getStudentInvite);

// Parent routes
router.post('/link', protect, requireRole(['parent']), linkStudent);
router.get('/children', protect, requireRole(['parent']), getChildren);
router.get('/children/:studentId/progress', protect, requireRole(['parent']), getChildProgress);

export default router;
