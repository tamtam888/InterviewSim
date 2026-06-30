/**
 * Technical / role-specific questions — product, uxui, data, support, general.
 */
export const TECHNICAL_NONDEV_QUESTIONS = [
  /* ---------- Product Manager ---------- */
  {
    id: "pm-prioritize",
    role: "product",
    type: "technical",
    level: "mid",
    text: {
      en: "You have ten feature requests and capacity for two. How do you decide what to build?",
      he: "יש לכם עשר בקשות לפיצ'רים וקיבולת לשניים. איך תחליטו מה לבנות?",
    },
    tip: {
      en: "Name a framework (RICE, impact/effort) but show judgment beyond it.",
      he: "ציינו מסגרת (RICE, השפעה/מאמץ) אבל הראו שיקול דעת מעבר לה.",
    },
    model: {
      en: "I'd score them against the product goal for the quarter — a framework like RICE helps: reach, impact, confidence, effort. But the framework just structures the conversation; the real work is validating assumptions, talking to customers behind the requests, checking what data we have, and weighing strategic bets versus quick wins. I'd also ask what we're saying no to and make that explicit to stakeholders, because prioritization without communicating trade-offs creates resentment later.",
      he: "אדרג אותן מול מטרת המוצר לרבעון — מסגרת כמו RICE עוזרת: reach, impact, confidence, effort. אבל המסגרת רק מבנה את השיחה; העבודה האמיתית היא לאמת הנחות, לדבר עם הלקוחות שמאחורי הבקשות, לבדוק איזה דאטה יש לנו ולשקול הימורים אסטרטגיים מול ניצחונות מהירים. אשאל גם למה אנחנו אומרים לא ואהפוך את זה למפורש מול בעלי העניין, כי תעדוף בלי תקשור פשרות יוצר מרירות אחר כך.",
    },
    keywords: {
      en: ["rice", "impact", "effort", "data", "customers", "trade-off"],
      he: ["השפעה", "מאמץ", "דאטה", "לקוחות", "פשרה", "מטרה"],
    },
  },
  {
    id: "pm-metrics",
    role: "product",
    type: "technical",
    level: "mid",
    text: {
      en: "You just launched a new feature. How do you know if it's successful?",
      he: "השקתם פיצ'ר חדש. איך תדעו אם הוא מצליח?",
    },
    tip: {
      en: "Define success metrics before launch; separate adoption, engagement, and outcome metrics.",
      he: "הגדירו מדדי הצלחה לפני ההשקה; הפרידו בין אימוץ, מעורבות ותוצאה.",
    },
    model: {
      en: "Success criteria should be set before launch, tied to the problem the feature solves. I'd track three layers: adoption — what share of target users try it; engagement — do they come back and complete the core action; and outcome — does it move the business or user metric we built it for, like retention or support ticket reduction. I'd also watch guardrail metrics to make sure it doesn't hurt something else, and pair the numbers with qualitative feedback. If we can A/B test the rollout, even better — that separates the feature's effect from seasonality.",
      he: "קריטריוני הצלחה נקבעים לפני ההשקה, צמודים לבעיה שהפיצ'ר פותר. אעקוב אחרי שלוש שכבות: אימוץ — איזה אחוז ממשתמשי היעד מנסים; מעורבות — האם הם חוזרים ומשלימים את הפעולה המרכזית; ותוצאה — האם זה מזיז את מדד העסק או המשתמש שלשמו בנינו, כמו שימור או ירידה בפניות תמיכה. אשגיח גם על מדדי guardrail כדי לוודא שלא פגענו במשהו אחר, ואצמיד למספרים פידבק איכותני. אם אפשר A/B test בהשקה — עוד יותר טוב, זה מפריד את אפקט הפיצ'ר מעונתיות.",
    },
    keywords: {
      en: ["metrics", "adoption", "retention", "a/b", "baseline", "qualitative"],
      he: ["מדדים", "אימוץ", "שימור", "ניסוי", "תוצאה", "פידבק"],
    },
  },
  {
    id: "pm-stakeholders",
    role: "product",
    type: "technical",
    level: "mid",
    text: {
      en: "The CEO wants a feature that your user research says nobody needs. What do you do?",
      he: "המנכ\"ל רוצה פיצ'ר שמחקר המשתמשים שלכם אומר שאף אחד לא צריך. מה תעשו?",
    },
    tip: {
      en: "Don't just say no — understand the underlying goal, bring data, propose alternatives.",
      he: "אל תגידו סתם לא — הבינו את המטרה שמאחורי הבקשה, הביאו דאטה והציעו חלופות.",
    },
    model: {
      en: "First I'd understand why the CEO wants it — executives often have context I don't: a strategic deal, a competitor move, a board commitment. Then I'd share the research transparently: here's what users told us, here's the risk. If the goals conflict, I'd propose a cheap test — a prototype, a landing-page experiment, a limited rollout — so evidence decides rather than opinions. And if the decision is still to build it, I commit fully and define success metrics so we learn either way. Disagree with data, commit without sulking.",
      he: "קודם אבין למה המנכ\"ל רוצה את זה — להנהלה יש לעתים הקשר שאין לי: עסקה אסטרטגית, מהלך של מתחרה, התחייבות לבורד. אז אשתף את המחקר בשקיפות: הנה מה שמשתמשים אמרו, הנה הסיכון. אם המטרות מתנגשות, אציע בדיקה זולה — אב-טיפוס, ניסוי דף נחיתה, השקה מוגבלת — כדי שראיות יכריעו ולא דעות. ואם ההחלטה עדיין לבנות, אני מתחייב/ת במלואי ומגדיר/ה מדדי הצלחה כדי שנלמד בכל מקרה. לחלוק עם דאטה, להתחייב בלי להתבאס.",
    },
    keywords: {
      en: ["why", "data", "research", "test", "alternative", "commit"],
      he: ["למה", "דאטה", "מחקר", "ניסוי", "חלופה", "מחויבות"],
    },
  },
  {
    id: "pm-discovery",
    role: "product",
    type: "technical",
    level: "mid",
    text: {
      en: "How do you figure out what problem to solve before writing any requirements?",
      he: "איך אתם מזהים איזו בעיה לפתור לפני שכותבים בכלל דרישות?",
    },
    tip: {
      en: "User interviews, data analysis, problem framing — discovery before delivery.",
      he: "ראיונות משתמשים, ניתוח דאטה, מסגור הבעיה — discovery לפני delivery.",
    },
    model: {
      en: "Discovery starts with evidence from two directions: qualitative — user interviews and support tickets to hear pains in users' own words — and quantitative — funnels and usage data to see where people actually struggle. I'd frame the problem as a hypothesis: 'users in segment X fail to do Y because Z', and validate it cheaply before committing — more interviews, a fake-door test, a prototype. The discipline is staying in the problem space long enough; the most expensive mistake in product is building a beautiful solution to a problem nobody has.",
      he: "Discovery מתחיל מראיות משני כיוונים: איכותני — ראיונות משתמשים ופניות תמיכה כדי לשמוע כאבים במילים של המשתמשים — וכמותי — משפכים ודאטת שימוש כדי לראות איפה אנשים באמת נתקעים. אמסגר את הבעיה כהיפותזה: 'משתמשים בסגמנט X לא מצליחים לעשות Y בגלל Z', ואאמת אותה בזול לפני התחייבות — עוד ראיונות, fake-door test, אב-טיפוס. המשמעת היא להישאר במרחב הבעיה מספיק זמן; הטעות הכי יקרה במוצר היא לבנות פתרון יפהפה לבעיה שאין לאף אחד.",
    },
    keywords: {
      en: ["interviews", "data", "hypothesis", "validate", "problem", "discovery"],
      he: ["ראיונות", "דאטה", "היפותזה", "אימות", "בעיה", "משתמשים"],
    },
  },

  /* ---------- UX/UI Designer ---------- */
  {
    id: "ux-process",
    role: "uxui",
    type: "technical",
    level: "mid",
    text: {
      en: "Walk me through your design process for a new feature, from brief to handoff.",
      he: "תארו את תהליך העיצוב שלכם לפיצ'ר חדש, מהבריף ועד ה-handoff.",
    },
    tip: {
      en: "Show a flexible process: research → ideation → prototype → test → iterate → handoff.",
      he: "הראו תהליך גמיש: מחקר ← רעיונות ← אב-טיפוס ← בדיקה ← איטרציה ← מסירה.",
    },
    model: {
      en: "I start by understanding the problem and success criteria with the PM, then look at data and user research — or run quick interviews if none exist. I explore broadly with low-fidelity sketches and user flows before committing, review feasibility with engineers early, then build a prototype and test it with five-or-so users. After iterating, I produce high-fidelity designs in the design system with documented states — empty, loading, error, edge cases — and stay involved during development for QA on the implementation. The process flexes with the project's size, but testing before building is the part I won't skip.",
      he: "אני מתחיל/ה בהבנת הבעיה וקריטריוני ההצלחה עם מנהל/ת המוצר, ואז בוחן/ת דאטה ומחקר משתמשים — או מריץ/ה ראיונות מהירים אם אין. אני חוקר/ת רחב עם סקיצות low-fidelity וזרימות משתמש לפני התחייבות, בודק/ת ישימות עם מהנדסים מוקדם, ואז בונה אב-טיפוס ובודק/ת אותו עם כחמישה משתמשים. אחרי איטרציות, אני מפיק/ה עיצובים סופיים בתוך מערכת העיצוב עם כל המצבים מתועדים — ריק, טעינה, שגיאה, מקרי קצה — ונשאר/ת מעורב/ת בפיתוח ל-QA על המימוש. התהליך גמיש לפי גודל הפרויקט, אבל בדיקה לפני בנייה היא החלק שלא אדלג עליו.",
    },
    keywords: {
      en: ["research", "prototype", "test", "iterate", "states", "handoff"],
      he: ["מחקר", "אב-טיפוס", "בדיקה", "איטרציה", "מצבים", "מסירה"],
    },
  },
  {
    id: "ux-feedback-conflict",
    role: "uxui",
    type: "technical",
    level: "mid",
    text: {
      en: "A stakeholder insists on a design change you believe hurts usability. How do you handle it?",
      he: "בעל עניין מתעקש על שינוי עיצובי שאתם מאמינים שפוגע בשמישות. איך תתמודדו?",
    },
    tip: {
      en: "Anchor in user evidence, not taste. Offer to test both options.",
      he: "התבססו על ראיות ממשתמשים, לא על טעם. הציעו לבדוק את שתי האפשרויות.",
    },
    model: {
      en: "I'd move the conversation from opinions to evidence. First, understand their goal — often the request is a solution to a real concern I can address differently. Then I'd explain the usability risk in terms of their goal: 'this pattern hid the action in testing, which would lower the conversion you care about'. If we still disagree, I'd propose a quick usability test or A/B of both versions — cheap, fast, and it depersonalizes the decision. I document the outcome either way. Design authority comes from evidence and empathy, not from 'trust me, I'm the designer'.",
      he: "אעביר את השיחה מדעות לראיות. קודם אבין את המטרה שלהם — לעתים קרובות הבקשה היא פתרון לדאגה אמיתית שאפשר לפתור אחרת. אז אסביר את סיכון השמישות במונחי המטרה שלהם: 'הדפוס הזה הסתיר את הפעולה בבדיקות, מה שיוריד את ההמרה שחשובה לך'. אם עדיין חולקים, אציע בדיקת שמישות מהירה או A/B של שתי הגרסאות — זול, מהיר ומוציא את האגו מההחלטה. בכל מקרה אתעד את התוצאה. סמכות עיצובית מגיעה מראיות ואמפתיה, לא מ'סמוך עליי, אני המעצב'.",
    },
    keywords: {
      en: ["evidence", "test", "goal", "usability", "data", "a/b"],
      he: ["ראיות", "בדיקה", "מטרה", "שמישות", "דאטה", "המרה"],
    },
  },
  {
    id: "ux-design-system",
    role: "uxui",
    type: "technical",
    level: "mid",
    text: {
      en: "What is a design system, and what makes one succeed or fail in practice?",
      he: "מהי מערכת עיצוב (design system), ומה גורם לה להצליח או להיכשל בפועל?",
    },
    tip: {
      en: "More than a UI kit: tokens, components, guidelines, governance, adoption.",
      he: "יותר מ-UI kit: טוקנים, קומפוננטות, הנחיות, ממשל ואימוץ.",
    },
    model: {
      en: "A design system is a shared language between design and code: design tokens for color, spacing and type; reusable components with defined states and accessibility built in; and usage guidelines explaining when to use what. It succeeds when it's treated as a product — with owners, versioning, a contribution process, and tight sync between the Figma library and the code components. It fails when it's a static style guide nobody maintains, when it's too rigid to cover real needs so teams fork it, or when adoption is mandated without support. The measure of success is teams shipping faster with fewer inconsistencies.",
      he: "מערכת עיצוב היא שפה משותפת בין עיצוב לקוד: טוקנים לצבע, ריווח וטיפוגרפיה; קומפוננטות לשימוש חוזר עם מצבים מוגדרים ונגישות מובנית; והנחיות שימוש שמסבירות מתי להשתמש במה. היא מצליחה כשמתייחסים אליה כמוצר — עם בעלים, גרסאות, תהליך תרומה וסנכרון הדוק בין ספריית הפיגמה לקומפוננטות בקוד. היא נכשלת כשהיא מדריך סגנון סטטי שאיש לא מתחזק, כשהיא נוקשה מדי ולא מכסה צרכים אמיתיים אז צוותים עוקפים אותה, או כשכופים אימוץ בלי תמיכה. מדד ההצלחה הוא צוותים שמשחררים מהר יותר עם פחות חוסר עקביות.",
    },
    keywords: {
      en: ["tokens", "components", "guidelines", "adoption", "consistency", "maintain"],
      he: ["טוקנים", "קומפוננטות", "הנחיות", "אימוץ", "עקביות", "תחזוקה"],
    },
  },
  {
    id: "ux-research-nodata",
    role: "uxui",
    type: "technical",
    level: "mid",
    text: {
      en: "You're asked to redesign a flow but there's no budget or time for user research. What do you do?",
      he: "מבקשים מכם לעצב מחדש זרימה אבל אין תקציב או זמן למחקר משתמשים. מה תעשו?",
    },
    tip: {
      en: "Scrappy research: analytics, support tickets, heuristics, guerrilla testing, internal users.",
      he: "מחקר מאולתר: אנליטיקס, פניות תמיכה, היוריסטיקות, בדיקות גרילה ומשתמשים פנימיים.",
    },
    model: {
      en: "No budget doesn't mean no evidence. I'd mine what already exists: analytics to see where users drop off, support tickets and sales call notes for verbatim pains, session recordings if available, and a heuristic evaluation of the current flow. For validation, guerrilla methods work: testing a prototype with five colleagues outside my team, or a few customers recruited via support, catches the worst problems in a day. I'd also be honest with stakeholders about the confidence level and frame the launch as something we monitor closely — research debt you acknowledge is manageable; invisible debt isn't.",
      he: "אין תקציב לא אומר אין ראיות. אכרה את מה שכבר קיים: אנליטיקס כדי לראות איפה משתמשים נושרים, פניות תמיכה וסיכומי שיחות מכירה לכאבים במילים שלהם, הקלטות סשנים אם יש, והערכה היוריסטית של הזרימה הנוכחית. לאימות, שיטות גרילה עובדות: בדיקת אב-טיפוס עם חמישה קולגות מחוץ לצוות, או כמה לקוחות שגויסו דרך התמיכה, תופסת את הבעיות הקשות ביום אחד. אהיה גם כן/ה עם בעלי העניין לגבי רמת הביטחון ואמסגר את ההשקה ככזו שמנטרים מקרוב — חוב מחקרי שמודים בו הוא בר-ניהול; חוב בלתי נראה לא.",
    },
    keywords: {
      en: ["analytics", "support", "heuristic", "guerrilla", "prototype", "evidence"],
      he: ["אנליטיקס", "תמיכה", "היוריסטי", "אב-טיפוס", "ראיות", "נשירה"],
    },
  },

  /* ---------- Data Analyst ---------- */
  {
    id: "da-metric-drop",
    role: "data",
    type: "technical",
    level: "mid",
    text: {
      en: "A key metric dropped 20% this week. Walk me through how you'd investigate.",
      he: "מדד מרכזי ירד ב-20% השבוע. תארו איך תחקרו את זה.",
    },
    tip: {
      en: "Validate the data first, then segment, then correlate with changes/events.",
      he: "קודם אמתו את הדאטה, אחר כך פלחו, ואז הצליבו עם שינויים ואירועים.",
    },
    model: {
      en: "Step one: rule out a data problem — tracking changes, pipeline failures, definition changes — because a surprising number of 'drops' are instrumentation bugs. Step two: segment the drop — by platform, geography, user cohort, acquisition channel — to see if it's broad or isolated. Step three: correlate the timing with events: releases, marketing changes, pricing, seasonality, even external factors like a competitor or holiday. Then form hypotheses and test them against the data. I'd communicate early with a status like 'investigating, data validity confirmed, drop isolated to mobile signups' rather than going silent until I have the full story.",
      he: "שלב ראשון: לשלול בעיית דאטה — שינויי tracking, כשלי pipeline, שינויי הגדרה — כי מספר מפתיע של 'ירידות' הן באגי אינסטרומנטציה. שלב שני: לפלח את הירידה — פלטפורמה, גיאוגרפיה, קוהורט, ערוץ רכישה — כדי לראות אם היא רוחבית או מבודדת. שלב שלישי: להצליב תזמון עם אירועים: שחרורים, שינויי שיווק, תמחור, עונתיות, ואפילו גורמים חיצוניים כמו מתחרה או חג. ואז לגבש היפותזות ולבחון מול הדאטה. אתקשר מוקדם עם סטטוס כמו 'בחקירה, תקינות הדאטה אומתה, הירידה מבודדת להרשמות מובייל' במקום להיעלם עד שיש סיפור מלא.",
    },
    keywords: {
      en: ["validate", "segment", "tracking", "correlate", "hypothesis", "cohort"],
      he: ["אימות", "פילוח", "הצלבה", "היפותזה", "דאטה", "שינוי"],
    },
  },
  {
    id: "da-sql",
    role: "data",
    type: "technical",
    level: "mid",
    text: {
      en: "Explain the difference between INNER JOIN and LEFT JOIN, and describe a case where choosing wrong changes the business answer.",
      he: "הסבירו את ההבדל בין INNER JOIN ל-LEFT JOIN, ותארו מקרה שבו בחירה שגויה משנה את התשובה העסקית.",
    },
    tip: {
      en: "Definition plus a concrete example with missing rows changing a metric.",
      he: "הגדרה ועוד דוגמה קונקרטית שבה שורות חסרות משנות מדד.",
    },
    model: {
      en: "INNER JOIN returns only rows that match in both tables; LEFT JOIN keeps every row from the left table, filling NULLs where the right side has no match. The classic trap: 'average orders per customer' with customers INNER JOIN orders silently drops customers who never ordered, inflating the average and hiding your inactive-customer problem. With a LEFT JOIN those customers appear with zero orders and the answer changes materially. My habit: always ask 'do I need to keep rows without a match?' and sanity-check row counts before and after the join.",
      he: "INNER JOIN מחזיר רק שורות עם התאמה בשתי הטבלאות; LEFT JOIN שומר כל שורה מהטבלה השמאלית וממלא NULL כשאין התאמה מימין. המלכודת הקלאסית: 'ממוצע הזמנות ללקוח' עם customers INNER JOIN orders משמיט בשקט לקוחות שמעולם לא הזמינו, מנפח את הממוצע ומסתיר את בעיית הלקוחות הלא-פעילים. עם LEFT JOIN הלקוחות האלה מופיעים עם אפס הזמנות והתשובה משתנה מהותית. ההרגל שלי: תמיד לשאול 'האם אני צריך לשמור שורות בלי התאמה?' ולבדוק ספירת שורות לפני ואחרי ה-join.",
    },
    keywords: {
      en: ["inner", "left", "null", "match", "rows", "average"],
      he: ["התאמה", "שורות", "ממוצע", "לקוחות", "טבלה", "מדד"],
    },
  },
  {
    id: "da-storytelling",
    role: "data",
    type: "technical",
    level: "mid",
    text: {
      en: "How do you present analysis to non-technical stakeholders so it actually drives a decision?",
      he: "איך תציגו ניתוח לבעלי עניין לא-טכניים כך שבאמת יוביל להחלטה?",
    },
    tip: {
      en: "Lead with the recommendation, not the methodology. Visuals over tables.",
      he: "פתחו בהמלצה, לא במתודולוגיה. ויזואליה במקום טבלאות.",
    },
    model: {
      en: "I lead with the answer: 'We should do X because Y' — one slide, one chart, one recommendation. Then the supporting evidence in plain language, framed around the business question rather than the analysis steps. Methodology and caveats go in an appendix for those who want depth. Visually: one message per chart, annotated directly, no walls of numbers. I always include what action I'm recommending and what it costs to be wrong, because analysis without a decision attached is just trivia. And I pre-share with key stakeholders before the meeting — surprises create resistance.",
      he: "אני פותח/ת בתשובה: 'כדאי לעשות X בגלל Y' — שקף אחד, גרף אחד, המלצה אחת. אחר כך הראיות התומכות בשפה פשוטה, ממוסגרות סביב השאלה העסקית ולא סביב שלבי הניתוח. מתודולוגיה והסתייגויות עוברות לנספח למי שרוצה עומק. ויזואלית: מסר אחד לכל גרף, עם הערות ישירות על הגרף, בלי קירות של מספרים. אני תמיד כולל/ת איזו פעולה אני ממליץ/ה ומה עלות הטעות, כי ניתוח בלי החלטה מחוברת הוא סתם טריוויה. ואני משתף/ת מראש בעלי עניין מרכזיים לפני הפגישה — הפתעות יוצרות התנגדות.",
    },
    keywords: {
      en: ["recommendation", "visual", "decision", "simple", "chart", "action"],
      he: ["המלצה", "ויזואלי", "החלטה", "פשוט", "גרף", "פעולה"],
    },
  },
  {
    id: "da-dirty-data",
    role: "data",
    type: "technical",
    level: "mid",
    text: {
      en: "You receive a dataset full of duplicates, missing values, and inconsistent formats. What's your process?",
      he: "קיבלתם דאטהסט מלא בכפילויות, ערכים חסרים ופורמטים לא עקביים. מה התהליך שלכם?",
    },
    tip: {
      en: "Profile first, document decisions, never overwrite raw data.",
      he: "קודם פרופיילינג, תעדו החלטות, ולעולם אל תדרסו את הדאטה הגולמי.",
    },
    model: {
      en: "First, profile before touching anything: row counts, distributions, null rates per column, duplicate patterns — understand the mess before cleaning it. Then clean with rules I document: define what makes a duplicate before dropping, decide per column whether missing values mean zero, unknown, or should exclude the row, and standardize formats like dates and casing. Two principles throughout: keep the raw data untouched and work on a copy with a reproducible script, and ask the data owner about anything ambiguous — silent assumptions are how analyses go quietly wrong. The cleaning log becomes part of the deliverable.",
      he: "קודם פרופיילינג לפני שנוגעים: ספירת שורות, התפלגויות, אחוזי NULL לכל עמודה, דפוסי כפילויות — להבין את הבלגן לפני שמנקים. אז ניקוי עם כללים מתועדים: להגדיר מהי כפילות לפני שמוחקים, להחליט לכל עמודה אם ערך חסר משמעו אפס, לא ידוע, או הוצאת השורה, ולתקנן פורמטים כמו תאריכים ואותיות. שני עקרונות לאורך הדרך: הדאטה הגולמי נשאר ללא שינוי ועובדים על עותק עם סקריפט שחזיר, ושואלים את בעל הדאטה על כל דבר עמום — הנחות שקטות הן הדרך שבה ניתוחים משתבשים בשקט. יומן הניקוי הופך לחלק מהתוצר.",
    },
    keywords: {
      en: ["profile", "duplicates", "missing", "document", "raw", "reproducible"],
      he: ["פרופיילינג", "כפילויות", "חסרים", "תיעוד", "גולמי", "שחזור"],
    },
  },

  /* ---------- Customer Support / Success ---------- */
  {
    id: "cs-angry-customer",
    role: "support",
    type: "technical",
    level: "mid",
    text: {
      en: "A customer is furious about a bug that lost them a day of work. Walk me through the conversation.",
      he: "לקוח זועם על באג שגרם לו לאבד יום עבודה. תארו את השיחה.",
    },
    tip: {
      en: "Acknowledge → empathize → own it → concrete next steps → follow up.",
      he: "הכרה ← אמפתיה ← לקיחת אחריות ← צעדים קונקרטיים ← מעקב.",
    },
    model: {
      en: "First, let them vent and genuinely acknowledge the impact: 'Losing a day of work is a serious disruption — I understand why you're angry, and I'm sorry.' No defensiveness, no hiding behind policy. Then take ownership: I'm their single point of contact even if engineering fixes it. Next, concrete action: what I'm doing right now, a realistic timeline, and a workaround if one exists. I'd check whether their lost work is recoverable and escalate compensation if appropriate. Finally, follow up proactively until resolved — angry customers who feel heard and see action often become the most loyal ones.",
      he: "קודם נותנים להם לפרוק ומכירים באמת בנזק: 'לאבד יום עבודה זו פגיעה רצינית — אני מבין/ה למה אתה כועס, ואני מתנצל/ת.' בלי התגוננות, בלי להסתתר מאחורי נהלים. אז לוקחים בעלות: אני נקודת הקשר היחידה שלהם גם אם ההנדסה מתקנת. בהמשך, פעולה קונקרטית: מה אני עושה ממש עכשיו, לוח זמנים ריאלי ומעקף אם קיים. אבדוק אם העבודה שאבדה ניתנת לשחזור ואסלים פיצוי אם מתאים. ולבסוף, מעקב יזום עד לפתרון — לקוחות כועסים שמרגישים שנשמעו ורואים פעולה הופכים לא פעם לנאמנים ביותר.",
    },
    keywords: {
      en: ["empathy", "acknowledge", "ownership", "timeline", "follow up", "escalate"],
      he: ["אמפתיה", "הכרה", "אחריות", "מעקב", "פתרון", "הסלמה"],
    },
  },
  {
    id: "cs-no-answer",
    role: "support",
    type: "technical",
    level: "mid",
    text: {
      en: "A customer asks something you don't know the answer to. What do you do?",
      he: "לקוח שואל משהו שאתם לא יודעים את התשובה עליו. מה תעשו?",
    },
    tip: {
      en: "Honesty + ownership of finding the answer. Never guess.",
      he: "כנות + אחריות למצוא את התשובה. לעולם לא לנחש.",
    },
    model: {
      en: "I never guess — a confident wrong answer costs more trust than 'I don't know yet'. I'd say: 'Good question — I want to give you an accurate answer, so let me check with our team. You'll hear from me by end of day.' Then I actually find out: knowledge base, senior colleagues, or the relevant engineer. I follow up when promised even if the answer isn't ready — a status update beats silence. Afterwards, I document the answer in the knowledge base so the whole team can answer it next time. Each 'I don't know' should become organizational knowledge.",
      he: "אני אף פעם לא מנחש/ת — תשובה שגויה בביטחון עולה יותר אמון מ'אני עדיין לא יודע'. אגיד: 'שאלה מצוינת — אני רוצה לתת לך תשובה מדויקת, אז אבדוק עם הצוות. תקבל ממני תשובה עד סוף היום.' ואז באמת אברר: מאגר ידע, קולגות בכירים או המהנדס הרלוונטי. אחזור כשהבטחתי גם אם התשובה לא מוכנה — עדכון סטטוס עדיף על שתיקה. אחר כך אתעד את התשובה במאגר הידע כדי שכל הצוות יוכל לענות בפעם הבאה. כל 'אני לא יודע' צריך להפוך לידע ארגוני.",
    },
    keywords: {
      en: ["honest", "check", "follow up", "document", "knowledge", "promise"],
      he: ["כנות", "בדיקה", "מעקב", "תיעוד", "ידע", "הבטחה"],
    },
  },
  {
    id: "cs-churn-risk",
    role: "support",
    type: "technical",
    level: "mid",
    text: {
      en: "You notice a key customer's usage has dropped sharply. How do you handle the renewal risk?",
      he: "שמתם לב שהשימוש של לקוח מרכזי צנח. איך תטפלו בסיכון לאי-חידוש?",
    },
    tip: {
      en: "Proactive outreach, diagnose the root cause, build a success plan with the customer.",
      he: "פנייה יזומה, אבחון סיבת השורש ובניית תוכנית הצלחה עם הלקוח.",
    },
    model: {
      en: "Act early — by renewal time it's too late. First, investigate internally: which features dropped, did a champion leave, were there recent support escalations. Then reach out proactively, not with a sales pitch but with curiosity: 'I noticed your team's usage changed — I'd love to understand what's going on and whether we're still solving the right problem for you.' Based on that conversation, build a joint success plan: retraining, configuration changes, escalating product gaps internally, or connecting them with our roadmap. I'd also flag the risk to the account owner immediately — churn prevention is a team sport, and surprises help nobody.",
      he: "לפעול מוקדם — בזמן החידוש זה כבר מאוחר. קודם חקירה פנימית: אילו פיצ'רים ירדו, האם צ'מפיון עזב, האם היו הסלמות תמיכה לאחרונה. אז פנייה יזומה, לא במכירה אלא בסקרנות: 'שמתי לב שהשימוש של הצוות שלכם השתנה — אשמח להבין מה קורה והאם אנחנו עדיין פותרים לכם את הבעיה הנכונה.' על בסיס השיחה, בניית תוכנית הצלחה משותפת: הדרכה מחדש, שינויי קונפיגורציה, הסלמת פערי מוצר פנימה, או חיבור ל-roadmap שלנו. אדגל גם את הסיכון מול בעל החשבון מיד — מניעת נטישה היא ספורט קבוצתי, והפתעות לא עוזרות לאף אחד.",
    },
    keywords: {
      en: ["proactive", "usage", "root cause", "plan", "renewal", "escalate"],
      he: ["יזום", "שימוש", "סיבת שורש", "תוכנית", "חידוש", "הסלמה"],
    },
  },
  {
    id: "cs-prioritize-tickets",
    role: "support",
    type: "technical",
    level: "mid",
    text: {
      en: "Your queue has 40 open tickets and more coming in. How do you prioritize and keep customers informed?",
      he: "בתור שלכם 40 פניות פתוחות ועוד נכנסות. איך תתעדפו ותעדכנו את הלקוחות?",
    },
    tip: {
      en: "Triage by impact and urgency, batch similar issues, communicate wait expectations.",
      he: "טריאז' לפי השפעה ודחיפות, איגוד פניות דומות ותקשור ציפיות המתנה.",
    },
    model: {
      en: "Triage first: anything indicating an outage or data loss jumps the queue and gets escalated immediately — and if several tickets describe the same issue, that's an incident, so I'd post a status update that answers everyone at once. Then prioritize by impact and urgency: blocked paying customers before how-to questions, SLA commitments respected. Batching similar tickets with a saved-but-personalized response keeps quality up at speed. Crucially, everyone gets an acknowledgment with a realistic timeframe — customers tolerate waiting far better than silence. And afterwards I'd flag the top recurring issues, because the best queue management is preventing the tickets.",
      he: "קודם טריאז': כל מה שמעיד על תקלה רוחבית או אובדן דאטה קופץ לראש התור ומוסלם מיד — ואם כמה פניות מתארות את אותה בעיה, זה אינסידנט, אז אפרסם עדכון סטטוס שעונה לכולם בבת אחת. אז תעדוף לפי השפעה ודחיפות: לקוחות משלמים חסומים לפני שאלות how-to, עמידה בהתחייבויות SLA. איגוד פניות דומות עם תשובה שמורה אך מותאמת אישית שומר על איכות במהירות. וקריטית — כל אחד מקבל אישור קבלה עם מסגרת זמן ריאלית: לקוחות סובלים המתנה הרבה יותר טוב משתיקה. ובסוף אדגל את הבעיות החוזרות, כי ניהול התור הטוב ביותר הוא מניעת הפניות.",
    },
    keywords: {
      en: ["triage", "impact", "sla", "acknowledge", "batch", "incident"],
      he: ["טריאז", "השפעה", "עדכון", "דחיפות", "תור", "מניעה"],
    },
  },

  /* ---------- General Interview ---------- */
  {
    id: "gen-problem-solving",
    role: "general",
    type: "technical",
    level: "mid",
    text: {
      en: "Describe how you approach a problem you've never encountered before.",
      he: "תארו איך אתם ניגשים לבעיה שמעולם לא נתקלתם בה.",
    },
    tip: {
      en: "Show a method: understand, break down, research, try, verify, ask for help wisely.",
      he: "הראו שיטה: הבנה, פירוק, מחקר, ניסיון, אימות ובקשת עזרה נבונה.",
    },
    model: {
      en: "First I make sure I understand the actual problem, not the symptom — restating it in my own words and asking what success looks like. Then I break it into smaller parts and identify which piece is the truly unknown one. I research that piece — documentation, similar solved problems, colleagues who've faced it — and try the smallest possible experiment to test my understanding. If I'm stuck past a sensible time-box, I ask for help with context: here's what I tried, here's where I'm stuck. The method matters more than knowing everything upfront.",
      he: "קודם אני מוודא/ת שאני מבין/ה את הבעיה האמיתית ולא את הסימפטום — מנסח/ת אותה במילים שלי ושואל/ת איך נראית הצלחה. אז מפרק/ת לחלקים קטנים ומזהה איזה חלק הוא הלא-נודע האמיתי. את החלק הזה אני חוקר/ת — תיעוד, בעיות דומות שנפתרו, קולגות שהתמודדו עם זה — ומנסה את הניסוי הקטן ביותר שבודק את ההבנה שלי. אם נתקעתי מעבר לזמן סביר, אבקש עזרה עם הקשר: הנה מה שניסיתי, הנה איפה נתקעתי. השיטה חשובה יותר מלדעת הכל מראש.",
    },
    keywords: {
      en: ["understand", "break", "research", "experiment", "ask", "method"],
      he: ["הבנה", "פירוק", "מחקר", "ניסוי", "עזרה", "שיטה"],
    },
  },
  {
    id: "gen-fit",
    role: "general",
    type: "technical",
    level: "mid",
    text: {
      en: "What does a great work environment look like for you, and what do you bring to a team?",
      he: "איך נראית עבורכם סביבת עבודה מצוינת, ומה אתם מביאים לצוות?",
    },
    tip: {
      en: "Be specific about both sides — what you need and what you give.",
      he: "היו ספציפיים בשני הצדדים — מה אתם צריכים ומה אתם נותנים.",
    },
    model: {
      en: "I do my best work where feedback is direct but kind, where people ask questions without fear of looking dumb, and where priorities are clear enough that I can focus. What I bring in return: reliability — when I commit, it gets done or you hear early that it's at risk; calm under pressure; and I actively share knowledge, whether through documentation or just being the person people can ask. In my last team I started a weekly fifteen-minute 'what I learned' round that outlived my time there.",
      he: "אני עובד/ת הכי טוב במקום שבו הפידבק ישיר אבל מכבד, שבו אנשים שואלים שאלות בלי פחד להיראות טיפשים, ושבו סדרי העדיפויות ברורים מספיק כדי להתמקד. מה שאני מביא/ה בתמורה: אמינות — כשאני מתחייב/ת, זה נעשה או שתשמעו מוקדם שזה בסיכון; רוגע תחת לחץ; ושיתוף ידע אקטיבי, בין אם בתיעוד ובין אם פשוט להיות האדם שאפשר לשאול. בצוות האחרון שלי התחלתי סבב שבועי של רבע שעה 'מה למדתי' שנשאר גם אחרי שעזבתי.",
    },
    keywords: {
      en: ["feedback", "reliability", "share", "team", "specific", "bring"],
      he: ["פידבק", "אמינות", "שיתוף", "צוות", "ספציפי", "תרומה"],
    },
  },
  {
    id: "gen-stay-current",
    role: "general",
    type: "technical",
    level: "mid",
    text: {
      en: "How do you keep your skills and knowledge up to date in your field?",
      he: "איך אתם שומרים על כישורים וידע עדכניים בתחום שלכם?",
    },
    tip: {
      en: "Name concrete sources and habits, plus how you apply what you learn.",
      he: "ציינו מקורות והרגלים קונקרטיים, וגם איך אתם מיישמים את הנלמד.",
    },
    model: {
      en: "I keep it concrete: a couple of high-signal newsletters and communities in my field that I actually read weekly, following practitioners rather than hype accounts, and one deeper learning project per quarter — a course or building something with an unfamiliar tool. The filter that matters is application: when I learn something promising, I look for a small real task to try it on within a month, otherwise it evaporates. I also learn a lot by teaching — explaining things to colleagues or writing internal docs exposes the gaps in my own understanding.",
      he: "אני שומר/ת על זה קונקרטי: כמה ניוזלטרים וקהילות איכותיים בתחום שאני באמת קורא/ת שבועית, מעקב אחרי אנשי מקצוע ולא חשבונות הייפ, ופרויקט למידה מעמיק אחד ברבעון — קורס או בנייה של משהו עם כלי לא מוכר. הפילטר החשוב הוא יישום: כשאני לומד/ת משהו מבטיח, אני מחפש/ת משימה אמיתית קטנה לנסות אותו תוך חודש, אחרת זה מתאדה. אני גם לומד/ת המון מללמד — הסבר לקולגות או כתיבת תיעוד פנימי חושפים את הפערים בהבנה שלי.",
    },
    keywords: {
      en: ["learn", "course", "apply", "community", "practice", "teach"],
      he: ["למידה", "קורס", "יישום", "קהילה", "תרגול", "ללמד"],
    },
  },
  {
    id: "gen-motivation",
    role: "general",
    type: "technical",
    level: "mid",
    text: {
      en: "What motivates you at work, and what drains you?",
      he: "מה מניע אתכם בעבודה, ומה שוחק אתכם?",
    },
    tip: {
      en: "Be honest and specific — generic answers ('I love challenges') say nothing.",
      he: "היו כנים וספציפיים — תשובות גנריות ('אני אוהב אתגרים') לא אומרות כלום.",
    },
    model: {
      he: "מה שהכי מניע אותי הוא התקדמות נראית על משהו שחשוב — לשחרר משהו ולראות אנשים באמת משתמשים בו שווה יותר מכל הטבה. גם למידה מאנשים טובים ממני ממלאת אותי באנרגיה. מה ששוחק אותי: תקופות ארוכות של עדיפויות לא ברורות שבהן העבודה מרגישה הצגה, ופגישות שהיו צריכות להיות הודעה. למדתי לנהל את זה — כשהעדיפויות מיטשטשות, אני שואל/ת באופן יזום 'מה הדבר האחד שהכי חשוב השבוע?' במקום לאבד עניין בשקט.",
    },
    keywords: {
      en: ["motivate", "progress", "ship", "learn", "priorities", "drain"],
      he: ["מניע", "התקדמות", "שחרור", "למידה", "עדיפויות", "שחיקה"],
    },
  },
];
