import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  lessonNumber: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  word: {
    type: String,
    required: true,
  },
  pronunciation: {
    type: String,
    required: true,
  },
  imageLink: {
    type: String,
  },
  minAccuracy: {
    type: Number,
    default: 50,
  },
});

const courseSchema = new mongoose.Schema({
  phoneme1: {
    type: String,
    required: [true, 'Please add phoneme1'],
    trim: true,
  },
  phoneme2: {
    type: String,
    required: [true, 'Please add phoneme2'],
    trim: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  totalLessons: {
    type: Number,
    default: 4,
  },
  lessons: [lessonSchema],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  isActive: {
    type: Boolean,
    default: true,
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

courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Course', courseSchema);
