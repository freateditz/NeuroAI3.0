from flask import Flask, jsonify, request
import os
import io
import re
import logging
from flask_cors import CORS
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Configure CORS
_allowed_origins = [
    r"https?://localhost:\d+",
    r"https?://127\.0\.0\.1:\d+",
    r"https://.*\.vercel\.app",
    r"https://.*\.onrender\.com",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:3000",
]
_frontend_url = os.getenv("FRONTEND_URL")
if _frontend_url:
    if _frontend_url == "*":
        _allowed_origins = "*"
    else:
        for url in _frontend_url.split(","):
            u = url.strip()
            if u:
                _allowed_origins.append(u)

CORS(app,
     origins=_allowed_origins,
     supports_credentials=True,
     methods=["GET", "POST", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"])

# Load environment variables
load_dotenv()
ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY')
OPEN_API_KEY = os.getenv('OPEN_API_KEY') or os.getenv('GROQ_API_KEY')

# Initialize ElevenLabs client
client = ElevenLabs(api_key=ELEVENLABS_API_KEY) if ELEVENLABS_API_KEY else None

# Validate API key
if not ELEVENLABS_API_KEY:
    logger.warning("ELEVENLABS_API_KEY not found in environment variables!")
SOUND_REFERENCE = {
    'A': 'E',
    'B': 'V',
    'C': 'K',
    'D': 'T',
    'F': 'TH',
    'L': 'R',
    'P': 'F',
    'S': 'SH',
    'T': 'D',
    'Z': 'S'
}

IMAGE = {
    'A': 'https://cdn-icons-png.flaticon.com/512/415/415733.png',
    'B': 'https://cdn-icons-png.flaticon.com/512/33/33736.png',
    'C': 'https://cdn-icons-png.flaticon.com/512/616/616430.png',
    'D': 'https://cdn-icons-png.flaticon.com/512/616/616408.png',
    'F': 'https://cdn-icons-png.flaticon.com/512/616/616421.png',
    'L': 'https://cdn-icons-png.flaticon.com/512/616/616412.png',
    'P': 'https://cdn-icons-png.flaticon.com/512/1250/1250615.png',
    'S': 'https://cdn-icons-png.flaticon.com/512/869/869869.png',
    'T': 'https://cdn-icons-png.flaticon.com/512/489/489969.png',
    'Z': 'https://cdn-icons-png.flaticon.com/512/616/616427.png'
}

PRONUNCIATION = {
    "apple": "ˈæp.əl",
    "ball": "bɔːl",
    "boat": "boʊt",
    "cat": "kæt",
    "dog": "dɒɡ",
    "fish": "fɪʃ",
    "free": "friː",
    "lion": "ˈlaɪ.ən",
    "love": "lʌv",
    "pen": "pen",
    "sun": "sʌn",
    "sunday": "sʌn.deɪ",
    "tree": "triː",
    "zebra": "ˈziː.brə"
}

# Short 2-3 word phrases that emphasize each phoneme's sound in natural context
PHRASES = {
    'A': 'An apple a day',
    'B': 'Big blue ball',
    'C': 'Cool cat sits',
    'D': 'Dog digs deep',
    'F': 'Five fish swim',
    'L': 'Little lion leaps',
    'P': 'Pink pen please',
    'S': 'Sun sets slowly',
    'T': 'Two tall trees',
    'Z': 'Zebra zips away'
}

PHRASE_PRONUNCIATION = {
    'A': 'æn ˈæp.əl ə deɪ',
    'B': 'bɪɡ bluː bɔːl',
    'C': 'kuːl kæt sɪts',
    'D': 'dɒɡ dɪɡz diːp',
    'F': 'faɪv fɪʃ swɪm',
    'L': 'ˈlɪt.əl ˈlaɪ.ən liːps',
    'P': 'pɪŋk pen pliːz',
    'S': 'sʌn sets ˈsloʊ.li',
    'T': 'tuː tɔːl triːz',
    'Z': 'ˈziː.brə zɪps əˈweɪ'
}

LETTERS = ['A', 'B', 'C', 'D', 'F', 'L', 'P', 'S', 'T', 'Z']

EXAMPLE = {
    'A': 'apple',
    'B': 'ball',
    'C': 'cat',
    'D': 'dog',
    'F': 'fish',
    'L': 'lion',
    'P': 'pen',
    'S': 'sun',
    'T': 'tree',
    'Z': 'zebra'
}

PHONETIC_VARIANTS = {
    "apple": ["apple", "apel", "appl", "aepple", "apul", "aple"],
    "ball": ["ball", "bal", "boll", "bol", "bahl", "baall"],
    "boat": ["boat", "bot", "bote", "boaut"],
    "cat": ["cat", "kat", "catt", "kaat"],
    "dog": ["dog", "dogg", "daug", "dawg"],
    "fish": ["fish", "fissh", "phish", "fisc"],
    "free": ["free", "frii", "fre"],
    "lion": ["lion", "liun", "lyon", "lionn"],
    "love": ["love", "luv", "lov"],
    "pen": ["pen", "penn", "pan"],
    "sun": ["sun", "son", "sunn"],
    "sunday": ["sunday", "sundae", "sundai"],
    "tree": ["tree", "trii", "tre"],
    "zebra": ["zebra", "zeebra", "zibra"]
}


REMEDY = {
    'P': ['Put your lips together to make the sound. Vocal cords don’t vibrate for voiceless sounds.'],
    'B': ['Put your lips together to make the sound.'],
    'B2': ['Put your lips together to make the sound.'],
    'M': ['Put your lips together to make the sound. Air flows through your nose.'],
    'W': ['Put your lips together and shape your mouth like you are saying "oo".'],
    'F': ['Place your bottom lip against your upper front teeth. Top teeth may be on your bottom lip.'],
    'V': ['Place your bottom lip against your upper front teeth. Top teeth may be on your bottom lip.'],
    'S': ["Keep your teeth close together to make the sound. The ridge right behind your two front teeth is involved. The front of your tongue is used. Vocal cords don’t vibrate for voiceless sounds."],
    'Z': ['Keep your teeth close together to make the sound. The ridge right behind your two front teeth is involved. The front of your tongue is used.'],
    'th': ['Place your top teeth on your bottom lip and let your tongue go between your teeth for the sound. The front of your tongue is involved.'],
    'TH': ['Place your top teeth on your bottom lip and let your tongue go between your teeth for the sound (as in thin). The front of your tongue is involved. The front of your tongue is used.'],
    'NG': ['Air flows through your nose.'],
    'SING': ['Air flows through your nose.'],
    'L': ['The ridge right behind your two front teeth is involved. The front of your tongue is used.'],
    'T': ["The ridge right behind your two front teeth is involved. The front of your tongue is used. Vocal cords don’t vibrate for voiceless sounds."],
    'D': ['The ridge right behind your two front teeth is involved. The front of your tongue is used.'],
    'CH': ['The front-roof of your mouth is the right spot for the sound. The front of your tongue is used.'],
    'J': ['The front-roof of your mouth is the right spot for the sound. The front of your tongue is used.'],
    'SH': ['The front-roof of your mouth is the right spot for the sound. The front of your tongue is used.'],
    'ZH': ['The front-roof of your mouth is the right spot for the sound. The front of your tongue is used.'],
    'K': ["The back-roof of your mouth is the right spot for the sound. The back of your tongue is used. Vocal cords don’t vibrate for voiceless sounds."],
    'G': ['The back-roof of your mouth is the right spot for the sound. The back of your tongue is used.'],
    'R': ['The back-roof of your mouth is the right spot for the sound. The back of your tongue is used.'],
    'Y': ['The front of your tongue is used.'],
    'H': ['Your lungs provide the airflow for every sound, especially this one.'],
    'A': [
        'Open your mouth wide with your tongue flat at the bottom, as in "apple".',
        'Open your mouth wide and pull your tongue back slightly, as in "father".'
    ]  # Added remedies for 'A'
}

DEV_MAP = {
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo',
    'ए': 'e', 'ऐ': 'a', 'ओ': 'o', 'औ': 'au', 'ऋ': 'ri',
    'ा': 'a', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo',
    'े': 'e', 'ै': 'a', 'ो': 'o', 'औ': 'au', 'ॉ': 'o', 'ॅ': 'a',
    'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
    'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'n',
    'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
    'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
    'प': 'p', 'फ': 'f', 'ब': 'b', 'भ': 'bh', 'म': 'm',
    'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
    'क़': 'q', 'ख़': 'kh', 'ग़': 'gh', 'ज़': 'z', 'ड़': 'd', 'ढ़': 'dh', 'फ़': 'f',
    '्': '', 'ँ': 'n', 'ं': 'n', 'ः': 'h'
}

KNOWN_HINDI_WORDS = {
    'बैट': 'bat',
    'बॉट': 'boat',
    'बोट': 'boat',
    'बॉल': 'ball',
    'बाल': 'ball',
    'पेन': 'pen',
    'ट्री': 'tree',
    'लव': 'love',
    'एप्पल': 'apple',
    'ऐप्पल': 'apple',
    'फ्री': 'free',
    'संडे': 'sunday',
    'ज़ेब्रा': 'zebra',
    'जेब्रा': 'zebra'
}

def has_devanagari(text):
    return any('\u0900' <= c <= '\u097f' for c in text)

def devanagari_to_latin(text):
    if not text:
        return text
    clean_text = text.strip()
    if clean_text in KNOWN_HINDI_WORDS:
        return KNOWN_HINDI_WORDS[clean_text]
    result = []
    i = 0
    while i < len(text):
        if i + 1 < len(text) and text[i:i+2] in DEV_MAP:
            result.append(DEV_MAP[text[i:i+2]])
            i += 2
        elif text[i] in DEV_MAP:
            result.append(DEV_MAP[text[i]])
            i += 1
        else:
            result.append(text[i])
            i += 1
    return ''.join(result).strip()

def normalize_phonetics(s):
    if not s:
        return s
    import re
    s = s.lower()
    # collapse duplicate letters
    s = re.sub(r'(.)\1+', r'\1', s)
    # remove silent final e
    if len(s) > 2 and s.endswith('e'):
        s = s[:-1]
    # normalize common vowel digraphs
    s = s.replace('oa', 'o').replace('ou', 'u').replace('ee', 'i').replace('ea', 'i').replace('oo', 'u')
    return s

def levenshtein_distance(s1, s2):
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)

    if len(s2) == 0:
        return len(s1)

    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row

    return previous_row[-1]

# Noise/ambient-sound words and phrases that are NOT real speech attempts
NOISE_WORDS = {
    '', 'uh', 'um', 'hmm', 'hm', 'ah', 'oh', 'eh', 'er', 'ugh',
    'click', 'pop', 'bang', 'creak', 'noise', 'sound', 'door', 'thud',
    'tap', 'knock', 'beep', 'buzz', 'hiss', 'wind', 'static',
    'clears', 'throat', 'cough', 'coughing', 'sigh', 'sighs', 'sighing',
    'background', 'noise', 'applause', 'laughter', 'cheering', 'whistling',
    'snort', 'snorting', 'snicker', 'silence', 'gasp', 'gasping',
    'think', 'meaning', 'subtitles', 'watching', 'thank', 'thanks', 'bye', 'hello'
}

# Common ASR hallucination phrases on low-volume / noise-padded short audio
HALLUCINATED_PHRASES = {
    'i think', 'i think so', 'i mean', 'you know', 'thank you', 'thanks',
    'subtitles', 'subtitles by', 'thank you for watching', 'thanks for watching',
    'bye', 'hello', 'ok', 'okay', 'like', 'yeah', 'yes', 'no', 'so'
}

def _normalize_text(text):
    """Normalize text for comparison: lowercase, remove punctuation, strip."""
    if has_devanagari(text):
        text = devanagari_to_latin(text)
    text = text.lower().strip()
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text


def _score_single_word(target, transcribed):
    """Score a single target word against transcribed text. Returns (is_correct, accuracy)."""
    if target == transcribed:
        return True, 100
    if target in transcribed.split():
        return True, 100

    distance = levenshtein_distance(target, transcribed)
    max_len = max(len(target), len(transcribed))
    accuracy = max(0, int((1 - distance / max_len) * 100))

    target_phonetic = normalize_phonetics(target)
    transcribed_phonetic = normalize_phonetics(transcribed)
    if target_phonetic == transcribed_phonetic:
        accuracy = max(accuracy, 95)

    known_variants = PHONETIC_VARIANTS.get(target, [])
    if transcribed in known_variants:
        accuracy = max(accuracy, 95)
    for tw in transcribed.split():
        if tw in known_variants:
            accuracy = max(accuracy, 90)

    if transcribed and target and transcribed[0] == target[0] and distance <= 2:
        accuracy = max(accuracy, 85)
    if len(transcribed) >= 3 and (transcribed in target or target in transcribed):
        accuracy = max(accuracy, 80)

    return accuracy >= 80, accuracy


def _score_phrase(target_phrase, transcribed):
    """
    Word-level scoring for multi-word phrases.
    Matches each significant target word against any transcribed word using Levenshtein.
    Returns (is_correct, accuracy).
    """
    target_words = [w for w in target_phrase.split() if len(w) >= 3]
    transcribed_words = transcribed.split()

    if not target_words:
        return _score_single_word(target_phrase, transcribed)

    matched = 0
    for tw in target_words:
        best_sim = 0
        for rw in transcribed_words:
            dist = levenshtein_distance(tw, rw)
            max_l = max(len(tw), len(rw))
            sim = max(0, (1 - dist / max_l)) * 100 if max_l else 0
            best_sim = max(best_sim, sim)
        # Check phonetic variants too
        if tw in PHONETIC_VARIANTS:
            for variant in PHONETIC_VARIANTS[tw]:
                if variant in transcribed_words:
                    best_sim = max(best_sim, 95)
        if best_sim >= 65:
            matched += 1

    accuracy = int((matched / len(target_words)) * 100)
    is_correct = accuracy >= 55
    return is_correct, accuracy


def verify_word(target_word, transcribed_text):
    """
    Normalizes and compares the transcribed text with the target word or phrase.
    Handles both single words and multi-word phrases.
    Returns (is_correct, accuracy).
    """
    # Pre-strip bracketed annotation text like [clears throat] or [background noise]
    transcribed_clean = re.sub(r'\[.*?\]', '', transcribed_text).strip()
    if not transcribed_clean and transcribed_text:
        logger.info(f"[VERIFY] Raw transcription '{transcribed_text}' was entirely bracketed noise — returning 0%")
        return False, 0

    target = _normalize_text(target_word)
    transcribed = _normalize_text(transcribed_clean if transcribed_clean else transcribed_text)

    logger.info(f"Verification - Target: '{target}', Transcribed: '{transcribed}'")

    if not target or not transcribed:
        return False, 0

    # Reject ASR hallucinations and noise-only transcriptions immediately
    transcribed_words = set(transcribed.split())
    if transcribed in HALLUCINATED_PHRASES or transcribed_words.issubset(NOISE_WORDS):
        logger.info(f"[VERIFY] Transcription '{transcribed}' identified as noise/hallucination — returning 0%")
        return False, 0

    # Route to phrase scoring (>1 word) or single-word scoring
    if len(target.split()) > 1:
        return _score_phrase(target, transcribed)
    else:
        return _score_single_word(target, transcribed)

@app.route('/record', methods=["POST"])
def record():
    logger.info("[FLASK] Request received at /record")
    try:
        # Check if audio file and target word are in the request
        if 'audio' not in request.files:
            logger.error("[FLASK] No audio file provided in request")
            return jsonify({"error": "No audio file provided"}), 400

        target_word = request.form.get('targetWord')
        logger.info(f"[FLASK] targetWord received: {target_word}")
        if not target_word:
            logger.error("[FLASK] No targetWord provided in request")
            return jsonify({"error": "No target word provided"}), 400

        audio_file = request.files['audio']
        logger.info(f"[FLASK] audio received: {audio_file.filename}, content_type: {audio_file.content_type}")

        if audio_file.filename == '':
            return jsonify({"error": "No audio file selected"}), 400

        # Determine correct file extension based on filename / content type
        ext = ".webm"
        if audio_file.filename and '.' in audio_file.filename:
            ext = os.path.splitext(audio_file.filename)[1].lower()
        elif audio_file.content_type:
            if "mp4" in audio_file.content_type:
                ext = ".mp4"
            elif "wav" in audio_file.content_type:
                ext = ".wav"
            elif "ogg" in audio_file.content_type:
                ext = ".ogg"

        # Save the uploaded audio file with correct extension
        filename = f"temp_audio{ext}"
        audio_file.save(filename)
        logger.info(f"[FLASK] Audio file saved as {filename}")

        # ── NOISE GUARD: reject recordings that are too short (< 3 KB = silent/noise) ──
        audio_size = os.path.getsize(filename)
        logger.info(f"[FLASK] Audio file size: {audio_size} bytes")
        if audio_size < 3000:
            logger.warning(f"[FLASK] Audio too short ({audio_size} bytes) — treating as silence")
            return jsonify({
                "success": True,
                "transcript": "",
                "isCorrect": False,
                "accuracy": 0,
                "note": "Recording too short or silent — please speak clearly and hold the button longer."
            })

        # Initialize ElevenLabs client if not already done
        if not client:
            logger.error("[FLASK] ElevenLabs client not initialized")
            return jsonify({"error": "ElevenLabs API key not configured"}), 500

        # Transcribe audio using ElevenLabs with keyword biasing toward target word and all phonetic variants
        logger.info("[ELEVENLABS] API request started with language_code='en', tag_audio_events=False, and keyterms")
        with open(filename, "rb") as file:
            target_lower = target_word.lower()
            target_cap = target_word.capitalize()
            target_upper = target_word.upper()
            variants = PHONETIC_VARIANTS.get(target_lower, [])
            keyterms_list = list(set([target_lower, target_cap, target_upper] + variants))

            transcription = client.speech_to_text.convert(
                file=file,
                model_id="scribe_v2",
                language_code="en",
                tag_audio_events=False,
                keyterms=keyterms_list
            )

        # transcription.text holds the result
        transcribed_text = transcription.text if hasattr(transcription, 'text') else str(transcription)
        transcribed_text = transcribed_text.strip()

        logger.info(f"[ELEVENLABS] Raw Transcription: '{transcribed_text}'")

        # Reject clearly empty transcriptions
        if not transcribed_text:
            logger.warning("[FLASK] Empty transcription from ElevenLabs")
            return jsonify({
                "success": True,
                "transcript": "",
                "isCorrect": False,
                "accuracy": 0,
                "note": "Could not detect any speech. Please speak louder and more clearly."
            })

        # If transcription is in Devanagari/Hindi, transliterate it to Latin English
        if has_devanagari(transcribed_text):
            latin_converted = devanagari_to_latin(transcribed_text)
            logger.info(f"[TRANSLITERATE] Converted Devanagari '{transcribed_text}' -> '{latin_converted}'")
            transcribed_text = latin_converted

        logger.info(f"[VERIFY] Transcription: '{transcribed_text}', Target: '{target_word}'")
        # Verify transcription
        is_correct, accuracy = verify_word(target_word, transcribed_text)
        logger.info(f"[VERIFY] Result - Correct: {is_correct}, Accuracy: {accuracy}")

        logger.info("[RESPONSE] Returning final JSON result")
        return jsonify({
            "success": True,
            "transcript": transcribed_text,
            "isCorrect": is_correct,
            "accuracy": accuracy
        })

    except Exception as e:
        logger.error(f"[RESPONSE] Error in record endpoint: {str(e)}", exc_info=True)
        return jsonify({"error": str(e), "stage": "flask-backend"}), 500


@app.route("/remedy/<letter>/<int:averagePercentage>", methods=["GET", "POST"])
def remedy(letter, averagePercentage):
    """Return remediation tips for a given letter and accuracy percentage."""
    try:
        letter_upper = letter.upper()
        if averagePercentage <= 50:
            remedy_text = REMEDY.get(letter_upper, ["Practice the pronunciation more carefully and speak slowly."])
            result = {"remedy": remedy_text, "letter": letter_upper}
        else:
            result = {"remedy": [], "letter": letter_upper}
        return jsonify(result)
    except Exception as e:
        print(f"Error in remedy endpoint: {e}")
        return jsonify({"error": str(e)}), 500


# Legacy endpoint — kept for backward compatibility, letter resolved from query param
@app.route("/remedy/<int:averagePercentage>", methods=["GET", "POST"])
def remedy_legacy(averagePercentage):
    letter = request.args.get('letter', 'A').upper()
    try:
        if averagePercentage <= 50:
            remedy_text = REMEDY.get(letter, ["Practice the pronunciation more carefully."])
            result = {"remedy": remedy_text, "letter": letter}
        else:
            result = {"remedy": [], "letter": letter}
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Health check endpoint
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "service": "phonemes-backend",
        "port": 5002,
        "elevenlabs_configured": bool(ELEVENLABS_API_KEY),
        "groq_configured": bool(OPEN_API_KEY)
    })


# Get all available letters
@app.route("/letters", methods=["GET"])
def get_letters():
    return jsonify({
        "letters": LETTERS,
        "examples": EXAMPLE
    })


@app.route("/test/<lettergiven>")
def test(lettergiven):
    letter = lettergiven.upper()
    try:
        example_word = EXAMPLE.get(letter)
        if not example_word:
            return jsonify({"error": f"No example found for letter {letter}"}), 404

        word_data = {
            "word1": example_word,
            "letter": letter,
            "pronunciation": PRONUNCIATION.get(example_word, ""),
            "image_link": IMAGE.get(letter, ""),
            "phrase": PHRASES.get(letter, example_word),
            "phrase_pronunciation": PHRASE_PRONUNCIATION.get(letter, ""),
        }
        return jsonify(word_data)
    except Exception as e:
        print(f"Error in test endpoint: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/generate_word/<lettergiven>")
def generate_word(lettergiven):
    letter = lettergiven.upper()
    try:
        example_word = EXAMPLE.get(letter)
        if not example_word:
            return jsonify({"error": f"No example found for letter {letter}"}), 404

        word_data = {
            "word1": example_word,
            "letter": letter,
            "pronunciation": PRONUNCIATION.get(example_word, ""),
            "phrase": PHRASES.get(letter, example_word),
            "phrase_pronunciation": PHRASE_PRONUNCIATION.get(letter, ""),
        }
        return jsonify(word_data)
    except Exception as e:
        print(f"Error in generate_word endpoint: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/tts', methods=['POST'])
def text_to_speech():
    data = request.get_json()
    text = data.get('text', '').strip()
    if not text:
        return jsonify({"error": "No text provided"}), 400
    try:
        audio_generator = client.text_to_speech.convert(
            voice_id="21m00Tcm4TlvDq8ikWAM",
            model_id="eleven_multilingual_v2",
            text=text,
            voice_settings={
                "stability": 0.5,
                "similarity_boost": 0.75,
                "style": 0.0,
                "use_speaker_boost": True
            }
        )
        audio_bytes = b"".join(audio_generator)
        return Response(audio_bytes, mimetype='audio/mpeg')
    except Exception as e:
        print(f"TTS error: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5002))  # Use PORT from Render or default to 5002
    app.run(host="0.0.0.0", port=port, debug=False)  # Bind to 0.0.0.0 for production
