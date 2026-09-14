import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { initializeAll, InitializationStatus } from '../config/runanywhere';

interface RunAnywhereContextType {
  isReady: boolean;
  isLoading: boolean;
  status: InitializationStatus;
  currentStep: string;
  progress: number;
  error: string | null;
}

const RunAnywhereContext = createContext<RunAnywhereContextType | undefined>(undefined);

export const RunAnywhereProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState('Starting...');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<InitializationStatus>({
    sdk: false,
    llm: false,
    stt: false,
    vad: false,
  });

  useEffect(() => {
    const init = async () => {
      try {
        const result = await initializeAll((step, prog) => {
          setCurrentStep(step);
          if (prog !== undefined) setProgress(prog);
        });
        setStatus(result);
        setIsReady(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Initialization failed');
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  return (
    <RunAnywhereContext.Provider
      value={{ isReady, isLoading, status, currentStep, progress, error }}
    >
      {children}
    </RunAnywhereContext.Provider>
  );
};

export const useRunAnywhere = (): RunAnywhereContextType => {
  const context = useContext(RunAnywhereContext);
  if (!context) {
    throw new Error('useRunAnywhere must be used within RunAnywhereProvider');
  }
  return context;
};
