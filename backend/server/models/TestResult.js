import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema({
  attemptNumber: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const testResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  letter: {
    type: String,
    required: true,
    uppercase: true,
    match: /^[A-Z]$/
  },
  word: {
    type: String,
    required: true
  },
  pronunciation: {
    type: String,
    required: true
  },
  attempts: [attemptSchema],
  averageAccuracy: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update averageAccuracy before saving
testResultSchema.pre('save', function(next) {
  if (this.attempts && this.attempts.length > 0) {
    const total = this.attempts.reduce((sum, attempt) => sum + attempt.accuracy, 0);
    this.averageAccuracy = Math.round((total / this.attempts.length) * 100) / 100;
  }
  
  if (this.attempts && this.attempts.length >= 3) {
    this.completed = true;
    if (!this.completedAt) {
      this.completedAt = new Date();
    }
  }
  
  this.updatedAt = new Date();
  next();
});

// Index for faster queries
testResultSchema.index({ user: 1, letter: 1 });
testResultSchema.index({ user: 1, completed: 1 });

export default mongoose.model('TestResult', testResultSchema);
