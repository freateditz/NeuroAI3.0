import { RunAnywhere } from "@runanywhere/core";
import runtimeManager from "./runtime";

class PhonemeAnalyzerService {
    constructor() {
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;

        await runtimeManager.initialize();
        this.initialized = true;
    }

    calculateSimpleAccuracy(transcription, expectedWord) {
        if (!transcription || !expectedWord) return 0;

        const trans = transcription.toLowerCase().trim();
        const expected = expectedWord.toLowerCase().trim();

        if (trans === expected) return 100;

        const distance = this.levenshteinDistance(trans, expected);
        const maxLen = Math.max(trans.length, expected.length);
        const accuracy = Math.max(0, ((maxLen - distance) / maxLen) * 100);

        return Math.round(accuracy);
    }

    async analyzePhonemes(transcription, expectedWord, targetPhonemes) {
        try {
            await this.initialize();

            console.log('=== AI ANALYSIS ===');
            console.log('Input:', { transcription, expectedWord, targetPhonemes });

            // Calculate accuracy based on actual transcription
            const calculatedAccuracy = this.calculateSimpleAccuracy(transcription, expectedWord);
            
            const prompt = `You are a friendly speech therapist analyzing a child's pronunciation.

Expected word: "${expectedWord}"
What they said: "${transcription}"
Calculated accuracy: ${calculatedAccuracy}%

Provide brief, encouraging feedback in 2-3 sentences:
- If accuracy >= 90%: Praise their excellent pronunciation
- If accuracy >= 70%: Encourage them, mention what was good
- If accuracy >= 50%: Gently correct, give one specific tip
- If accuracy < 50%: Be very encouraging, break down the word

Keep response under 50 words. Be warm and child-friendly.`;

            const result = await RunAnywhere.generate(prompt, {
                maxTokens: 80,
                temperature: 0.5,
            });

            const response = result.text;
            console.log('AI Response:', response);

            return {
                accuracy: calculatedAccuracy,
                transcription,
                expectedWord,
                feedback: response,
                timestamp: new Date().toISOString(),
            };
        } catch (error) {
            console.error('AI analysis failed, using simple comparison:', error);

            const accuracy = this.calculateSimpleAccuracy(transcription, expectedWord);
            
            return {
                accuracy,
                transcription,
                expectedWord,
                feedback: this.generateSimpleFeedback(transcription, expectedWord, accuracy),
                timestamp: new Date().toISOString(),
            };
        }
    }

    generateSimpleFeedback(transcription, expectedWord, accuracy) {
        if (accuracy >= 95) {
            return `🎉 Perfect! You said "${transcription}" - that's exactly right! Your pronunciation of "${expectedWord}" is excellent. Keep up the amazing work!`;
        } else if (accuracy >= 80) {
            return `⭐ Great job! You said "${transcription}" which is very close to "${expectedWord}". Your pronunciation is almost perfect. Try one more time!`;
        } else if (accuracy >= 60) {
            return `👍 Good try! You said "${transcription}" - you're getting "${expectedWord}" right! Focus on saying each sound clearly and slowly.`;
        } else if (accuracy >= 40) {
            return `💪 Nice effort! Let's practice "${expectedWord}" together. Try breaking it into smaller parts: say each syllable slowly, then combine them.`;
        } else {
            return `🎯 Let's work on "${expectedWord}"! Listen to the example carefully. Watch how the mouth moves. Take a deep breath and try saying it slowly.`;
        }
    }

    levenshteinDistance(str1, str2) {
        const matrix = [];

        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1,
                    );
                }
            }
        }

        return matrix[str2.length][str1.length];
    }
}



export default new PhonemeAnalyzerService();
