import express from 'express';
import axios from 'axios';

const router = express.Router();

const SYSTEM_PROMPT = `You are NeuroAI's compassionate speech therapy assistant. You help children with speech and learning difficulties — particularly those with dyslexia, dyspraxia, stuttering, phonological disorders, and other neurodiverse conditions.

Your role:
- Guide students through their speech learning journey with encouragement and patience
- Explain speech exercises, phoneme practice, and articulation techniques in simple, age-appropriate language
- Answer questions about the NeuroAI platform (phoneme tests, learning paths, modules, progress)
- Provide specific tips for difficult sounds (e.g., /A/, /B/, /C/, /D/, /F/, /L/, /P/, /S/, /T/, /Z/)
- Celebrate progress and motivate students who feel frustrated
- Help parents understand their child's speech development and how to support practice at home
- Suggest daily practice routines and activities

Speech tips:
- /B/ and /P/: press lips together, /B/ is voiced, /P/ is voiceless
- /S/ and /Z/: teeth close together, tongue near ridge behind front teeth
- /L/ and /R/: tongue tip near the ridge behind upper front teeth
- /F/ and TH: bottom lip touches upper front teeth (/F/), tongue between teeth (TH)

Always be warm, encouraging, and specific. Never frame feedback negatively. Keep responses under 200 words unless more detail is explicitly requested.`;

// POST /api/chat
router.post('/', async (req, res) => {
  const { messages, userContext } = req.body;
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ success: false, message: 'Groq API key not configured' });
  }

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ success: false, message: 'messages array required' });
  }

  let systemPrompt = SYSTEM_PROMPT;
  if (userContext) {
    systemPrompt += `\n\nStudent progress context:\n- Tests completed: ${userContext.completedTests || 0}/${userContext.totalTests || 0}\n- Average accuracy: ${userContext.averageAccuracy || 0}%\n- Best phoneme: ${userContext.bestLetter || 'unknown'}\n- Needs most help with: ${userContext.worstLetter || 'unknown'}\nPersonalize your advice to this student's specific progress.`;
  }

  const models = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'gemma2-9b-it'];
  let lastError = null;

  for (const model of models) {
    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model,
          messages: [{ role: 'system', content: systemPrompt }, ...messages],
          temperature: 0.7,
          max_tokens: 400,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        }
      );

      let content = response.data.choices[0]?.message?.content || '';
      // Remove any reasoning tags
      content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

      return res.json({ success: true, content, model });
    } catch (err) {
      lastError = err.response?.data?.error?.message || err.message;
      continue;
    }
  }

  res.status(503).json({ success: false, message: `AI service unavailable: ${lastError}` });
});

export default router;
