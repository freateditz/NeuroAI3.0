import axios from 'axios';
import * as FileSystem from 'expo-file-system';

export const NODE_URL = 'https://neuroai3-0-backend.onrender.com';
export const PHONEMES_URL = 'https://neuroai3-0-phonemes.onrender.com';

export const nodeApi = axios.create({
  baseURL: NODE_URL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

export const phonemesApi = axios.create({
  baseURL: PHONEMES_URL,
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

// Analyzes audio — phonemes backend /record endpoint.
// Returns normalised shape: { percentage, transcription, isCorrect, feedback }
export const analyzeAudio = async (audioUri, expectedWord) => {
  const formData = new FormData();
  formData.append('audio', {
    uri: audioUri,
    type: 'audio/m4a',
    name: 'recording.m4a',
  });
  formData.append('targetWord', expectedWord);

  const response = await axios.post(`${PHONEMES_URL}/record`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 30000,
  });

  const d = response.data;
  return {
    percentage: d.accuracy ?? 0,
    transcription: d.transcript ?? '',
    isCorrect: d.isCorrect ?? false,
    feedback: d.note ?? null,
  };
};

// Fetches AI remedy tips for a phoneme letter at a given accuracy percentage.
export const getRemedy = async (percentage, p1) => {
  const letter = p1 || 'S';
  const pct = Math.round(percentage);
  const response = await phonemesApi.get(`/remedy/${letter}/${pct}`);
  const d = response.data;
  const remedyText = Array.isArray(d.remedy) ? d.remedy.join(' ') : (d.remedy || 'Keep practicing every day!');
  return { remedy: remedyText };
};

// Returns a local file URI for playback via expo-audio.
export const playTTS = async (text) => {
  const response = await axios.post(
    `${PHONEMES_URL}/tts`,
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

// Chat goes through Node backend /api/chat (Groq-powered).
// Returns { reply } for use in ChatbotScreen.
export const sendChatMessage = async (messages) => {
  const response = await nodeApi.post('/api/chat', { messages });
  const d = response.data;
  return { reply: d.content || d.reply || d.message || 'I understand. Keep practicing!' };
};

// Transcribes voice by sending to /record with a placeholder targetWord.
// Only the transcript field is used; accuracy is discarded.
export const transcribeAudio = async (audioUri) => {
  const formData = new FormData();
  formData.append('audio', {
    uri: audioUri,
    type: 'audio/m4a',
    name: 'voice.m4a',
  });
  formData.append('targetWord', 'hello');

  const response = await axios.post(`${PHONEMES_URL}/record`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 20000,
  });
  return { transcription: response.data.transcript || '' };
};
