import mongoose from 'mongoose';

const dayTaskSchema = new mongoose.Schema({
  dayNumber: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  activityType: {
    type: String,
    enum: ['drill', 'story', 'reading', 'phonics'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  targetPhoneme: {
    type: String,
    uppercase: true,
  },
  targetUrl: {
    type: String,
    required: true,
  },
  actionLabel: {
    type: String,
    required: true,
  },
  estimatedMinutes: {
    type: Number,
    default: 10,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
});

const learningPathWeekSchema = new mongoose.Schema({
  path: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LearningPath',
    required: true,
  },
  weekNumber: {
    type: Number,
    required: true,
  },
  focusArea: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  days: [dayTaskSchema],
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
});

const learningPathSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  planSummary: {
    type: String,
  },
  currentWeek: {
    type: Number,
    default: 1,
  },
  totalWeeks: {
    type: Number,
    default: 4,
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active',
  },
  trackMode: {
    type: String,
    default: 'Steady Mastery Track',
  },
  stageNumber: {
    type: Number,
    default: 1,
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

learningPathSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for fast lookup of active path
learningPathSchema.index({ user: 1, status: 1 });

export const LearningPath = mongoose.model('LearningPath', learningPathSchema);
export const LearningPathWeek = mongoose.model('LearningPathWeek', learningPathWeekSchema);
