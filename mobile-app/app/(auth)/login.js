import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-native-elements';

const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const result = await login(email, password);
    
    if (!result.success) {
      Alert.alert('Login Failed', result.error);
    }
    // Navigation will happen automatically via AuthContext state change
  };

  return (
    <View>
      <Text>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />

      {/* Signup Link */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Don't have an account?{" "}
        </Text>
        <Link href="/(auth)/signup" style={styles.link}>
          <Text style={styles.linkText}>Sign Up</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  footerText: {
    color: "#999",
    fontSize: 14,
  },
  link: {
    marginLeft: 4,
  },
  linkText: {
    color: "#6366f1",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default LoginScreen;