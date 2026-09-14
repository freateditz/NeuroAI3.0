
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import TestResult from './models/TestResult.js';
import { LearningPath, LearningPathWeek } from './models/LearningPath.js';
import ParentStudentLink from './models/ParentStudentLink.js';
import { generateLearningPath } from './services/learningPathService.js';
import dotenv from 'dotenv';

dotenv.config();

async function runProof() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // 1. Setup Student User
    let student = await User.findOne({ email: 'test_student@neuroai.com' });
    if (!student) {
      student = await User.create({
        name: 'Test Student',
        email: 'test_student@neuroai.com',
        password: 'password123',
        role: 'student',
        grade_level: '2',
        inviteCode: 'STUDENT123'
      });
      console.log('Created test student');
    }

    // 2. Simulate Phoneme Assessment (A-Z)
    console.log('Simulating phoneme assessment...');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    for (const letter of alphabet) {
      let accuracy = 85; // Default strong
      if (letter === 'H') accuracy = 30; // Primary weakness
      if (letter === 'S') accuracy = 45; // Secondary weakness

      await TestResult.findOneAndUpdate(
        { user: student._id, letter },
        {
          letter,
          averageAccuracy: accuracy,
          attempts: [{ attemptNumber: 1, accuracy }],
          completed: true,
          completedAt: new Date(),
          word: 'SampleWord'
        },
        { upsert: true, new: true }
      );
    }
    console.log('Assessment results saved to DB');

    // 3. Verify Adaptive Analysis & Module Generation
    console.log('Generating adaptive learning path...');
    const path = await generateLearningPath(student._id);
    console.log('Generated Path:', path.title);
    console.log('Track Mode:', path.trackMode);
    console.log('Plan Summary:', path.planSummary);

    const weeks = await LearningPathWeek.find({ path: path._id }).sort({ weekNumber: 1 });
    console.log(`Generated ${weeks.length} weeks.`);

    // Verify content of Week 1
    const week1 = weeks[0];
    console.log('Week 1 Focus:', week1.focusArea);
    console.log('Week 1 Tasks:', week1.days.map(d => ({ title: d.title, type: d.activityType })));

    if (week1.focusArea !== 'H') {
      throw new Error(`Expected focus H, but got ${week1.focusArea}`);
    }

    // 4. Verify Module Interaction & Completion
    console.log('Simulating module completion...');
    const firstTask = week1.days[0];

    await LearningPathWeek.updateOne(
      { path: path._id, weekNumber: week1.weekNumber, 'days.dayNumber': firstTask.dayNumber },
      {
        $set: { 'days.$.completed': true, 'days.$.completedAt': new Date() }
      }
    );
    console.log('Task marked as completed in DB');

    // 5. Verify Adaptation
    console.log('Simulating improvement in H and new weakness in R...');
    await TestResult.findOneAndUpdate(
      { user: student._id, letter: 'H' },
      { averageAccuracy: 80, attempts: [{ attemptNumber: 1, accuracy: 30 }, { attemptNumber: 2, accuracy: 80 }] },
      { new: true }
    );
    await TestResult.findOneAndUpdate(
      { user: student._id, letter: 'R' },
      { averageAccuracy: 20, attempts: [{ attemptNumber: 1, accuracy: 20 }] },
      { new: true }
    );

    const adaptedPath = await generateLearningPath(student._id);
    console.log('Adapted Path Focus:', adaptedPath.title);

    const adaptedWeeks = await LearningPathWeek.find({ path: adaptedPath._id }).sort({ weekNumber: 1 });
    console.log('New Week 1 Focus:', adaptedWeeks[0].focusArea);

    if (adaptedWeeks[0].focusArea === 'H') {
      throw new Error('Path did not adapt! Still focusing on H despite improvement.');
    }

    // 6. Verify Parent View (Data)
    let parent = await User.findOne({ role: 'parent' });
    if (!parent) {
      parent = await User.create({
        name: 'Test Parent',
        email: 'parent@neuroai.com',
        password: 'password123',
        role: 'parent'
      });
    }

    await ParentStudentLink.findOneAndUpdate(
      { parent: parent._id, student: student._id },
      { consentGranted: true, consentDate: new Date() },
      { upsert: true }
    );

    console.log('Parent link established');

    process.exit(0);
  } catch (error) {
    console.error('RUNTIME PROOF FAILED:', error);
    process.exit(1);
  }
}

runProof();
