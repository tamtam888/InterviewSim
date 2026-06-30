/**
 * Junior-level web questions — JavaScript, CSS, tooling, Git, env & security.
 * Frontend role + full-stack tooling/workflow questions.
 */
export const JUNIOR_WEB_QUESTIONS = [
  /* ---------- Frontend: JavaScript ---------- */
  {
    id: "jr-arrow-fn",
    role: "frontend",
    type: "technical",
    category: "javascript",
    difficulty: "junior",
    level: "junior",
    tags: ["arrow-functions", "this", "syntax"],
    text: {
      en: "What is an arrow function, and how is it different from a regular function?",
      he: "מהי arrow function, ובמה היא שונה מפונקציה רגילה?",
    },
    tip: {
      en: "Syntax, implicit return, and the `this` difference.",
      he: "תחביר, החזרה מרומזת, וההבדל ב-this.",
    },
    model: {
      en: "An arrow function is the shorter syntax: const add = (a, b) => a + b — with a single expression the return is implicit. The deeper difference is `this`: arrow functions don't have their own `this`, they inherit it from the surrounding scope, while regular functions get `this` from how they're called. That's why arrows are great for callbacks like array methods or event handlers inside classes, and why they can't be used as object methods that rely on `this` or as constructors. In React function components, we use them constantly for inline handlers and array callbacks.",
      he: "Arrow function היא התחביר הקצר: const add = (a, b) => a + b — עם ביטוי יחיד ההחזרה מרומזת. ההבדל העמוק הוא this: לפונקציות חץ אין this משלהן, הן יורשות אותו מהסקופ העוטף, בעוד פונקציה רגילה מקבלת this לפי איך שקראו לה. לכן חצים מצוינים ל-callbacks כמו מתודות מערך או event handlers בתוך מחלקות, ולכן אי אפשר להשתמש בהם כמתודות אובייקט שתלויות ב-this או כבנאים. בקומפוננטות React אנחנו משתמשים בהם כל הזמן ל-handlers ול-callbacks של מערכים.",
    },
    keywords: {
      en: ["this", "implicit return", "syntax", "callback", "scope", "constructor"],
      he: ["תחביר", "החזרה", "סקופ", "קולבק", "בנאי", "יורשת"],
    },
  },
  {
    id: "jr-map-filter-reduce",
    role: "frontend",
    type: "technical",
    category: "javascript",
    difficulty: "junior",
    level: "junior",
    tags: ["arrays", "map", "filter", "reduce"],
    text: {
      en: "Explain map, filter and reduce with a practical example — say, a list of products.",
      he: "הסבירו את map, filter ו-reduce עם דוגמה מעשית — נגיד רשימת מוצרים.",
    },
    tip: {
      en: "What each returns, and that none of them mutate the original array.",
      he: "מה כל אחת מחזירה, ושאף אחת לא משנה את המערך המקורי.",
    },
    model: {
      en: "map transforms each item and returns a new array of the same length — products.map(p => p.price) gives just the prices. filter keeps items that pass a test — products.filter(p => p.inStock) returns only in-stock products. reduce boils the array down to a single value — products.reduce((sum, p) => sum + p.price, 0) totals the cart. All three return new arrays or values without mutating the original, which fits React's immutability perfectly. In JSX, map is the one you use daily: products.map(p => <ProductCard key={p.id} ... />).",
      he: "map ממירה כל פריט ומחזירה מערך חדש באותו אורך — products.map(p => p.price) נותן רק את המחירים. filter שומרת פריטים שעוברים תנאי — products.filter(p => p.inStock) מחזירה רק מוצרים במלאי. reduce מצמצמת את המערך לערך יחיד — products.reduce((sum, p) => sum + p.price, 0) מסכמת את העגלה. שלושתן מחזירות מערכים או ערכים חדשים בלי לשנות את המקור, מה שמתאים בדיוק לאי-המוטביליות של React. ב-JSX, map היא זו שמשתמשים בה יומיום: products.map(p => <ProductCard key={p.id} ... />).",
    },
    keywords: {
      en: ["transform", "new array", "mutate", "sum", "immutable", "key"],
      he: ["ממירה", "מערך חדש", "מסננת", "סכום", "מקור", "פריט"],
    },
  },
  {
    id: "jr-destructuring",
    role: "frontend",
    type: "technical",
    category: "javascript",
    difficulty: "junior",
    level: "junior",
    tags: ["destructuring", "es6", "props"],
    text: {
      en: "What is destructuring? Show where you'd use it in everyday React code.",
      he: "מהו destructuring? הראו איפה תשתמשו בו בקוד React יומיומי.",
    },
    tip: {
      en: "Objects and arrays, defaults, and the two famous React spots.",
      he: "אובייקטים ומערכים, ערכי ברירת מחדל, ושני המקומות המפורסמים ב-React.",
    },
    model: {
      en: "Destructuring unpacks values from objects or arrays into variables: const { name, price } = product, or const [first, second] = list. You can set defaults — const { size = 'md' } = props — and rename. In React it's everywhere: function Card({ title, onClick }) destructures props right in the signature, and const [count, setCount] = useState(0) is array destructuring of the state pair. It makes code shorter and shows at a glance which fields a component actually uses.",
      he: "Destructuring מחלץ ערכים מאובייקטים או מערכים למשתנים: const { name, price } = product, או const [first, second] = list. אפשר לקבוע ברירות מחדל — const { size = 'md' } = props — ולשנות שמות. ב-React זה בכל מקום: function Card({ title, onClick }) מפרק את ה-props ישר בחתימה, ו-const [count, setCount] = useState(0) הוא פירוק מערך של זוג ה-state. זה מקצר קוד ומראה במבט אילו שדות הקומפוננטה באמת צורכת.",
    },
    keywords: {
      en: ["unpack", "object", "array", "default", "props", "usestate"],
      he: ["פירוק", "אובייקט", "מערך", "ברירת מחדל", "חתימה", "משתנים"],
    },
  },
  {
    id: "jr-promises-async",
    role: "frontend",
    type: "technical",
    category: "javascript",
    difficulty: "junior",
    level: "junior",
    tags: ["promises", "async-await", "asynchronous"],
    text: {
      en: "Explain what a promise is, and how async/await relates to it.",
      he: "הסבירו מה זה promise, ואיך async/await קשור אליו.",
    },
    tip: {
      en: "Pending/fulfilled/rejected, .then vs await, try/catch for errors.",
      he: "מצבי promise, ‏.then מול await, ו-try/catch לשגיאות.",
    },
    model: {
      en: "A promise represents a value that will arrive later — it starts pending and settles as fulfilled with a value or rejected with an error. You can consume it with .then/.catch chains, but async/await is syntax over the same promises that reads like normal code: inside an async function, await pauses until the promise settles, and errors are handled with try/catch instead of .catch. So const data = await fetch(url).then(r => r.json()) and the .then version do the same thing — await just makes multi-step flows much easier to read and debug.",
      he: "Promise מייצג ערך שיגיע מאוחר יותר — הוא מתחיל pending ומסתיים כ-fulfilled עם ערך או rejected עם שגיאה. אפשר לצרוך אותו עם שרשראות then/catch, אבל async/await הוא תחביר מעל אותם promises שנקרא כמו קוד רגיל: בתוך פונקציה async, ‏await עוצר עד שה-promise מסתיים, ושגיאות נתפסות עם try/catch במקום catch. כך ש-const data = await fetch(url) וגרסת ה-then עושות אותו דבר — await פשוט הופך זרימות מרובות-שלבים לקריאות וקלות לדיבוג.",
    },
    keywords: {
      en: ["pending", "fulfilled", "rejected", "then", "await", "try/catch"],
      he: ["ממתין", "הצלחה", "שגיאה", "תחביר", "אסינכרוני", "קריא"],
    },
  },
  {
    id: "jr-fetch-errors",
    role: "frontend",
    type: "technical",
    category: "apis",
    difficulty: "junior",
    level: "junior",
    tags: ["fetch", "api", "error-handling", "http"],
    text: {
      en: "How do you call an API with fetch and handle errors properly? What surprises people about fetch?",
      he: "איך קוראים ל-API עם fetch ומטפלים בשגיאות נכון? מה מפתיע אנשים לגבי fetch?",
    },
    tip: {
      en: "fetch only rejects on network failure — check response.ok yourself.",
      he: "fetch נכשל רק על שגיאת רשת — את response.ok בודקים לבד.",
    },
    model: {
      en: "The surprise: fetch does NOT throw on HTTP errors like 404 or 500 — it only rejects on network failure. So the correct pattern is: const res = await fetch(url); if (!res.ok) throw new Error(`HTTP ${res.status}`); const data = await res.json(); — all inside try/catch. I'd also distinguish error types for the user: a network error means 'check your connection', a 404 means the resource doesn't exist, a 500 means try again later. For POST requests you add method, headers with Content-Type: application/json, and a JSON.stringify'd body.",
      he: "ההפתעה: fetch לא זורק שגיאה על שגיאות HTTP כמו 404 או 500 — הוא נכשל רק על שגיאת רשת. לכן הדפוס הנכון: const res = await fetch(url); if (!res.ok) throw new Error(`HTTP ${res.status}`); const data = await res.json(); — הכל בתוך try/catch. כדאי גם להבדיל בין סוגי שגיאות עבור המשתמש: שגיאת רשת אומרת 'בדקו את החיבור', 404 אומר שהמשאב לא קיים, 500 אומר לנסות שוב מאוחר יותר. בבקשות POST מוסיפים method, ‏headers עם Content-Type: application/json, ו-body עם JSON.stringify.",
    },
    keywords: {
      en: ["response.ok", "status", "network", "try/catch", "json", "headers"],
      he: ["סטטוס", "רשת", "שגיאה", "כותרות", "בקשה", "טיפול"],
    },
  },

  /* ---------- Frontend: CSS & browser ---------- */
  {
    id: "jr-css-specificity",
    role: "frontend",
    type: "technical",
    category: "css",
    difficulty: "junior",
    level: "junior",
    tags: ["css", "specificity", "selectors"],
    text: {
      en: "Your CSS rule isn't being applied. How does specificity work, and how do you debug this?",
      he: "כלל ה-CSS שלכם לא חל. איך עובדת ספציפיות (specificity), ואיך מדבגים את זה?",
    },
    tip: {
      en: "inline > id > class > element; later wins on ties. DevTools shows the winner.",
      he: "inline > id > class > element; בשוויון האחרון מנצח. DevTools מראה מי גבר.",
    },
    model: {
      en: "Specificity decides which rule wins when several target the same element: inline styles beat IDs, IDs beat classes/attributes/pseudo-classes, which beat element selectors — and on equal specificity, the rule that comes later in the file wins. To debug, I open DevTools, inspect the element, and look at the Styles panel: overridden rules appear crossed out, and you can see exactly which selector won. Usual fixes: make the selector slightly more specific, fix the order, or check the rule isn't misspelled or scoped to the wrong element. !important works but is a last resort because it makes future overrides painful.",
      he: "ספציפיות קובעת איזה כלל מנצח כשכמה כללים פונים לאותו אלמנט: סגנון inline גובר על ID, ‏ID גובר על מחלקות/תכונות/פסאודו-מחלקות, שגוברות על סלקטורים של אלמנטים — ובשוויון, הכלל המאוחר יותר בקובץ מנצח. לדיבוג אני פותח DevTools, בוחן את האלמנט ומסתכל בפאנל Styles: כללים שנדרסו מופיעים מחוקים, ורואים בדיוק איזה סלקטור ניצח. תיקונים נפוצים: סלקטור מעט יותר ספציפי, תיקון סדר, או בדיקה שהכלל לא שגוי בכתיב או מכוון לאלמנט הלא נכון. !important עובד אבל הוא מוצא אחרון כי הוא מקשה על דריסות עתידיות.",
    },
    keywords: {
      en: ["inline", "id", "class", "order", "devtools", "important"],
      he: ["סלקטור", "מחלקה", "סדר", "נדרס", "בוחן", "מנצח"],
    },
  },
  {
    id: "jr-responsive",
    role: "frontend",
    type: "technical",
    category: "css",
    difficulty: "junior",
    level: "junior",
    tags: ["responsive", "media-queries", "flexbox", "grid"],
    text: {
      en: "How do you make a page responsive? Name the concrete techniques you actually use.",
      he: "איך הופכים עמוד לרספונסיבי? ציינו את הטכניקות הקונקרטיות שאתם באמת משתמשים בהן.",
    },
    tip: {
      en: "Fluid layouts first, media queries second. Mention the viewport meta tag.",
      he: "פריסות נוזליות קודם, media queries אחר כך. הזכירו את תגית ה-viewport.",
    },
    model: {
      en: "I start fluid: Flexbox and Grid with flexible units — percentages, fr, minmax, auto-fit — so the layout adapts before any breakpoints. Then media queries for real layout changes, like a sidebar collapsing under 800px; I work mobile-first with min-width queries. Other essentials: the viewport meta tag (without it, phones render a zoomed-out desktop page), relative font sizes with rem and clamp() for fluid type, max-width: 100% on images, and testing in DevTools device mode plus at least one real phone. Modern bonus: container queries when a component should adapt to its container rather than the screen.",
      he: "אני מתחיל נוזלי: Flexbox ו-Grid עם יחידות גמישות — אחוזים, fr, minmax, auto-fit — כך שהפריסה מסתגלת עוד לפני breakpoints. אז media queries לשינויי פריסה אמיתיים, כמו סרגל צד שמתקפל מתחת ל-800px; אני עובד mobile-first עם min-width. עוד חיוניים: תגית ה-viewport (בלעדיה טלפונים מרנדרים עמוד דסקטופ מוקטן), גדלי פונט יחסיים עם rem ו-clamp() לטיפוגרפיה נוזלית, max-width: 100% על תמונות, ובדיקה ב-device mode של DevTools ולפחות טלפון אמיתי אחד. בונוס מודרני: container queries כשקומפוננטה צריכה להסתגל למיכל שלה ולא למסך.",
    },
    keywords: {
      en: ["media query", "flexbox", "grid", "viewport", "mobile-first", "rem"],
      he: ["נוזלי", "פריסה", "מובייל", "יחידות", "תמונות", "בדיקה"],
    },
  },
  {
    id: "jr-localstorage",
    role: "frontend",
    type: "technical",
    category: "browser",
    difficulty: "junior",
    level: "junior",
    tags: ["localStorage", "persistence", "browser-apis"],
    text: {
      en: "What is localStorage, when would you use it, and what are its limitations?",
      he: "מהו localStorage, מתי תשתמשו בו, ומהן המגבלות שלו?",
    },
    tip: {
      en: "Strings only (JSON.stringify/parse), ~5MB, synchronous, never for secrets.",
      he: "מחרוזות בלבד (JSON), כ-5MB, סינכרוני, לעולם לא לסודות.",
    },
    model: {
      en: "localStorage persists key-value strings in the browser across sessions — setItem, getItem, removeItem. Since it stores only strings, objects go through JSON.stringify and come back with JSON.parse, ideally wrapped in try/catch because stored data can be corrupted or absent. Good uses: UI preferences like theme or language, drafts, a small practice history. Limitations: roughly 5MB, synchronous (don't hammer it in loops), per-origin, can be blocked in private mode — so always handle failure — and crucially it's readable by any JS on the page, so never store tokens, passwords, or anything sensitive.",
      he: "localStorage שומר מחרוזות מפתח-ערך בדפדפן בין סשנים — setItem, getItem, removeItem. כיוון שהוא שומר רק מחרוזות, אובייקטים עוברים JSON.stringify וחוזרים עם JSON.parse, רצוי בתוך try/catch כי דאטה שמור יכול להיות פגום או חסר. שימושים טובים: העדפות UI כמו ערכת נושא או שפה, טיוטות, היסטוריית תרגול קטנה. מגבלות: בערך 5MB, סינכרוני (לא להציף בלולאות), לפי origin, יכול להיחסם במצב פרטי — אז תמיד מטפלים בכישלון — והכי חשוב: כל JS בעמוד יכול לקרוא אותו, אז לעולם לא שומרים בו טוקנים, סיסמאות או מידע רגיש.",
    },
    keywords: {
      en: ["setitem", "json", "persist", "5mb", "synchronous", "secrets"],
      he: ["שמירה", "מחרוזת", "מגבלה", "סינכרוני", "סודות", "העדפות"],
    },
  },
  {
    id: "jr-devtools",
    role: "frontend",
    type: "technical",
    category: "debugging",
    difficulty: "junior",
    level: "junior",
    tags: ["devtools", "debugging", "browser"],
    text: {
      en: "Which browser DevTools panels do you use, and what do you use each one for?",
      he: "באילו פאנלים של DevTools אתם משתמשים, ולמה משמש כל אחד?",
    },
    tip: {
      en: "Console, Elements, Network at minimum — with a concrete use for each.",
      he: "לפחות Console, Elements, Network — עם שימוש קונקרטי לכל אחד.",
    },
    model: {
      en: "Console for errors, warnings and quick checks — it's the first place I look when anything breaks. Elements to inspect the DOM and live-edit CSS, see which rules apply and test fixes before touching code. Network to watch API calls: status codes, request/response bodies, headers, and timing — invaluable when 'the data doesn't show' (is the request even sent? did it 401?). Beyond those: Sources for breakpoints when console.log isn't enough, Application to inspect localStorage and cookies, and Lighthouse plus the device toolbar for performance and responsive checks. With React DevTools added, I can inspect component props and state directly.",
      he: "Console לשגיאות, אזהרות ובדיקות מהירות — המקום הראשון שאני מסתכל בו כשמשהו נשבר. Elements לבחינת ה-DOM ועריכת CSS חיה, לראות אילו כללים חלים ולנסות תיקונים לפני נגיעה בקוד. Network למעקב אחרי קריאות API: קודי סטטוס, גופי בקשה/תשובה, כותרות וזמנים — לא יסולא בפז כש'הדאטה לא מופיע' (האם הבקשה בכלל נשלחה? קיבלה 401?). מעבר לאלה: Sources ל-breakpoints כש-console.log לא מספיק, Application לבחינת localStorage ועוגיות, ו-Lighthouse עם סרגל המכשירים לבדיקות ביצועים ורספונסיביות. עם React DevTools אפשר לבחון props ו-state של קומפוננטות ישירות.",
    },
    keywords: {
      en: ["console", "elements", "network", "breakpoint", "application", "lighthouse"],
      he: ["קונסול", "רשת", "סטטוס", "בדיקה", "עריכה", "ביצועים"],
    },
  },
  {
    id: "jr-git-basics",
    role: "frontend",
    type: "technical",
    category: "workflow",
    difficulty: "junior",
    level: "junior",
    tags: ["git", "github", "workflow"],
    text: {
      en: "Walk me through your Git workflow on a team: from starting a task to your code reaching main.",
      he: "תארו את זרימת העבודה שלכם עם Git בצוות: מתחילת משימה ועד שהקוד מגיע ל-main.",
    },
    tip: {
      en: "branch → commits → push → pull request → review → merge. Why branches matter.",
      he: "ענף ← קומיטים ← push ← pull request ← ביקורת ← מיזוג. למה ענפים חשובים.",
    },
    model: {
      en: "I pull the latest main, create a feature branch — git checkout -b feature/login-form — and work there so main stays stable. I commit in small, described steps: git add, git commit -m 'Add email validation', which makes review and rollback easy. Then git push sets the branch on GitHub and I open a pull request describing what and why; a teammate reviews, I fix what's needed, and we merge. If main moved meanwhile, I pull and resolve conflicts locally first. The two commands that save juniors: git status constantly, and git log to understand what happened.",
      he: "אני מושך את main העדכני, יוצר ענף פיצ'ר — git checkout -b feature/login-form — ועובד שם כדי ש-main יישאר יציב. אני מקמיט בצעדים קטנים ומתוארים: git add, ‏git commit -m 'Add email validation', מה שמקל על ביקורת ועל חזרה לאחור. אז git push מעלה את הענף ל-GitHub ואני פותח pull request שמתאר מה ולמה; חבר צוות סוקר, אני מתקן מה שצריך וממזגים. אם main התקדם בינתיים, אני מושך ופותר קונפליקטים מקומית קודם. שתי הפקודות שמצילות ג'וניורים: git status כל הזמן, ו-git log כדי להבין מה קרה.",
    },
    keywords: {
      en: ["branch", "commit", "push", "pull request", "review", "merge"],
      he: ["ענף", "קומיט", "מיזוג", "ביקורת", "קונפליקט", "סטטוס"],
    },
  },

  /* ---------- Full-stack: tooling & workflow ---------- */
  {
    id: "jr-npm-install-dev",
    role: "fullstack",
    type: "technical",
    category: "tooling",
    difficulty: "junior",
    level: "junior",
    tags: ["npm", "tooling", "scripts"],
    text: {
      en: "What's the difference between npm install and npm run dev?",
      he: "מה ההבדל בין npm install ל-npm run dev?",
    },
    tip: {
      en: "One downloads dependencies, the other runs a script from package.json.",
      he: "אחת מורידה תלויות, השנייה מריצה סקריפט מ-package.json.",
    },
    model: {
      en: "npm install reads package.json and downloads all listed dependencies into node_modules — you run it once after cloning a project and again when dependencies change; package-lock.json pins exact versions so everyone gets the same tree. npm run dev runs the script named 'dev' defined in package.json's scripts section — in a Vite project that script is 'vite', which starts the local dev server with hot reload. So: install prepares the project's libraries, run dev actually starts the app for development. If 'npm run dev' fails right after cloning, the usual cause is simply that npm install wasn't run yet.",
      he: "npm install קורא את package.json ומוריד את כל התלויות הרשומות אל node_modules — מריצים אותו פעם אחת אחרי שכפול פרויקט ושוב כשהתלויות משתנות; package-lock.json נועל גרסאות מדויקות כך שכולם מקבלים אותו עץ. npm run dev מריץ את הסקריפט בשם 'dev' שמוגדר בחלק scripts של package.json — בפרויקט Vite הסקריפט הזה הוא 'vite', שמרים שרת פיתוח מקומי עם hot reload. כלומר: install מכין את ספריות הפרויקט, run dev באמת מריץ את האפליקציה לפיתוח. אם 'npm run dev' נכשל מיד אחרי שכפול, הסיבה הרגילה היא פשוט ש-npm install עוד לא הורץ.",
    },
    keywords: {
      en: ["dependencies", "node_modules", "scripts", "package.json", "dev server", "lock"],
      he: ["תלויות", "סקריפט", "שרת פיתוח", "התקנה", "גרסאות", "שכפול"],
    },
  },
  {
    id: "jr-package-json",
    role: "fullstack",
    type: "technical",
    category: "tooling",
    difficulty: "junior",
    level: "junior",
    tags: ["package.json", "dependencies", "npm"],
    text: {
      en: "What lives in package.json? What's the difference between dependencies and devDependencies?",
      he: "מה נמצא ב-package.json? מה ההבדל בין dependencies ל-devDependencies?",
    },
    tip: {
      en: "Name/version/scripts/deps. Runtime vs build-time packages, with examples.",
      he: "שם/גרסה/סקריפטים/תלויות. חבילות ריצה מול חבילות פיתוח, עם דוגמאות.",
    },
    model: {
      en: "package.json is the project's manifest: name, version, the scripts you run with npm run, and the two dependency lists. dependencies are packages the app needs at runtime — react, react-dom, a date library. devDependencies are tools needed only while developing or building — vite, eslint, testing libraries; npm install -D puts a package there. The split matters for clarity and for production installs that skip dev tools. Version ranges like ^19.2.0 allow compatible updates, and package-lock.json records the exact resolved versions so installs are reproducible across the team.",
      he: "package.json הוא המניפסט של הפרויקט: שם, גרסה, הסקריפטים שמריצים עם npm run, ושתי רשימות התלויות. dependencies הן חבילות שהאפליקציה צריכה בזמן ריצה — react, react-dom, ספריית תאריכים. devDependencies הן כלים שנחוצים רק בזמן פיתוח או בנייה — vite, eslint, ספריות בדיקה; npm install -D מכניס חבילה לשם. ההפרדה חשובה לבהירות ולהתקנות פרודקשן שמדלגות על כלי פיתוח. טווחי גרסאות כמו ^19.2.0 מאפשרים עדכונים תואמים, ו-package-lock.json מתעד את הגרסאות המדויקות כך שההתקנות זהות בכל הצוות.",
    },
    keywords: {
      en: ["scripts", "dependencies", "devdependencies", "runtime", "version", "lock"],
      he: ["סקריפטים", "תלויות", "ריצה", "פיתוח", "גרסה", "מניפסט"],
    },
  },
  {
    id: "jr-folder-structure",
    role: "fullstack",
    type: "technical",
    category: "architecture",
    difficulty: "junior",
    level: "junior",
    tags: ["folder-structure", "organization", "vite"],
    text: {
      en: "How would you organize components and folders in a growing React (Vite) project?",
      he: "איך תארגנו קומפוננטות ותיקיות בפרויקט React (Vite) שגדל?",
    },
    tip: {
      en: "Start simple, group by feature as it grows. Show a concrete tree.",
      he: "מתחילים פשוט, מקבצים לפי פיצ'ר כשגדל. הראו עץ קונקרטי.",
    },
    model: {
      en: "I start with the standard Vite skeleton — index.html at the root, src/ with main.jsx and App.jsx — and add folders as real needs appear: components/ for shared UI like buttons and cards, pages/ or screens/ for route-level views, hooks/ for custom hooks, utils/ for pure helpers, and an api/ or services/ layer for server calls. Styles live next to what they style. When the app grows, I shift from grouping by type to grouping by feature — a features/checkout folder containing its components, hooks, and api together — because related code that changes together should live together. The rule I follow: don't create structure speculatively; three similar files earn a folder.",
      he: "אני מתחיל מהשלד הסטנדרטי של Vite — index.html בשורש, src/ עם main.jsx ו-App.jsx — ומוסיף תיקיות כשמופיע צורך אמיתי: components/ ל-UI משותף כמו כפתורים וכרטיסים, pages/ או screens/ לתצוגות ברמת ראוט, hooks/ להוקים מותאמים, utils/ לעזרים טהורים, ושכבת api/ או services/ לקריאות שרת. סטיילים יושבים ליד מה שהם מעצבים. כשהאפליקציה גדלה, אני עובר מקיבוץ לפי סוג לקיבוץ לפי פיצ'ר — תיקיית features/checkout שמכילה יחד את הקומפוננטות, ההוקים וה-api שלה — כי קוד קשור שמשתנה יחד צריך לגור יחד. הכלל שלי: לא יוצרים מבנה ספקולטיבית; שלושה קבצים דומים מצדיקים תיקייה.",
    },
    keywords: {
      en: ["components", "pages", "hooks", "feature", "structure", "src"],
      he: ["קומפוננטות", "תיקיות", "פיצר", "מבנה", "עזרים", "שכבה"],
    },
  },
  {
    id: "jr-env-vars",
    role: "fullstack",
    type: "technical",
    category: "tooling",
    difficulty: "junior",
    level: "junior",
    tags: ["env", "vite", "configuration", "security"],
    text: {
      en: "What are environment variables, and how do they work in a Vite project? What's the security catch?",
      he: "מהם משתני סביבה, ואיך הם עובדים בפרויקט Vite? מה מלכודת האבטחה?",
    },
    tip: {
      en: ".env files, the VITE_ prefix, and why frontend env vars are never secret.",
      he: "קובצי .env, קידומת VITE_, ולמה משתני סביבה בפרונט לעולם אינם סוד.",
    },
    model: {
      en: "Environment variables hold configuration that changes between environments — API URLs, feature flags — without changing code. In Vite they live in .env files and are exposed to your code as import.meta.env.VITE_SOMETHING, but only variables prefixed with VITE_ reach the frontend, deliberately. The security catch: anything with the VITE_ prefix is baked into the public JavaScript bundle, so anyone can read it — frontend env vars are configuration, never secrets. Real secrets like API keys belong on a server, read from process.env, with .env files git-ignored and only a .env.example committed.",
      he: "משתני סביבה מחזיקים קונפיגורציה שמשתנה בין סביבות — כתובות API, דגלי פיצ'רים — בלי לשנות קוד. ב-Vite הם יושבים בקובצי .env ונחשפים לקוד כ-import.meta.env.VITE_SOMETHING, אבל רק משתנים עם קידומת VITE_ מגיעים לפרונט, בכוונה. מלכודת האבטחה: כל מה שעם קידומת VITE_ נאפה לתוך ה-bundle הציבורי, כך שכל אחד יכול לקרוא אותו — משתני סביבה בפרונט הם קונפיגורציה, לעולם לא סודות. סודות אמיתיים כמו מפתחות API שייכים לשרת, נקראים מ-process.env, עם קובצי .env ב-gitignore ורק .env.example בקוד.",
    },
    keywords: {
      en: ["vite_", "import.meta.env", "bundle", "secrets", "gitignore", "server"],
      he: ["קידומת", "קונפיגורציה", "סודות", "שרת", "ציבורי", "מפתח"],
    },
  },
  {
    id: "jr-frontend-security",
    role: "fullstack",
    type: "technical",
    category: "security",
    difficulty: "junior",
    level: "junior",
    tags: ["security", "xss", "validation"],
    text: {
      en: "What frontend security basics do you watch for when building an app?",
      he: "על אילו יסודות אבטחה בפרונטאנד אתם מקפידים כשבונים אפליקציה?",
    },
    tip: {
      en: "XSS, no secrets in frontend code, validate on the server too, HTTPS.",
      he: "XSS, בלי סודות בקוד פרונט, ולידציה גם בשרת, HTTPS.",
    },
    model: {
      en: "The big four: first, XSS — never inject raw user content into the DOM; React escapes JSX by default, so the danger zones are dangerouslySetInnerHTML and building HTML strings by hand. Second, no secrets in frontend code or VITE_ env vars — everything shipped to the browser is public, so keys live on a server. Third, client-side validation is UX only — the server must validate everything again, because anyone can bypass the UI with curl. Fourth, HTTPS everywhere, and being careful with what goes into localStorage since any script on the page can read it. Bonus habit: keep dependencies updated, since npm audit findings are real attack surface.",
      he: "הארבעה הגדולים: ראשית XSS — לעולם לא מזריקים תוכן משתמש גולמי ל-DOM; ‏React ממלט JSX כברירת מחדל, אז אזורי הסכנה הם dangerouslySetInnerHTML ובניית מחרוזות HTML ידנית. שנית, אין סודות בקוד פרונט או במשתני VITE_ — כל מה שנשלח לדפדפן הוא ציבורי, אז מפתחות חיים בשרת. שלישית, ולידציה בצד לקוח היא UX בלבד — השרת חייב לוודא הכל שוב, כי כל אחד יכול לעקוף את ה-UI עם curl. רביעית, HTTPS בכל מקום, וזהירות עם מה שנכנס ל-localStorage כי כל סקריפט בעמוד קורא אותו. הרגל בונוס: לעדכן תלויות, כי ממצאי npm audit הם שטח תקיפה אמיתי.",
    },
    keywords: {
      en: ["xss", "secrets", "validation", "https", "localstorage", "audit"],
      he: ["הזרקה", "סודות", "ולידציה", "שרת", "ציבורי", "תלויות"],
    },
  },
  {
    id: "jr-debug-api",
    role: "fullstack",
    type: "technical",
    category: "debugging",
    difficulty: "junior",
    level: "junior",
    tags: ["debugging", "api", "cors", "deployment"],
    text: {
      en: "An API call works locally but fails after deployment. How do you debug it?",
      he: "קריאת API עובדת מקומית אבל נכשלת אחרי דיפלוי. איך תדבגו את זה?",
    },
    tip: {
      en: "Network tab first: status? CORS? wrong URL? Then env vars and the server.",
      he: "קודם לשונית Network: סטטוס? CORS? כתובת שגויה? ואז משתני סביבה והשרת.",
    },
    model: {
      he: "פותחים את לשונית Network באתר המפורסם ומסתכלים על הבקשה בפועל: האם היא נשלחת לכתובת הנכונה, ואיזה סטטוס חוזר? לחשודים הקלאסיים יש חתימות: שגיאת CORS מופיעה בקונסול ומשמעותה שהשרת לא מאשר את ה-origin של פרודקשן — תיקון בצד השרת עם כותרות Access-Control נכונות. בקשה שהולכת ל-localhost:3001 בפרודקשן אומרת כתובת קשיחה בקוד או משתנה סביבה שלא הוגדר בפלטפורמת האחסון. 404 יכול לומר שנתיב ה-API שונה בפרודקשן; חסימת mixed-content קורית כשעמוד HTTPS קורא ל-API ב-HTTP. כלומר: לוודא כתובת, סטטוס, כותרות CORS ומשתני סביבה של פרודקשן — בסדר הזה — ולבדוק בלוגים של השרת אם הבקשה בכלל הגיעה.",
    },
    keywords: {
      en: ["network", "cors", "origin", "env", "status", "logs"],
      he: ["רשת", "סטטוס", "כתובת", "סביבה", "לוגים", "כותרות"],
    },
  },
];
