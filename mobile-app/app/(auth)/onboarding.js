import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function Onboarding() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Logo/Icon Section */}
                <View style={styles.heroSection}>
                    <Text style={styles.logo}>🧠</Text>
                    <Text style={styles.title}>Neuro AI</Text>
                    <Text style={styles.subtitle}>
                        Your personal AI assistant powered by on-device intelligence
                    </Text>
                </View>

                {/* Features List */}
                <View style={styles.features}>
                    <FeatureItem
                        icon="💬"
                        title="Smart Conversations"
                        description="Chat with AI offline"
                    />
                    <FeatureItem
                        icon="🎤"
                        title="Voice Recognition"
                        description="Speech-to-text on device"
                    />
                    <FeatureItem
                        icon="🔒"
                        title="Privacy First"
                        description="All data stays on your device"
                    />
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => router.push("/(auth)/signup")}
                >
                    <Text style={styles.primaryButtonText}>Get Started</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => router.push("/(auth)/login")}
                >
                    <Text style={styles.secondaryButtonText}>
                        I already have an account
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

function FeatureItem({ icon, title, description }) {
    return (
        <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>{icon}</Text>
            <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{title}</Text>
                <Text style={styles.featureDescription}>{description}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: "center",
    },
    heroSection: {
        alignItems: "center",
        marginBottom: 48,
    },
    logo: {
        fontSize: 80,
        marginBottom: 16,
    },
    title: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: "#999",
        textAlign: "center",
        lineHeight: 24,
        paddingHorizontal: 32,
    },
    features: {
        gap: 24,
    },
    featureItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: "#333",
    },
    featureIcon: {
        fontSize: 32,
        marginRight: 16,
    },
    featureContent: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#fff",
        marginBottom: 4,
    },
    featureDescription: {
        fontSize: 14,
        color: "#999",
    },
    actions: {
        padding: 24,
        gap: 12,
    },
    primaryButton: {
        backgroundColor: "#6366f1",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
    },
    primaryButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    secondaryButton: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#333",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
    },
    secondaryButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
