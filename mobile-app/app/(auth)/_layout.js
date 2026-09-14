import { Stack } from "expo-router";

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
                contentStyle: { backgroundColor: "#000" },
            }}
        >
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
        </Stack>
    );
}
