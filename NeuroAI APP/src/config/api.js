import axios from 'axios';
import * as FileSystem from 'expo-file-system';

// Returns a local file URI ready for expo-audio player.replace({ uri })


// Your Mac's LAN IP — shown in `npx expo start` QR output (exp://X.X.X.X:8081)
// Change this if your IP changes (router reassignment, new network, etc.)
export const LOCAL_IP = '192.168.0.231';

export const NODE_URL = `http://${LOCAL_IP}:8000`;
export const FLASK_URL = `http://${LOCAL_IP}:5002`;

export const nodeApi = axios.create({
  baseURL: NODE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export const flaskApi = axios.create({
  baseURL: FLASK_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

export const LETTER_WORDS = {
  A: { word: 'Apple', phonetic: '/ˈæp.əl/', emoji: '🍎' },
  B: { word: 'Ball', phonetic: '/bɔːl/', emoji: '⚽' },
  C: { word: 'Cat', phonetic: '/kæt/', emoji: '🐱' },
  D: { word: 'Dog', phonetic: '/dɔːɡ/', emoji: '🐕' },
  E: { word: 'Elephant', phonetic: '/ˈel.ɪ.fənt/', emoji: '🐘' },
  F: { word: 'Fish', phonetic: '/fɪʃ/', emoji: '🐠' },
  G: { word: 'Goat', phonetic: '/ɡoʊt/', emoji: '🐐' },
  H: { word: 'Hat', phonetic: '/hæt/', emoji: '🎩' },
  I: { word: 'Ice', phonetic: '/aɪs/', emoji: '🧊' },
  J: { word: 'Juice', phonetic: '/dʒuːs/', emoji: '🧃' },
  K: { word: 'Kite', phonetic: '/kaɪt/', emoji: '🪁' },
  L: { word: 'Lion', phonetic: '/ˈlaɪ.ən/', emoji: '🦁' },
  M: { word: 'Moon', phonetic: '/muːn/', emoji: '🌙' },
  N: { word: 'Nose', phonetic: '/noʊz/', emoji: '👃' },
  O: { word: 'Orange', phonetic: '/ˈɔː.rɪndʒ/', emoji: '🍊' },
  P: { word: 'Pen', phonetic: '/pen/', emoji: '🖊️' },
  Q: { word: 'Queen', phonetic: '/kwiːn/', emoji: '👑' },
  R: { word: 'Rabbit', phonetic: '/ˈræb.ɪt/', emoji: '🐰' },
  S: { word: 'Sun', phonetic: '/sʌn/', emoji: '☀️' },
  T: { word: 'Tree', phonetic: '/triː/', emoji: '🌳' },
  U: { word: 'Umbrella', phonetic: '/ʌmˈbrel.ə/', emoji: '☂️' },
  V: { word: 'Van', phonetic: '/væn/', emoji: '🚐' },
  W: { word: 'Water', phonetic: '/ˈwɔː.tər/', emoji: '💧' },
  X: { word: 'Xylophone', phonetic: '/ˈzaɪ.lə.foʊn/', emoji: '🎹' },
  Y: { word: 'Yellow', phonetic: '/ˈjel.oʊ/', emoji: '💛' },
  Z: { word: 'Zebra', phonetic: '/ˈziː.brə/', emoji: '🦓' },
};

export const COURSES = [
  { id: 1, phoneme1: 'V', phoneme2: 'B', title: 'V vs B', color: '#6366f1' },
  { id: 2, phoneme1: 'P', phoneme2: 'F', title: 'P vs F', color: '#7dd3fc' },
  { id: 3, phoneme1: 'T', phoneme2: 'D', title: 'T vs D', color: '#c4b5fd' },
  { id: 4, phoneme1: 'S', phoneme2: 'Sh', title: 'S vs Sh', color: '#2dd4bf' },
  { id: 5, phoneme1: 'F', phoneme2: 'Th', title: 'F vs Th', color: '#86efac' },
  { id: 6, phoneme1: 'L', phoneme2: 'R', title: 'L vs R', color: '#fde68a' },
];

export const analyzeAudio = async (audioUri, expectedWord, phoneme1, phoneme2) => {
  const formData = new FormData();
  formData.append('audio', {
    uri: audioUri,
    type: 'audio/m4a',
    name: 'recording.m4a',
  });
  formData.append('expected_word', expectedWord);
  if (phoneme1) formData.append('phoneme1', phoneme1);
  if (phoneme2) formData.append('phoneme2', phoneme2);

  const response = await axios.post(`${FLASK_URL}/analyze-phoneme`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 30000,
  });
  return response.data;
};

export const getRemedy = async (percentage, p1, p2) => {
  const response = await flaskApi.post('/get-remedy', {
    percentage,
    phoneme1: p1,
    phoneme2: p2,
  });
  return response.data;
};

export const playTTS = async (text) => {
  const response = await axios.post(
    `${FLASK_URL}/tts`,
    { text },
    { responseType: 'arraybuffer', timeout: 20000 }
  );
  const base64 = btoa(
    new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
  const fileUri = FileSystem.cacheDirectory + `tts_${Date.now()}.mp3`;
  await FileSystem.writeAsStringAsync(fileUri, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return fileUri;
};

export const loginUser = async (email, password) => {
  const response = await nodeApi.post('/api/auth/login', { email, password });
  return response.data;
};

export const registerUser = async (name, email, password) => {
  const response = await nodeApi.post('/api/auth/register', { name, email, password });
  return response.data;
};

export const getProfile = async (token) => {
  const response = await nodeApi.get('/api/users/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateProgress = async (token, data) => {
  const response = await nodeApi.post('/api/users/progress', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchArticles = async (token) => {
  const response = await nodeApi.get('/api/articles', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

export const sendChatMessage = async (messages) => {
  const response = await flaskApi.post('/chat', { messages });
  return response.data;
};

export const transcribeAudio = async (audioUri) => {
  const formData = new FormData();
  formData.append('audio', {
    uri: audioUri,
    type: 'audio/m4a',
    name: 'voice.m4a',
  });
  const response = await axios.post(`${FLASK_URL}/transcribe`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 20000,
  });
  return response.data;
};
