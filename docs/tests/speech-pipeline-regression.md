# Regression Test Plan: Speech Recording & Verification Pipeline

This document outlines the expected behavior and regression test cases for the speech-to-text verification pipeline in NeuroAI 2.0.

## 1. Pipeline Behavioral Specifications

| Step | Process | Expected Behavior |
| :--- | :--- | :--- |
| **1** | **Start Recording** | `navigator.mediaDevices.getUserMedia` requested $\rightarrow$ `MediaRecorder` initialized $\rightarrow$ `recorder.start()` called. UI replaces `Mic` component with `RecordingLoader`. |
| **2** | **Stop Recording** | `mediaRecorder.stop()` called $\rightarrow$ all media tracks stopped. UI replaces `RecordingLoader` with `Mic` component. |
| **3** | **Audio Upload** | `chunks` aggregated into `Blob` (`audio/wav`) $\rightarrow$ `FormData` containing `audio` (file) and `targetWord` (string) $\rightarrow$ `POST /api/test/record` sent to Node backend. |
| **4** | **Transcription** | Node proxy forwards to Flask `/record` $\rightarrow$ Flask calls ElevenLabs `speech_to_text.convert` with `model_id="scribe_v2"` $\rightarrow$ API returns raw text transcription. |
| **5** | **Normalization** | Both `targetWord` and `transcribed_text` are processed: Lowercase $\rightarrow$ Trim $\rightarrow$ Remove non-alphanumeric characters (excluding whitespace) $\rightarrow$ Collapse multiple spaces to single space. |
| **6** | **Accuracy Calc** | Levenshtein distance calculated between normalized strings. $\text{Accuracy} = \max(0, \text{int}((1 - \frac{\text{distance}}{\max(\text{len1, len2})}) \times 100))$. |
| **7** | **Determination** | If $\text{Accuracy} \ge 90\% \rightarrow$ `isCorrect = true`. Otherwise $\rightarrow$ `isCorrect = false`. |
| **8** | **Attempt Creation** | `POST /api/courses/:id/lessons/:num/attempt` called $\rightarrow$ `accuracy` stored in `CourseProgress` attempts array. |
| **9** | **Attempt Number** | Determined by `attempts.length + 1` at the time of saving in the database. |
| **10** | **Stats Update** | `averageAccuracy` recalculated as $\frac{\sum \text{accuracies}}{\text{total attempts}}$. `setProgress` updates React state to reflect new average and attempt count. |
| **11** | **UI Result Display** | Result card appears showing: Target Word, "You said" (transcription), Accuracy %, Result (Correct/Incorrect), and Attempt number. |

## 2. Critical Test Cases

### Happy Path & Functional Tests
| Case | Input | Expected Outcome |
| :--- | :--- | :--- |
| **Exact Match** | Target: "Apple", Speak: "Apple" | Accuracy: 100%, Result: Correct, Attempt incremented, UI updated. |
| **Near Match** | Target: "Apple", Speak: "Apple." | Accuracy: $\ge 90\%$, Result: Correct (due to normalization), UI updated. |
| **Mismatch** | Target: "Apple", Speak: "Banana" | Accuracy: Low, Result: Incorrect, Attempt incremented, UI updated. |
| **Repeated Attempts** | 3x "Apple" | Attempt 1 $\rightarrow$ 2 $\rightarrow$ 3. Average accuracy updated after each save. |

### Edge Cases & Error Handling
| Case | Scenario | Expected Outcome |
| :--- | :--- | :--- |
| **Empty Recording** | Click Start $\rightarrow$ Click Stop immediately | Backend returns 400 or 0% accuracy $\rightarrow$ UI shows "Failed to process speech" or 0% accuracy. |
| **ElevenLabs Failure** | API returns error or timeout | Flask returns 500 $\rightarrow$ Node returns 500 $\rightarrow$ UI shows "Failed to process speech". |
| **Missing API Key** | `ELEVENLABS_API_KEY` removed from `.env` | Flask returns 500 ("API key not configured") $\rightarrow$ UI shows "Failed to process speech". |
| **Backend Down** | Node or Flask server stopped | Network fetch failure $\rightarrow$ Catch block triggered $\rightarrow$ UI shows "Failed to process speech". |
| **Permission Denied** | Mic access blocked by user | `getUserMedia` throws error $\rightarrow$ UI shows "Could not access microphone". |

## 3. Verification Checklist
- [ ] Recording starts and stops correctly.
- [ ] Audio file is successfully forwarded from Node to Flask.
- [ ] `scribe_v2` model is used for transcription.
- [ ] Normalization removes punctuation and handles casing.
- [ ] Accuracy is calculated numerically via Levenshtein distance.
- [ ] Every attempt (correct or incorrect) is saved to the database.
- [ ] UI updates immediately without page refresh.
- [ ] Average accuracy matches the mathematical mean of attempts.
