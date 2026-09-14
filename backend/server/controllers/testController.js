import axios from "axios";
import FormData from "form-data";
import TestResult from "../models/TestResult.js";
import Course from "../models/Course.js";
import { generateLearningPath } from "../services/learningPathService.js";

const PHONEME_API_URL = process.env.PHONEME_API_URL || "http://127.0.0.1:5002";

// @desc    Get word for a specific letter (from phoneme backend)
// @route   GET /api/test/word/:letter
// @access  Public
export const getWordForLetter = async (req, res) => {
    try {
        const { letter } = req.params;

        // Call phoneme backend /test/:letter endpoint
        const response = await axios.get(`${PHONEME_API_URL}/test/${letter}`);

        res.status(200).json({
            success: true,
            data: response.data,
        });
    } catch (error) {
        console.error("Error fetching word:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch word for letter",
            error: error.message,
        });
    }
};

// @desc    Get user's test progress for a letter
// @route   GET /api/test/progress/:letter
// @access  Private
export const getUserTestProgress = async (req, res) => {
    try {
        const { letter } = req.params;
        const userId = req.user.id;

        let testResult = await TestResult.findOne({
            user: userId,
            letter: letter.toUpperCase(),
        });

        if (!testResult) {
            return res.status(200).json({
                success: true,
                data: {
                    letter: letter.toUpperCase(),
                    attempts: [],
                    averageAccuracy: 0,
                    completed: false,
                },
            });
        }

        res.status(200).json({
            success: true,
            data: testResult,
        });
    } catch (error) {
        console.error("Error fetching test progress:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch test progress",
            error: error.message,
        });
    }
};

// @desc    Save test attempt
// @route   POST /api/test/attempt
// @access  Private
export const saveTestAttempt = async (req, res) => {
    try {
        const { letter, word, pronunciation, accuracy } = req.body;
        const userId = req.user.id;

        if (!letter || !word || !pronunciation || accuracy === undefined) {
            return res.status(400).json({
                success: false,
                message:
                    "Please provide letter, word, pronunciation, and accuracy",
            });
        }

        // Find or create test result
        let testResult = await TestResult.findOne({
            user: userId,
            letter: letter.toUpperCase(),
        });

        if (!testResult) {
            testResult = new TestResult({
                user: userId,
                letter: letter.toUpperCase(),
                word,
                pronunciation,
                attempts: [],
            });
        }

        // Add new attempt
        const attemptNumber = testResult.attempts.length + 1;
        testResult.attempts.push({
            attemptNumber,
            accuracy: parseFloat(accuracy),
        });

        await testResult.save();

        res.status(201).json({
            success: true,
            message: "Attempt saved successfully",
            data: testResult,
        });
    } catch (error) {
        console.error("Error saving attempt:", error);
        res.status(500).json({
            success: false,
            message: "Failed to save attempt",
            error: error.message,
        });
    }
};

// @desc    Reset test for a letter
// @route   DELETE /api/test/reset/:letter
// @access  Private
export const resetTest = async (req, res) => {
    try {
        const { letter } = req.params;
        const userId = req.user.id;

        const testResult = await TestResult.findOne({
            user: userId,
            letter: letter.toUpperCase(),
        });

        if (!testResult) {
            return res.status(404).json({
                success: false,
                message: "No test found for this letter",
            });
        }

        testResult.attempts = [];
        testResult.averageAccuracy = 0;
        testResult.completed = false;
        testResult.completedAt = null;

        await testResult.save();

        res.status(200).json({
            success: true,
            message: "Test reset successfully",
            data: testResult,
        });
    } catch (error) {
        console.error("Error resetting test:", error);
        res.status(500).json({
            success: false,
            message: "Failed to reset test",
            error: error.message,
        });
    }
};

// @desc    Get all user's test results
// @route   GET /api/test/all
// @access  Private
export const getAllUserTests = async (req, res) => {
    try {
        const userId = req.user.id;

        const tests = await TestResult.find({ user: userId }).sort({
            letter: 1,
        });

        res.status(200).json({
            success: true,
            count: tests.length,
            data: tests,
        });
    } catch (error) {
        console.error("Error fetching all tests:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch tests",
            error: error.message,
        });
    }
};

// @desc    Get user's overall statistics
// @route   GET /api/test/statistics
// @access  Private
export const getUserStatistics = async (req, res) => {
    try {
        const userId = req.user.id;

        const tests = await TestResult.find({ user: userId });

        const statistics = {
            totalTests: tests.length,
            completedTests: tests.filter((t) => t.completed).length,
            inProgressTests: tests.filter(
                (t) => !t.completed && t.attempts.length > 0,
            ).length,
            totalAttempts: tests.reduce((sum, t) => sum + t.attempts.length, 0),
            averageOverallAccuracy: 0,
            bestLetter: null,
            worstLetter: null,
            letterProgress: {},
        };

        if (tests.length > 0) {
            const totalAccuracy = tests.reduce(
                (sum, t) => sum + t.averageAccuracy,
                0,
            );
            statistics.averageOverallAccuracy =
                Math.round((totalAccuracy / tests.length) * 100) / 100;

            const sortedByAccuracy = [...tests].sort(
                (a, b) => b.averageAccuracy - a.averageAccuracy,
            );
            if (
                sortedByAccuracy[0] &&
                sortedByAccuracy[0].attempts.length > 0
            ) {
                statistics.bestLetter = {
                    letter: sortedByAccuracy[0].letter,
                    accuracy: sortedByAccuracy[0].averageAccuracy,
                };
            }

            const withAttempts = sortedByAccuracy.filter(
                (t) => t.attempts.length > 0,
            );
            if (withAttempts.length > 0) {
                const worst = withAttempts[withAttempts.length - 1];
                statistics.worstLetter = {
                    letter: worst.letter,
                    accuracy: worst.averageAccuracy,
                };
            }

            tests.forEach((test) => {
                statistics.letterProgress[test.letter] = {
                    attempts: test.attempts.length,
                    averageAccuracy: test.averageAccuracy,
                    completed: test.completed,
                };
            });
        }

        res.status(200).json({
            success: true,
            data: statistics,
        });
    } catch (error) {
        console.error("Error fetching statistics:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch statistics",
            error: error.message,
        });
    }
};

// @desc    Record audio and get analysis (proxy to phoneme backend)
// @route   POST /api/test/record
// @access  Public
export const recordAndAnalyze = async (req, res) => {
    try {
        console.log("[RECORD] Request received at /api/test/record");
        if (!req.files || !req.files.audio) {
            console.error("[RECORD] No audio file uploaded");
            return res.status(400).json({ success: false, message: "No audio file uploaded" });
        }

        console.log("[RECORD] targetWord:", req.body.targetWord);
        console.log("[RECORD] file exists: true");
        console.log("[RECORD] filename:", req.files.audio.name);
        console.log("[RECORD] content type:", req.files.audio.mimetype);
        console.log("[RECORD] file size:", req.files.audio.size);

        const formData = new FormData();
        formData.append('audio', req.files.audio.data, {
            filename: req.files.audio.name,
            contentType: req.files.audio.mimetype
        });
        formData.append('targetWord', req.body.targetWord);

        console.log("[FORWARD] Node -> Flask request started to:", `${PHONEME_API_URL}/record`);
        const response = await axios.post(`${PHONEME_API_URL}/record`, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        console.log("[RESPONSE] Flask responded with status:", response.status);
        res.status(200).json({
            success: true,
            data: response.data,
        });
    } catch (error) {
        console.error("[RESPONSE] Error recording (proxy):", error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: "Failed to record and analyze",
            error: error.message,
            stage: "node-proxy",
            details: error.response?.data
        });
    }
};

// @desc    Get personalized course recommendations based on test results
// @route   GET /api/test/recommendations
// @access  Private
export const getCourseRecommendations = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch all user test results
        const tests = await TestResult.find({ user: userId });

        if (tests.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No test data available yet. Complete some tests to get personalized recommendations.",
                data: {
                    recommendations: [],
                    keyAreasForImprovement: [],
                    overallProgress: 0
                }
            });
        }

        // Calculate overall metrics
        const totalAccuracy = tests.reduce((sum, t) => sum + t.averageAccuracy, 0);
        const overallAccuracy = totalAccuracy / tests.length;

        // Identify weak areas (below 70% accuracy)
        const weakLetters = tests
            .filter(t => t.attempts.length > 0 && t.averageAccuracy < 70)
            .sort((a, b) => a.averageAccuracy - b.averageAccuracy)
            .slice(0, 5);

        // Identify improving areas (progression in attempts)
        const improvingLetters = tests.filter(t => {
            if (t.attempts.length < 2) return false;
            const recent = t.attempts.slice(-2);
            return recent[1].accuracy > recent[0].accuracy;
        });

        // Fetch all courses
        const allCourses = await Course.find({ isActive: true });

        // Match weak letters to relevant courses
        const recommendedCourses = [];
        const keyAreasForImprovement = [];

        for (const weakTest of weakLetters) {
            // Find courses that contain this letter's phoneme
            const relevantCourses = allCourses.filter(course => {
                const letter = weakTest.letter.toLowerCase();
                return (
                    (course.phoneme1 && course.phoneme1.includes(letter)) ||
                    (course.phoneme2 && course.phoneme2.includes(letter)) ||
                    (course.title && course.title.toLowerCase().includes(letter))
                );
            });

            keyAreasForImprovement.push({
                letter: weakTest.letter,
                word: weakTest.word,
                currentAccuracy: weakTest.averageAccuracy,
                attempts: weakTest.attempts.length,
                trend: getTrend(weakTest.attempts),
                priority: getPriority(weakTest.averageAccuracy, weakTest.attempts.length),
                recommendation: getRecommendation(weakTest.averageAccuracy)
            });

            relevantCourses.forEach(course => {
                if (!recommendedCourses.find(rc => rc.courseId.toString() === course._id.toString())) {
                    recommendedCourses.push({
                        courseId: course._id,
                        title: course.title,
                        description: course.description,
                        phoneme1: course.phoneme1,
                        phoneme2: course.phoneme2,
                        difficulty: course.difficulty,
                        totalLessons: course.totalLessons,
                        relevantLetters: [weakTest.letter],
                        matchScore: calculateMatchScore(course, weakTest)
                    });
                } else {
                    const existing = recommendedCourses.find(rc => rc.courseId.toString() === course._id.toString());
                    if (existing && !existing.relevantLetters.includes(weakTest.letter)) {
                        existing.relevantLetters.push(weakTest.letter);
                        existing.matchScore += 10;
                    }
                }
            });
        }

        // Sort recommendations by match score
        recommendedCourses.sort((a, b) => b.matchScore - a.matchScore);

        // Prepare response
        const response = {
            overallProgress: Math.round(overallAccuracy),
            totalTestsTaken: tests.length,
            completedTests: tests.filter(t => t.completed).length,
            keyAreasForImprovement: keyAreasForImprovement.slice(0, 5),
            recommendedCourses: recommendedCourses.slice(0, 6),
            strengthAreas: tests
                .filter(t => t.attempts.length > 0 && t.averageAccuracy >= 80)
                .sort((a, b) => b.averageAccuracy - a.averageAccuracy)
                .slice(0, 3)
                .map(t => ({
                    letter: t.letter,
                    word: t.word,
                    accuracy: t.averageAccuracy
                })),
            improvingAreas: improvingLetters.map(t => ({
                letter: t.letter,
                word: t.word,
                improvement: calculateImprovement(t.attempts)
            })).slice(0, 3)
        };

        res.status(200).json({
            success: true,
            data: response
        });
    } catch (error) {
        console.error("Error generating recommendations:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate recommendations",
            error: error.message
        });
    }
};

// @desc    Submit all tests and generate adaptive learning path
// @route   POST /api/test/submit-all
// @access  Private
export const submitAllTests = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Mark all relevant tests as completed
        await TestResult.updateMany(
            { user: userId },
            { $set: { completed: true, completedAt: new Date() } }
        );

        // 2. Trigger adaptive learning path generation
        const learningPath = await generateLearningPath(userId);

        res.status(200).json({
            success: true,
            message: "Tests submitted and adaptive learning path generated",
            data: learningPath,
        });
    } catch (error) {
        console.error("Error submitting all tests:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to submit tests and generate path",
            error: error.message,
        });
    }
};

// Helper functions
function getTrend(attempts) {
    if (attempts.length < 2) return 'insufficient_data';
    const recent = attempts.slice(-3);
    if (recent.length < 2) return 'stable';
    
    const first = recent[0].accuracy;
    const last = recent[recent.length - 1].accuracy;
    const diff = last - first;
    
    if (diff > 10) return 'improving';
    if (diff < -10) return 'declining';
    return 'stable';
}

function getPriority(accuracy, attemptCount) {
    if (accuracy < 50) return 'high';
    if (accuracy < 70 && attemptCount >= 3) return 'high';
    if (accuracy < 70) return 'medium';
    return 'low';
}

function getRecommendation(accuracy) {
    if (accuracy < 40) {
        return "Focus on this sound immediately. Practice daily with guided exercises.";
    } else if (accuracy < 60) {
        return "Needs significant improvement. Regular practice recommended.";
    } else if (accuracy < 75) {
        return "Good progress! Continue practicing to strengthen this skill.";
    } else {
        return "Minor improvements needed. Review occasionally to maintain proficiency.";
    }
}

function calculateMatchScore(course, weakTest) {
    let score = 50; // Base score

    // Higher score for exact phoneme match
    const letter = weakTest.letter.toLowerCase();
    if (course.phoneme1 && course.phoneme1.includes(letter)) score += 30;
    if (course.phoneme2 && course.phoneme2.includes(letter)) score += 30;

    // Adjust for difficulty vs accuracy
    if (weakTest.averageAccuracy < 50 && course.difficulty === 'beginner') score += 20;
    if (weakTest.averageAccuracy >= 50 && weakTest.averageAccuracy < 70 && course.difficulty === 'intermediate') score += 15;

    return score;
}

function calculateImprovement(attempts) {
    if (attempts.length < 2) return 0;
    const first = attempts[0].accuracy;
    const last = attempts[attempts.length - 1].accuracy;
    return Math.round((last - first) * 10) / 10;
}
