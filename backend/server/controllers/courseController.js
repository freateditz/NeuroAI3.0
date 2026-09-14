import Course from '../models/Course.js';
import CourseProgress from '../models/CourseProgress.js';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ isActive: true }).sort({ createdAt: 1 });
    
    // If user is authenticated, get their progress for each course
    if (req.user) {
      const coursesWithProgress = await Promise.all(
        courses.map(async (course) => {
          const progress = await CourseProgress.findOne({
            user: req.user._id,
            course: course._id,
          });
          
          return {
            ...course.toObject(),
            userProgress: progress || null,
          };
        })
      );
      
      return res.status(200).json({
        success: true,
        count: coursesWithProgress.length,
        data: coursesWithProgress,
      });
    }
    
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
export const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
      });
    }
    
    // If user is authenticated, get their progress
    let userProgress = null;
    if (req.user) {
      userProgress = await CourseProgress.findOne({
        user: req.user._id,
        course: course._id,
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        ...course.toObject(),
        userProgress,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new course (Admin only)
// @route   POST /api/courses
// @access  Private/Admin
export const createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    
    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
export const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
      });
    }
    
    // Delete all progress records for this course
    await CourseProgress.deleteMany({ course: req.params.id });
    
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's course progress for all courses
// @route   GET /api/courses/progress
// @access  Private
export const getUserProgress = async (req, res, next) => {
  try {
    const progressRecords = await CourseProgress.find({ user: req.user._id })
      .populate('course')
      .sort({ lastAccessedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: progressRecords.length,
      data: progressRecords,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get or create user progress for a specific course
// @route   GET /api/courses/:id/progress
// @access  Private
export const getCourseProgress = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
      });
    }
    
    let progress = await CourseProgress.findOne({
      user: req.user._id,
      course: req.params.id,
    });
    
    // If progress doesn't exist, create it
    if (!progress) {
      const lessonsProgress = course.lessons.map(lesson => ({
        lessonNumber: lesson.lessonNumber,
        attempts: [],
        averageAccuracy: 0,
        isCompleted: false,
      }));
      
      progress = await CourseProgress.create({
        user: req.user._id,
        course: req.params.id,
        lessonsProgress,
      });
    }
    
    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Record an attempt for a lesson
// @route   POST /api/courses/:courseId/lessons/:lessonNumber/attempt
// @access  Private
export const recordAttempt = async (req, res, next) => {
  try {
    const { courseId, lessonNumber } = req.params;
    const { accuracy } = req.body;
    
    if (accuracy === undefined || accuracy < 0 || accuracy > 100) {
      return res.status(400).json({
        success: false,
        error: 'Valid accuracy (0-100) is required',
      });
    }
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
      });
    }
    
    const lesson = course.lessons.find(l => l.lessonNumber === parseInt(lessonNumber));
    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Lesson not found',
      });
    }
    
    let progress = await CourseProgress.findOne({
      user: req.user._id,
      course: courseId,
    });
    
    // Create progress if it doesn't exist
    if (!progress) {
      const lessonsProgress = course.lessons.map(l => ({
        lessonNumber: l.lessonNumber,
        attempts: [],
        averageAccuracy: 0,
        isCompleted: false,
      }));
      
      progress = new CourseProgress({
        user: req.user._id,
        course: courseId,
        lessonsProgress,
      });
    }
    
    // Find or create lesson progress
    let lessonProgress = progress.lessonsProgress.find(
      lp => lp.lessonNumber === parseInt(lessonNumber)
    );
    
    if (!lessonProgress) {
      lessonProgress = {
        lessonNumber: parseInt(lessonNumber),
        attempts: [],
        averageAccuracy: 0,
        isCompleted: false,
      };
      progress.lessonsProgress.push(lessonProgress);
    }
    
    // Add the attempt
    const attemptNumber = lessonProgress.attempts.length + 1;
    lessonProgress.attempts.push({
      attemptNumber,
      accuracy,
    });
    
    // Calculate average accuracy
    const totalAccuracy = lessonProgress.attempts.reduce(
      (sum, attempt) => sum + attempt.accuracy,
      0
    );
    lessonProgress.averageAccuracy = Math.round(
      totalAccuracy / lessonProgress.attempts.length
    );
    
    // Check if lesson is completed (3 attempts and average >= minAccuracy)
    if (
      lessonProgress.attempts.length >= 3 &&
      lessonProgress.averageAccuracy >= lesson.minAccuracy
    ) {
      lessonProgress.isCompleted = true;
      if (!lessonProgress.completedAt) {
        lessonProgress.completedAt = new Date();
      }
    }
    
    await progress.save();
    
    res.status(200).json({
      success: true,
      data: progress,
      lessonProgress: lessonProgress,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset lesson progress
// @route   DELETE /api/courses/:courseId/lessons/:lessonNumber/reset
// @access  Private
export const resetLesson = async (req, res, next) => {
  try {
    const { courseId, lessonNumber } = req.params;
    
    const progress = await CourseProgress.findOne({
      user: req.user._id,
      course: courseId,
    });
    
    if (!progress) {
      return res.status(404).json({
        success: false,
        error: 'Progress not found',
      });
    }
    
    const lessonProgress = progress.lessonsProgress.find(
      lp => lp.lessonNumber === parseInt(lessonNumber)
    );
    
    if (lessonProgress) {
      lessonProgress.attempts = [];
      lessonProgress.averageAccuracy = 0;
      lessonProgress.isCompleted = false;
      lessonProgress.completedAt = undefined;
      
      await progress.save();
    }
    
    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Initialize default courses (for setup)
// @route   POST /api/courses/initialize
// @access  Public (should be protected in production)
export const initializeCourses = async (req, res, next) => {
  try {
    // Check if courses already exist
    const existingCourses = await Course.countDocuments();
    if (existingCourses > 0) {
      return res.status(400).json({
        success: false,
        error: 'Courses already initialized',
      });
    }
    
    const defaultCourses = [
      {
        phoneme1: 'V',
        phoneme2: 'B',
        title: 'Phoneme V and B',
        description: 'Learn to differentiate and pronounce V and B sounds',
        totalLessons: 4,
        lessons: [
          {
            lessonNumber: 1,
            title: 'Introduction to V and B',
            description: 'Basic pronunciation of V and B',
            word: 'bat',
            pronunciation: '/bæt/',
            minAccuracy: 50,
          },
          {
            lessonNumber: 2,
            title: 'V Sound Practice',
            description: 'Practice V sound',
            word: 'van',
            pronunciation: '/væn/',
            minAccuracy: 50,
          },
          {
            lessonNumber: 3,
            title: 'B Sound Practice',
            description: 'Practice B sound',
            word: 'ball',
            pronunciation: '/bɔːl/',
            minAccuracy: 50,
          },
          {
            lessonNumber: 4,
            title: 'Advanced Practice',
            description: 'Advanced V and B differentiation',
            word: 'vote',
            pronunciation: '/voʊt/',
            minAccuracy: 50,
          },
        ],
      },
      {
        phoneme1: 'P',
        phoneme2: 'F',
        title: 'Phoneme P and F',
        description: 'Learn to differentiate and pronounce P and F sounds',
        totalLessons: 4,
        lessons: [
          {
            lessonNumber: 1,
            title: 'Introduction to P and F',
            description: 'Basic pronunciation of P and F',
            word: 'pen',
            pronunciation: '/pen/',
            minAccuracy: 50,
          },
          {
            lessonNumber: 2,
            title: 'F Sound Practice',
            description: 'Practice F sound',
            word: 'fun',
            pronunciation: '/fʌn/',
            minAccuracy: 50,
          },
          {
            lessonNumber: 3,
            title: 'P Sound Practice',
            description: 'Practice P sound',
            word: 'pot',
            pronunciation: '/pɒt/',
            minAccuracy: 50,
          },
          {
            lessonNumber: 4,
            title: 'Advanced Practice',
            description: 'Advanced P and F differentiation',
            word: 'phone',
            pronunciation: '/foʊn/',
            minAccuracy: 50,
          },
        ],
      },
      {
        phoneme1: 'T',
        phoneme2: 'D',
        title: 'Phoneme T and D',
        description: 'Learn to differentiate and pronounce T and D sounds',
        totalLessons: 4,
        lessons: [
          {
            lessonNumber: 1,
            title: 'Introduction to T and D',
            description: 'Basic pronunciation of T and D',
            word: 'top',
            pronunciation: '/tɒp/',
            minAccuracy: 50,
          },
          {
            lessonNumber: 2,
            title: 'D Sound Practice',
            description: 'Practice D sound',
            word: 'dog',
            pronunciation: '/dɒɡ/',
            minAccuracy: 50,
          },
          {
            lessonNumber: 3,
            title: 'T Sound Practice',
            description: 'Practice T sound',
            word: 'tea',
            pronunciation: '/tiː/',
            minAccuracy: 50,
          },
          {
            lessonNumber: 4,
            title: 'Advanced Practice',
            description: 'Advanced T and D differentiation',
            word: 'done',
            pronunciation: '/dʌn/',
            minAccuracy: 50,
          },
        ],
      },
      {
        phoneme1: 'S',
        phoneme2: 'Sh',
        title: 'Phoneme S and Sh',
        description: 'Learn to differentiate and pronounce S and Sh sounds',
        totalLessons: 4,
        lessons: [
          {
            lessonNumber: 1,
            title: 'Introduction to S and Sh',
            description: 'Basic pronunciation of S and Sh',
            word: 'sun',
            pronunciation: '/sʌn/',
            minAccuracy: 50,
          },
          {
            lessonNumber: 2,
            title: 'Sh Sound Practice',
            description: 'Practice Sh sound',
            word: 'ship',
            pronunciation: '/ʃɪp/',
            minAccuracy: 50,
          },
          {
            lessonNumber: 3,
            title: 'S Sound Practice',
            description: 'Practice S sound',
            word: 'see',
            pronunciation: '/siː/',
            minAccuracy: 50,
          },
          {
            lessonNumber: 4,
            title: 'Advanced Practice',
            description: 'Advanced S and Sh differentiation',
            word: 'shoe',
            pronunciation: '/ʃuː/',
            minAccuracy: 50,
          },
        ],
      },
      {
        phoneme1: 'F',
        phoneme2: 'Th',
        title: 'Phoneme F and Th',
        description: 'Learn to differentiate and pronounce F and Th sounds',
        totalLessons: 4,
        lessons: [
          {
            lessonNumber: 1,
            title: 'Introduction to F and Th',
            description: 'Basic pronunciation of F and Th',
            word: 'fan',
            pronunciation: '/fæn/',
            minAccuracy: 50,
          },
          {
            lessonNumber: 2,
            title: 'Th Sound Practice',
            description: 'Practice Th sound',
            word: 'think',
            pronunciation: '/θɪŋk/',
            minAccuracy: 50,
          },
          {
            lessonNumber: 3,
            title: 'F Sound Practice',
            description: 'Practice F sound',
            word: 'fish',
            pronunciation: '/fɪʃ/',
            minAccuracy: 50,
          },
          {
            lessonNumber: 4,
            title: 'Advanced Practice',
            description: 'Advanced F and Th differentiation',
            word: 'thank',
            pronunciation: '/θæŋk/',
            minAccuracy: 50,
          },
        ],
      },
      {
        phoneme1: 'L',
        phoneme2: 'R',
        title: 'Phoneme L and R',
        description: 'Learn to differentiate and pronounce L and R sounds',
        totalLessons: 4,
        lessons: [
          {
            lessonNumber: 1,
            title: 'Introduction to L and R',
            description: 'Basic pronunciation of L and R',
            word: 'light',
            pronunciation: '/laɪt/',
            minAccuracy: 50,
          },
          {
            lessonNumber: 2,
            title: 'R Sound Practice',
            description: 'Practice R sound',
            word: 'run',
            pronunciation: '/rʌn/',
            minAccuracy: 50,
          },
          {
            lessonNumber: 3,
            title: 'L Sound Practice',
            description: 'Practice L sound',
            word: 'love',
            pronunciation: '/lʌv/',
            minAccuracy: 50,
          },
          {
            lessonNumber: 4,
            title: 'Advanced Practice',
            description: 'Advanced L and R differentiation',
            word: 'right',
            pronunciation: '/raɪt/',
            minAccuracy: 50,
          },
        ],
      },
    ];
    
    const courses = await Course.insertMany(defaultCourses);
    
    res.status(201).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};
