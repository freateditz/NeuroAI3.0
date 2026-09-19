# NeuroAI App

React Native (Expo) mobile app for the NeuroAI speech learning platform.

## Setup

```bash
cd "NeuroAI APP"
npm install
```

## Configure Backend URL

Open `src/config/api.js` and set `LOCAL_IP`:

- **Android emulator**: `10.0.2.2` (default — maps to host localhost)
- **iOS simulator**: `localhost`
- **Real device**: Your machine's LAN IP (e.g. `192.168.1.100`)

Both backends must be running:
- Node/Express on port 8000
- Flask AI on port 5002

## Run

```bash
npx expo start
# Press 'a' for Android emulator, 'i' for iOS simulator
```

## Features

| Screen | Description |
|--------|-------------|
| Home | Dashboard with stats, waveform, quick actions |
| Learn | 6 phoneme pair modules with AI-powered recording analysis |
| Test | Full 6-pair assessment with grade + AI remedy |
| Chat | AI chatbot with voice input + TTS |
| Articles | Speech therapy articles from backend |
| Profile | User stats, theme toggle, settings |

## Architecture

```
src/
├── config/api.js          # API URLs, all backend calls
├── contexts/
│   ├── ThemeContext.jsx   # Dark/light mode with AsyncStorage
│   └── AuthContext.jsx    # Auth state with AsyncStorage
├── navigation/
│   ├── RootNavigator.jsx  # Auth vs Main routing
│   └── MainNavigator.jsx  # Bottom tab navigator
├── screens/
│   ├── auth/              # Onboarding, Login, Signup
│   └── main/              # Home, Learn, Test, Chat, Articles, Profile
└── components/
    ├── GlassCard.jsx      # Theme-aware card (glass/neumorphic)
    ├── WaveformBars.jsx   # Animated EQ bars
    ├── ThemeToggle.jsx    # Animated pill toggle
    └── AudioRecorder.jsx  # expo-av recording hook
```
