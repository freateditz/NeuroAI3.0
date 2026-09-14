import { RunAnywhere, SDKEnvironment } from "@runanywhere/core";
import { LlamaCPP } from "@runanywhere/llamacpp";
import { ONNX } from "@runanywhere/onnx";

class RuntimeManager {
    constructor() {
        this.initialized = false;
        this.initializing = false;
    }

    async initialize() {
        if (this.initialized) return;

        if (this.initializing) {
            while (!this.initialized) {
                await new Promise((r) => setTimeout(r, 50));
            }
            return;
        }

        this.initializing = true;
        try {
            console.log("Initializing RunAnywhere SDK...");

            // 1. Initialize SDK first
            await RunAnywhere.initialize({
                environment: SDKEnvironment.Development,
            });

            // 2. Register backends (synchronous, no await needed per docs)
            LlamaCPP.register();
            ONNX.register();

            console.log("Backends registered successfully");

            this.initialized = true;
            console.log("RunAnywhere SDK initialized successfully");
        } catch (error) {
            console.error("Failed to initialize RunAnywhere SDK:", error);
            this.initializing = false;
            throw error;
        }
    }

    isReady() {
        return this.initialized;
    }
}

export default new RuntimeManager();
