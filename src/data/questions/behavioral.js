/**
 * Behavioral questions — shared across all roles.
 * Best answered with the STAR structure (Situation, Task, Action, Result).
 */
export const BEHAVIORAL_QUESTIONS = [
  {
    id: "bh-conflict",
    type: "behavioral",
    level: "all",
    text: {
      en: "Tell me about a time you had a disagreement with a colleague. How did you handle it?",
      he: "ספרו על פעם שהייתה לכם מחלוקת עם עמית/ה לעבודה. איך התמודדתם?",
    },
    tip: {
      en: "Use STAR. Focus on how you listened and reached a resolution — not on winning.",
      he: "השתמשו במבנה STAR. התמקדו בהקשבה ובפתרון — לא בניצחון.",
    },
    model: {
      en: "On a previous project, a teammate and I disagreed about an architectural approach. Instead of debating in the group channel, I asked for a 30-minute call where each of us presented the trade-offs. It turned out we were optimizing for different things — speed vs. maintainability. We agreed to prototype both for a day and let the results decide. His approach won for that case, and the process became how our team settles technical debates.",
      he: "בפרויקט קודם, חבר צוות ואני חלקנו על גישה ארכיטקטונית. במקום להתווכח בערוץ הקבוצתי, ביקשתי שיחה של 30 דקות שבה כל אחד הציג את היתרונות והחסרונות. התברר שכל אחד מאיתנו אופטימיזציה למשהו אחר — מהירות מול תחזוקתיות. הסכמנו לבנות אב-טיפוס לכל גישה ליום אחד ולתת לתוצאות להכריע. הגישה שלו ניצחה במקרה ההוא, והתהליך הזה הפך לדרך שבה הצוות שלנו מיישב ויכוחים טכניים.",
    },
    keywords: {
      en: ["situation", "listened", "resolved", "agreed", "result", "learned"],
      he: ["מצב", "הקשבתי", "פתרנו", "הסכמנו", "תוצאה", "למדתי"],
    },
  },
  {
    id: "bh-failure",
    type: "behavioral",
    level: "all",
    text: {
      en: "Describe a time you failed or made a significant mistake. What did you learn?",
      he: "תארו פעם שנכשלתם או עשיתם טעות משמעותית. מה למדתם?",
    },
    tip: {
      en: "Pick a real failure, own it fully, and spend most of the answer on the lesson and change.",
      he: "בחרו כישלון אמיתי, קחו אחריות מלאה, והקדישו את רוב התשובה ללקח ולשינוי.",
    },
    model: {
      en: "Early in my career I pushed a change without proper testing because we were under deadline pressure — it broke a key flow for several hours. I took responsibility immediately, helped roll it back, and wrote the incident summary myself. The lesson changed how I work: I now treat tests and staged rollouts as non-negotiable, and I've caught at least three potentially similar issues since by following that discipline.",
      he: "בתחילת הדרך דחפתי שינוי בלי בדיקות מספקות בגלל לחץ של דדליין — וזה שבר זרימה מרכזית לכמה שעות. לקחתי אחריות מיד, עזרתי להחזיר לאחור וכתבתי בעצמי את סיכום התקלה. הלקח שינה את צורת העבודה שלי: בדיקות ושחרור הדרגתי הם עכשיו עיקרון בל-יעבור, ומאז תפסתי לפחות שלוש בעיות דומות בזכות המשמעת הזו.",
    },
    keywords: {
      en: ["mistake", "responsibility", "learned", "changed", "since", "result"],
      he: ["טעות", "אחריות", "למדתי", "שיניתי", "מאז", "תוצאה"],
    },
  },
  {
    id: "bh-pressure",
    type: "behavioral",
    level: "all",
    text: {
      en: "Tell me about a time you worked under significant pressure or a tight deadline.",
      he: "ספרו על פעם שעבדתם תחת לחץ משמעותי או דדליין צפוף.",
    },
    tip: {
      en: "Show prioritization and communication, not just 'working harder'.",
      he: "הראו תעדוף ותקשורת, לא רק 'עבדתי קשה יותר'.",
    },
    model: {
      en: "Before a major release, we discovered a critical bug two days before launch. I mapped what was truly launch-blocking versus what could ship a week later, got stakeholder sign-off on that split in an hour, and we focused only on the blocker. We launched on time with a stable core, and the deferred items shipped the next sprint. The key was cutting scope early instead of heroics at 2am.",
      he: "לפני שחרור גדול, גילינו באג קריטי יומיים לפני ההשקה. מיפיתי מה באמת חוסם השקה ומה יכול לצאת שבוע אחר כך, קיבלתי אישור מבעלי העניין על החלוקה הזו תוך שעה, והתמקדנו רק בחוסם. השקנו בזמן עם ליבה יציבה, והפיצ'רים שנדחו יצאו בספרינט הבא. המפתח היה לחתוך סקופ מוקדם במקום הרואיקה בשתיים בלילה.",
    },
    keywords: {
      en: ["deadline", "prioritized", "communicated", "focused", "delivered", "result"],
      he: ["דדליין", "תעדפתי", "תקשרתי", "התמקדנו", "סיפקנו", "תוצאה"],
    },
  },
  {
    id: "bh-initiative",
    type: "behavioral",
    level: "all",
    text: {
      en: "Give an example of a time you took initiative beyond your defined role.",
      he: "תנו דוגמה לפעם שלקחתם יוזמה מעבר לתפקיד המוגדר שלכם.",
    },
    tip: {
      en: "Show you spotted a problem nobody owned and drove it to a measurable result.",
      he: "הראו שזיהיתם בעיה שלא היה לה אחראי והובלתם אותה לתוצאה מדידה.",
    },
    model: {
      en: "I noticed our onboarding docs were so outdated that every new hire lost their first week to setup issues. Nobody owned it, so I created a setup script and rewrote the guide, then asked the next two hires to test it. Onboarding time dropped from about five days to one, and the team adopted a rule that every new hire updates the doc — so it stays current without me.",
      he: "שמתי לב שמסמכי הקליטה שלנו היו כל כך לא מעודכנים שכל עובד חדש איבד את השבוע הראשון על בעיות התקנה. לא היה לזה אחראי, אז יצרתי סקריפט התקנה וכתבתי מחדש את המדריך, וביקשתי משני המצטרפים הבאים לבדוק אותו. זמן הקליטה ירד מחמישה ימים בערך ליום אחד, והצוות אימץ כלל שכל עובד חדש מעדכן את המסמך — כך שהוא נשאר עדכני גם בלעדיי.",
    },
    keywords: {
      en: ["noticed", "initiative", "owned", "created", "result", "improved"],
      he: ["שמתי לב", "יוזמה", "אחריות", "יצרתי", "תוצאה", "שיפרתי"],
    },
  },
  {
    id: "bh-feedback",
    type: "behavioral",
    level: "all",
    text: {
      en: "Tell me about a time you received tough feedback. How did you respond?",
      he: "ספרו על פעם שקיבלתם פידבק קשה. איך הגבתם?",
    },
    tip: {
      en: "Show openness, not defensiveness — and a concrete change you made afterwards.",
      he: "הראו פתיחות, לא התגוננות — ושינוי קונקרטי שעשיתם בעקבותיו.",
    },
    model: {
      en: "In a performance review, my manager told me my code reviews were technically sharp but came across as harsh, and teammates hesitated to send me work. It stung, but I asked for specific examples and saw the pattern. I changed my review style: leading with questions, noting what's good, and saving style nits for a linter instead of comments. Two months later a teammate specifically thanked me for a review — that felt like the real close of the loop.",
      he: "בשיחת משוב, המנהלת שלי אמרה שהקוד-ריוויו שלי חדים טכנית אבל נתפסים כקשוחים, ושחברי צוות מהססים לשלוח לי עבודה. זה צרב, אבל ביקשתי דוגמאות ספציפיות וראיתי את הדפוס. שיניתי את סגנון הסקירה: פתיחה בשאלות, ציון מה טוב, והעברת הערות סגנון ללינטר במקום לתגובות. חודשיים אחר כך חבר צוות הודה לי במפורש על ריוויו — וזו הייתה סגירת המעגל האמיתית.",
    },
    keywords: {
      en: ["feedback", "listened", "asked", "changed", "improved", "example"],
      he: ["פידבק", "הקשבתי", "ביקשתי", "שיניתי", "שיפרתי", "דוגמה"],
    },
  },
  {
    id: "bh-learning",
    type: "behavioral",
    level: "all",
    text: {
      en: "Describe a time you had to learn something new quickly to complete a task.",
      he: "תארו פעם שנאלצתם ללמוד משהו חדש במהירות כדי להשלים משימה.",
    },
    tip: {
      en: "Show your learning method, not just the outcome.",
      he: "הראו את שיטת הלמידה שלכם, לא רק את התוצאה.",
    },
    model: {
      en: "When our team adopted a technology I'd never used, I had two weeks before owning a feature in it. I built a tiny throwaway project the first weekend to learn by doing, kept a running doc of gotchas, and scheduled 30 minutes with the team expert to validate my approach before starting. I delivered the feature on schedule, and my gotchas doc became the team's quick-start guide.",
      he: "כשהצוות שלנו אימץ טכנולוגיה שלא הכרתי, היו לי שבועיים לפני שקיבלתי אחריות על פיצ'ר בה. בסוף השבוע הראשון בניתי פרויקט קטן לזריקה כדי ללמוד דרך עשייה, ניהלתי מסמך שוטף של מלכודות, וקבעתי 30 דקות עם המומחה בצוות לאימות הגישה לפני שהתחלתי. סיפקתי את הפיצ'ר בזמן, ומסמך המלכודות שלי הפך למדריך ההתחלה המהיר של הצוות.",
    },
    keywords: {
      en: ["learned", "quickly", "practice", "asked", "delivered", "method"],
      he: ["למדתי", "במהירות", "תרגול", "שאלתי", "סיפקתי", "שיטה"],
    },
  },
  {
    id: "bh-prioritize",
    type: "behavioral",
    level: "all",
    text: {
      en: "Tell me about a time you had several urgent tasks at once. How did you decide what to do first?",
      he: "ספרו על פעם שהיו לכם כמה משימות דחופות בו-זמנית. איך החלטתם מה לעשות קודם?",
    },
    tip: {
      en: "Show a clear prioritization framework: impact, urgency, dependencies, communication.",
      he: "הראו מסגרת תעדוף ברורה: השפעה, דחיפות, תלויות ותקשורת.",
    },
    model: {
      en: "During one sprint I had a production bug, a stakeholder demo, and a code review all landing the same day. I triaged by user impact: the bug affected paying customers, so it came first. I told the stakeholder immediately and moved the demo by three hours rather than cancelling, and asked a teammate to take the review. Everything got done that day — the key was communicating trade-offs early instead of silently juggling.",
      he: "בספרינט אחד היו לי באג בפרודקשן, דמו ללקוח פנימי וקוד-ריוויו — כולם באותו יום. תעדפתי לפי השפעה על משתמשים: הבאג פגע בלקוחות משלמים, אז הוא קודם. עדכנתי מיד את בעל העניין והזזתי את הדמו בשלוש שעות במקום לבטל, וביקשתי מחבר צוות לקחת את הריוויו. הכל הסתיים באותו יום — המפתח היה לתקשר את הפשרות מוקדם במקום ללהטט בשקט.",
    },
    keywords: {
      en: ["prioritized", "impact", "urgent", "communicated", "delegated", "result"],
      he: ["תעדפתי", "השפעה", "דחוף", "תקשרתי", "האצלתי", "תוצאה"],
    },
  },
  {
    id: "bh-proud",
    type: "behavioral",
    level: "all",
    text: {
      en: "What professional achievement are you most proud of, and why?",
      he: "מהו ההישג המקצועי שאתם הכי גאים בו, ולמה?",
    },
    tip: {
      en: "Pick something with measurable impact and explain your specific contribution.",
      he: "בחרו משהו עם השפעה מדידה והסבירו את התרומה הספציפית שלכם.",
    },
    model: {
      en: "I'm proudest of leading the rewrite of our slowest user flow. I proposed it after support tickets kept spiking, built the case with data, and drove it across three teams. We cut the flow's load time by 60% and related support tickets dropped by half within a quarter. I'm proud of it because it started from my initiative, required collaboration beyond my team, and the impact showed up in numbers users actually felt.",
      he: "אני הכי גאה בהובלת השכתוב של הזרימה האיטית ביותר אצלנו. הצעתי את זה אחרי שפניות התמיכה המשיכו לזנק, בניתי את ההצדקה עם דאטה והובלתי את זה מול שלושה צוותים. קיצרנו את זמן הטעינה ב-60% ופניות התמיכה הקשורות ירדו בחצי תוך רבעון. אני גאה בזה כי זה התחיל מיוזמה שלי, דרש שיתוף פעולה מעבר לצוות שלי, וההשפעה נראתה במספרים שמשתמשים באמת הרגישו.",
    },
    keywords: {
      en: ["led", "initiative", "impact", "cross-team", "data", "results"],
      he: ["הובלה", "יוזמה", "השפעה", "שיתוף פעולה", "דאטה", "תוצאות"],
    },
  },
];
