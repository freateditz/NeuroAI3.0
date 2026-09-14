import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '../url/base';
import NavButton from '../Components/NavButton';

const StudentDetail = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProgress();
  }, [studentId]);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/parent/children/${studentId}/progress`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch student progress');
      const data = await response.json();
      setProgress(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-2xl">Loading Progress...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500 text-2xl">Error: {error}</div>;
  }

  const student = progress?.student || { name: 'Student', grade_level: 'N/A' };
  const overallStats = progress?.overallStats || { averageAccuracy: 0, completedCourses: 0, totalTests: 0 };
  const courseProgress = progress?.courseProgress || [];
  const testResults = progress?.testResults || [];
  const learningPath = progress?.learningPath;

  return (
    <div className="md:px-[9rem] pb-[4rem] font-spacegroteskmedium min-h-screen">
      <div className="mb-10 mt-10 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2">{student?.name || 'Student'}'s Progress</h1>
          <p className="text-gray-600">Grade: {student?.grade_level || 'N/A'}</p>
        </div>
        <NavButton
          text="Back to Dashboard"
          currLetter=""
          onClickHandler={() => navigate('/parent/dashboard')}
        />
      </div>

      {/* Adaptive Learning Path Section */}
      {learningPath && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 mb-12 text-white shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Current Learning Path</h2>
            <span className="bg-white text-indigo-600 px-3 py-1 rounded-full text-sm font-bold">
              {learningPath.trackMode}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-lg opacity-90 mb-2">Current Focus: <span className="font-bold">{learningPath.title}</span></p>
              <p className="text-sm opacity-80">{learningPath.planSummary}</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm font-bold">
                <span>Overall Plan Progress</span>
                <span>{Math.round((learningPath.currentWeek / learningPath.totalWeeks) * 100)}%</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-white/20 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-white h-full transition-all duration-500"
                    style={{ width: `${(learningPath.currentWeek / learningPath.totalWeeks) * 100}%` }}
                  ></div>
                </div>
                <span className="font-bold">Week {learningPath.currentWeek} / {learningPath.totalWeeks}</span>
              </div>
            </div>
          </div>

          {learningPath.weeks && (
            <div className="mt-6 pt-6 border-t border-white/20">
              <h3 className="text-lg font-bold mb-3">Current Week's Progress</h3>
              <div className="flex flex-wrap gap-2">
                {learningPath.weeks
                  .find(w => w.weekNumber === learningPath.currentWeek)
                  ?.days.map(day => (
                    <div
                      key={day.dayNumber}
                      className={`px-3 py-1 rounded-full text-xs font-bold ${day.completed ? 'bg-green-400 text-green-900' : 'bg-white/30 text-white'}`}
                    >
                      Day {day.dayNumber} {day.completed ? '✓' : '○'}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 text-center">
          <div className="text-gray-500 mb-2">Avg. Accuracy</div>
          <div className="text-4xl font-bold text-blue-600">{overallStats?.averageAccuracy ?? 0}%</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 text-center">
          <div className="text-gray-500 mb-2">Completed Courses</div>
          <div className="text-4xl font-bold text-green-600">{overallStats?.completedCourses ?? 0}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 text-center">
          <div className="text-gray-500 mb-2">Total Tests Taken</div>
          <div className="text-4xl font-bold text-purple-600">{overallStats?.totalTests ?? 0}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-6">Course Progress</h2>
          <div className="space-y-4">
            {courseProgress.length === 0 ? (
              <div className="text-gray-500 bg-white p-6 rounded-xl border border-gray-100 text-center">
                No course progress recorded yet.
              </div>
            ) : (
              courseProgress.map((cp, index) => (
                <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{cp.course?.title || `Course ${index + 1}`}</div>
                    <div className="text-sm text-gray-500">Status: {cp.status || 'in-progress'}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{cp.overallProgress || 0}%</div>
                    <div className="text-xs text-gray-400">Completed</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Test Accuracy per Letter</h2>
          <div className="grid grid-cols-2 gap-4">
            {testResults.map((tr, index) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <span className="text-xl font-bold text-gray-700">{tr.letter}</span>
                <span className={`font-bold ${(tr.averageAccuracy || 0) >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                  {tr.averageAccuracy || 0}%
                </span>
              </div>
            ))}
            {testResults.length === 0 && <div className="col-span-2 text-center text-gray-500">No test results yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
