import * as Speech from "expo-speech";
import runtimeManager from "./runtime";

class PronunciationPlayerService {
    constructor() {
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;

        await runtimeManager.initialize();

        this.initialized = true;
        console.log("TTS initialized");
    }

    async playWord(word) {
        try {
            await this.initialize();

            if (!word) {
                console.warn("No word provided to play");
                return;
            }

            console.log("Playing pronunciation:", word);

            // Use Expo Speech module
            const isSpeaking = await Speech.isSpeakingAsync();
            if (isSpeaking) {
                await Speech.stop();
            }

            await Speech.speak(word, {
                language: "en-US",
                pitch: 1.0,
                rate: 0.75,
            });
        } catch (error) {
            console.error("Failed to play pronunciation:", error);
        }
    }

    async cleanup() {
        try {
            const isSpeaking = await Speech.isSpeakingAsync();
            if (isSpeaking) {
                await Speech.stop();
            }
        } catch (error) {
            console.error("Error cleaning up sound:", error);
        }
    }
}


            
  
export default new PronunciationPlayerService();
