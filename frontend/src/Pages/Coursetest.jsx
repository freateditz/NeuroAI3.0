import { useEffect, useState, useRef } from "react";
import RecordButton from "../Components/RecordButton";
import Mic from "../Components/Mic";
import NavButton from "../Components/NavButton";
import RecordingLoader from "../Components/RecordingLoader";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../url/base";

const baseUrl = API_URL;

const Coursetest = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  
  const [course, setCourse] = useState(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [attempts, setAttempts] = useState([]);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(null);
  
  // New state for recording
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [transcriptionResult, setTranscriptionResult] = useState(null);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
      fetchProgress();
    }
  }, [courseId]);

  useEffect(() => {
    if (progress && progress.lessonsProgress) {
      // Find the first incomplete lesson or set to 0
      const firstIncompleteIndex = progress.lessonsProgress.findIndex(
        (lp) => !lp.isCompleted
      );
      if (firstIncompleteIndex !== -1) {
        setCurrentLessonIndex(firstIncompleteIndex);
        setAttempts(progress.lessonsProgress[firstIncompleteIndex].attempts.map(a => a.accuracy) || []);
      }
    }
  }, [progress]);

  const fetchCourse = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/api/courses/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch course');
      }

      const data = await response.json();
      setCourse(data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching course:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/api/courses/${courseId}/progress`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch progress');
      }

      const data = await response.json();
      setProgress(data.data);
    } catch (err) {
      console.error('Error fetching progress:', err);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      let chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        chunks = [];
        
        // Upload to backend
        await uploadRecording(audioBlob);
      };

      setMediaRecorder(recorder);
      recorder.start();
      setRecording(true);
      setTranscriptionResult(null); // Clear previous result
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setRecording(false);
    }
  };

  const uploadRecording = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      formData.append('targetWord', course.lessons[currentLessonIndex].word);

      // Using the Node.js backend proxy (which forwards to Flask phonemes-backend)
      const response = await fetch(`${baseUrl}/api/test/record`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload recording');
      }

      const data = await response.json();
      setTranscriptionResult(data.data); // data is wrapped in 'data' object from controller

      // Save attempt regardless of correctness
      if (data.data && data.data.accuracy !== undefined) {
        saveAttempt(data.data.accuracy);
      }

    } catch (err) {
      console.error('Error uploading recording:', err);
      setError('Failed to process speech');
    }
  };

  const saveAttempt = async (accuracy) => {
    try {
      const token = localStorage.getItem('token');
      const currentLesson = course.lessons[currentLessonIndex];
      
      const saveResponse = await fetch(
        `${baseUrl}/api/courses/${courseId}/lessons/${currentLesson.lessonNumber}/attempt`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ accuracy }),
        }
      );

      if (!saveResponse.ok) {
        throw new Error('Failed to save attempt');
      }

      const saveData = await saveResponse.json();
      setProgress(saveData.data);
      setAttempts((prev) => [...prev, accuracy]);
    } catch (err) {
      console.error('Error saving attempt:', err);
    }
  };

  const resetAttempts = async () => {
    try {
      const token = localStorage.getItem('token');
      const currentLesson = course.lessons[currentLessonIndex];
      
      const response = await fetch(
        `${baseUrl}/api/courses/${courseId}/lessons/${currentLesson.lessonNumber}/reset`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to reset lesson');
      }

      const data = await response.json();
      setProgress(data.data);
      setAttempts([]);
    } catch (err) {
      console.error('Error resetting attempts:', err);
      // Fallback: reset locally
      setAttempts([]);
    }
  };

  const nextLesson = () => {
    if (currentLessonIndex < course.lessons.length - 1) {
      const newIndex = currentLessonIndex + 1;
      setCurrentLessonIndex(newIndex);
      
      // Load attempts for the new lesson
      if (progress && progress.lessonsProgress[newIndex]) {
        setAttempts(progress.lessonsProgress[newIndex].attempts.map(a => a.accuracy) || []);
      } else {
        setAttempts([]);
      }
    }
  };

  const previousLesson = () => {
    if (currentLessonIndex > 0) {
      const newIndex = currentLessonIndex - 1;
      setCurrentLessonIndex(newIndex);
      
      // Load attempts for the new lesson
      if (progress && progress.lessonsProgress[newIndex]) {
        setAttempts(progress.lessonsProgress[newIndex].attempts.map(a => a.accuracy) || []);
      } else {
        setAttempts([]);
      }
    }
  };

  const improvisationNeeded = () => {
    const averageAccuracy = attempts.reduce((sum, acc) => sum + acc, 0) / attempts.length;
    const average = Math.round(averageAccuracy);
    navigate("/detect/" + average);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-spacegroteskmedium">Loading course...</div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-spacegroteskmedium text-red-500">
          Error: {error || 'Course not found'}
        </div>
      </div>
    );
  }

  const currentLesson = course.lessons[currentLessonIndex];
  const averageAccuracy = attempts.length > 0 
    ? attempts.reduce((sum, acc) => sum + acc, 0) / attempts.length 
    : 0;

  const currentLessonProgress = progress?.lessonsProgress[currentLessonIndex];
  const isLessonComplete = currentLessonProgress?.isCompleted || false;

  return (
    <div className="md:px-[9rem] pb-[4rem] font-spacegroteskmedium">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">{course.title}</h1>
        <div className="text-md font-semibold">
          Lesson {currentLessonIndex + 1} of {course.lessons.length}: {currentLesson.title}
        </div>
      </div>

      <div className="flex justify-between text-md font-semibold mb-5">
        <span className="">
          Word to be spelled: {currentLesson.word.charAt(0).toUpperCase() + currentLesson.word.slice(1)}
        </span>
        <span className="me-[4rem]">
          Average Correct Percentage - {averageAccuracy.toFixed(2)} %
        </span>
      </div>

      <center className="text-2xl">
        <div className="mb-1">{currentLesson.word}</div>
        <div className="mb-8">{currentLesson.pronunciation}</div>
        {!recording ? <Mic /> : <RecordingLoader />}
        {transcriptionResult && (
          <div className="mt-6 p-6 rounded-xl bg-white shadow-lg text-center border-2 border-gray-100 max-w-md mx-auto">
            <div className="text-gray-500 text-sm uppercase tracking-wide mb-2 font-semibold">Test Result</div>
            <div className="flex justify-between mb-3 px-4">
              <span className="text-gray-600">Target Word:</span>
              <span className="font-bold text-gray-900">{currentLesson.word}</span>
            </div>
            <div className="flex justify-between mb-3 px-4">
              <span className="text-gray-600">You said:</span>
              <span className={`font-bold ${transcriptionResult.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {transcriptionResult.transcript || '...'}
              </span>
            </div>
            <div className="flex justify-between mb-3 px-4">
              <span className="text-gray-600">Accuracy:</span>
              <span className="font-bold text-gray-900">{transcriptionResult.accuracy}%</span>
            </div>
            <div className="flex justify-between mb-5 px-4">
              <span className="text-gray-600">Result:</span>
              <span className={`font-bold ${transcriptionResult.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {transcriptionResult.isCorrect ? 'Correct' : 'Incorrect'}
              </span>
            </div>
            <div className="text-sm text-gray-400 italic">
              Attempt {attempts.length + 1}
            </div>
          </div>
        )}
      </center>

      <div className="flex w-[75%] mx-auto justify-center mt-5">
        {!recording ? (
          <RecordButton
            bgColor="#89D85D"
            text="Start Recording"
            onClickHandler={startRecording}
          />
        ) : (
          <RecordButton
            bgColor="#E3E2E7"
            textColor="black"
            text="Recording..."
          />
        )}
        <RecordButton
          bgColor="#D86C5D"
          text="Stop Recording"
          onClickHandler={stopRecording}
        />
        <RecordButton
          bgColor="#0984E3"
          text="Reset all tries"
          onClickHandler={resetAttempts}
        />
      </div>

      <div className="my-[5rem]">
        <div className="text-[#2D8CFF] font-medium">Attempts:</div>

        <div className="flex justify-center gap-x-[4rem] mt-5">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="h-[7rem] w-[14rem] rounded-lg flex flex-col justify-center items-center text-white font-semibold text-md gap-y-3 text-center drop-shadow-[3px_4px_2px_rgba(0,0,0,0.7)]"
              style={
                attempts[index]
                  ? attempts[index] >= 50
                    ? { backgroundColor: "#89D85D" }
                    : { backgroundColor: "#D86C5D" }
                  : { backgroundColor: "#E3E2E7", color: "black" }
              }
            >
              <div>Attempt {index + 1}</div>
              {attempts[index] !== undefined && <div>Accuracy {attempts[index]}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-x-[4rem] mt-[3rem]">
        {currentLessonIndex > 0 && (
          <NavButton
            text="Previous Lesson"
            currLetter={`Lesson ${currentLessonIndex}`}
            onClickHandler={previousLesson}
          />
        )}
        {currentLessonIndex < course.lessons.length - 1 && (
          <NavButton
            text="Next Lesson"
            currLetter={`Lesson ${currentLessonIndex + 2}`}
            onClickHandler={nextLesson}
          />
        )}
      </div>

      {isLessonComplete && (
        <div className="flex items-center justify-center mt-5">
          <button className="bg-lime-600 p-4 rounded-lg text-white shadow-md">
            ✓ Lesson Completed! Great going!
          </button>
        </div>
      )}

      {averageAccuracy >= 50 && attempts.length === 3 && !isLessonComplete && (
        <div className="flex items-center justify-center mt-5">
          <button className="bg-lime-600 p-4 rounded-lg text-white shadow-md">
            Great going! You can move to the next lesson.
          </button>
        </div>
      )}

      {averageAccuracy < 50 && attempts.length === 3 && (
        <div className="flex items-center justify-center mt-5">
          <button 
            onClick={improvisationNeeded} 
            className="bg-blue-600 p-4 rounded-lg text-white shadow-md hover:bg-blue-700"
          >
            You need to practice more!
          </button>
        </div>
      )}

      <div className="mt-10 text-center">
        <div className="text-lg font-semibold mb-2">Overall Course Progress</div>
        <div className="text-md">
          Completed: {progress?.lessonsProgress?.filter(lp => lp.isCompleted).length || 0} / {course.lessons.length} lessons ({Math.round((progress?.lessonsProgress?.filter(lp => lp.isCompleted).length || 0) / course.lessons.length * 100)}%)
        </div>
      </div>
    </div>
  );
};

export default Coursetest;
