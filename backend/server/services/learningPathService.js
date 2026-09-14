import { LearningPath, LearningPathWeek } from '../models/LearningPath.js';
import Course from '../models/Course.js';
import TestResult from '../models/TestResult.js';

const PHONEME_PRACTICE_DATA = {
  'A': { words: ['Apple', 'Ant', 'Axe'], phrases: ['A big red apple', 'An ant on the leaf'], examples: ['/æ/ as in Apple'] },
  'B': { words: ['Ball', 'Bat', 'Bear'], phrases: ['The ball bounces', 'A brown bear'], examples: ['/b/ as in Ball'] },
  'C': { words: ['Cat', 'Cup', 'Cake'], phrases: ['The cat sat', 'A cold cup of tea'], examples: ['/k/ as in Cat'] },
  'D': { words: ['Dog', 'Duck', 'Door'], phrases: ['The dog barks', 'Open the door'], examples: ['/d/ as in Dog'] },
  'E': { words: ['Egg', 'Elephant', 'Elbow'], phrases: ['An egg in the pan', 'The big elephant'], examples: ['/ɛ/ as in Egg'] },
  'F': { words: ['Fish', 'Fan', 'Frog'], phrases: ['The fish swims', 'A fast fan'], examples: ['/f/ as in Fish'] },
  'G': { words: ['Goat', 'Girl', 'Gate'], phrases: ['The goat jumps', 'Close the gate'], examples: ['/g/ as in Goat'] },
  'H': { words: ['Hat', 'House', 'Horse'], phrases: ['A red hat', 'The big house'], examples: ['/h/ as in Hat'] },
  'I': { words: ['Igloo', 'Ink', 'Island'], phrases: ['An ice igloo', 'Blue ink on paper'], examples: ['/ɪ/ as in Igloo'] },
  'J': { words: ['Jam', 'Jet', 'Jug'], phrases: ['Sweet strawberry jam', 'The fast jet'], examples: ['/dʒ/ as in Jam'] },
  'K': { words: ['Kite', 'Key', 'King'], phrases: ['Fly the kite', 'The golden key'], examples: ['/k/ as in Kite'] },
  'L': { words: ['Lion', 'Lamp', 'Leaf'], phrases: ['The lion roars', 'A green leaf'], examples: ['/l/ as in Lion'] },
  'M': { words: ['Moon', 'Map', 'Mouse'], phrases: ['The moon is bright', 'A small mouse'], examples: ['/m/ as in Moon'] },
  'N': { words: ['Net', 'Nose', 'Nest'], phrases: ['A fishing net', 'The bird nest'], examples: ['/n/ as in Net'] },
  'O': { words: ['Octopus', 'Orange', 'Olive'], phrases: ['The orange octopus', 'An olive branch'], examples: ['/ɒ/ as in Octopus'] },
  'P': { words: ['Pig', 'Pan', 'Pen'], phrases: ['The pink pig', 'Write with a pen'], examples: ['/p/ as in Pig'] },
  'Q': { words: ['Queen', 'Quilt', 'Quiet'], phrases: ['The quiet queen', 'A warm quilt'], examples: ['/kw/ as in Queen'] },
  'R': { words: ['Rat', 'Rain', 'Red'], phrases: ['The rain falls', 'A red rat'], examples: ['/r/ as in Rat'] },
  'S': { words: ['Sun', 'Snake', 'Spoon'], phrases: ['The hot sun', 'A slithering snake'], examples: ['/s/ as in Sun'] },
  'T': { words: ['Tiger', 'Tent', 'Top'], phrases: ['The tiger hunts', 'A blue tent'], examples: ['/t/ as in Tiger'] },
  'U': { words: ['Umbrella', 'Up', 'Under'], phrases: ['An open umbrella', 'Up in the sky'], examples: ['/ʌ/ as in Umbrella'] },
  'V': { words: ['Van', 'Vest', 'Vase'], phrases: ['The white van', 'A glass vase'], examples: ['/v/ as in Van'] },
  'W': { words: ['Watch', 'Wind', 'Wolf'], phrases: ['The wind blows', 'A grey wolf'], examples: ['/w/ as in Watch'] },
  'X': { words: ['X-ray', 'Box', 'Fox'], phrases: ['An x-ray image', 'The quick fox'], examples: ['/ks/ as in Box'] },
  'Y': { words: ['Yellow', 'Yo-yo', 'Yak'], phrases: ['A yellow yak', 'Play with a yo-yo'], examples: ['/j/ as in Yellow'] },
  'Z': { words: ['Zebra', 'Zoo', 'Zip'], phrases: ['The zebra runs', 'Visit the zoo'], examples: ['/z/ as in Zebra'] },
};

const REQUIRED_SESSIONS_FOR_PLAN = 1;

async function analyzeWeaknesses(userId) {
  // Get all test results with at least one attempt, sorted by weakest first
  const results = await TestResult.find({
    user: userId,
    'attempts.0': { $exists: true }
  }).sort({ averageAccuracy: 1 });

  if (results.length < REQUIRED_SESSIONS_FOR_PLAN) {
    throw new Error(`Complete at least one phoneme test before generating a learning path.`);
  }

  const sortedResults = [...results].sort((a, b) => a.averageAccuracy - b.averageAccuracy);
  const primary = sortedResults[0];
  const secondary = sortedResults[1] || sortedResults[0];

  // Safety: ensure we always have valid phoneme letters
  const primaryPhoneme = (primary?.letter || 'A').toUpperCase();
  const secondaryPhoneme = (secondary?.letter || primaryPhoneme).toUpperCase();
  const primaryAccuracy = primary?.averageAccuracy ?? 0;
  const secondaryAccuracy = secondary?.averageAccuracy ?? 0;

  // Determine improvement trend for the primary phoneme
  const allTestsForPrimary = await TestResult.find({ user: userId, letter: primaryPhoneme }).sort({ createdAt: 1 });
  let trend = 'stable';
  if (allTestsForPrimary.length >= 2) {
    const first = allTestsForPrimary[0].averageAccuracy;
    const last = allTestsForPrimary[allTestsForPrimary.length - 1].averageAccuracy;
    if (last - first >= 10) trend = 'improving';
    else if (last - first <= -10) trend = 'declining';
  }

  console.log('[LEARN] analyzeWeaknesses result:', { primaryPhoneme, secondaryPhoneme, primaryAccuracy, secondaryAccuracy, trend, totalResults: results.length });

  return {
    primary: { phoneme: primaryPhoneme, accuracy: primaryAccuracy, trend },
    secondary: { phoneme: secondaryPhoneme, accuracy: secondaryAccuracy },
    allWeaknesses: sortedResults.slice(0, 5).map(r => ({ phoneme: r.letter, accuracy: r.averageAccuracy }))
  };
}

async function findCourseForPhoneme(phoneme) {
  const course = await Course.findOne({
    $or: [{ phoneme1: phoneme }, { phoneme2: phoneme }],
    isActive: true
  });
  return course;
}

async function generateGroqAIAdaptivePlan(analysis, algorithmicTrack, weakCount) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const { primary, secondary, allWeaknesses } = analysis;
  const safeP = primary.phoneme || 'A';
  const safeS = secondary.phoneme || safeP;

  const prompt = `You are an expert pediatric speech-language pathologist AI working alongside an algorithmic speech diagnostic engine.
Algorithmic Analysis Metrics:
- Primary Weak Phoneme: /${safeP}/ (Accuracy: ${primary.accuracy}%, Trend: ${primary.trend})
- Secondary Weak Phoneme: /${safeS}/ (Accuracy: ${secondary.accuracy}%)
- Total Weak Phonemes (<70%): ${weakCount} (${allWeaknesses.map(w => `${w.phoneme}: ${w.accuracy}%`).join(', ')})
- Algorithmic Recommended Track: ${algorithmicTrack} (${weakCount >= 4 ? '7-Day Extended Intensive Support Schedule' : '5-Day Standard Practice Schedule'})

Generate a rich, clinical AI speech therapy insight and custom weekly descriptions.
Return ONLY valid JSON matching this exact schema without markdown code blocks or reasoning tags:
{
  "title": "AI Adaptive Path: Focus on ${safeP} & ${safeS}",
  "planSummary": "Clinical AI insight explaining why /${safeP}/ is priority (accuracy: ${primary.accuracy}%) and how the ${algorithmicTrack} will build speech confidence...",
  "trackMode": "${algorithmicTrack}",
  "week1Title": "${safeP} Articulation Mastery",
  "week1Desc": "Targeted phonics drills for /${safeP}/ sound...",
  "week2Title": "${safeS} Articulation Mastery",
  "week2Desc": "Targeted phonics drills for /${safeS}/ sound...",
  "week3Title": "Fluency & Pacing",
  "week3Desc": "Reading passages focused on rhythm and expression...",
  "week4Title": "Mastery & Consolidation",
  "week4Desc": "Comprehensive assessment of all learned sounds..."
}`;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'openai/gpt-oss-20b',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 6000,
      }
    );

    let raw = response.data.choices[0]?.message?.content || '';
    raw = raw.replace(/<think>.*<\/think>/gs, '').replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(raw);
    console.log('[LEARN] Groq AI hybrid plan generated successfully:', parsed.title);
    return parsed;
  } catch (err) {
    console.warn('[LEARN] Groq AI generation timed out or failed, using algorithmic fallback:', err.message);
    return null;
  }
}

export async function generateLearningPath(userId) {
  // 1. Run Algorithmic Diagnostic Analysis
  const analysis = await analyzeWeaknesses(userId);
  const { primary, secondary } = analysis;

  const safeP = (primary.phoneme && typeof primary.phoneme === 'string' && primary.phoneme.length > 0)
    ? primary.phoneme : 'A';
  const safeS = (secondary.phoneme && typeof secondary.phoneme === 'string' && secondary.phoneme.length > 0)
    ? secondary.phoneme : safeP;

  // 2. Compute Algorithmic Track Mode & Weak Phonemes Count
  const weakCount = analysis.allWeaknesses.filter(w => w.accuracy < 70).length;
  let algorithmicTrack = 'Steady Mastery Track';
  if (primary.trend === 'improving') algorithmicTrack = 'Accelerated Track';
  else if (primary.trend === 'declining' || weakCount >= 4) algorithmicTrack = 'High-Support Intensive Track';

  console.log('[LEARN] Algorithmic Diagnostic complete:', { safeP, safeS, weakCount, algorithmicTrack });

  // 3. Deactivate any existing active paths
  const existingPath = await LearningPath.findOne({ user: userId, status: 'active' });
  let nextStage = 1;
  if (existingPath) {
    nextStage = (existingPath.stageNumber || 1) + 1;
    await LearningPath.updateMany(
      { user: userId, status: 'active' },
      { $set: { status: 'completed' } }
    );
  }

  // 4. Enrich Algorithmic Analysis with Groq AI Clinical Insights
  const groqPlan = await generateGroqAIAdaptivePlan(analysis, algorithmicTrack, weakCount);

  const pathTitle = groqPlan?.title || `Adaptive Path: Focus on ${safeP} & ${safeS}`;
  const planSummary = groqPlan?.planSummary || `Based on algorithmic diagnostic test (accuracy: ${primary.accuracy}% for /${safeP}/, ${secondary.accuracy}% for /${safeS}/), we have built a ${algorithmicTrack} targeting your weak phonemes.`;
  const trackMode = groqPlan?.trackMode || algorithmicTrack;

  console.log('[LEARN] Creating LearningPath with title:', pathTitle);

  const path = await LearningPath.create({
    user: userId,
    title: pathTitle,
    planSummary: planSummary,
    trackMode,
    status: 'active',
    stageNumber: nextStage
  });

  const weekConfigs = [
    { week: 1, focus: safeP, title: groqPlan?.week1Title || `${safeP} Mastery`, desc: groqPlan?.week1Desc || `Intensive practice focused on the ${safeP} sound.` },
    { week: 2, focus: safeS, title: groqPlan?.week2Title || `${safeS} Mastery`, desc: groqPlan?.week2Desc || `Focusing on the ${safeS} sound to build confidence.` },
    { week: 3, focus: 'FLUENCY', title: groqPlan?.week3Title || 'Reading Pacing', desc: groqPlan?.week3Desc || 'Focusing on overall flow and reading speed.' },
    { week: 4, focus: 'MASTERY', title: groqPlan?.week4Title || 'Final Review', desc: groqPlan?.week4Desc || 'Consolidating all learned sounds and taking the final assessment.' },
  ];

  // 5. Build Algorithmic 5-Day / 7-Day Structured Schedules
  for (const config of weekConfigs) {
    let targetCourse = null;
    if (config.focus !== 'FLUENCY' && config.focus !== 'MASTERY') {
      targetCourse = await findCourseForPhoneme(config.focus);
    }

    const days = buildWeekDays(config, targetCourse, primary.trend, weakCount);

    await LearningPathWeek.create({
      path: path._id,
      weekNumber: config.week,
      focusArea: config.focus,
      description: config.desc,
      days: days,
      completed: false,
    });
  }

  return path;
}

function buildWeekDays(config, targetCourse, trend, weakCount = 0) {
  const focus = config.focus;
  const isHighSupport = trend === 'declining';
  // Scale up to 7 days if student has 4+ weak phonemes, else 5
  const extendedMode = weakCount >= 4;
  const practice = PHONEME_PRACTICE_DATA[focus] || { words: ['Practice'], phrases: ['Practice phrase'], examples: ['Sound example'] };

  let days = [];

  if (config.focus !== 'FLUENCY' && config.focus !== 'MASTERY') {
    days = [
      {
        dayNumber: 1,
        title: `Day 1: ${focus} ${isHighSupport ? 'Foundation' : 'Drill'}`,
        activityType: 'drill',
        description: `Listen to ${practice.examples[0]} and repeat. Words to practice: ${practice.words.join(', ')}.`,
        targetPhoneme: focus,
        targetUrl: '/learning-module',
        actionLabel: 'Start Tracing Drill',
        estimatedMinutes: isHighSupport ? 15 : 10,
        completed: false,
      },
      {
        dayNumber: 2,
        title: `Day 2: Blending ${focus}`,
        activityType: 'phonics',
        description: `Practice blending the /${focus}/ sound. Say each word clearly: ${practice.words.join(', ')}.`,
        targetPhoneme: focus,
        targetUrl: '/learning-module',
        actionLabel: 'Start Blending Slider',
        estimatedMinutes: 12,
        completed: false,
      },
      {
        dayNumber: 3,
        title: `Day 3: ${focus} Word Sort`,
        activityType: 'drill',
        description: `Identify and say /${focus}/ sounds in: ${practice.words.join(', ')}. Focus on the first sound.`,
        targetPhoneme: focus,
        targetUrl: '/learning-module',
        actionLabel: 'Start Card Sort',
        estimatedMinutes: 12,
        completed: false,
      },
      {
        dayNumber: 4,
        title: `Day 4: ${focus} Story`,
        activityType: 'story',
        description: `Read aloud: "${practice.phrases[0]}". Listen first, then repeat.`,
        targetPhoneme: focus,
        targetUrl: targetCourse ? `/course/${targetCourse._id}` : '/learning-module',
        actionLabel: 'Read AI Story',
        estimatedMinutes: 14,
        completed: false,
      },
      {
        dayNumber: 5,
        title: `Day 5: ${focus} Check`,
        activityType: 'reading',
        description: `Weekly progress check for the /${focus}/ sound.`,
        targetPhoneme: focus,
        targetUrl: '/overalltest',
        actionLabel: 'Take Weekly Test',
        estimatedMinutes: 15,
        completed: false,
      },
    ];
    // Extended mode: add 2 bonus practice days for students with many weaknesses
    if (extendedMode) {
      days.push({
        dayNumber: 6,
        title: `Day 6: ${focus} Sentence Practice`,
        activityType: 'phonics',
        description: `Build sentences using /${focus}/ words: ${practice.words.join(', ')}. Speak each sentence out loud.`,
        targetPhoneme: focus,
        targetUrl: '/learning-module',
        actionLabel: 'Start Sentence Practice',
        estimatedMinutes: 15,
        completed: false,
      });
      days.push({
        dayNumber: 7,
        title: `Day 7: ${focus} Mastery Review`,
        activityType: 'story',
        description: `Final review day. Read: "${practice.phrases[1] || practice.phrases[0]}". Aim for 90%+ accuracy.`,
        targetPhoneme: focus,
        targetUrl: '/learning-module',
        actionLabel: 'Start Mastery Review',
        estimatedMinutes: 20,
        completed: false,
      });
    }
  } else if (config.focus === 'FLUENCY') {
    days = [
      { dayNumber: 1, title: 'Day 1: Pacing', activityType: 'drill', description: 'Practice reading smooth phrases. Focus on rhythm and flow.', targetPhoneme: 'FLUENCY', targetUrl: '/learning-module', actionLabel: 'Start Phrase Drill', estimatedMinutes: 12, completed: false },
      { dayNumber: 2, title: 'Day 2: Echo Reading', activityType: 'phonics', description: 'Listen and match the expression. Repeat with same rhythm.', targetPhoneme: 'FLUENCY', targetUrl: '/learning-module', actionLabel: 'Start Echo Drill', estimatedMinutes: 12, completed: false },
      { dayNumber: 3, title: 'Day 3: AI Story', activityType: 'story', description: 'Advanced phonics story reading. Focus on clarity and pace.', targetPhoneme: 'FLUENCY', targetUrl: '/learning-module', actionLabel: 'Read AI Story', estimatedMinutes: 14, completed: false },
      { dayNumber: 4, title: 'Day 4: Tracking', activityType: 'drill', description: 'Prevent word omissions. Read each word clearly.', targetPhoneme: 'FLUENCY', targetUrl: '/learning-module', actionLabel: 'Start Tracking Drill', estimatedMinutes: 10, completed: false },
      { dayNumber: 5, title: 'Day 5: Mid-Point Assessment', activityType: 'reading', description: 'Full progress check. Read aloud and measure accuracy.', targetPhoneme: 'MASTERY', targetUrl: '/overalltest', actionLabel: 'Take Assessment', estimatedMinutes: 15, completed: false },
    ];
    if (extendedMode) {
      days.push({ dayNumber: 6, title: 'Day 6: Fluency Challenge', activityType: 'phonics', description: 'Read longer passages at a steady pace without stopping.', targetPhoneme: 'FLUENCY', targetUrl: '/learning-module', actionLabel: 'Start Challenge', estimatedMinutes: 15, completed: false });
      days.push({ dayNumber: 7, title: 'Day 7: Fluency Mastery', activityType: 'story', description: 'Final fluency review. Read a full story with expression and clarity.', targetPhoneme: 'FLUENCY', targetUrl: '/learning-module', actionLabel: 'Final Fluency Review', estimatedMinutes: 20, completed: false });
    }
  } else {
    days = [
      { dayNumber: 1, title: 'Day 1: Sentence Building', activityType: 'drill', description: 'Construct sentences from vocabulary cards. Say each aloud.', targetPhoneme: 'MASTERY', targetUrl: '/learning-module', actionLabel: 'Start Sentence Quiz', estimatedMinutes: 12, completed: false },
      { dayNumber: 2, title: 'Day 2: Word Wall Hunt', activityType: 'phonics', description: 'Locate and say target words in a passage clearly.', targetPhoneme: 'MASTERY', targetUrl: '/learning-module', actionLabel: 'Start Word Hunt', estimatedMinutes: 10, completed: false },
      { dayNumber: 3, title: 'Day 3: Final Challenge', activityType: 'story', description: 'Combine all learned skills in one story. Read aloud with confidence.', targetPhoneme: 'MASTERY', targetUrl: '/learning-module', actionLabel: 'Read Final Story', estimatedMinutes: 15, completed: false },
      { dayNumber: 4, title: 'Day 4: Master Quiz', activityType: 'drill', description: 'Comprehensive speech quiz. Test all phonemes practiced this week.', targetPhoneme: 'MASTERY', targetUrl: '/learning-module', actionLabel: 'Take Master Quiz', estimatedMinutes: 15, completed: false },
      { dayNumber: 5, title: 'Day 5: Graduation Assessment', activityType: 'reading', description: 'Final comprehensive reading test. Give it your best!', targetPhoneme: 'MASTERY', targetUrl: '/overalltest', actionLabel: 'Complete Final Assessment', estimatedMinutes: 20, completed: false },
    ];
    if (extendedMode) {
      days.push({ dayNumber: 6, title: 'Day 6: Extended Practice', activityType: 'phonics', description: 'Additional review for all problem sounds before final test.', targetPhoneme: 'MASTERY', targetUrl: '/learning-module', actionLabel: 'Start Extended Review', estimatedMinutes: 15, completed: false });
      days.push({ dayNumber: 7, title: 'Day 7: Final Polish', activityType: 'story', description: 'Polish up any remaining weak areas. Read your mastery story one last time.', targetPhoneme: 'MASTERY', targetUrl: '/learning-module', actionLabel: 'Final Polish', estimatedMinutes: 20, completed: false });
    }
  }
  return days;
}

export async function getActivePath(userId) {
  const path = await LearningPath.findOne({ user: userId, status: 'active' }).populate('user');
  return path;
}

export async function completeTask(pathId, weekNumber, dayNumber, userId) {
  const week = await LearningPathWeek.findOne({ path: pathId, weekNumber });
  if (!week) throw new Error('Week not found');
  const days = week.days;
  const task = days.find(d => d.dayNumber === dayNumber);
  if (!task) throw new Error('Task not found');
  task.completed = true;
  task.completedAt = new Date();
  const allCompleted = days.every(d => d.completed);
  if (allCompleted) {
    week.completed = true;
    week.completedAt = new Date();
  }
  await week.save();
  return { week, task };
}
