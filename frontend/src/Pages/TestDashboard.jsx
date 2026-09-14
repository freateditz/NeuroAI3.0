import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import RecommendationsPanel from "../Components/RecommendationsPanel";
import { API_URL } from "../url/base";

export default function TestDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState(null);
  const [allTests, setAllTests] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const isPremium = false; // Set to true for premium users

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch statistics
      const statsResponse = await fetch(`${API_URL}/api/test/statistics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStatistics(statsData.data);
      }

      // Fetch all tests
      const testsResponse = await fetch(`${API_URL}/api/test/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (testsResponse.ok) {
        const testsData = await testsResponse.json();
        setAllTests(testsData.data);
      }

      // Fetch recommendations
      const recsResponse = await fetch(`${API_URL}/api/test/recommendations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (recsResponse.ok) {
        const recsData = await recsResponse.json();
        setRecommendations(recsData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-spacegrotesksemibold text-gray-900 dark:text-white mb-2">
            Your Progress Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-spacegroteskregular">
            Track your speech improvement journey, {user?.name}!
          </p>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Tests</div>
              <div className="text-3xl font-bold text-blue-600">{statistics.totalTests}</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Completed</div>
              <div className="text-3xl font-bold text-green-600">{statistics.completedTests}</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Attempts</div>
              <div className="text-3xl font-bold text-purple-600">{statistics.totalAttempts}</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Avg Accuracy</div>
              <div className="text-3xl font-bold text-orange-600">{statistics.averageOverallAccuracy}%</div>
            </div>
          </div>
        )}

        {/* Learning Path CTA */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 mb-8 shadow-lg text-white flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2">Your Adaptive Learning Path</h2>
            <p className="opacity-90 font-spacegroteskregular">
              AI-powered personalized plan based on your phoneme assessment results.
            </p>
          </div>
          <button
            onClick={() => navigate('/learning-path')}
            className="bg-white text-indigo-600 font-bold py-3 px-6 rounded-xl shadow-md hover:bg-indigo-50 transition-all whitespace-nowrap"
          >
            View My Plan →
          </button>
        </div>

        {/* Best and Worst Performance */}
        {statistics && (statistics.bestLetter || statistics.worstLetter) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {statistics.bestLetter && (
              <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-xl p-6 shadow-lg text-white">
                <div className="text-sm opacity-90 mb-2">🏆 Best Performance</div>
                <div className="text-4xl font-bold mb-1">Letter {statistics.bestLetter.letter}</div>
                <div className="text-2xl">{statistics.bestLetter.accuracy}% accuracy</div>
              </div>
            )}

            {statistics.worstLetter && (
              <div className="bg-gradient-to-r from-red-400 to-red-600 rounded-xl p-6 shadow-lg text-white">
                <div className="text-sm opacity-90 mb-2">📈 Needs Improvement</div>
                <div className="text-4xl font-bold mb-1">Letter {statistics.worstLetter.letter}</div>
                <div className="text-2xl">{statistics.worstLetter.accuracy}% accuracy</div>
              </div>
            )}
          </div>
        )}

        {/* Recommendations Toggle Button */}
        {recommendations && recommendations.keyAreasForImprovement && recommendations.keyAreasForImprovement.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setShowRecommendations(!showRecommendations)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <div className="text-left">
                  <div className="text-lg">View Personalized Recommendations</div>
                  <div className="text-sm opacity-90">AI-powered insights to improve faster</div>
                </div>
              </div>
              <svg
                className={`w-6 h-6 transition-transform ${showRecommendations ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}

        {/* Recommendations Panel */}
        {showRecommendations && recommendations && (
          <div className="mb-8">
            <RecommendationsPanel recommendations={recommendations} isPremium={isPremium} />
          </div>
        )}

        {/* All Tests Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-spacegrotesksemibold text-gray-900 dark:text-white">
              All Test Results
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Letter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Word
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Attempts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Avg Accuracy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {allTests.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No tests taken yet. Start your first test!
                    </td>
                  </tr>
                ) : (
                  allTests.map((test) => (
                    <tr key={test._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {test.letter}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {test.word}
                        </div>
                        <div className="text-xs text-gray-500">{test.pronunciation}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {test.attempts.length}/3
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-bold ${
                          test.averageAccuracy >= 70 ? 'text-green-600' :
                          test.averageAccuracy >= 50 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {test.averageAccuracy}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          test.completed
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {test.completed ? 'Completed' : 'In Progress'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => navigate('/overalltest')}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {test.completed ? 'Review' : 'Continue'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/overalltest')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-spacegrotesksemibold py-3 px-8 rounded-lg shadow-lg transition-all"
          >
            Continue Testing
          </button>
        </div>
      </div>
    </div>
  );
}
