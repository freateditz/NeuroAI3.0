// API Configuration
// Update this URL to match your backend server

// For local development:
// - Use your computer's local IP when testing on physical device
// - Use localhost or 10.0.2.2 for Android emulator
// - Use localhost for iOS simulator

const PROD_API_URL = 'https://neuro-ai-3ipn.onrender.com/api';
const DEV_API_URL = 'http://192.168.0.101:5000/api';

// Always use production URL
export const API_URL = PROD_API_URL;

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout', 
  PROFILE: '/auth/me',
};

console.log('API Configuration loaded');
console.log('API_URL:', API_URL);

export default API_URL;
