import express from 'express';
import { protect } from '../middleware/auth.js';
import * as learningPathService from '../services/learningPathService.js';

const router = express.Router();

// GET /api/learning/path
// Get the current active learning path for the authenticated user
router.get('/path', protect, async (req, res) => {
  try {
    const path = await learningPathService.getActivePath(req.user._id);
    if (!path) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No active learning path. Complete more tests to generate one.'
      });
    }

    // Also fetch the weeks for the path
    const { LearningPathWeek } = await import('../models/LearningPath.js');
    const weeks = await LearningPathWeek.find({ path: path._id }).sort({ weekNumber: 1 });

    res.json({
      success: true,
      data: {
        ...path.toObject(),
        weeks
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/learning/generate
// Trigger a new learning path generation based on latest assessments
router.post('/generate', protect, async (req, res) => {
  try {
    const path = await learningPathService.generateLearningPath(req.user._id);
    res.status(201).json({
      success: true,
      data: path
    });
  } catch (error) {
    if (error.message.includes('required')) {
      return res.status(400).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/learning/complete-task
// Mark a daily task as completed
router.patch('/complete-task', protect, async (req, res) => {
  const { pathId, weekNumber, dayNumber } = req.body;
  try {
    const result = await learningPathService.completeTask(pathId, weekNumber, dayNumber, req.user._id);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
