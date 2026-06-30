# Static Fallback Fix Plan

**Scope:** Fix the 4 HIGH findings from the Question Quality Audit validation report.  
**Constraint:** No architecture redesign. No Hebrew prompt changes. No UI styling changes.

---

## Root cause summary

All four findings trace to the same two gaps:

1. `buildSession(roleId, interviewType, count)` — three-parameter signature, no level/difficulty awareness.
2. The static bank has no `level` field on questions; seniority is accidentally encoded in `difficulty: "junior"` on two files and defaulted to `"mid"` everywhere else.

Fixing the signature fixes Findings 1, 2, and 3 in one pass. Finding 4 requires a separate one-line metadata attachment plus one UI notice.

---

## Data model change

### Problem

The static bank conflates two orthogonal concepts in the `difficulty` field:

| File | Current `difficulty` value | Intended meaning |
|---|---|---|
| `technicalJuniorReact.js` | `"junior"` | Seniority level |
| `technicalJuniorWeb.js` | `"junior"` | Seniority level |
| `technicalDev.js` | _(absent → normalized to `"mid"`)_ | Seniority level (implied) |
| `technicalNonDev.js` | _(absent → normalized to `"mid"`)_ | Seniority level (implied) |
| `behavioral.js` | _(absent → normalized to `"mid"`)_ | Not level-specific |
| `hr.js` | _(absent → normalized to `"mid"`)_ | Not level-specific |

The AI separately uses `difficulty` to mean `"easy"/"medium"/"hard"/"mixed"` in its response schema. These two usages of the same field name will collide when AI and static questions are mixed in the same session (top-up path).

### Fix: add a `level` field

Introduce `level: "junior" | "mid" | "senior" | "lead" | "all"` as a **new field**, separate from `difficulty`. The `difficulty` field is left as-is (it continues to mean question hardness for AI-generated questions; it is ignored for static bank filtering purposes going forward).

`normalize()` in `src/data/questions/index.js` gains a new default:

```js
function normalize(q) {
  return {
    category: q.type,
    difficulty: "mid",   // unchanged — hardness, used by AI questions
    level: "mid",        // NEW — seniority, used by buildSession filter
    tags: [],
    expectedTopics: q.keywords?.en ?? [],
    ...q,
  };
}
```

Because `...q` overrides defaults, any question that explicitly declares `level: "junior"` will retain it.

### Per-file changes required

**`src/data/questions/technicalJuniorReact.js`** (10 questions)  
Add `level: "junior"` to every question. These already have `difficulty: "junior"` — the new `level` field makes the intent explicit and decoupled.

**`src/data/questions/technicalJuniorWeb.js`** (12 questions)  
Same — add `level: "junior"` to every question.

**`src/data/questions/technicalDev.js`** (16 questions across frontend/react/fullstack/backend/qa)  
Add `level: "mid"` to every question. This makes implicit normalization explicit and prepares the file for future senior questions to be added alongside without ambiguity.

**`src/data/questions/technicalNonDev.js`** (all questions)  
Add `level: "mid"` to every question (same rationale as above).

**`src/data/questions/behavioral.js`** (8 questions)  
Add `level: "all"` to every question. Behavioral questions are not level-specific. The filter in `buildSession` will treat `"all"` as matching any requested level.

**`src/data/questions/hr.js`** (8 questions)  
Add `level: "all"` to every question (same as behavioral).

---

## Function signature changes

### 1. `buildSession` — `src/data/questions/index.js`

**Before:**
```js
export function buildSession(roleId, interviewType, count)
```

**After:**
```js
export function buildSession(roleId, interviewType, count, {
  experienceLevel = "mid",
  difficulty = "mixed",    // reserved for future pool-level filtering; not yet used
} = {})
```

The options object with defaults means all existing call sites that pass only 3 arguments continue to work without changes — they get `experienceLevel: "mid"` (the current implicit behavior). This is a non-breaking change.

### 2. `technicalForRole` — `src/data/questions/index.js`

**Before:**
```js
function technicalForRole(roleId) {
  return TECHNICAL_QUESTIONS.filter((q) => q.role === roleId);
}
```

**After:**
```js
function technicalForRole(roleId, level = null) {
  const byRole = TECHNICAL_QUESTIONS.filter((q) => q.role === roleId);
  if (!level) return byRole;
  return byRole.filter((q) => q.level === level || q.level === "all");
}
```

`level = null` means callers that don't pass a level (none currently exist, but the function is called in two places inside `buildSession`) get the unfiltered pool — no regression.

### 3. New internal helper: `resolveLevel`

```js
/**
 * Return the best available level to filter by, given what's in the pool.
 * Falls back gracefully if the requested level has too few questions.
 * 
 * @param {object[]} pool     - All questions for this role (unfiltered)
 * @param {string}   level    - Requested experienceLevel ("junior"|"mid"|"senior"|"lead")
 * @param {number}   needed   - Minimum questions required
 * @returns {string|null}     - Level to use, or null (use full pool)
 */
function resolveLevel(pool, level, needed) {
  const exact = pool.filter((q) => q.level === level);
  if (exact.length >= needed) return level;
  // Fallback hierarchy: senior→mid, lead→mid, junior→mid
  if (level === "senior" || level === "lead") {
    const mid = pool.filter((q) => q.level === "mid");
    if (mid.length >= needed) return "mid";
  }
  return null; // use full unfiltered pool as last resort
}
```

This function ensures that `buildSession` never returns an empty pool just because no senior/lead static questions exist yet.

### 4. `buildSession` — internal pool construction

Inside `buildSession`, everywhere `technicalForRole(roleId)` is called, replace with level-aware calls:

```js
// Current (Finding 1 & 2 root cause):
const roleQs = pickFresh(technicalForRole(roleId), count, recentIndex);

// Replacement:
const fullPool = technicalForRole(roleId);
const effectiveLevel = resolveLevel(fullPool, experienceLevel, count);
const leveledPool = technicalForRole(roleId, effectiveLevel);
const roleQs = pickFresh(leveledPool, count, recentIndex);
```

The same pattern applies to both the `technical` branch and the `mixed` branch inside `buildSession`.

The filler path (when pool is exhausted) remains unchanged — it pulls from `technicalForRole("general")` and behavioral/HR, which are `level: "all"` and therefore always eligible.

---

## Call site changes — `src/lib/questionGenerator.js`

### AI fallback (Finding 4 prerequisite — `line 214`)

**Before:**
```js
return buildSession(roleId, interviewType, count);
```

**After:**
```js
const fallbackQuestions = buildSession(roleId, interviewType, count, { experienceLevel, difficulty });
if (safeFocusAreas) {
  // Attach metadata so the caller can show a visible notice.
  Object.assign(fallbackQuestions, {
    _fallbackMeta: { focusAreasDropped: safeFocusAreas },
  });
}
return fallbackQuestions;
```

`Object.assign` on an array is valid JS — it attaches a non-enumerable-by-default property that array iteration (`.map`, `.forEach`, `for...of`) ignores completely. The caller reads it with `questions._fallbackMeta ?? null`. No existing code that processes the returned question array is affected.

### Top-up path (`line 193`)

**Before:**
```js
const static_ = buildSession(roleId, interviewType, count - questions.length);
```

**After:**
```js
const static_ = buildSession(roleId, interviewType, count - questions.length, { experienceLevel, difficulty });
```

---

## Call site changes — `src/App.jsx`

### `START_INTERVIEW` defensive fallback (line 97)

**Before:**
```js
const questions =
  action.questions ??
  buildSession(state.roleId, action.interviewType, action.questionCount);
```

**After:**
```js
const questions =
  action.questions ??
  buildSession(state.roleId, action.interviewType, action.questionCount, {
    experienceLevel: state.experienceLevel,
    difficulty: state.difficulty,
  });
```

### `startInterview` callback — read fallback metadata (lines ~312–325)

After `await generateInterviewQuestions(...)` returns, read and clear the metadata before dispatching:

```js
const fallbackMeta = questions._fallbackMeta ?? null;
// Clean the metadata off — don't store the property in app state
delete questions._fallbackMeta;

dispatch({
  type: "START_INTERVIEW",
  ...
  focusAreas: focusAreas ?? null,
  focusAreasFallback: fallbackMeta?.focusAreasDropped ?? null,  // NEW field
  ...
});
```

### `START_INTERVIEW` reducer — store fallback state

In the reducer's `START_INTERVIEW` case, add:
```js
focusAreasFallback: action.focusAreasFallback ?? null,
```

This field sits in App state. It is reset to `null` on `RESTART_SAME` and `START_INTERVIEW` without the flag.

### `RESTART_SAME` (lines 186–189) — intentionally unchanged

`RESTART_SAME` always calls `buildSession` without level/difficulty — this is by design (restart always gives a fresh generic set). **No change.** Document this explicitly in a code comment.

---

## Finding 4 — UI notice

A single conditional in either `GeneratingScreen` or `InterviewScreen` (whichever is shown first after question generation):

```jsx
{state.focusAreasFallback && (
  <div className="fallback-notice">
    AI unavailable — using general questions, not tailored to your gaps.
  </div>
)}
```

The notice appears once, at interview start, with no repeated warnings. The tailored banner still shows (because `state.focusAreas` is still set), and the SummaryScreen coverage section still renders — showing all misses, which is now explained by the notice the user saw at the start.

The `focusAreasFallback` value in state is the actual dropped focus areas array, so if desired the notice can say "We couldn't load questions for: React Query, TypeScript Generics" — but the minimal version (generic notice) is sufficient.

---

## Migration strategy

The data model change (adding `level` to question files) is purely additive. No existing field is renamed or removed. The priority order for migrations:

**Step 1 — `normalize()` change (one line)**  
Add `level: "mid"` to the defaults object. Zero risk. Takes effect for all questions without an explicit `level`.

**Step 2 — `buildSession` signature change (non-breaking)**  
Add the options parameter with defaults. All existing call sites still compile and run identically. Zero risk.

**Step 3 — `technicalJuniorReact.js` and `technicalJuniorWeb.js`**  
Add `level: "junior"` to all 22 questions. Additive only — these files already have `difficulty: "junior"`, so the intent is already expressed; `level` just makes it filterably explicit.

**Step 4 — Wire `experienceLevel` into `buildSession` calls**  
Update the 2 call sites in `questionGenerator.js` and 1 in `App.jsx`. Add `resolveLevel` helper. Update `technicalForRole` signature. This is where filtering actually takes effect.

**Step 5 — `technicalDev.js` and `technicalNonDev.js`**  
Add `level: "mid"` explicitly. These questions already behave as mid by default; making it explicit prepares for future senior questions to be added.

**Step 6 — `behavioral.js` and `hr.js`**  
Add `level: "all"`. Lowest risk, last priority.

**Step 7 — Finding 4 metadata + UI notice**  
`Object.assign` in catch block, `focusAreasFallback` in state, notice in InterviewScreen.

Steps 1–4 must be done together (they are mutually dependent). Steps 5–7 are independent and can be done in any order after step 4.

---

## QA plan

### Static bank level filter

1. Call `buildSession("react", "technical", 4, { experienceLevel: "junior" })` in a console test. Verify all 4 returned questions have `level === "junior"`. The React junior pool has 10 questions — this should never fall back.

2. Call `buildSession("react", "technical", 4, { experienceLevel: "mid" })`. Verify all 4 returned questions have `level === "mid"`. The React mid pool has 4 questions — exactly `count`, no fallback needed.

3. Call `buildSession("react", "technical", 6, { experienceLevel: "mid" })`. Pool is only 4 mid questions; `resolveLevel` should fall back to `null` (full pool). Verify the 6 returned questions are all from `level === "react"` pool (any level). Log and document this expected behavior — it is a known limitation until more mid/senior questions are authored.

4. Call `buildSession("react", "technical", 4, { experienceLevel: "senior" })`. Pool has 0 senior questions; `resolveLevel` falls back to `"mid"`. Verify all 4 returned questions have `level === "mid"`.

5. Call `buildSession("frontend", "technical", 4, { experienceLevel: "junior" })`. Verify questions come from `technicalJuniorWeb.js` with `role: "frontend"`.

### No-mix regression

6. For `experienceLevel: "junior"`, verify no question with `level: "mid"` or `level: "all"` appears in the technical pool when the junior pool is sufficient. For `experienceLevel: "mid"`, verify no question with `level: "junior"` appears.

### AI fallback + focusAreas notice

7. In dev environment: disable or break the `/api/generate-questions` endpoint (wrong URL, force 500). Start a tailored interview (use Job Match first to generate focus areas). Verify:
   - Interview starts without error
   - A visible notice appears: "AI unavailable — using general questions"
   - The tailored banner (focusAreas chips) still shows
   - The SummaryScreen coverage section still renders showing all misses

8. Start a non-tailored interview with AI disabled. Verify **no notice appears** (the notice is conditional on `focusAreasFallback` being non-null, which only happens when `safeFocusAreas` was non-null at fallback time).

### Top-up path

9. Mock the AI to return 2 questions when 6 are requested. Verify the 4 top-up questions have `level` matching `experienceLevel`. Verify the final array has 6 questions total.

### Non-regression

10. Run existing interview flows without any level selection change: HR session, behavioral session, mixed session. Verify they still work (behavioral/HR are `level: "all"` and should always be included).

11. Run `npm run lint` and `npm run build`. Verify no new warnings or errors.

---

## What this plan does NOT address

These are known gaps that are out of scope for this fix:

- **No senior/lead questions exist in the static bank.** Findings 1 and 2 are structurally fixed (the filter parameter now flows correctly), but the quality improvement for senior users depends on new question authoring. The `resolveLevel` fallback means senior users get mid questions — which is labeled as a known limitation, not a code bug.
- **The `difficulty` naming collision** (hardness vs. seniority) is not renamed. The new `level` field sidesteps it without a breaking rename.
- **RESTART_SAME is still level-agnostic.** This is intentional behavior and is documented, not fixed.
- **Focus area keyword matching** in the static bank is not implemented. The fallback notice covers the user experience gap; full focus-aware static selection is a separate larger feature.
