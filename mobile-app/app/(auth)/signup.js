import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

const PROBLEM_DESCRIPTIONS = [
    { value: 'stuttering', label: 'Stuttering' },
    { value: 'stammering', label: 'Stammering' },
    { value: 'lisp', label: 'Lisp' },
    { value: 'articulation', label: 'Articulation Disorder' },
    { value: 'phonological_disorder', label: 'Phonological Disorder' },
    { value: 'apraxia', label: 'Apraxia of Speech' },
    { value: 'dysarthria', label: 'Dysarthria' },
    { value: 'voice_disorder', label: 'Voice Disorder' },
    { value: 'other', label: 'Other' },
];

const REGIONS = [
    'North America',
    'South America',
    'Europe',
    'Asia',
    'Africa',
    'Australia/Oceania',
    'Middle East',
];

const SignupScreen = () => {
    const { signup } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        childAge: '',
        region: '',
        problemDescription: '',
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSignup = async () => {
        // Validation
        if (
            !formData.name ||
            !formData.email ||
            !formData.password ||
            !formData.phoneNumber ||
            !formData.childAge ||
            !formData.region ||
            !formData.problemDescription
        ) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        if (formData.password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        const age = parseInt(formData.childAge);
        if (isNaN(age) || age < 1 || age > 18) {
            Alert.alert('Error', 'Child age must be between 1 and 18');
            return;
        }

        setLoading(true);

        try {
            const result = await signup(
                formData.name,
                formData.email,
                formData.password,
                formData.phoneNumber,
                age,
                formData.region,
                formData.problemDescription
            );

            if (!result.success) {
                Alert.alert('Signup Failed', result.error || 'An error occurred');
            }
            // If successful, AuthContext will handle navigation
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>
                        Join us to help your child's speech journey
                    </Text>
                </View>

                <View style={styles.form}>
                    {/* Name Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Name <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="John Doe"
                            placeholderTextColor="#999"
                            value={formData.name}
                            onChangeText={(text) => handleChange('name', text)}
                            autoCapitalize="words"
                        />
                    </View>

                    {/* Email Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Email <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="you@example.com"
                            placeholderTextColor="#999"
                            value={formData.email}
                            onChangeText={(text) => handleChange('email', text)}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Password <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="••••••••"
                                placeholderTextColor="#999"
                                value={formData.password}
                                onChangeText={(text) => handleChange('password', text)}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-off' : 'eye'}
                                    size={20}
                                    color="#999"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Phone Number Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Phone Number <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="+1 234 567 8900"
                            placeholderTextColor="#999"
                            value={formData.phoneNumber}
                            onChangeText={(text) => handleChange('phoneNumber', text)}
                            keyboardType="phone-pad"
                        />
                    </View>

                    {/* Child Age Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Age of Child <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter age (1-18)"
                            placeholderTextColor="#999"
                            value={formData.childAge}
                            onChangeText={(text) => handleChange('childAge', text)}
                            keyboardType="number-pad"
                        />
                    </View>

                    {/* Region Picker */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Region <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={styles.pickerContainer}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.regionScroll}
                            >
                                {REGIONS.map((region) => (
                                    <TouchableOpacity
                                        key={region}
                                        style={[
                                            styles.regionChip,
                                            formData.region === region &&
                                                styles.regionChipSelected,
                                        ]}
                                        onPress={() => handleChange('region', region)}
                                    >
                                        <Text
                                            style={[
                                                styles.regionChipText,
                                                formData.region === region &&
                                                    styles.regionChipTextSelected,
                                            ]}
                                        >
                                            {region}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>

                    {/* Problem Description Picker */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Primary Speech Challenge{' '}
                            <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={styles.problemGrid}>
                            {PROBLEM_DESCRIPTIONS.map((problem) => (
                                <TouchableOpacity
                                    key={problem.value}
                                    style={[
                                        styles.problemChip,
                                        formData.problemDescription === problem.value &&
                                            styles.problemChipSelected,
                                    ]}
                                    onPress={() =>
                                        handleChange('problemDescription', problem.value)
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.problemChipText,
                                            formData.problemDescription === problem.value &&
                                                styles.problemChipTextSelected,
                                        ]}
                                    >
                                        {problem.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            loading && styles.submitButtonDisabled,
                        ]}
                        onPress={handleSignup}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.submitButtonText}>Create Account</Text>
                        )}
                    </TouchableOpacity>

                    {/* Login Link */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Already have an account?{' '}
                        </Text>
                        <Link href="/(auth)/login" style={styles.link}>
                            <Text style={styles.linkText}>Sign In</Text>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#999',
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#fff',
        marginBottom: 8,
        fontWeight: '500',
    },
    required: {
        color: '#ef4444',
    },
    input: {
        backgroundColor: '#1a1a1a',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#fff',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 12,
    },
    passwordInput: {
        flex: 1,
        padding: 16,
        fontSize: 16,
        color: '#fff',
    },
    eyeIcon: {
        padding: 16,
    },
    pickerContainer: {
        marginBottom: 8,
    },
    regionScroll: {
        flexDirection: 'row',
    },
    regionChip: {
        backgroundColor: '#1a1a1a',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 8,
    },
    regionChipSelected: {
        backgroundColor: '#6366f1',
        borderColor: '#6366f1',
    },
    regionChipText: {
        color: '#999',
        fontSize: 14,
        fontWeight: '500',
    },
    regionChipTextSelected: {
        color: '#fff',
    },
    problemGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    problemChip: {
        backgroundColor: '#1a1a1a',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    problemChipSelected: {
        backgroundColor: '#6366f1',
        borderColor: '#6366f1',
    },
    problemChipText: {
        color: '#999',
        fontSize: 13,
        fontWeight: '500',
    },
    problemChipTextSelected: {
        color: '#fff',
    },
    submitButton: {
        backgroundColor: '#6366f1',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    submitButtonDisabled: {
        backgroundColor: '#4b5563',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    footerText: {
        color: '#999',
        fontSize: 14,
    },
    link: {
        marginLeft: 4,
    },
    linkText: {
        color: '#6366f1',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default SignupScreen;