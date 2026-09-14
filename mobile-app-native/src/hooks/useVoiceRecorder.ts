import { useState, useCallback } from 'react';
import { RunAnywhere } from '@runanywhere/core';
import AudioRecord from 'react-native-audio-record';

interface RecorderOptions {
  sampleRate?: number;
  channels?: number;
  bitsPerSample?: number;
  language?: string;
}

export function useVoiceRecorder(options?: RecorderOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setTranscription('');

      AudioRecord.init({
        sampleRate: options?.sampleRate || 16000,
        channels: options?.channels || 1,
        bitsPerSample: options?.bitsPerSample || 16,
        audioSource: 6,
        wavFile: 'recording.wav',
      });

      AudioRecord.start();
      setIsRecording(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Recording start failed');
    }
  }, [options]);

  const stopRecording = useCallback(async (): Promise<string> => {
    try {
      setIsRecording(false);
      const audioPath = await AudioRecord.stop();

      setIsTranscribing(true);
      const result = await RunAnywhere.transcribeFile(audioPath, {
        language: options?.language || 'en',
      });

      setTranscription(result.text);
      return result.text;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Transcription failed';
      setError(message);
      return '';
    } finally {
      setIsTranscribing(false);
    }
  }, [options]);

  return {
    isRecording,
    isTranscribing,
    transcription,
    error,
    startRecording,
    stopRecording,
  };
}
