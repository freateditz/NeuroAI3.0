import phonemeAnalyzer from "../ai/phonemeAnalyzer";
import speechRecognition from "../ai/speechRecognition";

const API_BASE_URL = "https://dbw45q7c-8000.inc1.devtunnels.ms/api";

// Hardcoded words for each letter with phonetics
const LETTER_WORDS = {
    A: { word: "Apple", pronunciation: "/ˈæp.əl/", emoji: "🍎" },
    B: { word: "Ball", pronunciation: "/bɔːl/", emoji: "⚽" },
    C: { word: "Cat", pronunciation: "/kæt/", emoji: "🐱" },
    D: { word: "Dog", pronunciation: "/dɔːɡ/", emoji: "🐕" },
    E: { word: "Elephant", pronunciation: "/ˈel.ɪ.fənt/", emoji: "🐘" },
    F: { word: "Fish", pronunciation: "/fɪʃ/", emoji: "🐠" },
    G: { word: "Goat", pronunciation: "/ɡoʊt/", emoji: "🐐" },
    H: { word: "Hat", pronunciation: "/hæt/", emoji: "🎩" },
    I: { word: "Ice", pronunciation: "/aɪs/", emoji: "🧊" },
    J: { word: "Juice", pronunciation: "/dʒuːs/", emoji: "🧃" },
    K: { word: "Kite", pronunciation: "/kaɪt/", emoji: "🪁" },
    L: { word: "Lion", pronunciation: "/ˈlaɪ.ən/", emoji: "🦁" },
    M: { word: "Moon", pronunciation: "/muːn/", emoji: "🌙" },
    N: { word: "Nose", pronunciation: "/noʊz/", emoji: "👃" },
    O: { word: "Orange", pronunciation: "/ˈɔː.rɪndʒ/", emoji: "🍊" },
    P: { word: "Pen", pronunciation: "/pen/", emoji: "🖊️" },
    Q: { word: "Queen", pronunciation: "/kwiːn/", emoji: "👑" },
    R: { word: "Rabbit", pronunciation: "/ˈræb.ɪt/", emoji: "🐰" },
    S: { word: "Sun", pronunciation: "/sʌn/", emoji: "☀️" },
    T: { word: "Tree", pronunciation: "/triː/", emoji: "🌳" },
    U: { word: "Umbrella", pronunciation: "/ʌmˈbrel.ə/", emoji: "☂️" },
    V: { word: "Van", pronunciation: "/væn/", emoji: "🚐" },
    W: { word: "Water", pronunciation: "/ˈwɔː.tər/", emoji: "💧" },
    X: { word: "Xylophone", pronunciation: "/ˈzaɪ.lə.foʊn/", emoji: "🎹" },
    Y: { word: "Yellow", pronunciation: "/ˈjel.oʊ/", emoji: "💛" },
    Z: { word: "Zebra", pronunciation: "/ˈziː.brə/", emoji: "🦓" },
};

// Generate word - now uses hardcoded data
export const generateWord = async (letter) => {
    console.log(`Getting hardcoded word for letter: ${letter}`);

    const letterData = LETTER_WORDS[letter.toUpperCase()];

    if (!letterData) {
        console.warn(`No word found for letter ${letter}, using Apple`);
        return {
            word1: "Apple",
            pronunciation: "/ˈæp.əl/",
            image_link: "🍎",
        };
    }

    return {
        word1: letterData.word,
        pronunciation: letterData.pronunciation,
        image_link: letterData.emoji,
    };
};

// Test word - same as generateWord
export const testWord = async (letter) => {
    return generateWord(letter);
};

// Record audio and analyze with AI
export const recordAudio = async (expectedWord, targetPhonemes = []) => {
    try {
        console.log("=== RECORDING FOR:", expectedWord, "===");

        if (!expectedWord) {
            throw new Error("Expected word is required");
        }

        // Verify Whisper model is loaded
        console.log("Checking Whisper model...");
        const { RunAnywhere } = await import("@runanywhere/core");
        const modelInfo = await RunAnywhere.getModelInfo("whisper-tiny-en");

        if (!modelInfo || !modelInfo.localPath) {
            throw new Error(
                "Whisper model not loaded. Please restart the app.",
            );
        }

        console.log("Whisper model ready at:", modelInfo.localPath);

        // Start recording
        await speechRecognition.startRecording();
        console.log("Recording... (3 seconds)");

        // Wait 3 seconds for recording
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Stop and transcribe
        console.log("Stopping and transcribing...");
        const transcription =
            await speechRecognition.stopRecordingAndTranscribe();
        console.log("✅ Transcription:", transcription);

        // Analyze with AI
        console.log("Analyzing with AI...");
        const analysisResult = await phonemeAnalyzer.analyzePhonemes(
            transcription,
            expectedWord,
            targetPhonemes,
        );

        console.log("✅ Analysis complete");

        return {
            transcription: analysisResult.transcription,
            percentage: analysisResult.accuracy,
            feedback: analysisResult.feedback,
            timestamp: analysisResult.timestamp,
        };
    } catch (error) {
        console.error("❌ Recording error:", error);
        throw error;
    }
};

// Get AI remedy
export const getRemedy = async (
    percentage,
    phoneme1,
    phoneme2,
    attempts = [],
) => {
    try {
        console.log("Getting AI remedy for:", {
            percentage,
            phoneme1,
            phoneme2,
        });

        const prompt = `You are a speech therapist. A child scored ${percentage}% accuracy on phonemes ${phoneme1} and ${phoneme2}.

Provide:
1. Brief assessment (20 words max)
2. 3 specific practice tips
3. Encouragement

Keep response under 80 words, child-friendly language.`;

        const { RunAnywhere } = await import("@runanywhere/core");
        const result = await RunAnywhere.generate(prompt, {
            maxTokens: 150,
            temperature: 0.7,
        });

        return {
            remedy: result.text,
            percentage,
            phonemes: [phoneme1, phoneme2],
        };
    } catch (error) {
        console.error("Error getting remedy:", error);

        // Fallback remedy
        let remedy = "";
        if (percentage >= 80) {
            remedy = `Excellent work on ${phoneme1} and ${phoneme2}! You're doing great. Keep practicing daily for 5 minutes to maintain your skills.`;
        } else if (percentage >= 60) {
            remedy = `Good progress on ${phoneme1} and ${phoneme2}! Practice these sounds slowly, focusing on mouth positioning. Try 10 repetitions daily.`;
        } else {
            remedy = `Let's work on ${phoneme1} and ${phoneme2} together. Break the sounds into smaller parts. Watch your mouth in a mirror while practicing. Be patient with yourself!`;
        }

        return { remedy, percentage, phonemes: [phoneme1, phoneme2] };
    }
};
