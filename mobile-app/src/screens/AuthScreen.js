import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';

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

const AuthScreen = ({ route }) => {
  const initialMode = route?.params?.mode || 'login';
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    childAge: '',
    region: '',
    problemDescription: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [showProblemPicker, setShowProblemPicker] = useState(false);

  const navigation = useNavigation();
  const { login, signup } = useAuth(); // FIXED: Import signup

  const handleSubmit = async () => {
    console.log('=== AUTH SUBMIT ===');
    console.log('Mode:', mode);
    
    setError('');
    setLoading(true);

    try {
      let result;

      if (mode === 'login') {
        if (!formData.email || !formData.password) {
          console.warn('Missing email or password');
          setError('Please enter email and password');
          setLoading(false);
          return;
        }

        console.log('Calling login...');
        result = await login(formData.email, formData.password);
        console.log('Login result:', result);
      } else {
        // Validate signup fields
        if (
          !formData.name ||
          !formData.email ||
          !formData.password ||
          !formData.phoneNumber ||
          !formData.childAge ||
          !formData.region ||
          !formData.problemDescription
        ) {
          console.warn('Missing required fields');
          setError('Please fill in all required fields');
          setLoading(false);
          return;
        }

        const age = parseInt(formData.childAge);
        if (age < 1 || age > 18) {
          console.warn('Invalid age:', age);
          setError('Child age must be between 1 and 18');
          setLoading(false);
          return;
        }

        console.log('Calling signup...');
        result = await signup(
          formData.name,
          formData.email,
          formData.password,
          formData.phoneNumber,
          age,
          formData.region,
          formData.problemDescription
        );
        console.log('Signup result:', result);
      }

      if (result.success) {
        console.log('✅ Authentication successful, navigating to Learning...');
        navigation.navigate('Learning');
        setFormData({
          name: '',
          email: '',
          password: '',
          phoneNumber: '',
          childAge: '',
          region: '',
          problemDescription: '',
        });
      } else {
        console.error('❌ Authentication failed:', result.error);
        setError(result.error || 'Authentication failed');
      }
    } catch (err) {
      console.error('❌ Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      childAge: '',
      region: '',
      problemDescription: '',
    });
  };

  const renderPicker = (items, selectedValue, onSelect, placeholder) => (
    <View style={styles.pickerContainer}>
      <ScrollView style={styles.pickerScroll}>
        <TouchableOpacity
          style={styles.pickerItem}
          onPress={() => {
            onSelect('');
            setShowRegionPicker(false);
            setShowProblemPicker(false);
          }}
        >
          <Text style={styles.pickerItemText}>{placeholder}</Text>
        </TouchableOpacity>
        {items.map((item) => {
          const value = typeof item === 'string' ? item : item.value;
          const label = typeof item === 'string' ? item : item.label;
          return (
            <TouchableOpacity
              key={value}
              style={[
                styles.pickerItem,
                selectedValue === value && styles.pickerItemSelected,
              ]}
              onPress={() => {
                onSelect(value);
                setShowRegionPicker(false);
                setShowProblemPicker(false);
              }}
            >
              <Text
                style={[
                  styles.pickerItemText,
                  selectedValue === value && styles.pickerItemTextSelected,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={24} color={COLORS.black} />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </Text>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          {mode === 'signup' && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  value={formData.name}
                  onChangeText={(value) => handleChange('name', value)}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Email <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChangeText={(value) => handleChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Password <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  value={formData.password}
                  onChangeText={(value) => handleChange('password', value)}
                  secureTextEntry
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Phone Number <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="+1 234 567 8900"
                  value={formData.phoneNumber}
                  onChangeText={(value) => handleChange('phoneNumber', value)}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Age of Child <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter age (1-10)"
                  value={formData.childAge}
                  onChangeText={(value) => handleChange('childAge', value)}
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Region <Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.selectInput}
                  onPress={() => setShowRegionPicker(!showRegionPicker)}
                >
                  <Text
                    style={[
                      styles.selectText,
                      !formData.region && styles.selectPlaceholder,
                    ]}
                  >
                    {formData.region || 'Select region'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={COLORS.black} />
                </TouchableOpacity>
                {showRegionPicker &&
                  renderPicker(
                    REGIONS,
                    formData.region,
                    (value) => handleChange('region', value),
                    'Select region'
                  )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Primary Speech Challenge <Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.selectInput}
                  onPress={() => setShowProblemPicker(!showProblemPicker)}
                >
                  <Text
                    style={[
                      styles.selectText,
                      !formData.problemDescription && styles.selectPlaceholder,
                    ]}
                  >
                    {PROBLEM_DESCRIPTIONS.find(
                      (p) => p.value === formData.problemDescription
                    )?.label || 'Select challenge'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={COLORS.black} />
                </TouchableOpacity>
                {showProblemPicker &&
                  renderPicker(
                    PROBLEM_DESCRIPTIONS,
                    formData.problemDescription,
                    (value) => handleChange('problemDescription', value),
                    'Select challenge'
                  )}
              </View>
            </>
          )}

          {mode === 'login' && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChangeText={(value) => handleChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  value={formData.password}
                  onChangeText={(value) => handleChange('password', value)}
                  secureTextEntry
                />
              </View>
            </>
          )}

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={toggleMode}>
            <Text style={styles.toggleText}>
              {mode === 'login'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: '#fee',
    borderWidth: 1,
    borderColor: '#faa',
    borderRadius: SIZES.smallRadius,
    padding: 16,
    marginBottom: 24,
  },
  errorText: {
    color: '#c33',
    fontSize: SIZES.body3,
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: SIZES.body3,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 8,
  },
  required: {
    color: '#f00',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.black,
    borderRadius: SIZES.smallRadius,
    padding: 16,
    fontSize: SIZES.body2,
    backgroundColor: COLORS.white,
    color: COLORS.black,
  },
  selectInput: {
    borderWidth: 1,
    borderColor: COLORS.black,
    borderRadius: SIZES.smallRadius,
    padding: 16,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: SIZES.body2,
    color: COLORS.black,
    flex: 1,
  },
  selectPlaceholder: {
    color: COLORS.darkGray,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.black,
    borderRadius: SIZES.smallRadius,
    marginTop: 8,
    backgroundColor: COLORS.white,
    maxHeight: 200,
  },
  pickerScroll: {
    maxHeight: 200,
  },
  pickerItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  pickerItemSelected: {
    backgroundColor: COLORS.secondary,
  },
  pickerItemText: {
    fontSize: SIZES.body2,
    color: COLORS.black,
  },
  pickerItemTextSelected: {
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: COLORS.black,
    borderRadius: SIZES.smallRadius,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.darkGray,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: SIZES.body1,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 16,
  },
  toggleText: {
    color: COLORS.primary,
    fontSize: SIZES.body3,
    fontWeight: '500',
  },
});

export default AuthScreen;
