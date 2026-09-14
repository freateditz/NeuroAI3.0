import { useState, useCallback } from 'react';
import { RunAnywhere, GenerationOptions, GenerationResult } from '@runanywhere/core';

export function useAI() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (prompt: string, options?: GenerationOptions): Promise<GenerationResult | null> => {
      setIsGenerating(true);
      setError(null);

      try {
        return await RunAnywhere.generate(prompt, options);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Generation failed');
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  const chat = useCallback(async (prompt: string): Promise<string> => {
    setIsGenerating(true);
    setError(null);

    try {
      return await RunAnywhere.chat(prompt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chat failed');
      return '';
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generateStream = useCallback(
    async (
      prompt: string,
      options?: GenerationOptions,
      onToken?: (token: string) => void
    ): Promise<GenerationResult | null> => {
      setIsGenerating(true);
      setError(null);

      try {
        const streamResult = await RunAnywhere.generateStream(prompt, options);

        for await (const token of streamResult.stream) {
          onToken?.(token);
        }

        return await streamResult.result;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Stream generation failed');
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  return { generate, chat, generateStream, isGenerating, error };
}
