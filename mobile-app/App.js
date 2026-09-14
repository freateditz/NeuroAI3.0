import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import modelManager from "./src/ai/modelManager";
import { COLORS, SIZES } from "./src/constants/theme";
import { AuthProvider } from "./src/contexts/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
    const [modelsReady, setModelsReady] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(null);

    useEffect(() => {
        initializeApp();
    }, []);

    const initializeApp = async () => {
        try {
            console.log('=== Starting App Initialization ===');
            console.log('Backend URL: https://neuro-ai-3ipn.onrender.com');
            
            // Check if models are already downloaded
            const status = await modelManager.checkModelsStatus();
            console.log('Model status:', status);

            if (status.whisper && status.llm) {
                // Models cached, load them into memory
                console.log('Models cached, loading into memory...');
                await modelManager.ensureModelsLoaded();
                console.log('Models loaded successfully');
                setModelsReady(true);
                return;
            }

            // Download models with progress
            console.log('Downloading models...');
            await modelManager.initializeModels((progress) => {
                setDownloadProgress(progress);
            });

            console.log('=== App Initialization Complete ===');
            setModelsReady(true);
        } catch (error) {
            console.error("Failed to initialize models:", error);
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
            // Continue anyway - app will work with fallbacks
            setModelsReady(true);
        }
    };

    if (!modelsReady) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                {downloadProgress ? (
                    <>
                        <Text style={styles.loadingTitle}>
                            Downloading AI Models...
                        </Text>
                        <Text style={styles.loadingText}>
                            {downloadProgress.modelName}
                        </Text>
                        <Text style={styles.loadingSubtext}>
                            {downloadProgress.current} of{" "}
                            {downloadProgress.total} ({downloadProgress.size})
                        </Text>
                        <Text style={styles.loadingHint}>
                            This only happens once. Models are cached for
                            offline use.
                        </Text>
                    </>
                ) : (
                    <Text style={styles.loadingText}>Initializing...</Text>
                )}
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <AuthProvider>
                <NavigationContainer>
                    <StatusBar style="auto" />
                    <AppNavigator />
                </NavigationContainer>
            </AuthProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
        padding: 20,
    },
    loadingTitle: {
        fontSize: SIZES.h3,
        fontWeight: "bold",
        color: COLORS.black,
        marginTop: 20,
        textAlign: "center",
    },
    loadingText: {
        fontSize: SIZES.body1,
        color: COLORS.black,
        marginTop: 12,
        textAlign: "center",
    },
    loadingSubtext: {
        fontSize: SIZES.body2,
        color: COLORS.darkGray,
        marginTop: 8,
        textAlign: "center",
    },
    loadingHint: {
        fontSize: SIZES.body3,
        color: COLORS.darkGray,
        marginTop: 16,
        textAlign: "center",
        fontStyle: "italic",
    },
});
