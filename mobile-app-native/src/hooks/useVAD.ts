import { useState, useEffect, useCallback } from 'react';
import { RunAnywhere, SpeechActivityEvent, VADConfiguration } from '@runanywhere/core';

export function useVAD(config?: VADConfiguration) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [audioBuffer, setAudioBuffer] = useState<number[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVADEvent = useCallback((event: SpeechActivityEvent) => {
    switch (event.type) {
      case 'speechStarted':
        setIsSpeaking(true);
        setConfidence(event.confidence);
        setAudioBuffer(null);
        break;
      case 'speechEnded':
        setIsSpeaking(false);
        if (event.audioBuffer) {
          setAudioBuffer(event.audioBuffer);
        }
        break;
      case 'speechContinuing':
        setConfidence(event.confidence);
        break;
    }
  }, []);

  const startListening = useCallback(async () => {
    try {
      setError(null);
      await RunAnywhere.initializeVAD(config);
      RunAnywhere.setVADSpeechActivityCallback(handleVADEvent);
      await RunAnywhere.startVAD();
      setIsListening(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'VAD start failed');
    }
  }, [config, handleVADEvent]);

  const stopListening = useCallback(async () => {
    try {
      await RunAnywhere.stopVAD();
      setIsListening(false);
      setIsSpeaking(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'VAD stop failed');
    }
  }, []);

  useEffect(() => {
    return () => {
      if (isListening) {
        RunAnywhere.stopVAD().catch(console.error);
      }
    };
  }, [isListening]);

  return {
    isListening,
    isSpeaking,
    confidence,
    audioBuffer,
    error,
    startListening,
    stopListening,
  };
}
