/**
 * Technical questions — developer roles (frontend, react, fullstack, backend, qa).
 * Each question carries a `role` id; selection logic filters by it.
 */
export const TECHNICAL_DEV_QUESTIONS = [
  /* ---------- Frontend ---------- */
  {
    id: "fe-perf",
    role: "frontend",
    type: "technical",
    level: "mid",
    text: {
      en: "A page on your site loads slowly. How would you diagnose and improve its performance?",
      he: "עמוד באתר שלכם נטען לאט. איך תאבחנו ותשפרו את הביצועים שלו?",
    },
    tip: {
      en: "Mention measurement first (Lighthouse, DevTools), then concrete fixes.",
      he: "התחילו במדידה (Lighthouse, DevTools) ורק אז בפתרונות קונקרטיים.",
    },
    model: {
      en: "First I'd measure, not guess: Lighthouse and the Performance tab to find the bottleneck — large bundles, render-blocking resources, slow API calls, or heavy images. Then I'd fix by impact: code-splitting and lazy-loading routes, compressing and lazy-loading images with proper formats like WebP, caching API responses, and deferring non-critical scripts. Finally I'd set a performance budget in CI so it doesn't regress.",
      he: "קודם כל מודדים, לא מנחשים: Lighthouse ולשונית Performance כדי למצוא את צוואר הבקבוק — באנדלים גדולים, משאבים חוסמי רינדור, קריאות API איטיות או תמונות כבדות. אז מתקנים לפי השפעה: פיצול קוד וטעינה עצלה של ראוטים, דחיסת תמונות ופורמטים כמו WebP, קאשינג לתשובות API ודחיית סקריפטים לא קריטיים. לבסוף אגדיר תקציב ביצועים ב-CI כדי שלא תהיה נסיגה.",
    },
    keywords: {
      en: ["lighthouse", "measure", "bundle", "lazy", "cache", "images"],
      he: ["מדידה", "באנדל", "טעינה", "קאש", "תמונות", "ביצועים"],
    },
  },
  {
    id: "fe-css-layout",
    role: "frontend",
    type: "technical",
    level: "mid",
    text: {
      en: "When would you use CSS Grid versus Flexbox? Give a real example of each.",
      he: "מתי תשתמשו ב-CSS Grid לעומת Flexbox? תנו דוגמה אמיתית לכל אחד.",
    },
    tip: {
      en: "Grid = two-dimensional layout; Flexbox = one-dimensional flow.",
      he: "Grid = פריסה דו-ממדית; Flexbox = זרימה חד-ממדית.",
    },
    model: {
      en: "Flexbox is for one-dimensional layout — distributing items along a row or column, like a navbar with a logo on one side and links on the other, or vertically centering a card. Grid is for two-dimensional layout where rows and columns matter together — like a dashboard with cards spanning different areas or a photo gallery. In practice I use Grid for page-level structure and Flexbox inside components.",
      he: "Flexbox מתאים לפריסה חד-ממדית — חלוקת פריטים לאורך שורה או עמודה, כמו navbar עם לוגו בצד אחד וקישורים בצד השני, או מרכוז אנכי של כרטיס. Grid מתאים לפריסה דו-ממדית שבה שורות ועמודות חשובות יחד — כמו דשבורד עם כרטיסים בגדלים שונים או גלריית תמונות. בפועל אני משתמש/ת ב-Grid למבנה ברמת העמוד וב-Flexbox בתוך קומפוננטות.",
    },
    keywords: {
      en: ["grid", "flexbox", "two-dimensional", "row", "column", "layout"],
      he: ["גריד", "פלקס", "דו-ממדי", "שורה", "עמודה", "פריסה"],
    },
  },
  {
    id: "fe-accessibility",
    role: "frontend",
    type: "technical",
    level: "mid",
    text: {
      en: "What does accessibility mean in frontend work, and what concrete things do you do to support it?",
      he: "מה משמעות נגישות בעבודת פרונטאנד, ואילו דברים קונקרטיים אתם עושים כדי לתמוך בה?",
    },
    tip: {
      en: "Go beyond 'alt text' — semantics, keyboard, contrast, ARIA, testing.",
      he: "מעבר ל-alt — סמנטיקה, מקלדת, ניגודיות, ARIA ובדיקות.",
    },
    model: {
      en: "Accessibility means anyone can use the product, including people using screen readers, keyboards only, or with low vision. Concretely: semantic HTML first (buttons are buttons, headings in order), full keyboard navigation with visible focus states, sufficient color contrast, labels on every form field, ARIA only where semantics fall short, and testing with a screen reader and keyboard-only sessions. It's also a legal requirement in many markets, so I treat it as part of done, not a nice-to-have.",
      he: "נגישות אומרת שכל אחד יכול להשתמש במוצר, כולל משתמשי קוראי מסך, מקלדת בלבד או לקויי ראייה. קונקרטית: HTML סמנטי קודם כל (כפתורים הם כפתורים, כותרות לפי סדר), ניווט מקלדת מלא עם מצבי פוקוס נראים, ניגודיות צבעים מספקת, תוויות לכל שדה טופס, ARIA רק היכן שהסמנטיקה לא מספיקה, ובדיקות עם קורא מסך וסשנים של מקלדת בלבד. זו גם דרישה חוקית בשווקים רבים, אז אני מתייחס/ת לזה כחלק מההגדרה של 'גמור'.",
    },
    keywords: {
      en: ["semantic", "keyboard", "contrast", "aria", "screen reader", "focus"],
      he: ["סמנטי", "מקלדת", "ניגודיות", "קורא מסך", "פוקוס", "נגישות"],
    },
  },
  {
    id: "fe-state",
    role: "frontend",
    type: "technical",
    level: "mid",
    text: {
      en: "How do you decide where state should live in a frontend application?",
      he: "איך אתם מחליטים איפה state צריך לחיות באפליקציית פרונטאנד?",
    },
    tip: {
      en: "Talk about local vs. lifted vs. global state, and server cache vs. UI state.",
      he: "דברו על state מקומי מול מורם מול גלובלי, ועל server cache מול UI state.",
    },
    model: {
      en: "I start with the narrowest scope that works: component-local state for things only one component cares about, lifted state when siblings share it, and global state only for truly cross-cutting concerns like auth or theme. I also separate server data from UI state — server data belongs in a cache layer (like React Query or SWR semantics) with its own loading and invalidation, while UI state stays in components. Most 'state management problems' I've seen came from putting server data in global stores.",
      he: "אני מתחיל/ה מהסקופ הצר ביותר שעובד: state מקומי לקומפוננטה כשרק היא צריכה אותו, state מורם כשאחים חולקים אותו, ו-state גלובלי רק לעניינים חוצי-מערכת כמו אימות או ערכת נושא. אני גם מפריד/ה בין נתוני שרת ל-UI state — נתוני שרת שייכים לשכבת קאש (בסגנון React Query או SWR) עם טעינה ואינוולידציה משלה, בעוד UI state נשאר בקומפוננטות. רוב 'בעיות ניהול ה-state' שראיתי נבעו מהכנסת נתוני שרת ל-store גלובלי.",
    },
    keywords: {
      en: ["local", "global", "lifted", "server", "cache", "scope"],
      he: ["מקומי", "גלובלי", "מורם", "שרת", "קאש", "סקופ"],
    },
  },

  /* ---------- React ---------- */
  {
    id: "re-rerender",
    role: "react",
    type: "technical",
    level: "mid",
    text: {
      en: "A React component re-renders too often and slows the page. How do you find the cause and fix it?",
      he: "קומפוננטת React מתרנדרת מחדש יותר מדי ומאיטה את העמוד. איך תמצאו את הסיבה ותתקנו?",
    },
    tip: {
      en: "Mention React DevTools Profiler, then memo/useMemo/useCallback and state placement.",
      he: "הזכירו את ה-Profiler של React DevTools, ואז memo/useMemo/useCallback ומיקום state.",
    },
    model: {
      en: "I'd start with the React DevTools Profiler to see which components render and why. Common causes: state living too high so unrelated children re-render, new object/function references created each render, or a context whose value changes constantly. Fixes in order: move state down closer to where it's used, memoize expensive children with React.memo and stabilize props with useMemo/useCallback, and split contexts. Measuring first matters — memoizing everything blindly adds complexity without benefit.",
      he: "אתחיל עם ה-Profiler של React DevTools כדי לראות אילו קומפוננטות מתרנדרות ולמה. סיבות נפוצות: state שחי גבוה מדי כך שילדים לא קשורים מתרנדרים, רפרנסים חדשים לאובייקטים/פונקציות בכל רינדור, או context שערכו משתנה כל הזמן. תיקונים לפי סדר: הורדת ה-state קרוב לשימוש, מימואיזציה לילדים יקרים עם React.memo וייצוב props עם useMemo/useCallback, ופיצול contexts. חשוב למדוד קודם — מימואיזציה עיוורת של הכל מוסיפה מורכבות בלי תועלת.",
    },
    keywords: {
      en: ["profiler", "memo", "usememo", "usecallback", "state", "context"],
      he: ["פרופיילר", "memo", "state", "context", "רינדור", "מדידה"],
    },
  },
  {
    id: "re-useeffect",
    role: "react",
    type: "technical",
    level: "mid",
    text: {
      en: "What are common mistakes with useEffect, and when should you avoid using it at all?",
      he: "מהן טעויות נפוצות עם useEffect, ומתי כדאי להימנע ממנו לגמרי?",
    },
    tip: {
      en: "Mention dependency arrays, cleanup, and deriving state during render instead.",
      he: "הזכירו מערכי תלויות, cleanup, וגזירת state בזמן רינדור במקום effect.",
    },
    model: {
      en: "Common mistakes: missing or wrong dependencies causing stale values, no cleanup for subscriptions or timers causing leaks, and chains of effects setting state that trigger each other. The bigger mistake is using useEffect when you don't need it: deriving data from props or state should happen during render, not in an effect, and responding to user events belongs in event handlers. I treat useEffect as a tool for synchronizing with external systems — network, DOM APIs, subscriptions — and nothing else.",
      he: "טעויות נפוצות: תלויות חסרות או שגויות שגורמות לערכים ישנים, היעדר cleanup למנויים וטיימרים שגורם לדליפות, ושרשראות של effects שמעדכנים state ומפעילים זה את זה. הטעות הגדולה יותר היא להשתמש ב-useEffect כשלא צריך: גזירת נתונים מ-props או state צריכה לקרות בזמן רינדור, לא ב-effect, ותגובה לאירועי משתמש שייכת ל-event handlers. אני מתייחס/ת ל-useEffect ככלי לסנכרון עם מערכות חיצוניות — רשת, DOM, מנויים — ותו לא.",
    },
    keywords: {
      en: ["dependencies", "cleanup", "derived", "event", "synchronize", "stale"],
      he: ["תלויות", "ניקוי", "נגזר", "אירוע", "סנכרון", "ישן"],
    },
  },
  {
    id: "re-keys",
    role: "react",
    type: "technical",
    level: "mid",
    text: {
      en: "Why does React need keys in lists, and what goes wrong if you use the array index as a key?",
      he: "למה React צריך keys ברשימות, ומה משתבש אם משתמשים באינדקס של המערך כ-key?",
    },
    tip: {
      en: "Explain reconciliation and what happens when items are reordered or removed.",
      he: "הסבירו reconciliation ומה קורה כשפריטים משתנים בסדר או נמחקים.",
    },
    model: {
      en: "Keys let React match items between renders during reconciliation, so it updates only what changed instead of re-creating DOM. With index as key, inserting or removing an item shifts all the indexes — React then thinks every following item 'changed', which causes wasted re-renders and real bugs: component state like input values or checkboxes sticks to the wrong row. Index keys are only safe for static lists that never reorder. The right key is a stable unique id from the data.",
      he: "Keys מאפשרים ל-React להתאים פריטים בין רינדורים בתהליך ה-reconciliation, כך שהוא מעדכן רק את מה שהשתנה במקום ליצור DOM מחדש. עם אינדקס כ-key, הוספה או הסרה של פריט מזיזה את כל האינדקסים — React חושב שכל הפריטים שאחריו 'השתנו', מה שגורם לרינדורים מיותרים ולבאגים אמיתיים: state של קומפוננטה כמו ערכי input או checkboxes נדבק לשורה הלא נכונה. אינדקס בטוח רק לרשימות סטטיות שלעולם לא משתנות. ה-key הנכון הוא מזהה ייחודי ויציב מהדאטה.",
    },
    keywords: {
      en: ["reconciliation", "unique", "stable", "reorder", "state", "id"],
      he: ["ייחודי", "יציב", "סדר", "מזהה", "באג", "רינדור"],
    },
  },
  {
    id: "re-custom-hook",
    role: "react",
    type: "technical",
    level: "mid",
    text: {
      en: "When would you extract logic into a custom hook? Describe one you've built or would build.",
      he: "מתי תוציאו לוגיקה ל-custom hook? תארו אחד שבניתם או שהייתם בונים.",
    },
    tip: {
      en: "Reuse + separation of concerns. Give a concrete example with its API.",
      he: "שימוש חוזר + הפרדת אחריות. תנו דוגמה קונקרטית עם ה-API שלה.",
    },
    model: {
      en: "I extract a custom hook when stateful logic repeats across components or when a component mixes UI with complex logic that deserves its own tests. For example, a useDebounce hook: it takes a value and delay and returns the debounced value — used for search inputs in three places in our app. The component stays a simple input, the timing logic lives in one tested place, and changing the debounce strategy later means editing one file.",
      he: "אני מוציא/ה custom hook כשלוגיקה עם state חוזרת בכמה קומפוננטות, או כשקומפוננטה מערבבת UI עם לוגיקה מורכבת שמגיעות לה בדיקות משלה. לדוגמה, hook בשם useDebounce: מקבל ערך והשהיה ומחזיר את הערך המושהה — בשימוש בשדות חיפוש בשלושה מקומות באפליקציה שלנו. הקומפוננטה נשארת input פשוט, לוגיקת התזמון חיה במקום אחד עם בדיקות, ושינוי אסטרטגיית ה-debounce בעתיד אומר עריכת קובץ אחד.",
    },
    keywords: {
      en: ["reuse", "logic", "stateful", "separation", "test", "example"],
      he: ["שימוש חוזר", "לוגיקה", "הפרדה", "בדיקות", "דוגמה", "קומפוננטה"],
    },
  },

  /* ---------- Full-Stack ---------- */
  {
    id: "fs-design-feature",
    role: "fullstack",
    type: "technical",
    level: "mid",
    text: {
      en: "Walk me through how you'd design and build a 'comments' feature end-to-end: database, API, and UI.",
      he: "תארו איך תתכננו ותבנו פיצ'ר 'תגובות' מקצה לקצה: בסיס נתונים, API ו-UI.",
    },
    tip: {
      en: "Cover schema, endpoints, validation, and UI states (loading/error/empty).",
      he: "כסו סכמה, endpoints, ולידציה ומצבי UI (טעינה/שגיאה/ריק).",
    },
    model: {
      en: "Database: a comments table with id, post_id, author_id, body, created_at, and an index on post_id. API: REST endpoints — GET /posts/:id/comments with pagination, POST to create with validation and auth, DELETE restricted to the author. I'd sanitize input to prevent XSS. UI: a list with loading skeletons, an empty state, optimistic updates on submit with rollback on failure, and error toasts. I'd start with the API contract so frontend and backend can proceed in parallel.",
      he: "בסיס נתונים: טבלת comments עם id, post_id, author_id, body, created_at ואינדקס על post_id. API: נקודות קצה REST — GET /posts/:id/comments עם עימוד, POST ליצירה עם ולידציה ואימות, DELETE מוגבל לכותב. אסנן קלט למניעת XSS. UI: רשימה עם שלדי טעינה, מצב ריק, עדכונים אופטימיים בשליחה עם rollback בכישלון, והודעות שגיאה. אתחיל מחוזה ה-API כדי שפרונט ובק יוכלו להתקדם במקביל.",
    },
    keywords: {
      en: ["schema", "api", "validation", "pagination", "optimistic", "index"],
      he: ["סכמה", "ולידציה", "עימוד", "אינדקס", "אבטחה", "מצבים"],
    },
  },
  {
    id: "fs-auth",
    role: "fullstack",
    type: "technical",
    level: "mid",
    text: {
      en: "How does authentication work in a typical web app? Compare sessions and JWTs.",
      he: "איך עובד אימות (authentication) באפליקציית ווב טיפוסית? השוו בין sessions ל-JWT.",
    },
    tip: {
      en: "Explain the flow, storage, and trade-offs: revocation, scaling, XSS/CSRF.",
      he: "הסבירו את הזרימה, האחסון והפשרות: ביטול, סקיילינג, XSS/CSRF.",
    },
    model: {
      en: "After login, the server needs to recognize the user on later requests. With sessions, the server stores session state and the browser holds an httpOnly cookie with the session id — easy to revoke, but requires shared session storage when scaling. With JWTs, the user's claims are signed into a token the client sends each request — stateless and scales easily, but hard to revoke before expiry, so you pair short-lived access tokens with refresh tokens. Either way: httpOnly cookies to mitigate XSS token theft, CSRF protection for cookies, and HTTPS always.",
      he: "אחרי התחברות, השרת צריך לזהות את המשתמש בבקשות הבאות. עם sessions, השרת שומר את מצב הסשן והדפדפן מחזיק cookie מסוג httpOnly עם מזהה הסשן — קל לבטל, אבל דורש אחסון סשנים משותף בסקיילינג. עם JWT, פרטי המשתמש חתומים בטוקן שהלקוח שולח בכל בקשה — חסר מצב וקל לסקייל, אבל קשה לבטל לפני פקיעה, ולכן משלבים access token קצר-חיים עם refresh token. בכל מקרה: cookies מסוג httpOnly נגד גניבת טוקן ב-XSS, הגנת CSRF ל-cookies, ו-HTTPS תמיד.",
    },
    keywords: {
      en: ["session", "jwt", "token", "cookie", "revoke", "stateless"],
      he: ["סשן", "טוקן", "ביטול", "אבטחה", "התחברות", "שרת"],
    },
  },
  {
    id: "fs-slow-endpoint",
    role: "fullstack",
    type: "technical",
    level: "mid",
    text: {
      en: "Users report that a page is slow. How do you find whether the problem is frontend, backend, or database?",
      he: "משתמשים מדווחים שעמוד איטי. איך תגלו אם הבעיה בפרונט, בבק או בבסיס הנתונים?",
    },
    tip: {
      en: "Show a systematic elimination process with tools at each layer.",
      he: "הראו תהליך שיטתי של אלימינציה עם כלים בכל שכבה.",
    },
    model: {
      en: "I'd work through the layers with data. Network tab first: if the API responds fast but the page takes seconds to paint, it's frontend — profile rendering and bundle size. If the API call itself is slow, check server timing logs or APM to split app time from database time. If it's the database, EXPLAIN the query — usually a missing index or an N+1 query pattern. In my experience the most common culprits are N+1 queries on the backend and oversized bundles on the frontend, but measuring beats assuming.",
      he: "אעבור על השכבות עם דאטה. קודם לשונית Network: אם ה-API מגיב מהר אבל לעמוד לוקח שניות להיצבע, הבעיה בפרונט — אפרופיל רינדור וגודל באנדל. אם קריאת ה-API עצמה איטית, אבדוק לוגים של זמני שרת או APM כדי להפריד זמן אפליקציה מזמן בסיס נתונים. אם זה בסיס הנתונים, אריץ EXPLAIN על השאילתה — בדרך כלל אינדקס חסר או דפוס N+1. מניסיוני, האשמים הנפוצים הם שאילתות N+1 בבק ובאנדלים מנופחים בפרונט, אבל מדידה עדיפה על ניחוש.",
    },
    keywords: {
      en: ["network", "profile", "logs", "explain", "index", "n+1"],
      he: ["מדידה", "לוגים", "אינדקס", "שאילתה", "רינדור", "שכבות"],
    },
  },
  {
    id: "fs-api-versioning",
    role: "fullstack",
    type: "technical",
    level: "mid",
    text: {
      en: "You need to change an API that mobile clients already use in production. How do you do it without breaking them?",
      he: "אתם צריכים לשנות API שאפליקציות מובייל כבר משתמשות בו בפרודקשן. איך תעשו זאת בלי לשבור אותן?",
    },
    tip: {
      en: "Backward compatibility, versioning, deprecation timeline, monitoring.",
      he: "תאימות לאחור, גרסאות, לוח זמנים להוצאה משימוש וניטור.",
    },
    model: {
      en: "Rule one: never break existing clients, because mobile users update slowly. Additive changes — new optional fields — are safe. For breaking changes I'd version the endpoint (v2) or use content negotiation, run both versions in parallel, and add metrics on v1 usage. Then a deprecation plan: announce a timeline, monitor adoption, and only remove v1 when usage drops near zero. I'd also add contract tests so we catch accidental breaking changes in CI rather than in production.",
      he: "כלל ראשון: לעולם לא שוברים לקוחות קיימים, כי משתמשי מובייל מתעדכנים לאט. שינויים מוסיפים — שדות אופציונליים חדשים — בטוחים. לשינויים שוברים אגרסא את נקודת הקצה (v2) או אשתמש ב-content negotiation, אריץ את שתי הגרסאות במקביל ואוסיף מדדים על שימוש ב-v1. ואז תוכנית הוצאה משימוש: הכרזה על לוח זמנים, ניטור אימוץ, והסרת v1 רק כשהשימוש מתקרב לאפס. אוסיף גם contract tests כדי לתפוס שבירות בטעות ב-CI ולא בפרודקשן.",
    },
    keywords: {
      en: ["version", "backward", "deprecate", "monitor", "contract", "compatible"],
      he: ["גרסה", "תאימות", "ניטור", "לקוחות", "מדדים", "שבירה"],
    },
  },

  /* ---------- Backend ---------- */
  {
    id: "be-scaling",
    role: "backend",
    type: "technical",
    level: "mid",
    text: {
      en: "Your API works fine with 100 users but struggles at 10,000. What are the first things you'd look at?",
      he: "ה-API שלכם עובד מצוין עם 100 משתמשים אבל קורס ב-10,000. מה הדברים הראשונים שתבדקו?",
    },
    tip: {
      en: "Measure first. Then: database queries, caching, connection pools, horizontal scaling.",
      he: "קודם מדידה. אחר כך: שאילתות, קאשינג, connection pools וסקיילינג אופקי.",
    },
    model: {
      en: "First, observability: which endpoints are slow and where time is spent — app CPU, database, or external calls. The usual suspects in order: unindexed or N+1 database queries, missing caching for hot read paths (Redis or HTTP caching), exhausted database connection pools, and synchronous work that belongs in a queue — emails, image processing. Then horizontal scaling: stateless app servers behind a load balancer. The big wins are almost always in the database layer before infrastructure changes.",
      he: "קודם כל, observability: אילו נקודות קצה איטיות ואיפה הזמן הולך — CPU של האפליקציה, בסיס נתונים או קריאות חיצוניות. החשודים המיידיים לפי סדר: שאילתות בלי אינדקס או N+1, היעדר קאשינג לנתיבי קריאה חמים (Redis או HTTP caching), מאגרי חיבורים שנגמרים, ועבודה סינכרונית ששייכת לתור — מיילים, עיבוד תמונות. ואז סקיילינג אופקי: שרתי אפליקציה חסרי-מצב מאחורי load balancer. הניצחונות הגדולים כמעט תמיד בשכבת בסיס הנתונים לפני שינויי תשתית.",
    },
    keywords: {
      en: ["index", "cache", "queue", "pool", "horizontal", "measure"],
      he: ["אינדקס", "קאש", "תור", "מדידה", "סקיילינג", "שאילתות"],
    },
  },
  {
    id: "be-sql-nosql",
    role: "backend",
    type: "technical",
    level: "mid",
    text: {
      en: "How do you choose between a relational database and a NoSQL store for a new service?",
      he: "איך תבחרו בין בסיס נתונים רלציוני ל-NoSQL לשירות חדש?",
    },
    tip: {
      en: "Talk about data shape, consistency needs, query patterns, and team familiarity.",
      he: "דברו על מבנה הדאטה, צורכי עקביות, דפוסי שאילתות והיכרות הצוות.",
    },
    model: {
      en: "I start from the data and queries, not the hype. Relational wins when data is structured with relationships, you need transactions and strong consistency — orders, payments, users — and when query patterns will evolve, because SQL is flexible. NoSQL fits when the shape is document-like and access is mostly by key, when you need massive horizontal write scaling, or for specific patterns like caching and time series. My honest default is PostgreSQL — it handles JSON well too — and I'd reach for NoSQL when there's a concrete requirement it solves better.",
      he: "אני מתחיל/ה מהדאטה והשאילתות, לא מהבאזז. רלציוני מנצח כשהדאטה מובנה עם קשרים, כשצריך טרנזקציות ועקביות חזקה — הזמנות, תשלומים, משתמשים — וכשדפוסי השאילתות עוד ישתנו, כי SQL גמיש. NoSQL מתאים כשהמבנה דמוי-מסמך והגישה היא בעיקר לפי מפתח, כשצריך סקיילינג אופקי מסיבי לכתיבות, או לדפוסים ספציפיים כמו קאשינג וסדרות זמן. ברירת המחדל הכנה שלי היא PostgreSQL — שמטפל מצוין גם ב-JSON — ואפנה ל-NoSQL כשיש דרישה קונקרטית שהוא פותר טוב יותר.",
    },
    keywords: {
      en: ["relational", "transaction", "consistency", "query", "scale", "document"],
      he: ["רלציוני", "טרנזקציה", "עקביות", "שאילתה", "סקייל", "מסמך"],
    },
  },
  {
    id: "be-api-security",
    role: "backend",
    type: "technical",
    level: "mid",
    text: {
      en: "What are the most important things you do to secure a public-facing API?",
      he: "מהם הדברים החשובים ביותר שתעשו כדי לאבטח API ציבורי?",
    },
    tip: {
      en: "Auth, input validation, rate limiting, least privilege, secrets handling.",
      he: "אימות, ולידציית קלט, הגבלת קצב, הרשאות מינימליות וניהול סודות.",
    },
    model: {
      en: "Layers, not one trick: authentication and per-endpoint authorization — checking not just who you are but what you may access, since broken object-level authorization is the most common API hole. Validate and sanitize all input server-side, use parameterized queries against injection, rate-limit per user and IP, serve only HTTPS, keep secrets in a vault and out of code, and don't leak internals in error messages. Plus dependency scanning and audit logging so you can detect and investigate incidents.",
      he: "שכבות, לא טריק אחד: אימות והרשאות ברמת נקודת קצה — לבדוק לא רק מי אתה אלא למה מותר לך לגשת, כי broken object-level authorization היא הפרצה הנפוצה ביותר ב-API. ולידציה וסינון של כל קלט בצד שרת, שאילתות עם פרמטרים נגד הזרקות, הגבלת קצב לפי משתמש ו-IP, רק HTTPS, סודות ב-vault ולא בקוד, ולא לחשוף פנימיים בהודעות שגיאה. בנוסף סריקת תלויות ולוגים לביקורת כדי לזהות ולחקור אירועים.",
    },
    keywords: {
      en: ["authorization", "validation", "rate", "https", "injection", "secrets"],
      he: ["הרשאות", "ולידציה", "הזרקה", "סודות", "הגבלה", "אימות"],
    },
  },
  {
    id: "be-async",
    role: "backend",
    type: "technical",
    level: "mid",
    text: {
      en: "When would you move work from a request handler into a background job or message queue? Give examples.",
      he: "מתי תעבירו עבודה מתוך request handler לעבודת רקע או message queue? תנו דוגמאות.",
    },
    tip: {
      en: "Anything slow or failure-prone that the user doesn't need synchronously.",
      he: "כל דבר איטי או מועד לכישלון שהמשתמש לא צריך באופן סינכרוני.",
    },
    model: {
      en: "Whenever the user doesn't need the result in the response: sending emails, generating reports or thumbnails, syncing with third-party APIs, and bulk operations. The request just enqueues a job and returns fast. Queues also add resilience — retries with backoff when a third party is down, and buffering during traffic spikes. The trade-offs to handle: idempotency so retries don't duplicate effects, monitoring with dead-letter queues, and communicating async status back to users, for example a 'processing' state with a notification when done.",
      he: "בכל מקרה שהמשתמש לא צריך את התוצאה בתשובה עצמה: שליחת מיילים, יצירת דוחות או תמונות ממוזערות, סנכרון עם API צד-שלישי ופעולות בכמויות. הבקשה רק מכניסה משימה לתור וחוזרת מהר. תורים גם מוסיפים עמידות — ניסיונות חוזרים עם backoff כשצד שלישי נופל, וספיגת עומסים בזמן פיקים. הפשרות שצריך לטפל בהן: אידמפוטנטיות כדי שניסיונות חוזרים לא יכפילו אפקטים, ניטור עם dead-letter queues, ותקשור סטטוס אסינכרוני למשתמש — למשל מצב 'בעיבוד' עם התראה בסיום.",
    },
    keywords: {
      en: ["queue", "async", "retry", "idempotent", "email", "background"],
      he: ["תור", "אסינכרוני", "ניסיון חוזר", "רקע", "מייל", "עיבוד"],
    },
  },

  /* ---------- QA ---------- */
  {
    id: "qa-login-tests",
    role: "qa",
    type: "technical",
    level: "mid",
    text: {
      en: "How would you test a login form? Walk me through your test cases.",
      he: "איך תבדקו טופס התחברות? פרטו את מקרי הבדיקה שלכם.",
    },
    tip: {
      en: "Cover happy path, negative cases, edge cases, security, and UX states.",
      he: "כסו מסלול תקין, מקרים שליליים, מקרי קצה, אבטחה ומצבי UX.",
    },
    model: {
      en: "Happy path: valid credentials log in and land on the right page. Negative: wrong password, non-existent user, empty fields — each with a clear, non-revealing error. Edge cases: leading/trailing spaces, case sensitivity, very long inputs, special characters, paste into password field. Security: SQL injection and XSS attempts, rate limiting after repeated failures, password not visible or logged. UX: loading state on submit, double-click protection, keyboard-only flow, password manager compatibility, and 'forgot password' linkage. I'd automate the core paths and keep exploratory testing for the edges.",
      he: "מסלול תקין: פרטים נכונים מתחברים ומגיעים לעמוד הנכון. שלילי: סיסמה שגויה, משתמש לא קיים, שדות ריקים — כל אחד עם שגיאה ברורה שלא חושפת מידע. מקרי קצה: רווחים בקצוות, רגישות לאותיות, קלטים ארוכים מאוד, תווים מיוחדים, הדבקה בשדה סיסמה. אבטחה: ניסיונות SQL injection ו-XSS, הגבלת קצב אחרי כישלונות חוזרים, סיסמה לא נראית ולא נרשמת בלוגים. UX: מצב טעינה בשליחה, הגנה מלחיצה כפולה, זרימה במקלדת בלבד, תאימות למנהלי סיסמאות וקישור 'שכחתי סיסמה'. אאטמט את המסלולים המרכזיים ואשאיר בדיקות חוקרות לקצוות.",
    },
    keywords: {
      en: ["happy path", "negative", "edge", "security", "injection", "automate"],
      he: ["מסלול תקין", "שלילי", "קצה", "אבטחה", "אוטומציה", "שגיאה"],
    },
  },
  {
    id: "qa-automation-strategy",
    role: "qa",
    type: "technical",
    level: "mid",
    text: {
      en: "What would you automate first in a project with no automated tests, and what would you keep manual?",
      he: "מה תאטמטו קודם בפרויקט בלי בדיקות אוטומטיות, ומה תשאירו ידני?",
    },
    tip: {
      en: "Think test pyramid, ROI, flakiness, and critical user journeys.",
      he: "חשבו על פירמידת הבדיקות, ROI, יציבות ומסעות משתמש קריטיים.",
    },
    model: {
      en: "First, automate the critical user journeys that would hurt most if broken — signup, login, checkout — as a small, stable end-to-end smoke suite that runs on every deploy. In parallel, push for unit and API tests on new code, since they're cheaper and faster than UI tests — the classic test pyramid. I'd keep manual: exploratory testing, usability and visual judgment, and one-off scenarios where automation costs more than it returns. The goal isn't 100% automation; it's fast, trustworthy signal on every change.",
      he: "קודם כל אאטמט את מסעות המשתמש הקריטיים שהכי יכאבו אם יישברו — הרשמה, התחברות, תשלום — כסוויטת smoke קטנה ויציבה מקצה-לקצה שרצה בכל deploy. במקביל אדחוף לבדיקות יחידה ו-API על קוד חדש, כי הן זולות ומהירות מבדיקות UI — פירמידת הבדיקות הקלאסית. אשאיר ידני: בדיקות חוקרות, שיפוט שמישות וויזואליה, ותרחישים חד-פעמיים שבהם האוטומציה עולה יותר משהיא מחזירה. המטרה היא לא 100% אוטומציה, אלא סיגנל מהיר ואמין על כל שינוי.",
    },
    keywords: {
      en: ["pyramid", "smoke", "critical", "exploratory", "unit", "stable"],
      he: ["פירמידה", "קריטי", "חוקרות", "יחידה", "יציב", "אוטומציה"],
    },
  },
  {
    id: "qa-bug-report",
    role: "qa",
    type: "technical",
    level: "mid",
    text: {
      en: "A developer says they can't reproduce a bug you reported. What do you do?",
      he: "מפתח אומר שהוא לא מצליח לשחזר באג שדיווחתם. מה תעשו?",
    },
    tip: {
      en: "Show collaboration and systematic isolation: environment, data, timing.",
      he: "הראו שיתוף פעולה ובידוד שיטתי: סביבה, דאטה, תזמון.",
    },
    model: {
      en: "First I'd verify my own report: reproduce it again and capture everything — exact steps, environment, browser and version, account/data state, video, console and network logs. Then sit with the developer and compare environments, since 'works on my machine' usually means a difference in data, permissions, cache, or build version. If it's intermittent, I'd look for patterns: timing, race conditions, specific data. And if we still can't reproduce it, I'd add logging or monitoring around the suspected area so the next occurrence gives us the answer — close it as 'cannot reproduce' only with evidence, not frustration.",
      he: "קודם אאמת את הדיווח שלי: אשחזר שוב ואתעד הכל — צעדים מדויקים, סביבה, דפדפן וגרסה, מצב חשבון ודאטה, וידאו, לוגים של console ו-network. אחר כך אשב עם המפתח ונשווה סביבות, כי 'אצלי זה עובד' בדרך כלל אומר הבדל בדאטה, הרשאות, קאש או גרסת build. אם זה לסירוגין, אחפש דפוסים: תזמון, race conditions, דאטה ספציפי. ואם עדיין לא משוחזר, אוסיף לוגים או ניטור סביב האזור החשוד כדי שההופעה הבאה תיתן את התשובה — סוגרים כ'לא ניתן לשחזור' רק עם ראיות, לא מתוך תסכול.",
    },
    keywords: {
      en: ["reproduce", "environment", "logs", "steps", "data", "collaborate"],
      he: ["שחזור", "סביבה", "לוגים", "צעדים", "דאטה", "שיתוף"],
    },
  },
  {
    id: "qa-release-decision",
    role: "qa",
    type: "technical",
    level: "mid",
    text: {
      en: "It's release day and you found a medium-severity bug. How do you decide whether to block the release?",
      he: "יום שחרור ומצאתם באג בחומרה בינונית. איך תחליטו אם לעצור את השחרור?",
    },
    tip: {
      en: "Risk assessment: impact, frequency, workaround, rollback plan. QA informs, team decides.",
      he: "הערכת סיכון: השפעה, תדירות, מעקף, תוכנית rollback. QA ממליץ, הצוות מחליט.",
    },
    model: {
      en: "I'd assess risk on concrete axes: how many users hit it and how often, does it corrupt data or just inconvenience, is there a workaround, can we fix-forward quickly or feature-flag it off, and what's the cost of delaying the release. Then I'd present that assessment with a recommendation — QA's job is to make risk visible, while the release decision belongs to the team or product owner. For example, a cosmetic issue in a rare flow ships with a known-issues note; anything touching payments or data integrity blocks. Either way, the bug gets tracked and the decision documented.",
      he: "אעריך סיכון על צירים קונקרטיים: כמה משתמשים נתקלים בו ובאיזו תדירות, האם הוא משחית דאטה או רק מטריד, האם יש מעקף, האם אפשר לתקן מהר קדימה או לכבות ב-feature flag, ומה עלות דחיית השחרור. אז אציג את ההערכה עם המלצה — תפקיד ה-QA הוא להפוך סיכון לגלוי, וההחלטה על השחרור שייכת לצוות או לבעל המוצר. למשל, בעיה קוסמטית בזרימה נדירה משתחררת עם הערת known-issues; כל דבר שנוגע לתשלומים או שלמות הדאטה — חוסם. בכל מקרה, הבאג מתועד וההחלטה מתועדת.",
    },
    keywords: {
      en: ["risk", "severity", "ship", "rollback", "decision", "workaround"],
      he: ["סיכון", "חומרה", "שחרור", "rollback", "החלטה", "מעקף"],
    },
  },
];
