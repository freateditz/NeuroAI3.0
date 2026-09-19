import crypto from 'crypto';
import ParentStudentLink from '../models/ParentStudentLink.js';
import User from '../models/User.js';
import CourseProgress from '../models/CourseProgress.js';
import TestResult from '../models/TestResult.js';
import { LearningPath, LearningPathWeek } from '../models/LearningPath.js';

export const linkStudent = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const parentId = req.user._id;

    if (!inviteCode) {
      return res.status(400).json({ success: false, detail: 'Invite code is required' });
    }

    // Find student by invite code
    const student = await User.findOne({ inviteCode, role: 'student' });
    if (!student) {
      return res.status(404).json({ success: false, detail: 'Invalid or inactive invite code' });
    }

    // Check if link already exists
    const existingLink = await ParentStudentLink.findOne({ parent: parentId, student: student._id });
    if (existingLink) {
      return res.status(400).json({ success: false, detail: 'Student is already linked to this parent' });
    }

    // Create the link
    const link = await ParentStudentLink.create({
      parent: parentId,
      student: student._id,
      consentGranted: true, // In NeuroAI we assume linking implies consent for now, matching LEXI's simplified flow
      consentDate: new Date(),
    });

    res.status(201).json({
      success: true,
      detail: 'Student linked successfully',
      data: {
        studentName: student.name,
        studentId: student._id,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, detail: error.message });
  }
};

export const getChildren = async (req, res) => {
  try {
    const parentId = req.user._id;

    const links = await ParentStudentLink.find({ parent: parentId, withdrawnAt: null }).populate('student', 'name email picture grade_level childAge problemDescription inviteCode');

    const children = links.map(link => ({
      linkId: link._id,
      student: link.student,
    }));

    res.status(200).json({
      success: true,
      data: children,
    });
  } catch (error) {
    res.status(500).json({ success: false, detail: error.message });
  }
};

export const getChildProgress = async (req, res) => {
  try {
    const { studentId } = req.params;
    const parentId = req.user._id;

    // Verify link exists
    const link = await ParentStudentLink.findOne({ parent: parentId, student: studentId, withdrawnAt: null });
    if (!link) {
      return res.status(403).json({ success: false, detail: 'No linked child found or access withdrawn' });
    }

    const student = await User.findById(studentId).select('name email picture grade_level childAge problemDescription');

    // Get active learning path and its weeks
    const activePath = await LearningPath.findOne({ user: studentId, status: 'active' });
    let pathDetails = null;
    if (activePath) {
      const weeks = await LearningPathWeek.find({ path: activePath._id }).sort({ weekNumber: 1 });
      pathDetails = {
        ...activePath.toObject(),
        weeks
      };
    }

    // Aggregate data from CourseProgress and TestResult
    const courseProgress = await CourseProgress.find({ user: studentId }).populate('course', 'title description').lean();
    const testResults = await TestResult.find({ user: studentId }).lean();

    // Calculate overall statistics
    const totalTests = testResults.length;
    const avgAccuracy = totalTests > 0
      ? testResults.reduce((sum, tr) => sum + (tr.averageAccuracy || 0), 0) / totalTests
      : 0;

    const completedCourses = courseProgress.filter(cp => cp.status === 'completed').length;

    res.status(200).json({
      success: true,
      data: {
        student: student || { name: 'Student', grade_level: 'N/A' },
        studentId,
        overallStats: {
          totalTests,
          averageAccuracy: Math.round(avgAccuracy * 100) / 100,
          completedCourses,
        },
        learningPath: pathDetails,
        courseProgress,
        testResults,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, detail: error.message });
  }
};

export const getStudentInvite = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user || user.role !== 'student') {
      return res.status(403).json({ success: false, detail: 'Only students can generate invite codes' });
    }

    let inviteCode = user.inviteCode;
    if (!inviteCode) {
      inviteCode = crypto.randomBytes(3).toString('hex').toUpperCase();
      user.inviteCode = inviteCode;
      await user.save();
    }

    // Find linked parents
    const links = await ParentStudentLink.find({ student: userId, withdrawnAt: null }).populate('parent', 'name email');
    const linkedParents = links.map(link => link.parent);

    res.status(200).json({
      success: true,
      data: { inviteCode, linkedParents },
    });
  } catch (error) {
    res.status(500).json({ success: false, detail: error.message });
  }
};
