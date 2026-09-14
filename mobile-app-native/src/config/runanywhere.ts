import { RunAnywhere, SDKEnvironment, ModelCategory } from '@runanywhere/core';
import { LlamaCPP } from '@runanywhere/llamacpp';
import { ONNX, ModelArtifactType } from '@runanywhere/onnx';

// Model configurations
export const MODELS = {
  LLM: {
    id: 'smollm2-360m',
    name: 'SmolLM2 360M',
    url: 'https://huggingface.co/prithivMLmods/SmolLM2-360M-GGUF/resolve/main/SmolLM2-360M.Q8_0.gguf',
    memoryRequirement: 500_000_000,
  },
  STT: {
    id: 'whisper-tiny-en',
    name: 'Whisper Tiny English',
    url: 'https://github.com/RunanywhereAI/sherpa-onnx/releases/download/runanywhere-models-v1/sherpa-onnx-whisper-tiny.en.tar.gz',
    modality: ModelCategory.SpeechRecognition,
    artifactType: ModelArtifactType.TarGzArchive,
    memoryRequirement: 75_000_000,
  },
  VAD: {
    id: 'silero-vad',
    name: 'Silero VAD',
    url: 'https://github.com/RunanywhereAI/sherpa-onnx/releases/download/runanywhere-models-v1/silero-vad.tar.gz',
    modality: ModelCategory.Audio,
    artifactType: ModelArtifactType.TarGzArchive,
    memoryRequirement: 5_000_000,
  },
};

export type ModelDownloadProgress = {
  state: 'downloading' | 'extracting' | 'completed' | 'failed';
  progress: number;
};

export type InitializationStatus = {
  sdk: boolean;
  llm: boolean;
  stt: boolean;
  vad: boolean;
};

// Initialize the RunAnywhere SDK
export async function initializeSDK(): Promise<void> {
  await RunAnywhere.initialize({
    environment: SDKEnvironment.Development,
  });
}

// Register all backends
export function registerBackends(): void {
  LlamaCPP.register();
  ONNX.register();
}

// Add all models
export async function addModels(): Promise<void> {
  // Add LLM model
  await LlamaCPP.addModel(MODELS.LLM);

  // Add STT model
  await ONNX.addModel(MODELS.STT);

  // Add VAD model
  await ONNX.addModel(MODELS.VAD);
}

// Download a model with progress callback
export async function downloadModel(
  modelId: string,
  onProgress?: (progress: ModelDownloadProgress) => void
): Promise<void> {
  await RunAnywhere.downloadModel(modelId, (progress) => {
    onProgress?.({
      state: progress.state,
      progress: progress.progress,
    });
  });
}

// Load LLM model
export async function loadLLMModel(): Promise<void> {
  const modelInfo = await RunAnywhere.getModelInfo(MODELS.LLM.id);
  if (modelInfo?.localPath) {
    await RunAnywhere.loadModel(modelInfo.localPath);
  }
}

// Load STT model
export async function loadSTTModel(): Promise<void> {
  const modelInfo = await RunAnywhere.getModelInfo(MODELS.STT.id);
  if (modelInfo?.localPath) {
    await RunAnywhere.loadSTTModel(modelInfo.localPath, 'whisper');
  }
}

// Load VAD model
export async function loadVADModel(): Promise<void> {
  const modelInfo = await RunAnywhere.getModelInfo(MODELS.VAD.id);
  if (modelInfo?.localPath) {
    await RunAnywhere.loadVADModel(modelInfo.localPath);
  }
}

// Full initialization sequence
export async function initializeAll(
  onProgress?: (step: string, progress?: number) => void
): Promise<InitializationStatus> {
  const status: InitializationStatus = {
    sdk: false,
    llm: false,
    stt: false,
    vad: false,
  };

  try {
    // Step 1: Initialize SDK
    onProgress?.('Initializing SDK...');
    await initializeSDK();
    status.sdk = true;

    // Step 2: Register backends
    onProgress?.('Registering backends...');
    registerBackends();

    // Step 3: Add models
    onProgress?.('Configuring models...');
    await addModels();

    // Step 4: Download LLM
    onProgress?.('Downloading LLM model...');
    await downloadModel(MODELS.LLM.id, (p) => {
      onProgress?.(`Downloading LLM: ${(p.progress * 100).toFixed(1)}%`, p.progress);
    });
    await loadLLMModel();
    status.llm = true;

    // Step 5: Download STT
    onProgress?.('Downloading STT model...');
    await downloadModel(MODELS.STT.id, (p) => {
      onProgress?.(`Downloading STT: ${(p.progress * 100).toFixed(1)}%`, p.progress);
    });
    await loadSTTModel();
    status.stt = true;

    // Step 6: Download VAD
    onProgress?.('Downloading VAD model...');
    await downloadModel(MODELS.VAD.id, (p) => {
      onProgress?.(`Downloading VAD: ${(p.progress * 100).toFixed(1)}%`, p.progress);
    });
    await loadVADModel();
    status.vad = true;

    onProgress?.('Ready!');
  } catch (error) {
    console.error('Initialization failed:', error);
    throw error;
  }

  return status;
}
