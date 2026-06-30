"""
Hebrew prompt patch #5 — FULL PERSONA REWRITE + 5-rule final cleanup.

Replaces the entire Hebrew langBlock instruction set with a persona-first
frame. Also adds 5 targeted fixes for the recurring patterns identified
in QA (כיצד, construct-state openers, numeral article, עוזר ל-, raw
English compound nouns).

This is the final Hebrew prompt patch. Run it and stop.

Usage (from project root):
  python3 server/apply_he_patch5.py        # apply
  python3 server/apply_he_patch5.py --dry  # preview only

Supersedes apply_he_patch4.py — do NOT run patch4.
"""
import sys, os

DRY = "--dry" in sys.argv

path = "server/prompts.js"
src  = open(path, encoding="utf-8").read()

# ─────────────────────────────────────────────────────────────────────────────
# Locate the splice boundaries.
#
# START: identified by the unique line that follows "LANGUAGE GENERATION ORDER"
#        in the Hebrew block — "1. Write text_he FIRST:..." — appears only once.
# END:   "2. Write text_en SECOND..." which we KEEP (do not replace).
# ─────────────────────────────────────────────────────────────────────────────

START_INNER = '"1. Write text_he FIRST: compose the question DIRECTLY IN HEBREW from scratch.",'
END_MARKER  = '"2. Write text_en SECOND: a natural English equivalent (same meaning, not word-for-word).",'

for label, needle in [("START_INNER", START_INNER), ("END_MARKER", END_MARKER)]:
    n = src.count(needle)
    if n != 1:
        sys.exit(f"ERROR: {label} found {n} times (expected 1). Aborting.")

inner_pos   = src.index(START_INNER)
inner_line  = src.rindex("\n", 0, inner_pos) + 1
header_line = src.rindex("\n", 0, inner_line - 1) + 1   # "LANGUAGE GENERATION ORDER" line

end_pos  = src.index(END_MARKER, inner_pos)
end_line = src.rindex("\n", 0, end_pos) + 1              # start of END_MARKER line (kept)

OLD_BLOCK = src[header_line:end_line]

# ─────────────────────────────────────────────────────────────────────────────
# Build the replacement block.
# ─────────────────────────────────────────────────────────────────────────────

def q(s):
    return '        "' + s + '",\n'

LINES = [
    # ── Header ────────────────────────────────────────────────────────────
    "LANGUAGE GENERATION ORDER -- strictly follow:",
    "1. Write text_he FIRST — use the persona and rules below:",
    "",

    # ── PERSONA ───────────────────────────────────────────────────────────
    "PERSONA: You are a Senior React Tech Lead at an Israeli tech company (Wix, Monday, Fiverr, IronSource).",
    "You are conducting a live job interview RIGHT NOW, in Hebrew, with a React developer candidate.",
    "Generate every question exactly as you would say it out loud in this interview.",
    "",

    # ── HOW TO WRITE (+ 5 final cleanup rules) ────────────────────────────
    "HOW TO WRITE:",
    "Think and write in Hebrew from word one — do NOT draft in English and translate.",
    "Use the voice of a real tech lead speaking across a table, not a form or a quiz.",
    "If a sentence sounds stiff, academic, or formal — rewrite it until it sounds spoken.",
    "5 patterns that always sound translated — eliminate them:",
    "  (1) כיצד: nobody says this aloud. Always use איך.",
    "  (2) Construct-state noun openers: never open with בדיקת X / ניהול X / ביצוע X. Start with a scenario verb.",
    "  (3) Numeral as article: never write hook אחד or component אחד. Just write hook / component.",
    "  (4) עוזר ל: weak translated verb. Use מנהל / משלב / מרכז / מטפל ב instead.",
    "  (5) Raw English compound nouns: not class explosion — say יותר מדי classes; not cache invalidation — say כשה-cache מתיישן.",
    "",

    # ── TECHNICAL TERMS ───────────────────────────────────────────────────
    "TECHNICAL TERMS — always keep in English, never translate:",
    "React, TypeScript, hooks, custom hook, cache, mutation, query, props, state, component,",
    "React Query, TanStack Query, Playwright, Tailwind CSS, E2E, stale data, invalidation,",
    "bundle, build, CI/CD, generic, interface, useEffect, useState, useCallback, useMemo, useRef.",
    "",

    # ── ONE HARD RULE ─────────────────────────────────────────────────────
    "ONE HARD RULE — NO EXCEPTIONS:",
    "NEVER use slash gender forms: תוכל/י, ניגש/ת, בחר/י, תאר/י, נתקל/ת, עשית/ית.",
    "Use impersonal: שומרים, ניגשים, בוחרים — or direct singular: ספר לי / מה היית עושה.",
    "",

    # ── QUESTION FORMAT ───────────────────────────────────────────────────
    "QUESTION FORMAT — every technical question must be 2-3 sentences:",
    "(1) Open with a realistic scenario: נניח ש... / ספר לי על מקרה שבו... / יצא לך...",
    "(2) The concrete problem.",
    "(3) What you want them to reason through or do.",
    "NEVER write a one-line question. NEVER open with a bare definition request.",
    "",

    # ── NATURAL OPENERS ───────────────────────────────────────────────────
    "NATURAL INTERVIEW OPENERS — vary these across questions:",
    "  ספר לי על מקרה שבו...",
    "  נניח שנתקלת ב...",
    "  יצא לך לעבוד עם...?",
    "  בפרויקט שעבדת עליו...",
    "  איך היית ניגש ל...",
    "  מה היו השיקולים שלך כש...",
    "  נניח שיש לך... — מה היית עושה?",
    "",

    # ── REFERENCE QUESTIONS ───────────────────────────────────────────────
    "REFERENCE QUESTIONS — write in THIS exact voice (not similar topics, this style):",
    " 1. 'נניח שמשתמש מעדכן רשומה, אבל במסך אחר עדיין מוצג מידע ישן מה-cache. איך היית ניגש לפתרון עם React Query? מה היית בודק קודם?'",
    " 2. 'ספר לי על מקרה שבו ה-mutation הצליחה בשרת, אבל ה-UI לא התעדכן. מה ניסית ואיך מצאת את הגורם?'",
    " 3. 'נניח שה-E2E test עובר locally אבל נופל ב-CI. מה הדברים הראשונים שהיית בודק?'",
    " 4. 'יצא לך לכתוב custom hook שנהיה קשה לתחזק עם הזמן? ספר לי מה השתבש ואיך שיפרת.'",
    " 5. 'נניח שיש component עם עשרות Tailwind classes שמשתנות לפי מצב. איך היית מארגן את הקוד?'",
    " 6. 'ספר לי על TypeScript error שלקח לך זמן להבין — מה הייתה הבעיה ואיך פתרת?'",
    " 7. 'נניח שלוגיקה חוזרת ב-8 components שונים. מה השיקולים שלך לפני שמחצים אותה ל-custom hook?'",
    " 8. 'בפרויקט שעבדת עליו, איך ארגנת את ה-TypeScript types? מה עבד טוב ומה היה מסורבל?'",
    " 9. 'נניח שה-bundle size גדל ב-40% אחרי feature חדשה. מה הצעדים שלך לאיתור הגורם?'",
    "10. 'ספר לי על באג ב-useEffect שגרם ל-infinite loop — מה קרה, ואיך הגעת לגורם?'",
    "",
]

NEW_BLOCK = "".join(q(line) for line in LINES)

# ─────────────────────────────────────────────────────────────────────────────
# Sanity checks
# ─────────────────────────────────────────────────────────────────────────────

if OLD_BLOCK == NEW_BLOCK:
    print("Nothing to change — already up to date.")
    sys.exit(0)

src_out = src[:header_line] + NEW_BLOCK + src[end_line:]

if src_out.count(END_MARKER) != 1:
    sys.exit("ERROR: END_MARKER count changed after splice — aborting.")

# ─────────────────────────────────────────────────────────────────────────────
# Dry run
# ─────────────────────────────────────────────────────────────────────────────

if DRY:
    print(f"\n=== DRY RUN: {len(OLD_BLOCK.splitlines())} lines → {len(NEW_BLOCK.splitlines())} lines ===")
    print("\nFirst 15 lines of NEW block:")
    for ln in NEW_BLOCK.splitlines()[:15]:
        print(" ", ln)
    print("  ...")
    print("\nLast 3 lines of NEW block:")
    for ln in NEW_BLOCK.splitlines()[-3:]:
        print(" ", ln)
    print(f"\nNext preserved line: {END_MARKER[:70]}")
    print("\nRun without --dry to apply.")
    sys.exit(0)

# ─────────────────────────────────────────────────────────────────────────────
# Write
# ─────────────────────────────────────────────────────────────────────────────

open(path, "w", encoding="utf-8").write(src_out)
print(f"Done. {path} updated ({len(src_out.splitlines())} lines total).")
print("This is the final Hebrew prompt patch. No further patches needed.")

try:
    os.remove(__file__)
    print("Patch script removed.")
except Exception:
    pass
