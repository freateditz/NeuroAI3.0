import mongoose from 'mongoose';

const parentStudentLinkSchema = new mongoose.Schema({
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  consentGranted: {
    type: Boolean,
    default: false,
  },
  consentDate: {
    type: Date,
  },
  withdrawnAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure a parent can be linked to a student only once
parentStudentLinkSchema.index({ parent: 1, student: 1 }, { unique: true });

export default mongoose.model('ParentStudentLink', parentStudentLinkSchema);
