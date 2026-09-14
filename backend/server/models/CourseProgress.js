import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema({
  attemptNumber: {
    type: Number,
    required: true,
  },
  accuracy: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  recordedAt: {
    type: Date,
    default: Date.now,
  },
});

const lessonProgressSchema = new mongoose.Schema({
  lessonNumber: {
    type: Number,
    required: true,
  },
  attempts: [attemptSchema],
  averageAccuracy: {
    type: Number,
    default: 0,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
});

const courseProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  lessonsProgress: [lessonProgressSchema],
  totalLessonsCompleted: {
    type: Number,
    default: 0,
  },
  overallProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started',
  },
  startedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create unique index to ensure one progress record per user per course
courseProgressSchema.index({ user: 1, course: 1 }, { unique: true });

courseProgressSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  this.lastAccessedAt = Date.now();
  
  // Calculate total lessons completed
  this.totalLessonsCompleted = this.lessonsProgress.filter(lp => lp.isCompleted).length;
  
  // Calculate overall progress percentage
  if (this.lessonsProgress.length > 0) {
    this.overallProgress = Math.round((this.totalLessonsCompleted / this.lessonsProgress.length) * 100);
  }
  
  // Update status based on progress
  if (this.totalLessonsCompleted === 0) {
    this.status = 'not-started';
  } else if (this.totalLessonsCompleted === this.lessonsProgress.length) {
    this.status = 'completed';
    if (!this.completedAt) {
      this.completedAt = Date.now();
    }
  } else {
    this.status = 'in-progress';
    if (!this.startedAt) {
      this.startedAt = Date.now();
    }
  }
  
  next();
});

export default mongoose.model('CourseProgress', courseProgressSchema);
