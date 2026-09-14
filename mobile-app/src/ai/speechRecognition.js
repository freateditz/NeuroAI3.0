import { RunAnywhere } from "@runanywhere/core";
import * as FileSystem from "expo-file-system/legacy";
import { PermissionsAndroid, Platform } from "react-native";
import AudioRecorderPlayer from "react-native-nitro-sound";
import runtimeManager from "./runtime.js";

class SpeechRecognitionService {
    constructor() {
        this.audioRecorderPlayer = new AudioRecorderPlayer();
        this.initialized = false;
        this.isRecording = false;
        this.recordPath = null;
    }

    async initialize() {
        if (this.initialized) return;

        console.log("Initializing speech recognition...");
        await runtimeManager.initialize();

        // Request permissions on Android
        if (Platform.OS === "android") {
            try {
                const grants = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                ]);

                if (
                    grants["android.permission.RECORD_AUDIO"] !==
                    PermissionsAndroid.RESULTS.GRANTED
                ) {
                    throw new Error("Microphone permission not granted");
                }

                console.log("✅ Permissions granted");
            } catch (err) {
                console.error("Permission error:", err);
                throw new Error("Failed to get permissions");
            }
        }

        this.initialized = true;
        console.log("✅ Speech recognition initialized");
    }

    async startRecording() {
        await this.initialize();

        try {
            // Stop any existing recording
            if (this.isRecording) {
                try {
                    await this.audioRecorderPlayer.stopRecorder();
                } catch (e) {}
                this.isRecording = false;
            }

            // Generate unique filename with .wav extension
            const timestamp = Date.now();
            const fileName = `recording_${timestamp}.wav`;

            // Set path based on platform
            if (Platform.OS === "android") {
                this.recordPath = `${FileSystem.cacheDirectory}${fileName}`;
            } else {
                this.recordPath = `${FileSystem.cacheDirectory}${fileName}`;
            }

            // Remove file:// prefix for the recorder
            const recorderPath = this.recordPath.replace("file://", "");

            console.log("Starting recording to:", recorderPath);

            // Configure audio recorder for WAV format (16kHz, mono - Whisper compatible)
            const audioSet = {
                // Android settings
                AudioEncoderAndroid: 1, // DEFAULT encoder
                AudioSourceAndroid: 1, // MIC
                OutputFormatAndroid: 2, // MPEG_4 (will be converted)
                // iOS settings
                AVEncoderAudioQualityKeyIOS: 127, // max quality
                AVNumberOfChannelsKeyIOS: 1, // mono
                AVSampleRateKeyIOS: 16000, // 16kHz for Whisper
                AVFormatIDKeyIOS: "lpcm", // Linear PCM for WAV
                AVLinearPCMBitDepthKeyIOS: 16,
                AVLinearPCMIsBigEndianKeyIOS: false,
                AVLinearPCMIsFloatKeyIOS: false,
            };

            // Start recording
            const uri = await this.audioRecorderPlayer.startRecorder(
                recorderPath,
                audioSet,
                true, // Enable metering
            );

            this.isRecording = true;
            console.log("✅ Recording started:", uri);

            // Add recording listener for metering (optional)
            this.audioRecorderPlayer.addRecordBackListener((e) => {
                // Can use e.currentPosition for duration
                return;
            });

            return uri;
        } catch (error) {
            console.error("❌ Failed to start recording:", error);
            this.isRecording = false;
            throw error;
        }
    }

    async stopRecordingAndTranscribe() {
        if (!this.isRecording) {
            throw new Error("No active recording");
        }

        try {
            console.log("Stopping recording...");

            // Stop the recorder
            const result = await this.audioRecorderPlayer.stopRecorder();
            this.audioRecorderPlayer.removeRecordBackListener();
            this.isRecording = false;

            console.log("Recording stopped:", result);

            // Get the file path
            let audioPath = result || this.recordPath;

            // Ensure we have a valid path
            if (!audioPath) {
                throw new Error("No recording path available");
            }

            // Check if file exists
            const fileUri = audioPath.startsWith("file://")
                ? audioPath
                : `file://${audioPath}`;
            const fileInfo = await FileSystem.getInfoAsync(fileUri);

            console.log("File info:", fileInfo);

            if (!fileInfo.exists) {
                throw new Error("Recording file does not exist");
            }

            if (fileInfo.size < 1000) {
                throw new Error("Recording file is too small");
            }

            console.log("File size:", fileInfo.size, "bytes");

            // Prepare path for RunAnywhere transcription
            // RunAnywhere expects absolute path without file:// on Android
            let transcribePath = audioPath;
            if (Platform.OS === "android") {
                transcribePath = audioPath.replace("file://", "");
            }

            console.log("Transcribing with path:", transcribePath);

            // Transcribe using RunAnywhere Whisper
            const transcriptionResult = await RunAnywhere.transcribeFile(
                transcribePath,
                {
                    language: "en",
                },
            );

            console.log("✅ Transcription result:", transcriptionResult);
            console.log("Text:", transcriptionResult.text);
            console.log("Confidence:", transcriptionResult.confidence);

            // Clean up the temp file
            try {
                await FileSystem.deleteAsync(fileUri, { idempotent: true });
            } catch (e) {
                console.log("Could not delete temp file:", e);
            }

            return transcriptionResult.text.toLowerCase().trim();
        } catch (error) {
            console.error("❌ Transcription failed:", error);
            this.isRecording = false;

            // Clean up on error
            if (this.recordPath) {
                try {
                    const fileUri = this.recordPath.startsWith("file://")
                        ? this.recordPath
                        : `file://${this.recordPath}`;
                    await FileSystem.deleteAsync(fileUri, { idempotent: true });
                } catch (e) {}
            }

            throw error;
        }
    }

    async cleanup() {
        try {
            if (this.isRecording) {
                await this.audioRecorderPlayer.stopRecorder();
                this.audioRecorderPlayer.removeRecordBackListener();
                this.isRecording = false;
            }
        } catch (error) {
            console.error("Error cleaning up:", error);
        }
    }
}

export default new SpeechRecognitionService();
