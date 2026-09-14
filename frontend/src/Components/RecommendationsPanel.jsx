import { useNavigate } from "react-router-dom";

export default function RecommendationsPanel({ recommendations, isPremium = false }) {
  const navigate = useNavigate();

  if (!recommendations || !recommendations.keyAreasForImprovement) {
    return null;
  }

  const { keyAreasForImprovement, recommendedCourses, overallProgress, strengthAreas, improvingAreas } = recommendations;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700';
      case 'low': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      case 'stable': return '➡️';
      default: return '❓';
    }
  };

  return (
    <div className="space-y-6">
      {/* Premium Badge */}
      {isPremium && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 text-white">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👑</span>
            <div>
              <h3 className="font-bold text-lg">Premium Insights</h3>
              <p className="text-sm opacity-90">Personalized recommendations based on AI analysis</p>
            </div>
          </div>
        </div>
      )}

      {/* Overall Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Overall Progress</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>
          <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{overallProgress}%</span>
        </div>
      </div>

      {/* Key Areas for Improvement */}
      {keyAreasForImprovement.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🎯</span>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Key Areas for Improvement</h3>
          </div>
          <div className="space-y-4">
            {keyAreasForImprovement.map((area, index) => (
              <div 
                key={index}
                className={`border-2 rounded-lg p-4 ${getPriorityColor(area.priority)}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-lg">
                      Letter {area.letter} - {area.word}
                    </h4>
                    <p className="text-sm opacity-80">Current Accuracy: {area.currentAccuracy.toFixed(1)}%</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="px-3 py-1 bg-white dark:bg-gray-900 rounded-full text-xs font-bold uppercase">
                      {area.priority} Priority
                    </span>
                    <span className="text-2xl">{getTrendIcon(area.trend)}</span>
                  </div>
                </div>
                <p className="text-sm mt-2 italic">{area.recommendation}</p>
                <div className="mt-2 text-xs opacity-75">
                  Attempts: {area.attempts} • Trend: {area.trend}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Courses */}
      {recommendedCourses && recommendedCourses.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📚</span>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recommended Courses</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedCourses.map((course, index) => (
              <div 
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/course/${course.courseId}`)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-900 dark:text-white">{course.title}</h4>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                    {course.difficulty}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{course.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    {course.totalLessons} lessons
                  </span>
                  <div className="flex gap-1">
                    {course.relevantLetters.map((letter, i) => (
                      <span 
                        key={i}
                        className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded"
                      >
                        {letter}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strength Areas */}
      {strengthAreas && strengthAreas.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">⭐</span>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your Strengths</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {strengthAreas.map((area, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{area.letter}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{area.word}</div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400">{area.accuracy.toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Improving Areas */}
      {improvingAreas && improvingAreas.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🚀</span>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Making Progress</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {improvingAreas.map((area, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{area.letter}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{area.word}</div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  +{area.improvement.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
