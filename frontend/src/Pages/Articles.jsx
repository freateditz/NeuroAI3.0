import React, { useState, useEffect } from 'react'
import Articlescomponent from "../Components/Articlescomponent";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = () => {
    // Check cache first
    const cachedData = localStorage.getItem('speechArticles');
    const cacheTimestamp = localStorage.getItem('speechArticlesTimestamp');
    
    if (cachedData && cacheTimestamp) {
      const hoursSinceCache = (Date.now() - parseInt(cacheTimestamp)) / (1000 * 60 * 60);
      
      // Use cache if less than 6 hours old
      if (hoursSinceCache < 6) {
        setArticles(JSON.parse(cachedData));
        setLastFetch(new Date(parseInt(cacheTimestamp)));
        setLoading(false);
        return;
      }
    }
    
    // Fetch fresh data if no cache or expired
    fetchArticles();
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Step 1: Fetch articles from News API
      const newsApiKey = '29913dc0635d4336bea043672d789a56';
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=speech%20disorder%20children%20parents&language=en&sortBy=relevancy&pageSize=30&apiKey=${newsApiKey}`
      );

      const data = await response.json();

      if (!response.ok || data.status === 'error') {
        throw new Error(data.message || 'Failed to fetch articles');
      }

      const allArticles = data.articles || [];
      
      if (allArticles.length === 0) {
        setArticles([]);
        setError('No articles found.');
        setLoading(false);
        return;
      }

      // Step 2: Use Gemini API to filter relevant articles
      const geminiApiKey = 'AIzaSyDTE5995BYh_EEmBYN2P_3MCVVPz1ACILI';
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
      
      const articleSummaries = allArticles.map((article, index) => 
        `${index}. "${article.title}" - ${article.description || 'No description'}`
      ).join('\n');

      const geminiPrompt = `You are helping filter news articles for parents of children with speech disorders. 

Here are ${allArticles.length} articles. Analyze each one and return ONLY the article numbers (0-${allArticles.length - 1}) that are truly relevant to:
- Speech disorders in children
- Speech therapy
- Language development issues
- Communication disorders
- Stuttering, apraxia, or other speech conditions
- Resources or guidance for parents

Articles:
${articleSummaries}

Return your response as a JSON array of numbers (article indices that are relevant). For example: [0, 3, 5, 7, 12]
If at least 5 articles are relevant, only include the most relevant ones. If fewer than 5 are relevant, include all relevant ones. Return at least 3 articles minimum even if marginally relevant.`;

      try {
        const result = await model.generateContent(geminiPrompt);
        const geminiText = result.response.text();
        console.log('Gemini response:', geminiText);
        
        // Extract array of indices from Gemini response
        const match = geminiText.match(/\[[\d,\s]+\]/);
        const relevantIndices = match ? JSON.parse(match[0]) : [];
        
        const filteredArticles = relevantIndices
          .filter(idx => idx >= 0 && idx < allArticles.length)
          .map(idx => allArticles[idx]);
        
        // Ensure we have at least some articles
        const finalArticles = filteredArticles.length > 0 
          ? filteredArticles 
          : allArticles.slice(0, 10);
        
        setArticles(finalArticles);
        
        // Cache the results
        localStorage.setItem('speechArticles', JSON.stringify(finalArticles));
        const timestamp = Date.now();
        localStorage.setItem('speechArticlesTimestamp', timestamp.toString());
        setLastFetch(new Date(timestamp));
      } catch (geminiError) {
        console.warn('Gemini filtering failed, using all articles:', geminiError);
        // Fallback: use all articles if Gemini fails
        const fallbackArticles = allArticles.slice(0, 20);
        setArticles(fallbackArticles);
        
        localStorage.setItem('speechArticles', JSON.stringify(fallbackArticles));
        const timestamp = Date.now();
        localStorage.setItem('speechArticlesTimestamp', timestamp.toString());
        setLastFetch(new Date(timestamp));
      }
      
      setError(null);
    } catch (err) {
      // Fallback to cache if rate limited
      const cachedData = localStorage.getItem('speechArticles');
      if (cachedData && (err.message.includes('rate limit') || err.message.includes('rateLimited'))) {
        setArticles(JSON.parse(cachedData));
        setError('Rate limit reached. Showing cached articles.');
      } else {
        setError(err.message);
      }
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Articles on Speech Disorders for Parents
            </h1>
            {lastFetch && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Last updated: {lastFetch.toLocaleString()}
              </p>
            )}
          </div>
          <button
            onClick={fetchArticles}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-spacegroteskregular"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg text-gray-600 dark:text-gray-300">Loading articles...</div>
          </div>
        )}

        {error && (
          <div className={`border px-4 py-3 rounded mb-4 ${
            error.includes('cache') 
              ? 'bg-yellow-100 dark:bg-yellow-900 border-yellow-400 dark:border-yellow-600 text-yellow-700 dark:text-yellow-200'
              : 'bg-red-100 dark:bg-red-900 border-red-400 dark:border-red-600 text-red-700 dark:text-red-200'
          }`}>
            {error}
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-12 text-gray-600 dark:text-gray-300">
            No articles found.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <Articlescomponent
              key={index}
              article={article}
            />
          ))}
        </div>
      </div>
    </div>
  )
}