import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Modal,
    ScrollView,
    Alert,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

const PROBLEM_DESCRIPTIONS = [
    { value: "stuttering", label: "Stuttering" },
    { value: "stammering", label: "Stammering" },
    { value: "lisp", label: "Lisp" },
    { value: "articulation", label: "Articulation Disorder" },
    { value: "phonological_disorder", label: "Phonological Disorder" },
    { value: "apraxia", label: "Apraxia of Speech" },
    { value: "dysarthria", label: "Dysarthria" },
    { value: "voice_disorder", label: "Voice Disorder" },
    { value: "other", label: "Other" },
];

const REGIONS = [
    "North America",
    "South America",
    "Europe",
    "Asia",
    "Africa",
    "Australia/Oceania",
    "Middle East",
];

export default function AuthModal({ visible, mode, onClose, onSwitchMode }) {
    const { login, signup } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        childAge: "",
        region: "",
        problemDescription: "",
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        // Reset form when modal opens
        if (visible) {
            setFormData({
                name: "",
                email: "",
                password: "",
                phoneNumber: "",
                childAge: "",
                region: "",
                problemDescription: "",
            });
        }
    }, [visible]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.email || !formData.password) {
            Alert.alert("Error", "Email and password are required");
            return;
        }

        if (mode === "signup") {
            if (
                !formData.name ||
                !formData.phoneNumber ||
                !formData.childAge ||
                !formData.region ||
                !formData.problemDescription
            ) {
                Alert.alert("Error", "Please fill in all required fields");
                return;
            }

            const age = parseInt(formData.childAge);
            if (isNaN(age) || age < 1 || age > 18) {
                Alert.alert("Error", "Child age must be between 1 and 18");
                return;
            }
        }

        if (formData.password.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            let result;
            if (mode === "login") {
                result = await login(formData.email, formData.password);
            } else {
                result = await signup(
                    formData.name,
                    formData.email,
                    formData.password,
                    formData.phoneNumber,
                    parseInt(formData.childAge),
                    formData.region,
                    formData.problemDescription
                );
            }

            if (result.success) {
                onClose();
            } else {
                Alert.alert(
                    mode === "login" ? "Login Failed" : "Signup Failed",
                    result.error || "An error occurred"
                );
            }
        } catch (error) {
            Alert.alert("Error", "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            {mode === "login" ? "Welcome Back" : "Create Account"}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Form */}
                    <ScrollView
                        style={styles.formScroll}
                        showsVerticalScrollIndicator={false}
                    >
                        {mode === "signup" && (
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>
                                    Name <Text style={styles.required}>*</Text>
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="John Doe"
                                    placeholderTextColor="#666"
                                    value={formData.name}
                                    onChangeText={(text) => handleChange("name", text)}
                                    autoCapitalize="words"
                                />
                            </View>
                        )}

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>
                                Email <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="you@example.com"
                                placeholderTextColor="#666"
                                value={formData.email}
                                onChangeText={(text) => handleChange("email", text)}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>
                                Password <Text style={styles.required}>*</Text>
                            </Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="••••••••"
                                    placeholderTextColor="#666"
                                    value={formData.password}
                                    onChangeText={(text) => handleChange("password", text)}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity
                                    style={styles.eyeIcon}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-off" : "eye"}
                                        size={20}
                                        color="#999"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {mode === "signup" && (
                            <>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>
                                        Phone Number <Text style={styles.required}>*</Text>
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="+1 234 567 8900"
                                        placeholderTextColor="#666"
                                        value={formData.phoneNumber}
                                        onChangeText={(text) =>
                                            handleChange("phoneNumber", text)
                                        }
                                        keyboardType="phone-pad"
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>
                                        Age of Child <Text style={styles.required}>*</Text>
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter age (1-18)"
                                        placeholderTextColor="#666"
                                        value={formData.childAge}
                                        onChangeText={(text) => handleChange("childAge", text)}
                                        keyboardType="number-pad"
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>
                                        Region <Text style={styles.required}>*</Text>
                                    </Text>
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        style={styles.regionScroll}
                                    >
                                        {REGIONS.map((region) => (
                                            <TouchableOpacity
                                                key={region}
                                                style={[
                                                    styles.chip,
                                                    formData.region === region &&
                                                        styles.chipSelected,
                                                ]}
                                                onPress={() => handleChange("region", region)}
                                            >
                                                <Text
                                                    style={[
                                                        styles.chipText,
                                                        formData.region === region &&
                                                            styles.chipTextSelected,
                                                    ]}
                                                >
                                                    {region}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>
                                        Primary Speech Challenge{" "}
                                        <Text style={styles.required}>*</Text>
                                    </Text>
                                    <View style={styles.problemGrid}>
                                        {PROBLEM_DESCRIPTIONS.map((problem) => (
                                            <TouchableOpacity
                                                key={problem.value}
                                                style={[
                                                    styles.chip,
                                                    formData.problemDescription ===
                                                        problem.value && styles.chipSelected,
                                                ]}
                                                onPress={() =>
                                                    handleChange(
                                                        "problemDescription",
                                                        problem.value
                                                    )
                                                }
                                            >
                                                <Text
                                                    style={[
                                                        styles.chipText,
                                                        formData.problemDescription ===
                                                            problem.value &&
                                                            styles.chipTextSelected,
                                                    ]}
                                                >
                                                    {problem.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            </>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.submitButton,
                                loading && styles.submitButtonDisabled,
                            ]}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.submitButtonText}>
                                    {mode === "login" ? "Sign In" : "Sign Up"}
                                </Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.switchButton}
                            onPress={onSwitchMode}
                        >
                            <Text style={styles.switchButtonText}>
                                {mode === "login"
                                    ? "Don't have an account? Sign up"
                                    : "Already have an account? Sign in"}
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#1a1a1a",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: "90%",
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#333",
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
    },
    formScroll: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: "#fff",
        marginBottom: 8,
        fontWeight: "500",
    },
    required: {
        color: "#ef4444",
    },
    input: {
        backgroundColor: "#0a0a0a",
        borderWidth: 1,
        borderColor: "#333",
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: "#fff",
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#0a0a0a",
        borderWidth: 1,
        borderColor: "#333",
        borderRadius: 12,
    },
    passwordInput: {
        flex: 1,
        padding: 16,
        fontSize: 16,
        color: "#fff",
    },
    eyeIcon: {
        padding: 16,
    },
    regionScroll: {
        marginTop: 8,
    },
    problemGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 8,
    },
    chip: {
        backgroundColor: "#0a0a0a",
        borderWidth: 1,
        borderColor: "#333",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 8,
    },
    chipSelected: {
        backgroundColor: "#6366f1",
        borderColor: "#6366f1",
    },
    chipText: {
        color: "#999",
        fontSize: 14,
        fontWeight: "500",
    },
    chipTextSelected: {
        color: "#fff",
    },
    submitButton: {
        backgroundColor: "#6366f1",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        marginTop: 20,
    },
    submitButtonDisabled: {
        backgroundColor: "#4b5563",
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    switchButton: {
        marginTop: 16,
        alignItems: "center",
    },
    switchButtonText: {
        color: "#6366f1",
        fontSize: 14,
        fontWeight: "500",
    },
});
