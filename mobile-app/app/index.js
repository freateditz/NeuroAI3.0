import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function Index() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === "(auth)";
        const inMainGroup = segments[0] === "(tabs)";

        if (isAuthenticated && !inMainGroup) {
            // User is authenticated but not in main app
            router.replace("/(tabs)/home");
        } else if (!isAuthenticated && !inAuthGroup) {
            // User is not authenticated and not in auth screens
            router.replace("/(auth)/onboarding");
        }
    }, [isAuthenticated, isLoading, segments]);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#6366f1" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
    },
});
