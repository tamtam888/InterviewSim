# Tailored Question Relevance Audit
**Role:** React | **Type:** Technical | **Level:** Mid | **Difficulty:** Hard  
**Focus Areas:** TypeScript Generics · React Query/TanStack Query · React Hooks Composition · End-to-end Testing · Tailwind CSS advanced patterns  
**Sessions analyzed:** 3 × 6 questions = 18 total

---

## Score Summary

| Metric | Result | Requirement | Status |
|---|---|---|---|
| Direct match | 15/18 — **83%** | ≥ 80% | ✅ PASS |
| Partial match | 1/18 — 6% | — | — |
| No match | 2/18 — 11% | — | — |
| In focus-area space (direct + partial) | 17/18 — **94%** | — | — |
| Focus area coverage (all 5 areas hit) | 5/5 — **100%** | — | ✅ |

**Verdict: PASSES the 80% requirement, but by a narrow margin (83%). The 11% no-match rate is a real weakness.**

---

## Per-Question Breakdown

### Session 1

| # | Question | Focus Area | Match | Angle |
|---|---|---|---|---|
| Q1 | "You're writing a custom hook that needs to return different shapes depending on the generic parameter the caller passes. Walk me through typing this with generics to handle three return shapes without using `any`." | TypeScript Generics | **Direct** | Practical scenario |
| Q2 | "After a mutation, stale data keeps showing on screen even though you called `queryClient.invalidateQueries`. How do you diagnose which queries aren't being invalidated and restructure your invalidation keys?" | React Query | **Direct** | Debugging |
| Q3 | "Three components each manage their own event listener setup with useEffect. Walk me through extracting this into a shared custom hook, and what pitfalls would you watch for around stale closures and cleanup?" | React Hooks Composition | **Direct** | Architecture |
| Q4 | "A Playwright test for your checkout flow passes locally but fails ~30% of the time in CI. Walk me through how you diagnose the root cause and make the test deterministic." | End-to-end Testing | **Direct** | Debugging |
| Q5 | "A component's Tailwind class list has grown to 45+ utility classes. What strategies would you use to organize this without abandoning utility-first or ejecting from Tailwind?" | Tailwind CSS | **Direct** | Trade-off |
| Q6 | "How does React's reconciliation algorithm decide when to re-render a component, and how does the `key` prop affect this?" | *(none)* | **No match** | Generic React internals |

**Session 1: 5 direct / 0 partial / 1 no-match → 83% direct ✅**

---

### Session 2

| # | Question | Focus Area | Match | Angle |
|---|---|---|---|---|
| Q1 | "Walk me through a TypeScript error where a generic constraint `T extends Record<string, unknown>` works in isolation but breaks when passed through three layers of wrapper types." | TypeScript Generics | **Direct** | Debugging |
| Q2 | "Building a dashboard with five endpoints — how would you structure dependent React Query queries, manage combined loading/error states, and handle cache invalidation when a user action affects multiple datasets?" | React Query | **Direct** | Architecture |
| Q3 | "Your team has three custom hooks that each configure their own WebSocket subscription — two are nearly identical. How do you decide when to consolidate them into one shared hook vs. keep them separate?" | React Hooks Composition | **Direct** | Trade-off |
| Q4 | "Describe how you would structure a Playwright test suite for a multi-step flow that makes three API calls. How do you mock the APIs, sequence the steps, and prevent brittleness?" | End-to-end Testing | **Direct** | Architecture |
| Q5 | "What's the difference between `useCallback` and `useMemo`, and when does memoizing them actually help vs. add overhead?" | React Hooks Composition | **Partial** | Trade-off |
| Q6 | "Your design system defines 30 custom Tailwind color tokens. A developer bypasses them with inline styles because they can't find the right token. How do you enforce the token system?" | Tailwind CSS | **Direct** | Practical scenario |

**Session 2: 5 direct / 1 partial / 0 no-match → 83% direct ✅**

Q5 is partial because it tests hook API knowledge (memoization behavior) rather than the gap of *composing* custom hooks. A strong answer to Q3 does not answer Q5 — they are different sub-topics — but Q5 doesn't test what the job match identified as the actual gap.

---

### Session 3

| # | Question | Focus Area | Match | Angle |
|---|---|---|---|---|
| Q1 | "React Query's `useQuery` returns stale data after a mutation even after `invalidateQueries`. Name three common causes and show how you'd diagnose which one applies." | React Query | **Direct** | Debugging |
| Q2 | "Refactoring a fetch utility to accept any response shape via generics — how would you handle the case where the API returns a discriminated union and the caller needs to narrow the type downstream?" | TypeScript Generics | **Direct** | Practical scenario |
| Q3 | "A form library hook (`useField`) is being used inconsistently across two teams and causing state sync bugs. How would you redesign the hook API to make misuse harder?" | React Hooks Composition | **Direct** | Architecture |
| Q4 | "A Playwright test for your auth flow is deterministic locally but fails in CI because API response time varies. What specific techniques would you use to make the test resilient to timing?" | End-to-end Testing | **Direct** | Debugging |
| Q5 | "When would you use Tailwind's `@apply` directive, and what problems arise when a team overuses it?" | Tailwind CSS | **Direct** | Trade-off |
| Q6 | "You need to share auth state across deeply nested components without prop drilling, and it updates frequently. Compare React Context vs. a state management library for this." | *(none)* | **No match** | Generic state management |

**Session 3: 5 direct / 0 partial / 1 no-match → 83% direct ✅**

---

## Focus Area Coverage

| Focus Area | S1 | S2 | S3 | Overall |
|---|---|---|---|---|
| TypeScript Generics | ✓ | ✓ | ✓ | 3/3 sessions |
| React Query / TanStack Query | ✓ | ✓ | ✓ | 3/3 sessions |
| React Hooks Composition | ✓ | ✓ (partial) | ✓ | 3/3 sessions |
| End-to-end Testing | ✓ | ✓ | ✓ | 3/3 sessions |
| Tailwind CSS advanced patterns | ✓ | ✓ | ✓ | 3/3 sessions |

**Coverage: 100% — all 5 focus areas appear in every session.**

---

## Cross-Session Repetition

Three angle patterns repeat across sessions — a candidate who runs the interview twice will see near-identical questions:

| Repeated pattern | Sessions | Risk |
|---|---|---|
| React Query — "stale data after invalidateQueries, diagnose root causes" | S1Q2 ↔ S3Q1 | HIGH — same scenario, same debugging angle |
| E2E — "Playwright CI timing/flakiness" | S1Q4 ↔ S3Q4 | HIGH — only the flow name changes (checkout vs. auth) |
| TypeScript Generics — "generic constraint breaks through wrapper layers" | S2Q1 ↔ S3Q2 | MEDIUM — different type scenario, similar angle |

The anti-repeat mechanism (sending recent question texts to the API) should suppress exact duplicates. However, it operates on **text prefix similarity**, not semantic similarity — so "stale data after mutation" and "stale data after invalidateQueries" look different textually but test nearly the same thing.

---

## Structural Weaknesses in the Prompt

### 1. The "escape hatch" question is always Q6

The prompt allows `"The remaining question(s) may cover other relevant role topics for variety"`. With 6 questions and minAll=5, one question is permitted to drift. GPT-4o consistently uses its final slot for this escape hatch. Both no-match questions across 3 sessions are Q6.

**Fix:** Remove the escape hatch entirely when there are ≥ 5 focus areas. Change to:
```
"ALL ${count} questions MUST target a focus area when ${focusAreas.length} focus areas are provided.
The ${focusAreas.length} areas give you enough breadth for variety without drifting to generic topics."
```

### 2. No instruction to spread across all focus areas

With 5 focus areas and 5 required questions, the prompt says "at least 5 must target a focus area" but doesn't say "each focus area must be covered exactly once." GPT-4o distributes naturally in practice, but with 3 focus areas and 5 required questions, it could ask 3 TypeScript questions and ignore Tailwind entirely.

**Fix:** Add an explicit distribution instruction:
```
"Aim to cover each focus area at least once before repeating. With ${focusAreas.length} focus areas,
a 1-per-area distribution is preferred."
```

### 3. "React Hooks Composition" is too abstract — allows partial drift

The focus area name is abstract enough that GPT-4o treats `useCallback` vs `useMemo` as "hooks" and generates it as a valid answer. This creates partial-match questions that feel on-topic but don't test the actual gap (extracting reusable custom hooks, composing hooks that call other hooks).

**Fix:** When injecting focus areas into the prompt, append a clarification for abstract terms:
```
// In focusBlock:
"  3. React Hooks Composition  [means: extracting reusable custom hooks, composing hooks that
      call other hooks, managing shared state through custom hook APIs — NOT explaining useCallback/useMemo]"
```

### 4. Semantic dedup only applies within a session, not across sessions

The prompt's `SEMANTIC DEDUPLICATION` instruction prevents two similar questions in the same session. But the anti-repeat mechanism (recent question texts) only matches on short text prefixes, not meaning. "Stale data after mutation" and "cache invalidation after mutation" look different but test the same thing.

**Fix:** Send the first 20 characters of each previous question's text AND its semantic category tag to the API as part of `recentTexts`. Requires tagging each generated question with a canonical sub-topic (e.g., `"react-query:cache-invalidation"`) and storing that alongside question text.

### 5. No per-question focus area label in AI output

The JSON schema doesn't ask the AI to tag each question with which focus area it targets. This means:
- The `isFocusAreaCovered` function on SummaryScreen uses keyword matching instead of ground truth
- There's no way to audit compliance at generation time
- A partial-match question (like S2Q5) passes silently

**Fix:** Add a `focusAreaTag` field to the GENERATE_QUESTIONS_SCHEMA:
```js
focusAreaTag: {
  type: "string",
  description: "The exact focus area string this question targets, or empty string if general role topic"
}
```
Use this for accurate coverage tracking instead of keyword fuzzy matching.

---

## Recommendations

**Priority 1 (prompt fixes — high impact, low effort):**
1. Remove the escape hatch when `focusAreas.length >= count - 1`
2. Add per-focus-area distribution instruction ("cover each area at least once")
3. Append meaning clarifications for abstract gap names inline in `focusBlock`

**Priority 2 (schema + data — medium effort):**
4. Add `focusAreaTag` to the question schema; store it on each question object
5. Replace `isFocusAreaCovered` keyword matching with `question.focusAreaTag` comparison — 100% accurate coverage tracking

**Priority 3 (anti-repeat — medium effort):**
6. Store question sub-topic slugs alongside question texts in `recentTexts`; send both to the API to suppress semantic repeats across sessions

---

## Demo Guidance

When demoing tailored interview quality, choose this focus area set for the strongest output:
- `"TypeScript Generics"` → debugging angle
- `"React Query optimistic updates"` → architecture angle  
- `"Custom hook extraction"` *(more specific than "React Hooks Composition")*
- `"Playwright page object model"` *(more specific than "End-to-end Testing")*
- `"Tailwind responsive breakpoints"` *(more specific than "advanced patterns")*

**More specific gap names produce better-targeted questions.** The Job Match prompt already returns specific topic labels (e.g., "React Query cache invalidation") — using those directly as focus areas rather than grouping them produces higher precision.
