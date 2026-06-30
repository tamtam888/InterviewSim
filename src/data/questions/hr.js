/**
 * HR questions — shared across all roles.
 * Each question: text, tip, model (suggested strong answer), keywords used by the feedback engine.
 */
export const HR_QUESTIONS = [
  {
    id: "hr-about-yourself",
    type: "hr",
    level: "all",
    text: {
      en: "Tell me about yourself.",
      he: "ספרו לי על עצמכם.",
    },
    tip: {
      en: "Keep it professional: present → past → future. 60–90 seconds.",
      he: "שמרו על מקצועיות: הווה ← עבר ← עתיד. 60–90 שניות.",
    },
    model: {
      en: "I'm a developer with three years of experience building web products, currently focused on performance and UX at a SaaS company. Before that I worked at a startup where I owned features end-to-end. I'm now looking for a role where I can take more ownership and grow toward technical leadership — which is exactly what drew me to this position.",
      he: "אני מפתח/ת עם שלוש שנות ניסיון בבניית מוצרי ווב, כיום מתמקד/ת בביצועים וב-UX בחברת SaaS. לפני כן עבדתי בסטארטאפ שם הובלתי פיצ'רים מקצה לקצה. כעת אני מחפש/ת תפקיד עם יותר אחריות וצמיחה לכיוון הובלה טכנית — וזה בדיוק מה שמשך אותי למשרה הזו.",
    },
    keywords: {
      en: ["experience", "years", "currently", "looking", "role", "team"],
      he: ["ניסיון", "שנים", "כיום", "מחפש", "תפקיד", "צוות"],
    },
  },
  {
    id: "hr-why-company",
    type: "hr",
    level: "all",
    text: {
      en: "Why do you want to work here?",
      he: "למה אתם רוצים לעבוד דווקא אצלנו?",
    },
    tip: {
      en: "Show you researched the company. Connect their mission to your goals.",
      he: "הראו שחקרתם את החברה. חברו בין החזון שלה למטרות שלכם.",
    },
    model: {
      en: "I've followed your product for a while and what stands out is how seriously you treat user experience — your latest release showed that. I want my next role to combine technical challenge with real product impact, and your team's size means I'd see the direct effect of my work. The stack you use is also exactly where I want to deepen my skills.",
      he: "אני עוקב/ת אחרי המוצר שלכם כבר תקופה, ומה שבולט הוא הרצינות שבה אתם מתייחסים לחוויית המשתמש. אני רוצה שהתפקיד הבא שלי ישלב אתגר טכני עם השפעה אמיתית על המוצר, ובצוות בגודל שלכם אראה את ההשפעה הישירה של העבודה שלי. גם הסטאק שלכם הוא בדיוק התחום שבו אני רוצה להתמקצע.",
    },
    keywords: {
      en: ["product", "company", "mission", "impact", "team", "grow"],
      he: ["מוצר", "חברה", "חזון", "השפעה", "צוות", "לצמוח"],
    },
  },
  {
    id: "hr-strengths-weaknesses",
    type: "hr",
    level: "all",
    text: {
      en: "What are your greatest strengths and one weakness?",
      he: "מהן החוזקות הגדולות שלכם, ומהי חולשה אחת?",
    },
    tip: {
      en: "Pick strengths relevant to the job. For the weakness — show self-awareness and what you're doing about it.",
      he: "בחרו חוזקות רלוונטיות למשרה. בחולשה — הראו מודעות עצמית ומה אתם עושים כדי להשתפר.",
    },
    model: {
      en: "My main strength is breaking complex problems into small, shippable steps — it keeps projects moving and makes my work easy to review. I'm also a clear communicator with non-technical stakeholders. A real weakness: I used to over-polish before sharing work. I've learned to share drafts early and ask for feedback at 70% instead of 95%, which has made me much faster.",
      he: "החוזקה המרכזית שלי היא פירוק בעיות מורכבות לצעדים קטנים שניתן לשחרר — זה שומר על קצב ומקל על סקירת העבודה שלי. אני גם מתקשר/ת ברור עם גורמים לא-טכניים. חולשה אמיתית: נהגתי ללטש יותר מדי לפני שיתוף. למדתי לשתף טיוטות מוקדם ולבקש פידבק ב-70% במקום ב-95%, וזה עשה אותי מהיר/ה בהרבה.",
    },
    keywords: {
      en: ["strength", "weakness", "improve", "learned", "feedback", "example"],
      he: ["חוזקה", "חולשה", "לשפר", "למדתי", "פידבק", "דוגמה"],
    },
  },
  {
    id: "hr-five-years",
    type: "hr",
    level: "all",
    text: {
      en: "Where do you see yourself in five years?",
      he: "איפה אתם רואים את עצמכם בעוד חמש שנים?",
    },
    tip: {
      en: "Show ambition that fits the company. Avoid 'I don't know' and avoid 'in your chair'.",
      he: "הראו שאפתנות שמתאימה לחברה. הימנעו מ'לא יודע' ומ'בכיסא שלך'.",
    },
    model: {
      en: "In five years I want to be the person the team relies on for hard problems in my domain — a senior contributor or team lead, depending on where I add more value. Concretely, that means deepening my technical expertise in the next two years and gradually taking on mentoring. What matters most is that I keep growing while delivering real impact.",
      he: "בעוד חמש שנים אני רוצה להיות האדם שהצוות סומך עליו בבעיות הקשות בתחום שלי — תורם/ת בכיר/ה או ראש/ת צוות, תלוי איפה אביא יותר ערך. בפועל זה אומר העמקה מקצועית בשנתיים הקרובות וכניסה הדרגתית לחניכה. הכי חשוב לי להמשיך לצמוח תוך יצירת השפעה אמיתית.",
    },
    keywords: {
      en: ["grow", "lead", "senior", "mentor", "impact", "learn"],
      he: ["לצמוח", "להוביל", "בכיר", "חניכה", "השפעה", "ללמוד"],
    },
  },
  {
    id: "hr-why-leaving",
    type: "hr",
    level: "all",
    text: {
      en: "Why are you leaving (or why did you leave) your current job?",
      he: "למה אתם עוזבים (או עזבתם) את מקום העבודה הנוכחי?",
    },
    tip: {
      en: "Never badmouth. Frame it as moving toward something, not running away.",
      he: "אל תדברו רעות. הציגו זאת כצעידה קדימה, לא כבריחה.",
    },
    model: {
      en: "I've learned a lot in my current role and I'm grateful for it, but I've reached the edge of what I can grow into there — the projects have become repetitive and there's limited room to take on bigger scope. I'm looking for a place with harder problems and a stronger engineering culture, and this role offers exactly that.",
      he: "למדתי המון בתפקיד הנוכחי ואני מעריך/ה את זה, אבל הגעתי לקצה אפשרויות הצמיחה שם — הפרויקטים נעשו חזרתיים ויש מעט מקום להרחיב אחריות. אני מחפש/ת מקום עם בעיות מאתגרות יותר ותרבות הנדסית חזקה, וזה בדיוק מה שהתפקיד הזה מציע.",
    },
    keywords: {
      en: ["learned", "grow", "challenge", "opportunity", "looking", "next"],
      he: ["למדתי", "לצמוח", "אתגר", "הזדמנות", "מחפש", "הבא"],
    },
  },
  {
    id: "hr-salary",
    type: "hr",
    level: "all",
    text: {
      en: "What are your salary expectations?",
      he: "מהן ציפיות השכר שלכם?",
    },
    tip: {
      en: "Give a researched range, anchor to market value, and stay flexible.",
      he: "תנו טווח מבוסס מחקר, התבססו על שווי שוק והישארו גמישים.",
    },
    model: {
      en: "Based on my research for this role and my experience level, I'd expect something in the range of X to Y. That said, I'm looking at the full picture — growth, team, and the overall package — so I'm open to discussing it once we both feel there's a fit.",
      he: "על בסיס מחקר שעשיתי לתפקיד הזה ורמת הניסיון שלי, הציפייה שלי היא בטווח של X עד Y. יחד עם זאת, אני מסתכל/ת על התמונה המלאה — צמיחה, צוות והחבילה הכוללת — ואשמח לדון בזה כשנרגיש ששנינו רואים התאמה.",
    },
    keywords: {
      en: ["range", "research", "market", "experience", "flexible", "package"],
      he: ["טווח", "מחקר", "שוק", "ניסיון", "גמיש", "חבילה"],
    },
  },
  {
    id: "hr-questions-for-us",
    type: "hr",
    level: "all",
    text: {
      en: "Do you have any questions for us?",
      he: "יש לכם שאלות אלינו?",
    },
    tip: {
      en: "Always have 2–3 questions ready. Ask about the team, success metrics, or challenges.",
      he: "תמיד הכינו 2–3 שאלות. שאלו על הצוות, מדדי הצלחה או אתגרים.",
    },
    model: {
      en: "Yes — first, how does the team measure success for this role in the first six months? Second, what's the biggest challenge the team is facing right now? And I'd love to hear what you personally enjoy most about working here.",
      he: "כן — ראשית, איך הצוות מודד הצלחה בתפקיד הזה בששת החודשים הראשונים? שנית, מה האתגר הגדול ביותר שהצוות מתמודד איתו כרגע? ואשמח לשמוע מה אתם אישית הכי אוהבים בעבודה כאן.",
    },
    keywords: {
      en: ["team", "success", "challenge", "measure", "culture", "growth"],
      he: ["צוות", "הצלחה", "אתגר", "מדד", "תרבות", "צמיחה"],
    },
  },
  {
    id: "hr-work-style",
    type: "hr",
    level: "all",
    text: {
      en: "How do you prefer to work — independently or in a team?",
      he: "איך אתם מעדיפים לעבוד — עצמאית או בצוות?",
    },
    tip: {
      en: "Show you can do both, with a concrete example of each.",
      he: "הראו שאתם מסוגלים לשניהם, עם דוגמה קונקרטית לכל אחד.",
    },
    model: {
      en: "Both, depending on the phase. I like deep, focused solo work when implementing — for example, I block mornings for that. But the best results I've had came from tight collaboration: in my last project, pairing with a designer early saved us two weeks of rework. So: independent execution, collaborative thinking.",
      he: "שניהם, תלוי בשלב. אני אוהב/ת עבודה עצמאית מרוכזת בזמן מימוש — למשל, אני שומר/ת את הבקרים לזה. אבל התוצאות הכי טובות שלי הגיעו משיתוף פעולה הדוק: בפרויקט האחרון, עבודה צמודה עם מעצבת בשלב מוקדם חסכה לנו שבועיים של תיקונים. בקצרה: ביצוע עצמאי, חשיבה משותפת.",
    },
    keywords: {
      en: ["team", "independent", "collaborate", "example", "balance"],
      he: ["צוות", "עצמאי", "שיתוף פעולה", "דוגמה", "איזון"],
    },
  },
];
