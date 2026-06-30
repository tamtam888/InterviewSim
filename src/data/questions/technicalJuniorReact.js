/**
 * Junior-level React questions — practical, the kind actually asked in
 * real junior frontend/React interviews.
 */
export const JUNIOR_REACT_QUESTIONS = [
  {
    id: "jr-props-state",
    role: "react",
    type: "technical",
    category: "react-fundamentals",
    difficulty: "junior",
    level: "junior",
    tags: ["props", "state", "data-flow"],
    text: {
      en: "What is the difference between props and state in React?",
      he: "מה ההבדל בין props ל-state ב-React?",
    },
    tip: {
      en: "Who owns the data, who can change it, and what happens on change.",
      he: "מי הבעלים של הדאטה, מי יכול לשנות אותה, ומה קורה כשהיא משתנה.",
    },
    model: {
      en: "Props are data a component receives from its parent — they're read-only, like function arguments. State is data the component owns and manages itself with useState, and the component can change it. Both trigger a re-render when they change, but only the owner can update state, while props change only when the parent passes new values. In a form, for example, the input's current value would be state, while a label or placeholder passed from outside would be props.",
      he: "Props הם דאטה שקומפוננטה מקבלת מההורה שלה — לקריאה בלבד, כמו ארגומנטים של פונקציה. State הוא דאטה שהקומפוננטה מחזיקה ומנהלת בעצמה עם useState, והיא יכולה לשנות אותו. שניהם גורמים לרינדור מחדש כשהם משתנים, אבל רק הבעלים יכול לעדכן state, בעוד props משתנים רק כשההורה מעביר ערכים חדשים. בטופס, למשל, הערך הנוכחי של ה-input יהיה state, בעוד תווית או placeholder שמגיעים מבחוץ יהיו props.",
    },
    keywords: {
      en: ["read-only", "parent", "usestate", "re-render", "own", "immutable"],
      he: ["קריאה בלבד", "הורה", "רינדור", "בעלות", "משתנה", "מעביר"],
    },
  },
  {
    id: "jr-usestate",
    role: "react",
    type: "technical",
    category: "react-fundamentals",
    difficulty: "junior",
    level: "junior",
    tags: ["useState", "hooks", "state"],
    text: {
      en: "How does useState work? Walk me through building a simple counter.",
      he: "איך useState עובד? תארו בניית מונה (counter) פשוט.",
    },
    tip: {
      en: "The destructured pair, the setter, and why you never mutate directly.",
      he: "הזוג שמפורק, פונקציית העדכון, ולמה אסור לשנות ישירות.",
    },
    model: {
      en: "useState returns a pair: the current value and a setter — const [count, setCount] = useState(0). Clicking a button calls setCount(count + 1), which tells React to re-render the component with the new value. You never assign count directly, because React wouldn't know anything changed. When the next value depends on the previous one, the safe form is setCount(prev => prev + 1), which avoids stale values if updates happen quickly.",
      he: "useState מחזיר זוג: הערך הנוכחי ופונקציית עדכון — const [count, setCount] = useState(0). לחיצה על כפתור קוראת ל-setCount(count + 1), מה שאומר ל-React לרנדר מחדש את הקומפוננטה עם הערך החדש. אף פעם לא משנים את count ישירות, כי React לא יידע שמשהו השתנה. כשהערך הבא תלוי בקודם, הצורה הבטוחה היא setCount(prev => prev + 1), שמונעת ערכים לא מעודכנים כשעדכונים קורים מהר.",
    },
    keywords: {
      en: ["setter", "re-render", "initial", "prev", "mutate", "hook"],
      he: ["עדכון", "רינדור", "ערך התחלתי", "קודם", "ישירות", "הוק"],
    },
  },
  {
    id: "jr-useeffect-for",
    role: "react",
    type: "technical",
    category: "react-fundamentals",
    difficulty: "junior",
    level: "junior",
    tags: ["useEffect", "side-effects", "lifecycle"],
    text: {
      en: "What is useEffect used for? Give two real examples from a project.",
      he: "למה משמש useEffect? תנו שתי דוגמאות אמיתיות מפרויקט.",
    },
    tip: {
      en: "Side effects: things outside rendering. Mention the dependency array.",
      he: "תופעות לוואי: דברים מחוץ לרינדור. הזכירו את מערך התלויות.",
    },
    model: {
      en: "useEffect runs code after render for things that aren't rendering itself — side effects. Two real examples: fetching data when a component mounts or when an ID changes, and setting the document title or subscribing to a browser event like window resize. The dependency array controls when it runs: empty array means once after mount, listed values mean re-run when they change. If the effect sets up something like a listener or timer, you return a cleanup function so it's removed when the component unmounts.",
      he: "useEffect מריץ קוד אחרי הרינדור עבור דברים שאינם הרינדור עצמו — תופעות לוואי. שתי דוגמאות אמיתיות: שליפת דאטה כשקומפוננטה עולה או כש-ID משתנה, וקביעת כותרת הדף או הרשמה לאירוע דפדפן כמו שינוי גודל חלון. מערך התלויות קובע מתי הוא רץ: מערך ריק = פעם אחת אחרי העלייה, ערכים ברשימה = ריצה מחדש כשהם משתנים. אם ה-effect מקים משהו כמו מאזין או טיימר, מחזירים פונקציית ניקוי שתסיר אותו כשהקומפוננטה יורדת.",
    },
    keywords: {
      en: ["side effect", "fetch", "dependency", "mount", "cleanup", "subscribe"],
      he: ["תופעת לוואי", "שליפה", "תלויות", "עלייה", "ניקוי", "מאזין"],
    },
  },
  {
    id: "jr-state-change",
    role: "react",
    type: "technical",
    category: "react-fundamentals",
    difficulty: "junior",
    level: "junior",
    tags: ["state", "rendering", "virtual-dom"],
    text: {
      en: "What actually happens when state changes in a React component?",
      he: "מה באמת קורה כשה-state משתנה בקומפוננטת React?",
    },
    tip: {
      en: "Setter → re-render → diff → minimal DOM update. Children re-render too.",
      he: "עדכון ← רינדור מחדש ← השוואה ← עדכון DOM מינימלי. גם הילדים מתרנדרים.",
    },
    model: {
      en: "Calling the setter schedules a re-render: React calls the component function again with the new state, producing a new tree of elements. React compares that tree with the previous one (reconciliation) and updates only the real DOM nodes that actually changed — that's why it's fast. By default the component's children re-render too, since they may receive new props. Important detail: state updates are asynchronous and may be batched, so reading state right after calling the setter still gives the old value.",
      he: "קריאה ל-setter מתזמנת רינדור מחדש: React קורא לפונקציית הקומפוננטה שוב עם ה-state החדש ומקבל עץ אלמנטים חדש. React משווה את העץ הזה לקודם (reconciliation) ומעדכן רק את צמתי ה-DOM שבאמת השתנו — לכן זה מהיר. כברירת מחדל גם הילדים של הקומפוננטה מתרנדרים, כי ייתכן שהם מקבלים props חדשים. פרט חשוב: עדכוני state הם אסינכרוניים ועשויים להתאגד, כך שקריאת ה-state מיד אחרי ה-setter עדיין מחזירה את הערך הישן.",
    },
    keywords: {
      en: ["re-render", "reconciliation", "diff", "batch", "asynchronous", "dom"],
      he: ["רינדור", "השוואה", "אסינכרוני", "ילדים", "עדכון", "עץ"],
    },
  },
  {
    id: "jr-controlled-forms",
    role: "react",
    type: "technical",
    category: "forms",
    difficulty: "junior",
    level: "junior",
    tags: ["forms", "controlled-components", "inputs"],
    text: {
      en: "What is a controlled component? How would you build a text input in a form?",
      he: "מהי קומפוננטה מבוקרת (controlled)? איך תבנו שדה טקסט בטופס?",
    },
    tip: {
      en: "value from state + onChange updating it. Why it's useful for validation.",
      he: "value מה-state + onChange שמעדכן אותו. למה זה שימושי לולידציה.",
    },
    model: {
      en: "A controlled component is an input whose value comes from React state: value={text} plus onChange={(e) => setText(e.target.value)}. The state is the single source of truth — the input shows exactly what's in state. That makes validation, clearing the form, and disabling the submit button trivial, because everything reads from state. The alternative, an uncontrolled input, keeps its own value in the DOM and you read it with a ref — fine for simple cases, but controlled is the default pattern in forms.",
      he: "קומפוננטה מבוקרת היא input שהערך שלו מגיע מה-state של React: value={text} ועוד onChange={(e) => setText(e.target.value)}. ה-state הוא מקור האמת היחיד — ה-input מציג בדיוק את מה שיש ב-state. זה הופך ולידציה, ניקוי טופס והשבתת כפתור שליחה לטריוויאליים, כי הכל נקרא מה-state. החלופה, input לא מבוקר, שומר ערך משלו ב-DOM וקוראים אותו עם ref — בסדר למקרים פשוטים, אבל מבוקר הוא דפוס ברירת המחדל בטפסים.",
    },
    keywords: {
      en: ["value", "onchange", "source of truth", "validation", "uncontrolled", "ref"],
      he: ["ערך", "מקור אמת", "ולידציה", "טופס", "מבוקר", "סטייט"],
    },
  },
  {
    id: "jr-conditional-render",
    role: "react",
    type: "technical",
    category: "react-fundamentals",
    difficulty: "junior",
    level: "junior",
    tags: ["conditional-rendering", "jsx"],
    text: {
      en: "What ways do you know to conditionally render UI in React? When do you use each?",
      he: "אילו דרכים אתם מכירים לרינדור מותנה ב-React? מתי תשתמשו בכל אחת?",
    },
    tip: {
      en: "&&, ternary, early return — and the classic 0-rendering pitfall.",
      he: "&&, טרנרי, early return — והמלכודת הקלאסית של רינדור 0.",
    },
    model: {
      en: "Three main patterns: condition && <Component /> for 'show or nothing', a ternary cond ? <A /> : <B /> for two alternatives like loading versus content, and an early return at the top of the component for whole-screen states like 'not logged in'. A classic pitfall: items.length && <List /> renders the number 0 when the array is empty, because 0 is falsy-but-renderable — so use items.length > 0 instead. For many branches, extracting the logic to a variable or a small function keeps JSX readable.",
      he: "שלושה דפוסים עיקריים: condition && <Component /> ל'הצג או כלום', טרנרי cond ? <A /> : <B /> לשתי חלופות כמו טעינה מול תוכן, ו-early return בראש הקומפוננטה למצבים של מסך שלם כמו 'לא מחובר'. מלכודת קלאסית: items.length && <List /> מרנדר את המספר 0 כשהמערך ריק, כי 0 הוא falsy אבל מתרנדר — לכן משתמשים ב-items.length > 0. כשיש הרבה ענפים, הוצאת הלוגיקה למשתנה או פונקציה קטנה שומרת על JSX קריא.",
    },
    keywords: {
      en: ["ternary", "&&", "early return", "loading", "falsy", "zero"],
      he: ["טרנרי", "מותנה", "טעינה", "ריק", "ענפים", "קריא"],
    },
  },
  {
    id: "jr-lifting-state",
    role: "react",
    type: "technical",
    category: "react-fundamentals",
    difficulty: "junior",
    level: "junior",
    tags: ["lifting-state", "data-flow", "architecture"],
    text: {
      en: "What does 'lifting state up' mean, and when would you actually need it?",
      he: "מה זה 'הרמת state למעלה' (lifting state up), ומתי באמת תצטרכו את זה?",
    },
    tip: {
      en: "Two siblings needing the same data → state moves to the shared parent.",
      he: "שני אחים שצריכים את אותו דאטה ← ה-state עובר להורה המשותף.",
    },
    model: {
      en: "Lifting state up means moving state from a child component to the closest parent that all interested components share. You need it when two sibling components must stay in sync — for example, a search input and a results list: the query lives in their shared parent, the input gets the value and a setter via props, and the list filters by it. React data flows one way, parent to child, so a sibling can't read another sibling's state directly — sharing through the parent is the standard solution before reaching for context or a store.",
      he: "הרמת state פירושה העברת state מקומפוננטת-ילד להורה הקרוב ביותר שכל הקומפוננטות המעוניינות חולקות. צריך את זה כששתי קומפוננטות-אחיות חייבות להישאר מסונכרנות — למשל שדה חיפוש ורשימת תוצאות: השאילתה חיה בהורה המשותף, ה-input מקבל ערך ו-setter דרך props, והרשימה מסננת לפיה. דאטה ב-React זורם בכיוון אחד, מהורה לילד, אז אח לא יכול לקרוא state של אח אחר ישירות — שיתוף דרך ההורה הוא הפתרון הסטנדרטי לפני שפונים ל-context או store.",
    },
    keywords: {
      en: ["parent", "siblings", "share", "one-way", "props", "sync"],
      he: ["הורה", "אחים", "שיתוף", "כיוון אחד", "סנכרון", "חיפוש"],
    },
  },
  {
    id: "jr-fetch-react",
    role: "react",
    type: "technical",
    category: "apis",
    difficulty: "junior",
    level: "junior",
    tags: ["fetch", "api", "useEffect", "loading-states"],
    text: {
      en: "How do you fetch data from an API in a React component? Include loading and error handling.",
      he: "איך שולפים דאטה מ-API בקומפוננטת React? כללו טיפול בטעינה ובשגיאות.",
    },
    tip: {
      en: "useEffect + three states: data, loading, error. Check response.ok.",
      he: "useEffect + שלושה מצבים: דאטה, טעינה, שגיאה. בדקו response.ok.",
    },
    model: {
      en: "The basic pattern is useEffect with three pieces of state: data, isLoading, and error. Inside the effect, an async function calls fetch, checks response.ok before parsing JSON — fetch doesn't throw on a 404 — then sets data, with a catch setting the error and a finally turning off loading. The UI renders a spinner while loading, an error message on failure, and the list on success. I'd also mention the empty dependency array so it runs once on mount, and that in a bigger app a library like React Query handles caching and refetching for you.",
      he: "הדפוס הבסיסי הוא useEffect עם שלושה מצבי state: דאטה, isLoading ו-error. בתוך ה-effect, פונקציה אסינכרונית קוראת ל-fetch, בודקת את response.ok לפני פירוק ה-JSON — fetch לא זורק שגיאה על 404 — ואז מעדכנת את הדאטה, עם catch שמעדכן שגיאה ו-finally שמכבה את הטעינה. ה-UI מציג ספינר בזמן טעינה, הודעת שגיאה בכישלון ואת הרשימה בהצלחה. אזכיר גם את מערך התלויות הריק כדי שירוץ פעם אחת בעלייה, ושבאפליקציה גדולה ספרייה כמו React Query מנהלת קאשינג ורענון בשבילך.",
    },
    keywords: {
      en: ["loading", "error", "response.ok", "json", "useeffect", "catch"],
      he: ["טעינה", "שגיאה", "ספינר", "אסינכרוני", "תלויות", "קריאה"],
    },
  },
  {
    id: "jr-third-party",
    role: "react",
    type: "technical",
    category: "tooling",
    difficulty: "junior",
    level: "junior",
    tags: ["npm", "dependencies", "libraries"],
    text: {
      en: "How do you add and use a third-party library in a React project? How do you decide if it's a good one?",
      he: "איך מוסיפים ומשתמשים בספריית צד-שלישי בפרויקט React? איך מחליטים אם היא טובה?",
    },
    tip: {
      en: "npm install → import → use. Judging: downloads, maintenance, size, docs.",
      he: "npm install ← import ← שימוש. שיפוט: הורדות, תחזוקה, גודל, תיעוד.",
    },
    model: {
      en: "Install it with npm install package-name, which adds it to dependencies in package.json and to node_modules, then import what you need at the top of the file and use it like any component or function — for example npm install date-fns, then import { format } from 'date-fns'. Before choosing one I check: is it actively maintained (recent releases, open issues handled), how many weekly downloads, bundle size, decent docs, and whether the license is permissive. I also ask whether I need a library at all — for ten lines of logic, writing it myself avoids a dependency I'll have to update forever.",
      he: "מתקינים עם npm install package-name, מה שמוסיף אותה ל-dependencies ב-package.json ול-node_modules, ואז מייבאים את מה שצריך בראש הקובץ ומשתמשים כמו בכל קומפוננטה או פונקציה — למשל npm install date-fns ואז import { format } from 'date-fns'. לפני בחירה אני בודק: האם היא מתוחזקת (גרסאות אחרונות, טיפול ב-issues), כמה הורדות שבועיות, גודל bundle, תיעוד סביר ורישיון מתאים. אני גם שואל אם בכלל צריך ספרייה — בשביל עשר שורות לוגיקה, עדיף לכתוב לבד מאשר תלות שאצטרך לעדכן לנצח.",
    },
    keywords: {
      en: ["npm install", "import", "package.json", "maintained", "bundle", "docs"],
      he: ["התקנה", "ייבוא", "תחזוקה", "גודל", "תיעוד", "תלות"],
    },
  },
  {
    id: "jr-blank-page",
    role: "react",
    type: "technical",
    category: "debugging",
    difficulty: "junior",
    level: "junior",
    tags: ["debugging", "devtools", "errors"],
    text: {
      en: "You open your React app and the page is completely blank. What do you check, in what order?",
      he: "אתם פותחים את אפליקציית ה-React והעמוד לבן לחלוטין. מה תבדקו, ובאיזה סדר?",
    },
    tip: {
      en: "Console first. Then: render error, router path, root element, build/import errors.",
      he: "קודם Console. אחר כך: שגיאת רינדור, נתיב ראוטר, אלמנט root, שגיאות ייבוא.",
    },
    model: {
      en: "First the browser console — a blank page almost always logs the reason: a runtime error during render (like reading a property of undefined), a failed import, or a syntax error that broke the bundle. Then I check the terminal where the dev server runs for compile errors. If the console is clean, I check that index.html has the root div and main.jsx actually mounts into it, that the router path matches the URL, and that I'm not rendering null because of a condition like data being undefined before the fetch finishes. React DevTools showing an empty tree versus a tree with components narrows it to mounting versus rendering.",
      he: "קודם כל ה-Console בדפדפן — עמוד לבן כמעט תמיד מתעד את הסיבה: שגיאת ריצה בזמן רינדור (כמו קריאת property של undefined), ייבוא שנכשל, או שגיאת תחביר ששברה את ה-bundle. אחר כך אבדוק את הטרמינל של שרת הפיתוח לשגיאות קומפילציה. אם ה-Console נקי, אבדוק שב-index.html יש את ה-div של root ושה-main.jsx באמת נטען לתוכו, שנתיב הראוטר תואם ל-URL, ושאני לא מרנדר null בגלל תנאי כמו דאטה שעוד undefined לפני שה-fetch הסתיים. React DevTools שמראה עץ ריק מול עץ עם קומפוננטות מצמצם בין בעיית טעינה לבעיית רינדור.",
  
    },
    keywords: {
      en: ["console", "error", "root", "import", "router", "devtools"],
      he: ["קונסול", "שגיאה", "טרמינל", "ייבוא", "ראוטר", "רינדור"],
    },
  },
];
