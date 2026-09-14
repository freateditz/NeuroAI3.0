# NeuroAi: Empowering Neurodiverse Learners

**NeuroAi** is an innovative web application designed to provide a personalized learning experience for neurodiverse students. By leveraging advanced technologies like speech recognition, AI-driven interactions, and 3D modeling, NeuroAi creates an engaging and supportive learning environment that caters to the unique educational needs and well-being of its users.

## Key Features

### AtoZ Learning with Visual and Auditory Support
- **Alphabet Learning**: Students learn the alphabet with corresponding words and images.
- **Pronunciation Diagnosis**: Focuses on identifying and diagnosing difficulties in pronouncing specific sounds.

### Speech Recognition and Pronunciation Training
- **Speech Analysis**: Utilizes speech recognition to monitor and analyze the student's pronunciation.
- **Tailored Feedback**: Provides personalized feedback to help students pronounce words correctly.
- **3D Mouth Modeling**: Displays a 3D model of the mouth, guiding students on proper articulation of sounds with step-by-step instructions.

### Confidence Building through Conversational AI
- **Generative AI Chatbot**: Engages students in real-time audio conversations on various topics.
- **Communication Skills Enhancement**: Helps improve communication skills and boosts the student's confidence.

## Unique Selling Points (USPs)
- **Personalized Learning Path**: Adapts educational content to each student’s individual needs, ensuring they receive the necessary support to succeed.
- **Speech Correction and Confidence Building**: Combines correct pronunciation training with confidence-building interactive conversations.
- **Advanced Technological Integration**: Employs cutting-edge technologies like speech recognition, 3D modeling, and generative AI to create an immersive learning environment.
- **Focus on Neurodiversity**: Specifically designed for neurodiverse students, addressing the challenges faced by students with various neurological conditions.

## Target Neurological Disorders

NeuroAi is tailored to support students with the following neurological and developmental conditions:

- **Autism Spectrum Disorder (ASD)**: Tailors content and interactions to meet the unique communication and learning needs of students with autism.
- **Dyslexia**: Focuses on speech and pronunciation, addressing common challenges in language processing.
- **Speech and Language Disorders**: Provides specialized tools and feedback for students with articulation and phonological disorders.
- **Attention Deficit Hyperactivity Disorder (ADHD)**: Creates engaging and interactive content to maintain focus and interest.

---

NeuroAi is more than just a learning platform; it's a comprehensive support system that empowers neurodiverse students to achieve their full potential.

## Project Structure

```
neuro-ai/
├── frontend/              # React web application
├── mobile-app/           # React Native mobile app
└── backend/
    ├── server/           # Node.js/Express backend (Auth, APIs, MongoDB)
    ├── phonemes-backend/ # Python ML service for phoneme detection
    └── streamlit-chatbot/# Python chatbot service
```

## Backend Architecture

### Node.js Backend (Port 5000)
- **Purpose**: Main application backend
- **Handles**: Authentication, user management, general APIs
- **Database**: MongoDB
- **Tech**: Express.js, JWT, Mongoose

### Python Services (ML-Only)
1. **Phoneme Detection** (Port 8001) - ML-based audio analysis
2. **Chatbot** (Port 8501) - NLP-powered conversational interface

## Getting Started

### 1. Start Node.js Backend
```bash
cd backend/server
npm install
cp .env.example .env
# Configure MongoDB URI and JWT secret in .env
npm run dev
```

### 2. Start Python Services (Optional - only for ML features)
```bash
# Phoneme Detection
cd backend/phonemes-backend
pip install -r requirements.txt
python main.py

# Chatbot
cd backend/streamlit-chatbot
pip install -r requirements.txt
streamlit run app.py
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Start Mobile App (Optional)
```bash
cd mobile-app
npm install
npm start
```

## Tech Stack

**Frontend**: React, TailwindCSS, Vite  
**Mobile**: React Native, Expo  
**Backend**: Node.js, Express, MongoDB  
**ML Services**: Python, FastAPI, Streamlit