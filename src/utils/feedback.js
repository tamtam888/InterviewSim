/**
 * Local heuristic feedback engine.
 * Scores an answer 0–100 and produces localized strengths / improvements.
 * This is guidance, not a real evaluation — and the UI says so.
 */

const STAR_SIGNALS = {
  en: [
    "situation", "when i", "i was", "my task", "i decided", "i did",
    "as a result", "the result", "we achieved", "led to", "outcome",
    "for example", "in my last", "in my previous", "at my",
  ],
  he: [
    "כאשר", "כש", "המשימה", "החלטתי", "עשיתי", "פעלתי",
    "כתוצאה", "התוצאה", "השגנו", "הוביל ל", "לדוגמה", "למשל",
    "בתפקיד הקודם", "בפרויקט",
  ],
};

const SPECIFICITY_REGEX = /\d|%|\$|₪/;

const FILLERS = {
  en: ["like,", "you know", "stuff", "things like that", "whatever", "etc etc"],
  he: ["כאילו", "אתה יודע", "דברים כאלה", "וזהו", "משהו כזה"],
};

const MESSAGES = {
  // strengths
  sLength: {
    en: "Good answer length — detailed enough to show real thinking.",
    he: "אורך תשובה טוב — מפורט מספיק כדי להראות חשיבה אמיתית.",
  },
  sStructure: {
    en: "Nice use of story structure — you describe a situation, your actions, and a result.",
    he: "שימוש יפה במבנה סיפורי — תיארתם מצב, פעולות ותוצאה.",
  },
  sSpecific: {
    en: "You used concrete details and numbers — that makes answers credible and memorable.",
    he: "השתמשתם בפרטים קונקרטיים ומספרים — זה הופך תשובה לאמינה וזכירה.",
  },
  sKeywords: {
    en: "You touched on the key topics interviewers listen for in this question.",
    he: "נגעתם בנושאים המרכזיים שמראיינים מקשיבים להם בשאלה הזו.",
  },
  sClear: {
    en: "Clear, focused sentences — easy for an interviewer to follow.",
    he: "משפטים ברורים וממוקדים — קל למראיין לעקוב.",
  },
  // improvements
  iTooShort: {
    en: "The answer is very short. Aim for 4–8 sentences: context, what you did, and the result.",
    he: "התשובה קצרה מאוד. כוונו ל-4–8 משפטים: הקשר, מה עשיתם והתוצאה.",
  },
  iTooLong: {
    en: "The answer runs long. Trim it to the strongest points — interviewers lose focus after ~90 seconds.",
    he: "התשובה ארוכה מדי. צמצמו לנקודות החזקות — מראיינים מאבדים ריכוז אחרי כ-90 שניות.",
  },
  iNoExample: {
    en: "Add a concrete example from your experience — 'for example, in my last project…' turns claims into proof.",
    he: "הוסיפו דוגמה קונקרטית מהניסיון שלכם — 'לדוגמה, בפרויקט האחרון…' הופך טענות להוכחות.",
  },
  iNoNumbers: {
    en: "Add numbers or measurable results (time saved, % improvement, team size) to strengthen impact.",
    he: "הוסיפו מספרים או תוצאות מדידות (זמן שנחסך, אחוז שיפור, גודל צוות) לחיזוק ההשפעה.",
  },
  iKeywords: {
    en: "Consider covering more of the core topics this question targets — see the suggested answer below.",
    he: "שקלו לכסות יותר מהנושאים שהשאלה מכוונת אליהם — ראו את התשובה המוצעת למטה.",
  },
  iFillers: {
    en: "Watch out for filler words — they weaken an otherwise good answer.",
    he: "שימו לב למילות מילוי — הן מחלישות תשובה טובה.",
  },
  iStructure: {
    en: "Try the STAR structure: Situation → Task → Action → Result. It keeps answers organized and complete.",
    he: "נסו את מבנה STAR: מצב ← משימה ← פעולה ← תוצאה. הוא שומר על תשובה מאורגנת ושלמה.",
  },
  // skipped
  skipped: {
    en: "You skipped this question. Try answering even imperfectly — practicing the hard ones is where growth happens.",
    he: "דילגתם על השאלה. נסו לענות גם באופן לא מושלם — דווקא תרגול השאלות הקשות מצמיח.",
  },
};

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function msg(key, lang) {
  return MESSAGES[key][lang] ?? MESSAGES[key].en;
}

/**
 * Evaluate one answer.
 * @returns {{score:number, strengths:string[], improvements:string[], skipped:boolean}}
 */
export function evaluateAnswer(question, answerText, lang = "en") {
  const text = (answerText ?? "").trim();

  if (!text) {
    return {
      score: 0,
      skipped: true,
      strengths: [],
      improvements: [msg("skipped", lang)],
    };
  }

  const lower = text.toLowerCase();
  const words = countWords(text);
  const strengths = [];
  const improvements = [];
  let score = 30; // base for attempting an answer

  // 1) Length (up to 25 pts)
  if (words >= 40 && words <= 220) {
    score += 25;
    strengths.push(msg("sLength", lang));
  } else if (words >= 20) {
    score += 15;
    if (words > 220) improvements.push(msg("iTooLong", lang));
  } else {
    score += 5;
    improvements.push(msg("iTooShort", lang));
  }

  // 2) Story structure / STAR signals (up to 15 pts)
  const starHits = [...STAR_SIGNALS.en, ...STAR_SIGNALS.he].filter((s) =>
    lower.includes(s)
  ).length;
  if (starHits >= 2) {
    score += 15;
    strengths.push(msg("sStructure", lang));
  } else if (starHits === 1) {
    score += 8;
  } else {
    improvements.push(
      question.type === "technical" ? msg("iNoExample", lang) : msg("iStructure", lang)
    );
  }

  // 3) Specificity: numbers / measurable detail (up to 10 pts)
  if (SPECIFICITY_REGEX.test(text)) {
    score += 10;
    strengths.push(msg("sSpecific", lang));
  } else {
    improvements.push(msg("iNoNumbers", lang));
  }

  // 4) Keyword coverage for this question (up to 15 pts)
  const keywordPool = [
    ...(question.keywords?.en ?? []),
    ...(question.keywords?.he ?? []),
  ];
  const keywordHits = keywordPool.filter((k) =>
    lower.includes(k.toLowerCase())
  ).length;
  if (keywordHits >= 3) {
    score += 15;
    strengths.push(msg("sKeywords", lang));
  } else if (keywordHits >= 1) {
    score += 8;
  } else {
    improvements.push(msg("iKeywords", lang));
  }

  // 5) Clarity: average sentence length (up to 5 pts)
  const sentences = text.split(/[.!?。\n]+/).filter((s) => s.trim().length > 0);
  const avgSentenceWords = sentences.length ? words / sentences.length : words;
  if (avgSentenceWords <= 28 && sentences.length >= 2) {
    score += 5;
    strengths.push(msg("sClear", lang));
  }

  // 6) Filler words (small penalty)
  const fillerHits = [...FILLERS.en, ...FILLERS.he].filter((f) =>
    lower.includes(f)
  ).length;
  if (fillerHits > 0) {
    score -= Math.min(8, fillerHits * 4);
    improvements.push(msg("iFillers", lang));
  }

  score = Math.max(5, Math.min(100, Math.round(score)));

  // Keep feedback digestible
  return {
    score,
    skipped: false,
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
  };
}

const RECOMMENDATIONS = {
  practiceStar: {
    en: "Practice the STAR structure (Situation, Task, Action, Result) until it's automatic — it fits almost every behavioral question.",
    he: "תרגלו את מבנה STAR (מצב, משימה, פעולה, תוצאה) עד שהוא אוטומטי — הוא מתאים כמעט לכל שאלה התנהגותית.",
  },
  addNumbers: {
    en: "Prepare 3–4 stories from your experience with concrete numbers — you can reuse them across many questions.",
    he: "הכינו 3–4 סיפורים מהניסיון שלכם עם מספרים קונקרטיים — אפשר למחזר אותם בהרבה שאלות.",
  },
  answerEverything: {
    en: "Don't skip hard questions in a real interview — say what you do know and how you'd find the rest.",
    he: "אל תדלגו על שאלות קשות בראיון אמיתי — אמרו מה אתם כן יודעים ואיך תבררו את השאר.",
  },
  keepPracticing: {
    en: "Strong session! Try a harder mode: longer sessions or a different interview type to widen your range.",
    he: "סשן חזק! נסו מצב מאתגר יותר: סשנים ארוכים יותר או סוג ראיון אחר להרחבת הטווח.",
  },
  expandAnswers: {
    en: "Several answers were short. In a real interview, aim for 60–90 seconds per answer with one concrete example.",
    he: "כמה תשובות היו קצרות. בראיון אמיתי, כוונו ל-60–90 שניות לתשובה עם דוגמה קונקרטית אחת.",
  },
};

/**
 * Session-level summary: overall score + tailored recommendations.
 */
export function summarizeSession(results, lang = "en") {
  const answered = results.filter((r) => !r.feedback.skipped);
  const skippedCount = results.length - answered.length;

  const overall =
    answered.length === 0
      ? 0
      : Math.round(
          answered.reduce((sum, r) => sum + r.feedback.score, 0) / answered.length
        );

  const totalWords = answered.reduce(
    (sum, r) => sum + countWords(r.answer),
    0
  );
  const avgWords = answered.length
    ? Math.round(totalWords / answered.length)
    : 0;

  const recs = [];
  if (skippedCount > 0) recs.push(RECOMMENDATIONS.answerEverything[lang]);
  if (avgWords > 0 && avgWords < 35) recs.push(RECOMMENDATIONS.expandAnswers[lang]);

  const noNumbers = answered.filter((r) => !SPECIFICITY_REGEX.test(r.answer));
  if (answered.length > 0 && noNumbers.length >= answered.length / 2) {
    recs.push(RECOMMENDATIONS.addNumbers[lang]);
  }
  if (overall < 70) recs.push(RECOMMENDATIONS.practiceStar[lang]);
  if (recs.length === 0) recs.push(RECOMMENDATIONS.keepPracticing[lang]);

  return {
    overall,
    answeredCount: answered.length,
    skippedCount,
    avgWords,
    recommendations: recs.slice(0, 3),
  };
}
