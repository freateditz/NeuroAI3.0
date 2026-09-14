import { useState, useCallback } from 'react';
import { RunAnywhere, STTOptions, STTResult } from '@runanywhere/core';

export function useSTT() {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transcribeFile = useCallback(
    async (audioPath: string, options?: STTOptions): Promise<STTResult | null> => {
      setIsTranscribing(true);
      setError(null);

      try {
        return await RunAnywhere.transcribeFile(audioPath, options);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Transcription failed');
        return null;
      } finally {
        setIsTranscribing(false);
      }
    },
    []
  );

  const transcribeBuffer = useCallback(
    async (
      samples: number[],
      sampleRate: number,
      options?: STTOptions
    ): Promise<STTResult | null> => {
      setIsTranscribing(true);
      setError(null);

      try {
        return await RunAnywhere.transcribeBuffer(samples, sampleRate, options);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Transcription failed');
        return null;
      } finally {
        setIsTranscribing(false);
      }
    },
    []
  );

  return { transcribeFile, transcribeBuffer, isTranscribing, error };
}
