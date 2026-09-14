import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import AuthModal from "../../components/AuthModal";

export default function HomeScreen() {
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState("signup"); // 'signup' or 'login'

    const handleGetStarted = () => {
        if (isAuthenticated) {
            // If already authenticated, go to main features
            router.push("/(tabs)/chat");
        } else {
            // Show signup modal
            setAuthMode("signup");
            setShowAuthModal(true);
        }
    };

    const handleLogin = () => {
        setAuthMode("login");
        setShowAuthModal(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Text style={styles.logo}>🧠</Text>
                    <Text style={styles.title}>
                        {isAuthenticated
                            ? `Welcome back, ${user?.name || "User"}!`
                            : "Neuro AI"}
                    </Text>
                    <Text style={styles.subtitle}>
                        {isAuthenticated
                            ? "Your personal AI assistant powered by on-device intelligence"
                            : "On-device AI assistant for speech therapy"}
                    </Text>
                </View>

                {/* Features */}
                <View style={styles.features}>
                    <FeatureCard
                        icon="💬"
                        title="Smart Conversations"
                        description="Chat with AI offline"
                        color="#6366f1"
                    />
                    <FeatureCard
                        icon="🎤"
                        title="Voice Recognition"
                        description="Speech-to-text on device"
                        color="#8b5cf6"
                    />
                    <FeatureCard
                        icon="🎯"
                        title="Speech Therapy"
                        description="Personalized exercises"
                        color="#ec4899"
                    />
                    <FeatureCard
                        icon="🔒"
                        title="Privacy First"
                        description="All data stays on your device"
                        color="#10b981"
                    />
                </View>

                {/* CTA Section */}
                {!isAuthenticated && (
                    <View style={styles.ctaSection}>
                        <Text style={styles.ctaTitle}>Ready to get started?</Text>
                        <Text style={styles.ctaSubtitle}>
                            Join thousands of families improving speech together
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleGetStarted}
                >
                    <Text style={styles.primaryButtonText}>
                        {isAuthenticated ? "Go to Chat" : "Get Started"}
                    </Text>
                </TouchableOpacity>

                {!isAuthenticated && (
                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={handleLogin}
                    >
                        <Text style={styles.secondaryButtonText}>
                            I already have an account
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Auth Modal */}
            <AuthModal
                visible={showAuthModal}
                mode={authMode}
                onClose={() => setShowAuthModal(false)}
                onSwitchMode={() =>
                    setAuthMode(authMode === "login" ? "signup" : "login")
                }
            />
        </SafeAreaView>
    );
}

function FeatureCard({ icon, title, description, color }) {
    return (
        <View style={[styles.featureCard, { borderLeftColor: color }]}>
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
    },
    heroSection: {
        alignItems: "center",
        marginBottom: 40,
        marginTop: 20,
    },
    logo: {
        fontSize: 80,
        marginBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 12,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#999",
        textAlign: "center",
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    features: {
        gap: 16,
        marginBottom: 32,
    },
    featureCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: "#333",
        borderLeftWidth: 4,
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
    ctaSection: {
        alignItems: "center",
        marginTop: 16,
        marginBottom: 16,
    },
    ctaTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 8,
        textAlign: "center",
    },
    ctaSubtitle: {
        fontSize: 14,
        color: "#999",
        textAlign: "center",
    },
    actions: {
        padding: 24,
        gap: 12,
        backgroundColor: "#000",
        borderTopWidth: 1,
        borderTopColor: "#1a1a1a",
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
