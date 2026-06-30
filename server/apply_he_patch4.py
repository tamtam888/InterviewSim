"""
Hebrew prompt patch #4: replace the STYLE GUIDE model questions with
scenario-based, 2-3-sentence examples that match the expected interview quality.

Also adds a QUESTION DEPTH AND FORMAT section before the examples.

Usage (from project root):
  python3 server/apply_he_patch4.py        # apply
  python3 server/apply_he_patch4.py --dry  # preview only
"""
import sys, os

DRY = "--dry" in sys.argv

path = "server/prompts.js"
src = open(path, encoding="utf-8").read()

# ─────────────────────────────────────────────────────────────────────────────
# Splice boundaries:
#   Replace from the STYLE GUIDE header line
#   up to (but not including) the PREFERRED OPENERS line.
# ─────────────────────────────────────────────────────────────────────────────

FIND_START = '"STYLE GUIDE — 25 MODEL QUESTIONS (study and imitate this exact style):",'
FIND_END   = '"PREFERRED OPENERS — rotate these, use each at most once per session:",'

for label, needle in [("FIND_START", FIND_START), ("FIND_END", FIND_END)]:
    count = src.count(needle)
    if count != 1:
        sys.exit(f"ERROR: {label} found {count} times (expected 1). Aborting.")

start_char      = src.index(FIND_START)
start_of_line   = src.rindex("\n", 0, start_char) + 1

end_char        = src.index(FIND_END, start_char)
end_of_line_start = src.rindex("\n", 0, end_char) + 1

OLD_BLOCK = src[start_of_line:end_of_line_start]

# ─────────────────────────────────────────────────────────────────────────────
# Build the replacement block.
# Each entry in LINES becomes one JS array element:
#   8-space indent + double-quote + content + double-quote + comma + newline
# ─────────────────────────────────────────────────────────────────────────────

def q(s):
    return '        "' + s + '",\n'

LINES = [
    # ── QUESTION DEPTH AND FORMAT ─────────────────────────────────────────
    "QUESTION DEPTH AND FORMAT — MANDATORY FOR EVERY TECHNICAL QUESTION:",
    "Every question must be 2-3 sentences: (1) realistic scenario, (2) concrete problem, (3) what to reason about.",
    "BAD (too short, no context): 'איך פתרת stale data ב-React Query?'",
    "GOOD: 'נניח שמשתמש מעדכן רשומה, אבל במסך אחר עדיין מוצג מידע ישן. איך היית ניגש לפתרון עם React Query? אילו דברים היית בודק קודם?'",
    "BAD (definition question): 'מה ההבדל בין optimistic ל-pessimistic update?'",
    "GOOD: 'נניח שה-mutation הצליחה, אבל ה-UI לא התעדכן מיד. איך תזהה אם הבעיה היא ב-invalidation, ב-optimistic update שנכשל, או במשהו אחר?'",
    "BAD (one-liner): 'איך שמרת על טיפוסים מחמירים ב-TypeScript?'",
    "GOOD: 'נניח שיש component שמקבל props מורכבים מכמה מקורות שונים, וחלק מהטיפוסים מתחילים להתפזר. איך היית מגדיר את ה-types כך שהקוד יישאר בטוח אבל לא מסורבל?'",
    "NEVER write a one-line question. NEVER ask 'מה זה X' or 'מה ההבדל בין X ל-Y' as a standalone question.",
    "",
    # ── STYLE GUIDE: 25 SCENARIO-BASED MODEL QUESTIONS ───────────────────
    "STYLE GUIDE — 25 MODEL QUESTIONS (study and imitate this exact style):",
    # React Query (5)
    " 1. 'נניח שמשתמש מעדכן רשומה, אבל במסך אחר עדיין מוצג מידע ישן מה-cache. איך היית ניגש לפתרון עם React Query? מה היית בודק קודם?'",
    " 2. 'נניח שה-mutation הצליחה בשרת, אבל ה-UI לא התעדכן. איך מזהים אם הבעיה היא ב-invalidation, ב-optimistic update שנכשל, או במשהו אחר?'",
    " 3. 'יצא לך לעבוד עם dependent queries ב-React Query? ספר לי על מקרה שבו query אחת תלויה בתוצאה של אחרת — איך בנית את זה ומה היו האתגרים?'",
    " 4. 'ספר לי על מקרה שבו optimistic update גרם לבאג — מה היה המצב, מה קרה שלא היה צריך לקרות, ואיך תיקנת?'",
    " 5. 'נניח שהאפליקציה שולחת כמה קריאות API בטעינת הדף, וחלקן מחזירות נתונים ישנים. מה הגישה שלך לניהול ה-cache כך שה-UX לא יסבול?'",
    # TypeScript (5)
    " 6. 'נניח שיש לך custom hook לניהול form state שמשמש כמה components עם מבני נתונים שונים. איך היית הופך אותו ל-generic כך שכל component יקבל type safety מלא?'",
    " 7. 'נניח שיש component שמקבל props מורכבים מכמה מקורות שונים, וחלק מהטיפוסים מתחילים להתפזר בקוד. איך היית מגדיר את ה-types כך שהקוד יישאר בטוח אבל לא מסורבל מדי?'",
    " 8. 'ספר לי על TypeScript error שלקח לך זמן להבין — מה הייתה הבעיה, מה ניסית קודם, ואיך פתרת בסוף?'",
    " 9. 'נניח שיש function שמחזירה טיפוס שונה בהתאם לפרמטר הקלט. איך היית מגדיר את זה עם TypeScript? מה הגישה שלך ומה האתגרים שצפויים?'",
    "10. 'נניח שהפרויקט גדל ויש עשרות types מפוזרים בכל הקוד. איך היית מארגן אותם? קבצים נפרדים, co-location, או משהו אחר — ולמה?'",
    # Tailwind CSS (3)
    "11. 'נניח שיש לך component עם הרבה מצבי UI שונים — hover, active, disabled, loading — וכל מצב מוסיף עוד Tailwind classes. איך היית מארגן את הקוד כדי לשמור על קריאות ותחזוקה?'",
    "12. 'נניח שהדיזיין של הפרויקט השתנה, ועכשיו כמה צבעים וגדלים צריכים להשתנות בעשרות components. איך מתמודדים עם זה בצורה מסודרת עם Tailwind?'",
    "13. 'יצא לך לעבוד על component שהצבירה של Tailwind classes יצאה משליטה? ספר לי מה קרה ואיך טיפלת בבעיה.'",
    # End-to-end testing (3)
    "14. 'נניח שה-E2E test עובר locally אבל נופל ב-CI כל פעם. מה הצעדים הראשונים שלך לאיתור הגורם? מה הבעיות הנפוצות שהיית שוקל?'",
    "15. 'נניח שאתה כותב Playwright test לתהליך רכישה שמשלב קריאות API אמיתיות. מה היית מ-mock ומה היית משאיר אמיתי — ולמה?'",
    "16. 'ספר לי על E2E test שהיה flaky אצלך — מה גרם לחוסר היציבות, ואיך תיקנת?'",
    # Custom hooks (4)
    "17. 'נניח שלוגיקה של fetch + loading state + error handling חוזרת ב-8 components שונים. איך היית מחליט אילו חלקים מוצאים ל-custom hook ואיך היית בונה את ה-API שלו?'",
    "18. 'נניח שאתה בונה custom hook שמשלב authentication, permissions ו-feature flags. מה האתגרים שעשויים לצוץ בשילוב כזה, ואיך היית מנהל אותם?'",
    "19. 'ספר לי על באג שנגרם מ-stale closure בתוך custom hook — מה קרה, איך זיהית את הגורם, ואיך תיקנת?'",
    "20. 'נניח שאתה רוצה לחלוק custom hook בין כמה צוותים בחברה. מה היית מגדיר בברור — types, API, תיעוד — כדי שאנשים אחרים יוכלו להשתמש בו בביטחון?'",
    # Mixed React / performance (5)
    "21. 'נניח שיש component שמרנדר מחדש הרבה יותר ממה שצריך, ואתה מקבל תלונות על ביצועים. מה הכלים שהיית משתמש בהם ומה הצעדים שלך לאיתור הגורם?'",
    "22. 'נניח שה-bundle size של האפליקציה גדל ב-40% אחרי הוספת feature חדשה. מה הצעדים שלך לזיהוי מה גרם לזה ולצמצום ה-bundle?'",
    "23. 'ספר לי על באג ב-useEffect שגרם ל-infinite loop — מה היה ה-dependency array, מה קרה, ואיך אבחנת ותיקנת?'",
    "24. 'נניח שחלק מהאפליקציה מתרסק בגלל שגיאה שלא צפית — ה-stack trace לא ברור ואין לך מידע מספיק. איך היית ניגש לאיתור הבעיה ולמנוע חזרה שלה?'",
    "25. 'נניח שיש component מאוד קשה לבדוק — הרבה side effects, dependencies חיצוניים, ו-state מסובך. מה היית משנה בעיצוב שלו כדי שיהיה יותר testable?'",
    "",
]

NEW_BLOCK = "".join(q(line) for line in LINES)

# ─────────────────────────────────────────────────────────────────────────────
# Sanity: block must actually change something
# ─────────────────────────────────────────────────────────────────────────────

if OLD_BLOCK == NEW_BLOCK:
    print("Nothing to change — file already up to date.")
    sys.exit(0)

src_out = src[:start_of_line] + NEW_BLOCK + src[end_of_line_start:]

# Verify PREFERRED OPENERS is still present
if FIND_END not in src_out:
    sys.exit("ERROR: PREFERRED OPENERS disappeared after splice — aborting")

# ─────────────────────────────────────────────────────────────────────────────
# Dry run: show context around both splice boundaries
# ─────────────────────────────────────────────────────────────────────────────

if DRY:
    print("\n--- DRY RUN ---")
    print("OLD BLOCK (will be replaced):")
    for line in OLD_BLOCK.splitlines()[:6]:
        print("  OLD:", line)
    print("  ...")
    print("\nNEW BLOCK (first 8 lines):")
    for line in NEW_BLOCK.splitlines()[:8]:
        print("  NEW:", line)
    print("  ...")
    print(f"\nTotal lines: OLD={len(OLD_BLOCK.splitlines())} → NEW={len(NEW_BLOCK.splitlines())}")
    print("Run without --dry to apply.")
    sys.exit(0)

# ─────────────────────────────────────────────────────────────────────────────
# Write
# ─────────────────────────────────────────────────────────────────────────────

open(path, "w", encoding="utf-8").write(src_out)
print(f"Done. {path} updated ({len(src_out.splitlines())} lines).")

try:
    os.remove(__file__)
    print("Patch script removed.")
except Exception:
    pass
