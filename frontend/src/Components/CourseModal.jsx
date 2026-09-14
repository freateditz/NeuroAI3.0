import React from "react";
import { useNavigate } from "react-router-dom";
import learningphonemechar from "../assets/learningphonemechar.png";
import { useTheme } from "../contexts/ThemeContext";

export default function CourseModal({
  Phoneme1,
  Phoneme2,
  Status,
  Color,
  Progress,
  TotalLessons = 4,
  courseId,
}) {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const coursetest = () => {
    navigate(`/course/${courseId}`);
  };
  
  return (
    <div>
      <div className={`w-[800px] gap-8 flex items-center justify-center p-8 rounded-xl shadow-xl cursor-pointer hover:shadow-2xl transition-shadow ${darkMode ? 'bg-gray-800' : 'bg-[#F5F0F0]'}`}>
        <div className="bg-[#E5D1FF] p-6 rounded-xl">
          <img src={learningphonemechar} alt="learningphonemechar" />
        </div>
        <div className="flex gap-20 justify-between items-center">
          <div>
            <div>
              <p className={`font-spacegrotesksemibold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Phoneme {Phoneme1} and {Phoneme2}
              </p>
            </div>
            <div>
              <p className={`font-spacegroteskregular ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Progress</p>
            </div>
          </div>
          <div>
            <p className={`font-spacegrotesksemibold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Tests: {Progress} / {TotalLessons}
            </p>
          </div>
          <div>
            <div
              onClick={coursetest}
              style={{ backgroundColor: Color }}
              className="p-2 rounded-lg hover:opacity-80 transition-opacity"
            >
              <button className="font-spacegrotesksemibold text-white text-md">
                {Status} <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
