import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['student', 'parent', 'admin'],
    default: 'student',
    required: true,
  },
  inviteCode: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple nulls for non-students
  },
  picture: {
    type: String,
    default: function() {
      return `https://ui-avatars.com/api/?name=${this.name}&background=2D8CFF&color=fff`;
    },
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  childAge: {
    type: Number,
    min: 1,
    max: 18,
  },
  region: {
    type: String,
    trim: true,
  },
  problemDescription: {
    type: String,
    enum: ['stuttering', 'stammering', 'lisp', 'articulation', 'phonological_disorder', 'apraxia', 'dysarthria', 'voice_disorder', 'other'],
  },
  additionalNotes: {
    type: String,
    maxlength: 500,
  },
  profileCompleted: {
    type: Boolean,
    default: false,
  },
  coursesEnrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next ? next() : undefined;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  if (!enteredPassword || !this.password) {
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
