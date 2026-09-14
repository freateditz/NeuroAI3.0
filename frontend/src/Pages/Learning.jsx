import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import learningchar1 from "../assets/learningchar1.png";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import learningchar2 from "../assets/learningchar2.png";
import school from "../assets/school.png";
import CourseModal from "../Components/CourseModal";
import Articlescomponent from "../Components/Articlescomponent";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { API_URL } from "../url/base";

export default function Learning() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todaysCourse, setTodaysCourse] = useState(null);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchCourses();
    fetchArticles();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/courses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      setCourses(data.data);

      // Find the course with in-progress status or the first not-started course for today's goal
      const inProgressCourse = data.data.find(
        course => course.userProgress?.status === 'in-progress'
      );
      const notStartedCourse = data.data.find(
        course => !course.userProgress || course.userProgress.status === 'not-started'
      );
      
      setTodaysCourse(inProgressCourse || notStartedCourse || data.data[0]);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchArticles = () => {
    // Sample articles data - replace with actual API call if needed
    const sampleArticles = [
      {
        title: "Understanding Speech Therapy: A Comprehensive Guide",
        description: "Learn about the fundamentals of speech therapy and how it can help improve communication skills.",
        url: "https://example.com/article1",
        urlToImage: "https://via.placeholder.com/400x200",
        publishedAt: new Date().toISOString(),
        source: { name: "NeuroAI Blog" }
      },
      {
        title: "The Science Behind Phoneme Recognition",
        description: "Explore the neuroscience and technology behind phoneme detection and speech recognition.",
        url: "https://example.com/article2",
        urlToImage: "https://via.placeholder.com/400x200",
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        source: { name: "Science Daily" }
      },
      {
        title: "5 Tips for Improving Your Speech Clarity",
        description: "Practical exercises and techniques to enhance your speech clarity and pronunciation.",
        url: "https://example.com/article3",
        urlToImage: "https://via.placeholder.com/400x200",
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        source: { name: "Health & Wellness" }
      }
    ];
    setArticles(sampleArticles);
  };

  const overalltest = () => {
    navigate("/overall");
  };

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const getStatusText = (userProgress) => {
    if (!userProgress) return "Start Learning";
    switch (userProgress.status) {
      case 'completed':
        return "Completed";
      case 'in-progress':
        return "Continue Learning";
      default:
        return "Start Learning";
    }
  };

  const getStatusColor = (userProgress) => {
    if (!userProgress) return "#2D8CFF";
    switch (userProgress.status) {
      case 'completed':
        return "#89D85D";
      case 'in-progress':
        return "#2D8CFF";
      default:
        return "#2D8CFF";
    }
  };

  const getProgress = (userProgress) => {
    if (!userProgress) return 0;
    return userProgress.totalLessonsCompleted || 0;
  };

  return (
    <div>
      <div className="flex justify-center gap-[10%] items-center">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center gap-8 bg-gradient-to-r from-blue-300 to-cyan-100 rounded-2xl p-4 shadow-lg">
            <div className="flex flex-col items-start justify-start gap-4">
              <h2 className="text-2xl font-spacegroteskbold text-gray-800 mb-4">
                Confused on how to get started?
              </h2>
              <p className="text-xl mb-6 font-spacegrotesksemibold">
                Don't worry take our detection of phoneme error test
              </p>
              <button onClick={overalltest} className="bg-[#89D85D] shadow-lg text-lg hover:bg-opacity-80 font-spacegrotesksemibold py-4 px-4 rounded-lg">
                Start Test <span className="ml-2">→</span>
              </button>
            </div>
            <div>
              <img src={learningchar1} alt="learningchar1" />
            </div>
          </div>
        </div>
        <div className={`shadow-lg rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DateCalendar", "DateCalendar"]}>
              <DemoItem>
                <DateCalendar 
                  defaultValue={dayjs("2024-08-25")} 
                  sx={{
                    '& .MuiPickersDay-root': {
                      color: darkMode ? '#fff' : '#000',
                    },
                    '& .MuiPickersCalendarHeader-label': {
                      color: darkMode ? '#fff' : '#000',
                    },
                    '& .MuiDayCalendar-weekDayLabel': {
                      color: darkMode ? '#9ca3af' : '#6b7280',
                    },
                    '& .MuiIconButton-root': {
                      color: darkMode ? '#fff' : '#000',
                    },
                  }}
                />
              </DemoItem>
            </DemoContainer>
          </LocalizationProvider>
        </div>
      </div>
      <div className="flex items-start mt-10 justify-center gap-20">
        <div className="flex flex-col gap-8 items-center justify-center p-4">
          <div className={`text-2xl border-y-2 w-fit font-spacegrotesksemibold ${darkMode ? 'border-gray-600 text-white' : 'border-black text-gray-900'}`}>
            Correct your speech with Phonemes catalog
          </div>
          <div className="flex flex-col p-4 pt-0 gap-8 h-[800px] overflow-y-scroll custom-scrollbar">
            {loading ? (
              <div className={`text-center py-10 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Loading courses...</div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">Error: {error}</div>
            ) : courses.length === 0 ? (
              <div className={`text-center py-10 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>No courses available</div>
            ) : (
              courses.map((course) => (
                <div key={course._id} onClick={() => handleCourseClick(course._id)}>
                  <CourseModal
                    Phoneme1={course.phoneme1}
                    Phoneme2={course.phoneme2}
                    Status={getStatusText(course.userProgress)}
                    Progress={getProgress(course.userProgress)}
                    TotalLessons={course.totalLessons}
                    Color={getStatusColor(course.userProgress)}
                    courseId={course._id}
                  />
                </div>
              ))
            )}
          </div>
        </div>
        <div>
          {todaysCourse && (
            <div className="bg-[#89D85D] p-6 rounded-lg shadow-lg w-96">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center justify-center bg-[#2D8CFF] p-4 rounded-full">
                  <img src={school} alt="school" />
                </div>
                <div>
                  <span className="font-spacegroteskbold">20 min</span>
                  <span className="mx-2">·</span>
                  <span className="font-spacegroteskbold">{todaysCourse.totalLessons} Tests</span>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="flex flex-col gap-4">
                  <h2 className="text-lg font-spacegroteskbold">Today's Goal</h2>
                  <h3 className="text-xl font-spacegroteskbold mb-2">
                    {todaysCourse.title}
                  </h3>
                  <p className="mb-4 font-spacegrotesksemibold">
                    Tests Left: {getProgress(todaysCourse.userProgress)} / {todaysCourse.totalLessons}
                  </p>
                </div>
                <div>
                  <img src={learningchar2} alt="learningchar2" />
                </div>
              </div>
              <button 
                onClick={() => handleCourseClick(todaysCourse._id)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-spacegrotesksemibold py-2 px-8 rounded-full focus:outline-none focus:shadow-outline">
                Start
              </button>
            </div>
          )}
          <div>
            <div className={`text-2xl mt-10 border-y-2 w-fit font-spacegrotesksemibold ${darkMode ? 'border-gray-600 text-white' : 'border-black text-gray-900'}`}>
              Featured Articles
            </div>
            <div className="flex flex-col pt-0 pl-0 mt-10 gap-4 h-[470px] overflow-y-scroll custom-scrollbar p-4">
              {articles.length > 0 ? (
                articles.map((article, index) => (
                  <Articlescomponent key={index} article={article} />
                ))
              ) : (
                <div className={`text-center py-10 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  No articles available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
