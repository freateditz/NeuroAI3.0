import axios from 'axios';

const SPEECH_KEYWORDS = [
  'speech', 'language', 'stutter', 'stammer', 'apraxia', 'dysarthria',
  'articulation', 'phoneme', 'autism', 'dyslexia', 'adhd', 'communication',
  'therapy', 'disorder', 'hearing', 'verbal', 'nonverbal', 'fluency',
  'lisp', 'voice', 'neurodiverse', 'developmental', 'learning disability',
];

let cache = { articles: null, fetchedAt: 0 };
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

function isRelevant(article) {
  const text = `${article.title || ''} ${article.description || ''}`.toLowerCase();
  return SPEECH_KEYWORDS.some(kw => text.includes(kw));
}

export const getArticles = async (req, res) => {
  const forceRefresh = req.query.refresh === 'true';
  const now = Date.now();

  if (!forceRefresh && cache.articles && now - cache.fetchedAt < CACHE_TTL_MS) {
    return res.json({ success: true, data: cache.articles, cached: true });
  }

  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ success: false, message: 'NEWS_API_KEY not configured' });
  }

  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'speech disorder children parents',
        language: 'en',
        sortBy: 'relevancy',
        pageSize: 40,
        apiKey,
      },
      timeout: 10000,
    });

    const all = response.data.articles || [];
    const filtered = all.filter(isRelevant);
    const articles = filtered.length >= 5 ? filtered : all.slice(0, 15);

    cache = { articles, fetchedAt: now };
    return res.json({ success: true, data: articles, cached: false });
  } catch (err) {
    if (cache.articles) {
      return res.json({ success: true, data: cache.articles, cached: true, stale: true });
    }
    const status = err.response?.status || 500;
    const message = err.response?.data?.message || err.message;
    return res.status(status).json({ success: false, message });
  }
};
