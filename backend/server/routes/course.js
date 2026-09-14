import express from 'express';
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getUserProgress,
  getCourseProgress,
  recordAttempt,
  resetLesson,
  initializeCourses,
} from '../controllers/courseController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Initialize route - must come before /:id to avoid conflicts
router.get('/initialize', initializeCourses);

// Public routes with optional auth (to include progress if logged in)
router.get('/', protect, getCourses);
router.get('/:id', protect, getCourse);

// Protected routes (require authentication)
router.get('/user/progress', protect, getUserProgress);
router.get('/:id/progress', protect, getCourseProgress);
router.post('/:courseId/lessons/:lessonNumber/attempt', protect, recordAttempt);
router.delete('/:courseId/lessons/:lessonNumber/reset', protect, resetLesson);

// Admin routes (for now, just protected - add admin middleware later)
router.post('/', protect, createCourse);
router.put('/:id', protect, updateCourse);
router.delete('/:id', protect, deleteCourse);

export default router;
