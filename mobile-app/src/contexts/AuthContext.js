import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

// UPDATED: Use production backend URL
const API_URL = "https://neuro-ai-3ipn.onrender.com/api";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadStoredAuth();
    }, []);

    const loadStoredAuth = async () => {
        try {
            const storedToken = await AsyncStorage.getItem("token");
            const storedUser = await AsyncStorage.getItem("user");

            if (storedToken && storedUser) {
                if (isValidTokenFormat(storedToken)) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                } else {
                    await clearAuth();
                }
            }
        } catch (err) {
            console.error("Error loading auth:", err);
            await clearAuth();
        } finally {
            setIsLoading(false);
        }
    };

    const isValidTokenFormat = (token) => {
        if (!token || typeof token !== "string") return false;

        const parts = token.split(".");
        if (parts.length !== 3) return false;

        try {
            const payload = JSON.parse(atob(parts[1]));
            if (payload.exp && payload.exp * 1000 < Date.now()) {
                return false;
            }
            return true;
        } catch {
            return false;
        }
    };

    const login = async (email, password) => {
        console.log("=== LOGIN ATTEMPT ===");
        console.log("Email:", email);
        console.log("API URL:", `${API_URL}/auth/login`);

        setIsLoading(true);
        setError(null);

        try {
            const requestBody = { email, password };
            console.log("Request body:", requestBody);

            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            console.log("Response status:", response.status);
            const data = await response.json();
            console.log("Response data:", data);

            if (!response.ok) {
                console.error("Login failed:", data.message);
                throw new Error(data.message || "Login failed");
            }

            // FIXED: Backend returns 'access_token' not 'token'
            const token = data.access_token || data.token;

            if (!token) {
                throw new Error("No token received from server");
            }

            // Store token and user data
            console.log("Storing token and user data...");
            console.log("Token:", token);
            console.log("User:", data.user);

            await AsyncStorage.setItem("token", token);
            await AsyncStorage.setItem("user", JSON.stringify(data.user));

            setToken(token);
            setUser(data.user);

            console.log("✅ LOGIN SUCCESSFUL");
            return { success: true };
        } catch (err) {
            const message = err.message || "Login failed. Please try again.";
            console.error("❌ LOGIN FAILED:", message);
            console.error("Error details:", err);
            setError(message);
            return { success: false, error: message };
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (
        name,
        email,
        password,
        phoneNumber,
        childAge,
        region,
        problemDescription
    ) => {
        console.log("=== SIGNUP ATTEMPT ===");
        console.log("Name:", name);
        console.log("Email:", email);
        console.log("API URL:", `${API_URL}/auth/register`);

        setIsLoading(true);
        setError(null);

        try {
            const requestBody = {
                name,
                email,
                password,
                phoneNumber,
                childAge,
                region,
                problemDescription,
            };
            console.log("Request body:", requestBody);

            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            console.log("Response status:", response.status);
            const data = await response.json();
            console.log("Response data:", data);

            if (!response.ok) {
                console.error("Signup failed:", data.message);
                throw new Error(data.message || "Signup failed");
            }

            // FIXED: Backend returns 'access_token' not 'token'
            const token = data.access_token || data.token;

            if (!token) {
                throw new Error("No token received from server");
            }

            // Store token and user data
            console.log("Storing token and user data...");
            await AsyncStorage.setItem("token", token);
            await AsyncStorage.setItem("user", JSON.stringify(data.user));

            setToken(token);
            setUser(data.user);

            console.log("✅ SIGNUP SUCCESSFUL");
            return { success: true };
        } catch (err) {
            const message = err.message || "Signup failed. Please try again.";
            console.error("❌ SIGNUP FAILED:", message);
            console.error("Error details:", err);
            setError(message);
            return { success: false, error: message };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        await clearAuth();
    };

    const clearAuth = async () => {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                isAuthenticated: !!token && !!user && isValidTokenFormat(token),
                login,
                signup,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};

export default AuthContext;
