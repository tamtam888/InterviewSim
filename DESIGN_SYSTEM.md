# InterviewSim Design System
## Version 2.0 — Complete Product Specification

**Status:** Frozen for v1 implementation
**Last revised:** June 2026
**Scope:** All visual and interaction decisions for the InterviewSim product

This document is the single source of truth for all design decisions in InterviewSim. Every component, layout, color, type choice, and interaction pattern is governed by this specification. No implementation decision may depart from this document without a recorded design system update.

---

## Table of Contents

**Part I — Identity**
1. Brand Identity
2. Product Personality
3. Visual Principles

**Part II — Layout**
4. Layout Grid System
5. Responsive Grid

**Part III — Design Tokens**
6. Color Tokens
7. Typography Tokens
8. Spacing Tokens
9. Border Radius Tokens
10. Shadow and Elevation Tokens
11. Motion Tokens

**Part IV — Component Library**
12. Button
13. Badge
14. Score Pill
15. Filter Chip
16. Progress Bar
17. Trend Signal
18. Section Label
19. Coaching Insight Block
20. Score Display
21. Hero Surface Card
22. Section Card
23. Category Item Card
24. Session Row
25. Trend Chart
26. Page Header

**Part V — States**
27. States Library
28. Empty States
29. Skeleton States
30. Error States

**Part VI — Rules**
31. Dashboard Design Rules
32. Chart Design Rules
33. Iconography Rules
34. Illustration Rules
35. Accessibility Rules

---

# Part I — Identity

---

## 1. Brand Identity

### Product Name
InterviewSim

### Positioning
InterviewSim is a professional coaching product that helps job seekers improve their interview performance through deliberate, data-driven practice. It tracks performance over time, identifies the specific skills that need the most attention, and delivers focused recommendations for each practice session.

### Category
InterviewSim occupies a category between professional productivity tools and coaching/education products. Its reference products are: Linear, Stripe, Vercel, Notion (productivity); Duolingo, Brilliant, Superhuman (coaching and focus). It takes the structural language of the productivity category and the motivational voice of the coaching category.

### Brand Values
**Focused.** The product surfaces one clear recommendation at a time. It does not overwhelm. Every screen answers one question.

**Intelligent.** The product knows things about the user that the user cannot easily see for themselves — skill gaps, trends, performance patterns. It presents this intelligence calmly and clearly.

**Invested.** The product is not neutral about the user's outcome. It has an opinion about what the user should practice and communicates that opinion directly. It functions like a coach who is genuinely interested in the user's success.

**Professional.** The product is used by adults preparing for career-defining moments. Its visual language is calibrated accordingly: serious, precise, and respectful.

### Differentiation from Competitors
Most interview preparation tools are either clinical test platforms (no personality, no coaching layer) or consumer-facing self-help apps (too playful, insufficient data depth). InterviewSim occupies the gap: a professional-grade coaching tool with a warm, direct voice. The design system encodes this position in every visual and interaction decision.

### Bilingual Identity
The product serves English and Hebrew speakers equally. The design system is built for bilingual operation from the foundation up — logical spacing (start/end), mirrored directional icons, and type scale values that work for both scripts without adjustment.

### Brand Color
The brand anchor color is a considered violet — specifically in the mid-spectrum between blue-violet and purple. This color family reads as: intelligent, focused, slightly unconventional. It differentiates from the blue that most B2B SaaS products use, and from the warm orange/red of consumer coaching apps. The violet is used with strict semantic discipline — its presence on screen always means "action or active state."

---

## 2. Product Personality

### Tone of Voice
**Direct without being cold.** The product knows what the user should do and says so plainly. "Technical is your lowest score — practice it now" is the right voice. "We noticed you may want to consider potentially exploring Technical questions" is not.

**Encouraging without being cheerful.** The product cares about the user's improvement. It does not celebrate easy wins with confetti. It surfaces meaningful progress: a score that has climbed over multiple sessions, a streak that indicates consistency, a trend turning positive. These moments are acknowledged with quiet confidence, not performance.

**Specific without being overwhelming.** The product never shows more data than the user needs to make the next decision. A dashboard is not a data dump — it is a briefing.

### Emotional Arc of a Session
1. **Arrival:** The user opens the dashboard. The product tells them exactly what to practice and why. The action is clear. Cognitive load is minimal.
2. **Practice:** The product steps back. The session screen is focused, without ambient coaching data.
3. **Completion:** The user sees their score for the first time. This is the one moment of emotional weight. The design acknowledges it — the score animates in, the trend signal updates.
4. **Return:** The dashboard updates to reflect the new session. Progress is visible. The recommendation may have changed. The cycle continues.

### What the Product Never Does
- It does not shame the user for low scores.
- It does not push notifications or urgency that is manufactured rather than earned.
- It does not hide the user's data behind paywalls or upsell prompts.
- It does not use gamification as a substitute for genuine coaching value.

---

## 3. Visual Principles

These are the governing laws of the visual system. They take precedence over any individual aesthetic preference.

### Principle 1: Hierarchy Before Everything
Every screen must have a single, unambiguous focal point. The user's eye should know, within 500 milliseconds, where to look first. If a screen has two equally prominent elements, the hierarchy is broken. Fix the hierarchy, not the styling.

### Principle 2: Color Is Semantic
Color communicates meaning. It does not decorate. Every use of color on screen answers the question: "what is this color telling the user?" If the answer is "nothing — it just looks nice," the color is removed. The accent color means action or active state. The performance palette means score quality. The canvas/surface distinction means elevation layer. Nothing else.

### Principle 3: Type Does the Hierarchy Work
Premium products communicate importance through typography — specifically through the intentional contrast between type sizes. A three-size type scale, applied consistently, makes hierarchy legible without color, without icons, and without containers. If a section feels visually flat, the solution is almost always to increase the contrast between type tiers — not to add borders, shadows, or color.

### Principle 4: White Space Is Structure
White space is not the absence of content. It is the structure that communicates grouping, separation, and priority. Elements that are related sit close together. Elements that belong to different conceptual categories have space between them. The amount of space between two elements communicates their relationship more precisely than any line or border could.

### Principle 5: Consistency Is the Product
A design decision made once must be applied everywhere. Inconsistency — a button with a different radius in one screen, a different card padding in another — is not a small visual detail. It is a signal to the user that the product was not built with care. Users do not consciously perceive inconsistency. They feel it as reduced trust.

### Principle 6: The System Scales, Not the Exception
When a new component or screen is needed, the design system provides the answer. New components are built from existing tokens, existing type tiers, and existing interaction patterns. If a component cannot be built from the existing system, the system is extended with a documented decision — not bypassed with a one-off value.

### Principle 7: Motion Has a Purpose
Animation communicates. It is never decorative. If removing an animation makes the product harder to understand, it belongs. If removing it makes no difference to comprehension, it does not belong.

---

# Part II — Layout

---

## 4. Layout Grid System

### Content Column
InterviewSim uses a single-column layout for all primary content. The content column has a maximum width of 700px. This measure is the result of three constraints: wide enough to display the SkillFocus category grid comfortably (three columns at the minimum useful width), narrow enough to eliminate horizontal eye travel fatigue in a text-heavy reading context, and consistent with the measure used by reference products (Linear's content column is approximately 680–720px on standard viewports).

### Page Structure
The page has three horizontal zones:

**Outer zone:** The viewport edge to the content column. This zone is empty on desktop — the canvas color fills it. On mobile, this zone collapses to zero and is replaced by horizontal content padding.

**Content column:** The 700px column where all dashboard content lives. This column is centered on the viewport for screens wider than 900px. Below 900px it expands to fill the available width minus its own horizontal padding.

**Content padding:** A consistent inner padding of 32px on the left and right edges of the content column. This padding is the same for every card on the page — it creates the left-alignment rhythm that makes the dashboard read as a unified document rather than a collection of isolated components. On small viewports (below 480px), content padding reduces to 20px.

### Vertical Structure
The page has no fixed header. The page header (greeting + secondary action) is a lightweight content element at the top of the content column, not a persistent navigation bar. This keeps the viewport unencumbered and the content column maximally tall.

Page sections stack vertically in the content column. Their order is fixed and reflects the locked dashboard hierarchy. Sections do not reorder, collapse, or swap based on viewport size — only their internal layout adapts.

### Z-axis Layers
- Layer 0: Canvas (page background)
- Layer 1: Surface (cards in page flow)
- Layer 2: Floating elements (dropdowns, tooltips)
- Layer 3: Modal overlay
- Layer 4: Toast / notification

---

## 5. Responsive Grid

### Breakpoints

**Mobile (< 480px)**
- Content column: full width
- Horizontal padding: 20px each side
- Hero layout: stacked (role name → meta → coaching → stats → buttons)
- SkillFocus grid: single column (3 categories stack vertically)
- Recent Sessions: full width rows
- Chart: full width, height constrained proportionally

**Tablet (480px – 768px)**
- Content column: full width
- Horizontal padding: 24px each side
- Hero layout: stacked (same as mobile)
- SkillFocus grid: two columns (third card wraps to second row)
- Recent Sessions: full width rows
- Chart: full width, standard height

**Desktop (769px – 1199px)**
- Content column: 700px, centered
- Horizontal padding: 32px each side
- Hero layout: stacked
- SkillFocus grid: three columns (standard)
- Chart: standard height

**Large Desktop (≥ 1200px)**
- Content column: 700px, centered
- Behavior identical to Desktop
- The canvas color fills the lateral space — no sidebar, no supplementary panels

### Adaptation Rules

The layout adapts column counts, not padding values. Card padding (32px) remains constant at all breakpoints above mobile. Changing padding per breakpoint creates inconsistency in the visual rhythm.

Typography does not scale responsively. A 28px display size is correct at all breakpoints. Scaling typography with the viewport is appropriate for landing pages — not for dashboards, where information density must remain consistent.

RTL (Hebrew) uses the same breakpoint system with all positional values mirrored: content flows from right to left, icons flip as specified in the Iconography Rules section.

---

# Part III — Design Tokens

---

## 6. Color Tokens

Tokens are organized in two layers: **base palette** (raw values, not used directly in components) and **semantic tokens** (named intent, referenced by all components). Components reference semantic tokens only — never base palette values.

### Base Palette

**Violet family (brand)**
- violet-900: #1A1550
- violet-800: #26215C
- violet-700: #3D3594
- violet-600: #534AB7
- violet-500: #6B62CC
- violet-400: #9189DC
- violet-300: #B8B2EB
- violet-200: #DDD4FF
- violet-100: #EEE9FF
- violet-50:  #F7F5FF

**Neutral family**
- neutral-900: #0F0F12
- neutral-800: #1C1C22
- neutral-700: #2E2E38
- neutral-600: #4A4A5C
- neutral-500: #6B6B7E
- neutral-400: #8A8A9C
- neutral-300: #B4B4C4
- neutral-200: #D8D8E4
- neutral-100: #EBEBF2
- neutral-50:  #F4F4F6
- neutral-25:  #F7F8FA
- white:       #FFFFFF

**Green family (performance: high)**
- green-800: #14532D
- green-700: #166534
- green-600: #1A7F4B
- green-100: #DCFCE7
- green-50:  #E8F7EE

**Amber family (performance: mid)**
- amber-800: #78350F
- amber-700: #92400E
- amber-600: #A05C10
- amber-100: #FEF3C7
- amber-50:  #FEF4E0

**Red family (performance: low)**
- red-800:  #7F1D1D
- red-700:  #9B1C1C
- red-600:  #B42318
- red-100:  #FEE2E2
- red-50:   #FEEAE9

### Semantic Tokens

**Surface**
- `color-canvas`:          neutral-25 (#F7F8FA) — page background
- `color-surface`:         white (#FFFFFF) — card background
- `color-surface-raised`:  neutral-50 (#F4F4F6) — hover state, nested items
- `color-surface-overlay`: rgba(15, 15, 18, 0.40) — modal scrim

**Border**
- `color-border`:          rgba(0, 0, 0, 0.07) — default card edge
- `color-border-strong`:   rgba(0, 0, 0, 0.15) — active borders, inputs

**Text**
- `color-text-primary`:    neutral-900 (#0F0F12) — highest contrast
- `color-text-secondary`:  neutral-600 (#4A4A5C) — supporting content
- `color-text-muted`:      neutral-400 (#8A8A9C) — metadata, labels
- `color-text-inverse`:    white (#FFFFFF) — text on solid accent backgrounds
- `color-text-accent`:     violet-600 (#534AB7) — links, interactive labels

**Accent**
- `color-accent`:          violet-600 (#534AB7) — primary actions, active states
- `color-accent-hover`:    violet-700 (#3D3594) — accent hover state
- `color-accent-subtle`:   violet-200 (#DDD4FF) — hero surface, recommended backgrounds
- `color-accent-text`:     violet-800 (#26215C) — text on accent-subtle backgrounds

**Performance** *(score pill and trend signal use only)*
- `color-perf-high-bg`:    green-50 (#E8F7EE)
- `color-perf-high-text`:  green-700 (#166534)
- `color-perf-mid-bg`:     amber-50 (#FEF4E0)
- `color-perf-mid-text`:   amber-700 (#92400E)
- `color-perf-low-bg`:     red-50 (#FEEAE9)
- `color-perf-low-text`:   red-700 (#9B1C1C)

**Performance Thresholds**
- High: score ≥ 80
- Mid:  score 60–79
- Low:  score < 60

---

## 7. Typography Tokens

### Font Families
- `font-sans`:    Inter, system-ui, -apple-system, sans-serif — all UI text
- `font-display`: Inter, system-ui, -apple-system, sans-serif — same family; distinction is in size/weight, not typeface

Inter is specified for both tiers. The display tier achieves its distinction through size and weight, not a separate typeface. Using a second typeface for the display tier would add personality at the cost of coherence.

### Type Scale — Three Tiers Only

**Display**
- Size:         28px
- Weight:       Semibold (600)
- Line height:  1.15
- Letter spacing: -0.4px
- Usage:        Hero role name, session result score. One instance per screen maximum.

**Body**
- Size:         14px
- Weight:       Regular (400) default; Medium (500) for emphasis
- Line height:  1.5
- Letter spacing: 0
- Usage:        All content text, button labels, coaching insights, list item primary content, input values.

**Label**
- Size:         11px
- Weight:       Medium (500)
- Line height:  1.3
- Letter spacing: 0
- Usage:        Section headings, score pills, badges, date strings, metadata, counts, trend signals.

### Weight Scale
- Regular (400): body text in passive context
- Medium (500):  body text emphasis, all labels, secondary headings
- Semibold (600): display text, primary headings, button labels, active data values

No Bold (700). No Extra Bold (800). If a text element requires 700 weight to feel prominent, it is at the wrong type tier.

### Type Rules
- No uppercase transformation on labels. Uppercase with letter-spacing is a print convention that reads as dated in digital interfaces.
- No type size between the three defined tiers. An 18px heading is not a valid choice — it belongs to either Display or Body.
- No italic text in the UI layer. Italics are reserved for user-generated text content (e.g., a quoted question) if that feature is introduced.
- Numeric tabular figures (font-variant-numeric: tabular-nums) must be applied to all score and count values to prevent horizontal layout shifts when numbers change.

---

## 8. Spacing Tokens

Base unit: 4px. All spacing values are multiples of this unit.

| Token       | Value | Semantic Role                                               |
|-------------|-------|-------------------------------------------------------------|
| `space-1`   | 4px   | Icon-to-label gap; inline separator; very tight coupling   |
| `space-2`   | 8px   | Between elements in a metadata row; badge internal padding |
| `space-3`   | 12px  | Grid gap between category cards; list item line gap        |
| `space-4`   | 16px  | Within-card section gap; card title to content gap         |
| `space-5`   | 20px  | Between conceptually distinct blocks within one card       |
| `space-6`   | 24px  | Between cards in the page flow; default card padding       |
| `space-8`   | 32px  | Section break after hero; page horizontal padding          |
| `space-10`  | 40px  | Large desktop page padding; modal internal padding         |
| `space-12`  | 48px  | Reserved for future full-bleed section spacing             |
| `space-16`  | 64px  | Page-level top/bottom breathing room                       |

### Spacing Hierarchy Rule
Elements within a group must use spacing tokens ≤ space-4. Gaps between groups within a card use space-5 to space-6. Gaps between cards use space-6. Gaps between sections use space-8. Violating this hierarchy collapses the grouping logic.

---

## 9. Border Radius Tokens

| Token        | Value  | Element Category                          |
|--------------|--------|-------------------------------------------|
| `radius-xs`  | 4px    | Badges, score pills, keyboard keys, tags  |
| `radius-sm`  | 8px    | Buttons, input fields, small containers   |
| `radius-md`  | 12px   | Section cards, hero card, modals          |
| `radius-pill`| 9999px | Filter chips, avatar circles              |

Every element uses exactly one of these four values. Ad-hoc intermediate values (6px, 10px, 14px) are not permitted. If an element does not clearly belong to one of the four categories, that is a design decision to make — not a pixel value to negotiate.

---

## 10. Shadow and Elevation Tokens

| Token            | Value                                                                   | Usage                              |
|------------------|-------------------------------------------------------------------------|------------------------------------|
| `shadow-none`    | none                                                                    | All in-page cards (default)        |
| `shadow-button`  | 0 1px 4px rgba(0,0,0,0.10)                                             | Primary CTA button only            |
| `shadow-float`   | 0 4px 16px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)               | Dropdowns, tooltips, popovers      |
| `shadow-modal`   | 0 8px 40px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.08)               | Modal dialogs                      |

### Elevation Rule
In-page cards (Hero, SkillFocus, Trend, Recent Sessions, Roles) use `shadow-none`. Their elevation is implied by the contrast between `color-canvas` and `color-surface`. This is not a limitation — it is the mechanism. A properly calibrated canvas color makes hairline-bordered, shadow-free cards read as elevated surfaces. Shadow is reserved for elements that genuinely float above the page layer (z-index > 0).

---

## 11. Motion Tokens

### Duration

| Token                | Value  | Usage                                           |
|----------------------|--------|-------------------------------------------------|
| `duration-instant`   | 100ms  | Color and opacity transitions                   |
| `duration-fast`      | 150ms  | Small positional shifts, badge changes          |
| `duration-base`      | 200ms  | Panel entry/exit, dropdown open/close           |
| `duration-slow`      | 300ms  | Page-level transitions                          |
| `duration-score`     | 500ms  | Score reveal after session (the one exception)  |

### Easing

| Token           | Curve                          | Usage                                            |
|-----------------|--------------------------------|--------------------------------------------------|
| `ease-out`      | cubic-bezier(0, 0, 0.2, 1)    | Elements entering the viewport (decelerate)      |
| `ease-in`       | cubic-bezier(0.4, 0, 1, 1)    | Elements leaving the viewport (accelerate)       |
| `ease-in-out`   | cubic-bezier(0.4, 0, 0.2, 1)  | Elements changing state in place                 |
| `ease-linear`   | linear                         | Never used                                       |

### Motion Rules
1. No animation plays more than once per user-initiated action.
2. No stagger animation on simultaneously-rendered list items. All rows appear at once.
3. No hover-triggered scale transforms. Hover is communicated through background color only.
4. Score reveal (duration-score, ease-out) is the only animation permitted to have emotional weight. All others are functional.
5. All motion must respect `prefers-reduced-motion`. When this preference is set, duration-instant (100ms) is used for all transitions, and the score reveal plays at full final value without counting up.

---

# Part IV — Component Library

---

## 12. Button

**Purpose:** The primary interactive control for initiating actions. Buttons are not used for navigation — links and chips handle navigation. Buttons trigger operations: starting a session, submitting a configuration, confirming a choice.

**Anatomy**
- A: Container (background, border, radius)
- B: Leading icon (optional, 14–15px, same color as label)
- C: Label text
- D: Trailing icon (optional, 14px, same color as label)

Icons and labels are vertically centered within the container. Leading icon is used when it clarifies the action (Play for "Start practice"). Trailing icon is used for directional actions ("Choose a different role →"). Never use both simultaneously.

**Variants**

*Primary*
The single most important action on the current screen. Solid `color-accent` background, `color-text-inverse` label and icons. `shadow-button`. There is exactly one Primary button per visible screen context. If a design calls for two Primary buttons, the hierarchy is wrong.

*Secondary*
An alternative to the Primary action. Transparent background, `color-border-strong` border, `color-text-accent` label and icons. No shadow.

*Ghost*
Navigation-adjacent actions, supplementary controls. Transparent background, no border. `color-text-accent` label with `color-accent-subtle` background tint on hover. No shadow.

*Destructive*
Irreversible, consequential actions. Transparent background, `color-perf-low-text` border and label. Treated the same as Secondary but with red family color. Appears only when an action cannot be undone.

*Icon-only*
A square button with one icon, no label. Used for compact toolbars only. Must have an accessible label (aria-label). Background is transparent with surface-raised hover.

**States**

| State    | Visual Change                                                          |
|----------|------------------------------------------------------------------------|
| Default  | As defined per variant above                                           |
| Hover    | Background darkens by one step. Primary: accent-hover. Secondary: surface-raised tint + border-strong. Ghost: accent-subtle background appears. |
| Active   | Background darkens by two steps. Transition is instant (no easing).   |
| Focus    | 2px `color-accent` outline, offset 2px. Visible on keyboard navigation only. |
| Disabled | 40% opacity. No cursor change. No hover effect.                        |
| Loading  | Label replaced by a small neutral spinner. Button retains full size. No layout shift. |

**Spacing**
- Horizontal padding: space-5 (20px) each side
- Vertical padding: space-2 (8px) — desktop; space-3 (12px) — mobile touch targets
- Icon-to-label gap: space-1 (4px) for leading; space-2 (8px) for trailing
- Minimum height: 36px desktop; 44px mobile

**Typography**
- Tier: Body
- Weight: Semibold (600)
- Maximum label length: 3 words. "Start focused practice" (3 words). "Choose a different role" (4 words — too long, should be "Different role" or "Change role").

**Colors**
- Primary: background `color-accent`, label `color-text-inverse`, icon `color-text-inverse`
- Secondary: background transparent, border `color-border-strong`, label `color-text-accent`
- Ghost: background transparent, label `color-text-accent`
- Destructive: background transparent, border `color-perf-low-text`, label `color-perf-low-text`

**Do**
- Use one Primary button maximum per context
- Keep labels to verbs + optional noun ("Start practice", "View all")
- Pair Primary with Ghost or Secondary — never Primary with Primary
- Use leading icons to clarify intent (Play, Target, Plus)

**Don't**
- Don't use a button for navigation between screens — use a link or filter chip
- Don't stack two Primary buttons vertically and call one "more important"
- Don't apply performance palette colors to standard action buttons
- Don't add a shadow to Secondary or Ghost buttons
- Don't use icons on both ends of a button label simultaneously

---

## 13. Badge

**Purpose:** A small, non-interactive label that classifies or categorizes an item. In InterviewSim, badges identify the interview type (Technical, Behavioral, Case Study, Mixed). They communicate classification, not status. Badges are not clickable.

**Anatomy**
- A: Container (background, border, radius)
- B: Label text

**Variants**

*Type badge (interview type)*
Each interview type has a dedicated color assignment from the accent family:
- Technical: violet-100 background, violet-700 text
- Behavioral: a warm neutral — neutral-100 background, neutral-700 text
- Case Study: neutral-50 background, neutral-600 text
- Mixed: neutral-50 background, neutral-500 text

All type badges use the same size and radius. Color differentiates type, not importance.

*Status badge (future use)*
Reserved for system status labels (Beta, New, Deprecated). Uses a distinct color assignment that does not conflict with the type badge palette.

**States**
Badges are non-interactive and have no hover, active, or focus state. They do not change appearance.

**Spacing**
- Horizontal padding: space-2 (8px) each side
- Vertical padding: 3px each side
- Minimum width: none — badge sizes to content

**Typography**
- Tier: Label
- Weight: Medium (500)

**Colors**
Per variant definition above. Never use `color-accent` or any performance palette color for badges.

**Do**
- Use badges to communicate interview type classification only
- Assign one badge per item (one type per session)
- Position badges consistently — always adjacent to the role name or session title

**Don't**
- Don't make badges interactive (clickable, hoverable)
- Don't use badge size to communicate importance — a Technical session and a Behavioral session are equal in weight
- Don't apply score-bucket colors to type badges
- Don't use more than one badge per item in the current product scope

---

## 14. Score Pill

**Purpose:** A small, non-interactive numerical display that communicates a session score or skill score with performance-level context. Score Pills use the performance color palette to signal quality at a glance.

**Anatomy**
- A: Container (background, radius)
- B: Score number
- C: Optional denominator text ("/100") — omitted in tight spaces

**Variants**

*Full pill:* Number + denominator ("72/100"). Used in score results and skill cards where space allows.
*Compact pill:* Number only ("72"). Used in Recent Sessions rows where space is constrained.

**States**
Non-interactive. No hover, active, or focus state.

**Spacing**
- Horizontal padding: space-2 (8px)
- Vertical padding: 3px
- Uses `radius-xs` (4px)

**Typography**
- Tier: Label
- Weight: Semibold (600)
- Numeric figures must be tabular (no width shift between 72 and 81)

**Colors**
Score-to-color mapping:
- ≥ 80 (high): `color-perf-high-bg` background, `color-perf-high-text` text
- 60–79 (mid): `color-perf-mid-bg` background, `color-perf-mid-text` text
- < 60 (low): `color-perf-low-bg` background, `color-perf-low-text` text

Performance colors use the softened (-50 background, -700 text) palette — not the full-saturation values. The goal is legibility, not alarm.

**Do**
- Use Score Pills in Recent Sessions rows and Category Item Cards
- Apply consistent alignment — always right-aligned or consistently left-aligned within a list

**Don't**
- Don't use Score Pills on the lavender hero background — performance colors on colored backgrounds create conflicting signals
- Don't use Score Pill color to imply judgment — the pill shows data, not verdict
- Don't show "/100" in compact contexts (Recent Sessions rows)

---

## 15. Filter Chip

**Purpose:** A pill-shaped selection control that represents a filterable or selectable option. In InterviewSim, Filter Chips appear in the Practice by Role section. They are selection controls, not action buttons — they communicate state (selected / unselected) rather than triggering an operation directly.

**Anatomy**
- A: Container (background, border, radius-pill)
- B: Label (role name)
- C: Optional trailing count or indicator

**Variants**

*Default:* Unselected state. Surface background, border-strong border, text-secondary label.
*Selected:* Active selection. `color-accent-subtle` background, `color-accent` border, `color-text-accent` label.
*Most recent:* The role with the most recent session history. Same as Selected visual treatment by default. If the user has explicitly selected a different role, this chip returns to Default.

**States**

| State    | Visual Change                                            |
|----------|----------------------------------------------------------|
| Default  | Surface background, border-strong border                 |
| Hover    | Surface-raised background                                |
| Selected | Accent-subtle background, accent border, accent text     |
| Focus    | 2px accent outline, offset 2px                           |
| Disabled | 40% opacity — used when a role has no history yet        |

**Spacing**
- Horizontal padding: space-3 (12px) each side
- Vertical padding: space-2 (8px) each side
- Gap between chips: space-2 (8px)
- Uses `radius-pill` (9999px)

**Typography**
- Tier: Label
- Weight: Medium (500)

**Colors**
Per variant definition above.

**Do**
- Show all available roles as chips, even those without history (disabled state)
- Let the chip label be the role name only — no icon needed
- Arrange chips in a wrapping horizontal row (flex wrap)

**Don't**
- Don't use Filter Chips for actions — they communicate state, not operations
- Don't apply `radius-sm` (button radius) — Filter Chips must use `radius-pill` to be visually distinguishable from action buttons
- Don't show more than 6–8 chips before introducing a "Show more" overflow

---

## 16. Progress Bar

**Purpose:** A thin horizontal bar that visualizes a score value on a 0–100 scale. Used within Category Item Cards to show relative skill level at a glance. The bar is decorative-data — it reinforces the Score Pill, not a standalone indicator.

**Anatomy**
- A: Track (full-width background bar)
- B: Fill (proportional to score, performance-colored)

**Variants**
One variant only. Width, color, and height are determined by data.

**States**
Non-interactive. The bar renders at its final value — it does not animate on mount (the score animation exception applies only to session result screens, not the dashboard).

**Spacing**
- Height: 4px
- Width: 100% of its container
- Margin above: space-1 (4px) below the score number
- Border radius: 2px (half of height — fully rounded ends)

**Colors**
- Track: `color-border` — same hairline color as card borders; very subtle
- Fill: performance palette, matching the Score Pill of the same item
  - ≥ 80: green-600 at 60% opacity
  - 60–79: amber-600 at 60% opacity
  - < 60: red-600 at 60% opacity

Opacity reduction prevents the progress bar from competing visually with the Score Pill above it.

**Do**
- Always show the Score Pill above the Progress Bar — the bar is a reinforcement, not a replacement
- Ensure the bar container is the same width as the category card content area

**Don't**
- Don't animate the bar fill on dashboard load
- Don't use the Progress Bar as a standalone score indicator without the Score Pill
- Don't apply full-saturation performance colors — use 60% opacity fill

---

## 17. Trend Signal

**Purpose:** A concise, text-based indicator that communicates the direction and magnitude of a performance trend. Used in Category Item Cards and within the hero meta row. Trend Signals are read at a glance — they answer "is this skill improving, declining, or stable?"

**Anatomy**
- A: Directional arrow character (↑ ↓ → )
- B: Trend label text

**Variants**

*Improving:* ↑ + delta ("↑ +7") or label ("Improving"). Color: `color-perf-high-text` on the arrow character only; text-muted for the label text.
*Declining:* ↓ + delta ("↓ −4") or label ("Declining"). Color: `color-perf-low-text` on the arrow only; text-muted for label.
*Stable:* → + label ("Stable"). Color: text-muted throughout — neither good nor bad.
*Stale:* No arrow. Label: "No data" or "Not enough data". Color: text-muted.

The color is applied to the arrow character only. The label text is always text-muted. This prevents the trend signal from becoming a large area of high-contrast red or green that overpowers nearby content.

**States**
Non-interactive. No hover state.

**Spacing**
- Icon-to-text gap: space-1 (4px)
- No container — inline element within its parent

**Typography**
- Tier: Label
- Weight: Medium (500)

**Colors**
Per variant definition above. Arrow-only coloring.

**Do**
- Apply color to the arrow character only, not the full signal string
- Use ↑ ↓ → as Unicode characters, not as icons

**Don't**
- Don't use a large colored tag or pill for the trend signal — it competes with Score Pills
- Don't apply full performance color to the entire signal string

---

## 18. Section Label

**Purpose:** A small, muted heading that announces the content category of a card section. Section Labels orient the user within the page — they are navigational annotations, not content headings. They are the quietest text element on the page.

**Anatomy**
- A: Label text

**Variants**
One variant. The same typographic treatment is used for every section label on the dashboard.

**States**
Non-interactive. No state changes.

**Spacing**
- Margin below: space-4 (16px) before the section's content begins
- No padding — the label sits flush with the card's content padding

**Typography**
- Tier: Label
- Weight: Medium (500)
- Color: `color-text-muted`

**Colors**
`color-text-muted` only. Section Labels never use the accent color or the primary text color.

**Do**
- Keep section labels to two words maximum ("Skill Focus", "Score Trend", "Recent Sessions")
- Use the same label text in the English and Hebrew versions (translated)
- Place section labels at the top of their card, before all content

**Don't**
- Don't use icons adjacent to section labels — the label text alone is sufficient
- Don't uppercase section labels
- Don't make section labels interactive (no click, no tooltip)
- Don't increase the font size or weight of section labels — they should be the quietest text in their card

---

## 19. Coaching Insight Block

**Purpose:** A short, plain-language coaching recommendation that explains *why* a specific skill is recommended for focused practice. This is the most strategically important text element in the dashboard — it is the product's coaching intelligence made visible. It must be readable and credible, not buried.

**Anatomy**
- A: Insight sentence (1–2 lines)
- B: Recommended action button (adjacent, same row)

**Variants**

*Standard:* A single sentence explaining the recommendation. Example: "Technical is your lowest recent score — focused practice now will move it fastest." Maximum two lines. If the coaching reason exceeds two lines, the copy is too long.
*Stale variant:* When there is insufficient data for a strong recommendation. Example: "Practice a few more sessions to unlock your personalized coaching insights."

**States**
Non-interactive text. The adjacent button has standard button states.

**Spacing**
- A horizontal divider (`color-border`) appears above the Coaching Insight Block, separating it from the category grid above
- Top padding above the block (below the divider): space-5 (20px)
- Gap between insight text (A) and action button (B): space-5 (20px) or auto-flex to opposite ends of the row

**Typography**
- Tier: Body
- Weight: Regular (400), with the key noun (the skill type name) in Medium (500) for emphasis
- Color: `color-text-secondary`

**Colors**
- Insight text: `color-text-secondary`
- No background — the block sits directly on the card surface
- The divider above uses `color-border`

**Do**
- Surface the coaching reason as body-tier text, not as a highlighted callout box
- Bold (Medium weight) the skill type name within the sentence for quick scanning
- Position the CTA button on the same row as the insight text (right-aligned on LTR, left-aligned on RTL)

**Don't**
- Don't place the coaching reason in a colored box or highlighted panel — this was the previous design's mistake
- Don't make the coaching reason text-muted — it is too important to be deprioritized
- Don't exceed two lines — if the insight needs more than two lines, the copy needs editing

---

## 20. Score Display

**Purpose:** A very large number shown immediately after a practice session completes, communicating the user's overall session score. The Score Display is the emotional peak of the product experience. It appears on session result screens (not on the dashboard).

**Anatomy**
- A: Score number (very large)
- B: Denominator ("/100")
- C: Performance level label ("Proficient", "Advanced", etc.) — optional
- D: Performance color indicator (fills or surrounds the number)

**Variants**
One variant. Size and prominence are fixed. The only variable is the performance color tier.

**States**
The Score Display has one animated state: mount. On first render, the score counts up from zero to its final value over `duration-score` (500ms) with `ease-out` easing. This is the single exception to the "no decorative animation" rule. On subsequent renders (returning to the result screen), it renders at its final value without animation.

**Spacing**
- The Score Display is centered within its container
- Generous vertical padding above and below

**Typography**
- Tier: Display, but with a significantly larger size than the standard display value (48–64px range — this is a result screen, not a dashboard)
- Weight: Semibold (600)
- Letter spacing: -0.6px
- Numeric figures: tabular

**Colors**
- Score number: uses the performance color — `color-perf-high-text`, `color-perf-mid-text`, or `color-perf-low-text`
- This is the one context where performance color is applied to a large display element. The context (a dedicated result screen) justifies the prominence.

**Do**
- Play the count-up animation on first render only
- Show the performance color on the number itself — not as a background tint

**Don't**
- Don't use Score Display on the dashboard — the hero shows a smaller, contextual score via Score Pill
- Don't apply Score Display styling to the category scores in SkillFocus

---

## 21. Hero Surface Card

**Purpose:** The primary dashboard element. It answers the product's core question in under three seconds: "What should I practice next?" It is the highest-priority visual element on any screen where it appears.

**Anatomy**
- A: Container (accent-subtle background, card radius, no border, no shadow)
- B: Role name (Display tier)
- C: Meta row (type badge · score · trend signal)
- D: Coaching context sentence (Body tier, 1 line)
- E: Stats strip (sessions · streak · average, Label tier, text-muted)
- F: Action row (Primary button + Ghost button, horizontal)

**Variants**
One variant. The only visual change is in the content (role name, score, coaching reason) based on the user's data.

**States**
The Hero Surface Card has no interactive state itself. Its child components (buttons) have their own states.

*First run (no history):* The Hero Surface Card is replaced by the Empty State component. It does not appear in a "loading" or "empty" version.

**Spacing**
- Container padding: space-8 (32px) horizontal, space-7 (28px) vertical
- Gap between body sections (B→C→D→E): space-2 (8px) — these elements are tightly grouped as related context
- Gap between body section group and action row (E→F): space-6 (24px) — creates clear separation between "context" and "action"
- Margin below container: space-8 (32px) — the largest single gap on the page, signaling the transition from "what to do" to "why"

**Typography**
- Role name (B): Display tier, Semibold (600), `color-accent-text`
- Meta row (C): Label tier, Medium (500), type badge + `color-text-secondary` score + `color-text-muted` trend label
- Coaching context (D): Body tier, Regular (400), `color-text-secondary`
- Stats strip (E): Label tier, Medium (500), `color-text-muted`

**Colors**
- Container: `color-accent-subtle`
- Role name: `color-accent-text`
- All text on the hero surface must be drawn from the violet-800–neutral-600 range — no performance palette colors appear on this surface

**Do**
- Keep the role name to one line — truncate with ellipsis if needed
- Keep the coaching context sentence to one line — edit the copy if it wraps
- Maintain the section-break gap (space-8) below the hero — this gap is structural

**Don't**
- Don't apply performance (score) colors to any element on the hero surface — the lavender background creates conflicts
- Don't add decorative illustrations or patterns to the hero background
- Don't show more than two action buttons — one Primary, one Ghost
- Don't reduce the bottom gap to match the card-to-card gap — the hero's larger gap is intentional hierarchy

---

## 22. Section Card

**Purpose:** A white container that groups a thematically cohesive section of the dashboard. Section Cards are structural — they define visual boundaries between sections. They are not interactive themselves.

**Anatomy**
- A: Container (surface background, border, card radius, no shadow)
- B: Section Label (top of card, before all content)
- C: Content area (section-specific content)

**Variants**
One base variant. Section-specific CSS handles internal layout differences. All section cards share the same container treatment.

**States**
Non-interactive. No state changes.

**Spacing**
- Container padding: space-8 (32px) horizontal, space-7 (28px) vertical top, space-6 (24px) vertical bottom
- Section Label margin below: space-4 (16px)
- Margin between section cards: space-6 (24px)

**Colors**
- Background: `color-surface` (white)
- Border: `color-border` (hairline, rgba(0,0,0,0.07))
- Shadow: none

**Do**
- Apply consistent padding to every section card
- Use Section Card for: SkillFocus, Trend, Recent Sessions, Practice by Role
- Let the content dictate the card height — no fixed heights

**Don't**
- Don't apply shadow to section cards
- Don't vary the container padding between different section cards — consistency in the container creates the visual rhythm
- Don't nest another Section Card inside a Section Card

---

## 23. Category Item Card

**Purpose:** A data display block within the SkillFocus grid that shows the score, trend, and status of a single interview type category. These are data objects, not interactive controls.

**Anatomy**
- A: Container (surface-raised background, no border by default; accent-left-border variant for recommended)
- B: Category label (Label tier, text-secondary)
- C: Score number (Body tier, Semibold, performance-colored text or stale variant)
- D: Progress Bar (below score number)
- E: Trend Signal (below progress bar)
- F: Recommended indicator (only on recommended card: accent left border + subtle accent-subtle tint)

**Variants**

*Default:* Surface-raised background, no border. Category label, score, progress bar, trend signal.
*Recommended:* 3px `color-accent` left border. `color-accent-subtle` background tint at 30% opacity. A "Recommended" label in Label tier, `color-text-accent`, replaces the trend signal or appears above it.
*Stale:* No progress bar. No trend signal. Label reads "Not enough data" in text-muted.

**States**
Non-interactive in the current product scope. No hover state.

**Spacing**
- Container padding: space-4 (16px) horizontal, space-4 (16px) vertical
- Left border recommended variant reduces left padding by 3px (to 13px, maintaining visual alignment)
- Gap between category label (B) and score (C): space-1 (4px)
- Gap between score (C) and progress bar (D): space-1 (4px)
- Gap between progress bar (D) and trend signal (E): space-1 (4px)
- All elements within the card are very tightly grouped (space-1) — they form a single data unit, not separate sections

**Typography**
- Category label (B): Label tier, Medium (500), `color-text-secondary`
- Score number (C): Body tier, Semibold (600)
- Trend signal (E): Label tier, per Trend Signal component rules

**Colors**
- Default background: `color-surface-raised`
- Recommended background: `color-surface-raised` + `color-accent-subtle` at 30% opacity blend
- Score number: performance palette text color (perf-high-text / perf-mid-text / perf-low-text)
- Stale score: `color-text-muted`

**Do**
- Show exactly three category cards in a row on desktop (Technical, Behavioral, Case Study or equivalent)
- Mark one card as Recommended maximum
- Align all three cards to the same height (align-items: stretch)

**Don't**
- Don't apply a border to default category cards — they use surface-raised background, not a bordered container
- Don't use a Score Pill in category cards — the score is displayed as a number, not in a pill
- Don't show the performance color on the progress bar at full saturation — use 60% opacity

---

## 24. Session Row

**Purpose:** A list item in the Recent Sessions section that shows the essential details of a completed practice session. Session Rows are interactive — each one navigates to the session detail view.

**Anatomy**
- A: Row container (surface background, full width, border-top separator)
- B: Role name (Body tier, Medium weight, text-primary)
- C: Type label (Label tier, text-muted — below the role name)
- D: Date string (Label tier, text-muted — center or right positioned)
- E: Score Pill (compact variant, right-aligned)

**Variants**
One variant. All recent sessions rows are visually identical — no "featured" or "highlighted" session row in the list.

**States**

| State  | Visual Change                                                       |
|--------|---------------------------------------------------------------------|
| Default| Surface background, border-top hairline separator                   |
| Hover  | Full-row surface-raised background. Pointer cursor.                 |
| Active | Surface background with a 1px inset accent border on the left edge  |
| Focus  | 2px accent outline on the row container                             |

**Spacing**
- Vertical padding: space-4 (16px) top and bottom per row
- Horizontal padding: inherits the section card's horizontal padding (space-8, 32px)
- Gap between role name (B) and type label (C): space-1 (4px)
- The Score Pill (E) is right-aligned, vertically centered within the row height

**Typography**
- Role name (B): Body tier, Medium (500), `color-text-primary`
- Type label (C): Label tier, Medium (500), `color-text-muted`
- Date string (D): Label tier, Medium (500), `color-text-muted`
- Score Pill (E): per Score Pill component spec

**Colors**
- Background: `color-surface`
- Separator: `color-border`
- Role name: `color-text-primary`
- Type and date: `color-text-muted`
- Score Pill: per performance tier

**Do**
- Show a maximum of 5 recent sessions without a "View all" overflow link
- Include a "View all sessions" ghost link below the last row when more than 5 sessions exist
- Right-align the Score Pill consistently across all rows

**Don't**
- Don't use a card-within-a-card treatment for rows — separators (border-top) do the grouping work
- Don't show the score at high visual prominence — it is reference data, not the focus of this section
- Don't show more than one secondary label beneath the role name

---

## 25. Trend Chart

**Purpose:** A time-series area chart showing the user's overall score progression across sessions. The chart communicates direction and velocity of improvement — it answers "how has my performance changed over time?"

**Anatomy**
- A: SVG chart container
- B: Area fill (below the line, very low opacity accent)
- C: Score line (2px, accent color)
- D: Data point dots (on hover only — not persistent)
- E: Benchmark reference line (dashed, text-muted at 40%)
- F: Benchmark label (Label tier, positioned at right end of the dashed line)
- G: X-axis date labels (Label tier, text-muted, below the chart area)
- H: Trend summary row (below the chart, insight sentence)

**Variants**

*Standard:* Full session history, up to 20 sessions. Full chart height.
*Sparse (< 4 sessions):* A placeholder state communicates "keep practicing to see your trend." See Empty States.

**States**
The chart has one interactive state: individual data point hover. On hover over a data point, a tooltip appears (Floating elevation, shadow-float) showing the exact score and date.

**Spacing**
- Chart area padding inside the card: inherits section card padding
- Chart height: 110px (after reduction from original 140px)
- Viewbox: 620 × 110
- Date labels sit 8px below the bottom of the chart area
- Trend summary row sits space-5 (20px) below the date labels, separated by `color-border`

**Typography**
- Date labels (G): Label tier, Medium (500), `color-text-muted`
- Benchmark label (F): Label tier, Medium (500), `color-text-muted`
- Trend summary (H): Body tier, Regular (400), `color-text-secondary`. Arrow character colored per trend direction.

**Colors**
- Area fill: `color-accent` at 10–12% opacity
- Score line: `color-accent` at 80% opacity
- Data point dot: white fill, `color-accent` stroke (2px)
- Benchmark line: `color-text-muted` at 40% opacity, dashed (4px dash, 4px gap)
- Benchmark label: `color-text-muted`

**Do**
- Show the benchmark reference line at 70 (a meaningful threshold for interview preparation)
- Annotate the most recent data point with its exact value (right-aligned text, Label tier)
- Use the trend summary sentence to communicate the key insight in plain language

**Don't**
- Don't show Y-axis labels other than the benchmark line — they add noise without value
- Don't animate the chart on dashboard load — only the score result screen earns animation
- Don't use a bar chart — the line/area chart communicates progression over time more naturally

---

## 26. Page Header

**Purpose:** A minimal page-level header that provides personal orientation (greeting) and a single utility action. It is not a navigation header — InterviewSim is a single-view app. Its role is to confirm identity and provide a "start fresh" escape hatch.

**Anatomy**
- A: Greeting text (left on LTR, right on RTL)
- B: Secondary action button (right on LTR, left on RTL)

**Variants**
One variant.

**States**
- Greeting text: non-interactive
- Button: standard Ghost button states

**Spacing**
- No container padding — header sits directly on the canvas
- Margin below header before Hero Card: space-5 (20px)
- Internal horizontal gap between greeting and button: auto (flex space-between)

**Typography**
- Greeting (A): Label tier, Medium (500), `color-text-secondary`
- Button label: Body tier, Semibold (600) — inherits from Ghost Button component

**Colors**
- Greeting: `color-text-secondary`
- No background on the header container

**Do**
- Keep the greeting to first name only — no full name, no "Welcome back to InterviewSim"
- Use an orienting phrase ("Ready to practice?") or the date — either is acceptable
- Keep the secondary action to three words maximum ("New interview", "Start fresh")

**Don't**
- Don't add a horizontal border or background to the page header
- Don't add navigation elements to the header — this is not a nav bar
- Don't use the page header to surface dashboard stats

---

# Part V — States

---

## 27. States Library

All interactive components follow a consistent state vocabulary. The states defined here apply globally across the component library. Component-specific state notes appear in each component's specification.

### Interactive States Summary

**Default:** The component's baseline visual state. No user interaction is occurring.

**Hover:** User's pointer is over the component. Background shifts from current surface level to the next level up (surface → surface-raised). No other properties change on hover. Color does not change. Border does not change. Size does not change.

**Active / Pressed:** User is clicking or pressing the component. Background shifts two levels. Transition is instant — active states must feel mechanical and immediate, not floaty.

**Focus (keyboard):** User has navigated to the component via keyboard (Tab key). A 2px solid outline in `color-accent` appears outside the component boundary, offset by 2px. The focus ring appears on keyboard navigation only — not on mouse click (`:focus-visible` behavior). Every interactive component must have a visible focus state. This is non-negotiable.

**Disabled:** The component is present but not interactive. 40% opacity. No cursor change. No hover, active, or focus effects.

**Loading:** The component is waiting for an asynchronous operation. For buttons: the label is replaced with a neutral spinner; the button retains its size. For data-display areas: the content is replaced with a Skeleton State.

**Selected:** For selection controls (Filter Chips, navigation items). Background uses `color-accent-subtle`, text uses `color-text-accent`, border (if present) uses `color-accent`.

**Error:** For form inputs and validation contexts. Border uses `color-perf-low-text`. Helper text below the input uses `color-perf-low-text` at Body tier. The input's interior does not change color.

---

## 28. Empty States

Empty states appear when a section or page has no data to display. InterviewSim has two primary empty state contexts.

### Empty State: First Run (no practice history)

**Trigger:** User has zero completed sessions.

**Replaces:** The entire dashboard content area (Hero, SkillFocus, Trend, Recent Sessions are all absent).

**Anatomy**
- A: Illustration (single-color line art, accent color, abstract/geometric — represents a microphone or interview context)
- B: Heading (Body tier, Semibold, text-primary)
- C: Supporting sentence (Body tier, Regular, text-secondary)
- D: Primary action button ("Start your first practice")

**Copy**
- Heading: "Your coaching starts here"
- Supporting sentence: "Complete your first session and InterviewSim will build your personalized practice plan."

**Spacing**
- Illustration: 80px × 80px, centered
- Illustration to heading gap: space-6 (24px)
- Heading to body gap: space-2 (8px)
- Body to button gap: space-6 (24px)
- The block is vertically centered within the content column

**Colors**
- Illustration: `color-accent` at 70% opacity (slightly muted — this is a neutral context, not celebration)
- Heading: `color-text-primary`
- Body: `color-text-secondary`
- Button: standard Primary button

**Do**
- Keep the heading to five words maximum
- Make the CTA the only action — there is no secondary path

**Don't**
- Don't show an error illustration for a first-run state — the user hasn't done anything wrong
- Don't use the word "empty" or "no data" in the copy

---

### Empty State: Sparse Data (insufficient sessions for a section)

**Trigger:** A specific dashboard section (e.g., Trend Chart) requires minimum 4 sessions to render meaningfully. The user has fewer than 4 sessions in total, or in a specific interview type.

**Replaces:** The section's content area within its card. The Section Card container remains.

**Anatomy**
- A: Placeholder icon (neutral, non-alarming — an empty chart outline or similar)
- B: Short label (Label tier, text-muted)

**Copy examples**
- Trend Chart: "Complete 4 sessions to see your trend"
- SkillFocus category: "Not enough data — keep practicing"

**Spacing**
- Vertically centered within the card's content area
- Minimum height: 80px to prevent the card from collapsing

**Colors**
- Icon: `color-text-muted`
- Label: `color-text-muted`

---

## 29. Skeleton States

Skeleton states replace content while data is loading. They appear when the dashboard is first mounting and data is being fetched.

**Anatomy**
Skeleton elements are simplified rectangular shapes (with appropriate border radius) that match the approximate size and position of the content they replace. They use a pulsing animation to communicate active loading.

**Animation**
A horizontal shimmer passes left-to-right (right-to-left on RTL) across all skeleton elements in a coordinated pulse. Duration: 1.5s per cycle. This communicates "loading is in progress" without being alarming.

**Skeleton Elements for the Dashboard**

| Content Element     | Skeleton Shape                               |
|---------------------|----------------------------------------------|
| Hero card           | Full-width rectangle, 196px height, radius-md, accent-subtle background with shimmer |
| Section label       | Short rectangle, 11px height, radius-xs      |
| Category item card  | Rectangle matching category card dimensions  |
| Trend chart         | Rectangle, 110px height, full width          |
| Session row         | Two lines per row (role name + type label)   |
| Filter chip         | Pill-shaped rectangles                       |

**Colors**
- Skeleton base: `color-surface-raised`
- Shimmer highlight: white at 40% opacity, moving left to right
- Hero skeleton base: `color-accent-subtle` at 40% opacity

**Timing**
Skeleton states appear only after 100ms of loading time. If data loads in under 100ms, the skeleton never renders — content appears directly. This prevents flickering on fast connections.

---

## 30. Error States

Error states communicate that something has gone wrong at the system level — not at the user level.

### Error State: Data Load Failure

**Trigger:** Dashboard data fails to load from the data source.

**Replaces:** The affected section's content area. The section card container remains.

**Anatomy**
- A: Icon (a simple × or ! in text-muted — not red, not alarming)
- B: Short label (Body tier, text-secondary)
- C: Retry action (Ghost button, "Try again")

**Copy**
- Label: "Couldn't load your data"
- Retry: "Try again"

**Colors**
- Icon and label: `color-text-secondary`
- No red. Error states in a coaching product should not alarm the user — they should be calm and actionable.

**Spacing**
- Identical to Sparse Data empty state — centered in the card content area

### Error State: Form / Validation Error (future)

When form inputs exist (session configuration), validation errors are communicated at the field level: `color-perf-low-text` border on the input, a single-sentence error message in `color-perf-low-text` at the Label tier directly below the field.

Page-level validation errors (e.g., "Please select a role") use a dismissible alert banner at the top of the form area — `color-perf-low-bg` background, `color-perf-low-text` text, `radius-sm`.

---

# Part VI — Rules

---

## 31. Dashboard Design Rules

These rules govern every layout and content decision on the dashboard screen. They cannot be overridden by individual component preferences.

**Rule 1: One answer per screen.**
The dashboard answers one question: "What should I practice next?" Every element on the page either contributes to answering that question or provides supporting context for it. An element that does neither is removed.

**Rule 2: The hero is uncontested.**
No element on the page may be visually larger, more prominent, or higher-contrast than the hero role name. Category scores, section headings, and button labels must all occupy a lower tier. If any element appears to compete with the hero role name, that element's visual weight is reduced — the hero's is not.

**Rule 3: Hierarchy decreases as you scroll.**
The most important section is at the top. The least important is at the bottom. Visual weight — background color, type size, spacing — should reinforce this order, not contradict it.

**Rule 4: The coaching layer is integrated, not appended.**
The coaching reason (why practice this skill) appears within the hero (one line of context) and within SkillFocus (the coaching row). It is first-class content. It is not a footnote, tooltip, or collapsed section.

**Rule 5: No more than 7 distinct numbers at one time.**
The dashboard may surface: hero score, type badge score, sessions count, streak, average score, and up to three category scores. That is eight at the theoretical maximum. Every additional number increases cognitive load without increasing decision-making quality. If the count exceeds seven, a number is removed or deprioritized.

**Rule 6: Performance colors stay in their lane.**
Red/amber/green performance colors appear only on Score Pills, Score Displays, Progress Bar fills, and Trend Signal arrow characters. They do not appear on containers, section backgrounds, headers, or the hero surface. One violation of this rule creates a signal-noise conflict that degrades the performance color's semantic meaning everywhere.

**Rule 7: Empty states are content.**
An empty state is not a fallback. It is the product's first impression for a new user. It must be designed with the same care as the populated dashboard.

---

## 32. Chart Design Rules

**Rule 1: The chart serves the insight, not the other way around.**
The trend chart's purpose is to answer "am I improving?" The visual design — line, area, reference line — serves that answer. Decorative chart elements that do not contribute to the answer are removed.

**Rule 2: One chart type per product (at v1).**
InterviewSim uses the line/area chart for time-series data. No bar charts, radar charts, scatter plots, or pie charts are introduced without a documented design system decision. Introducing a second chart type requires a decision, not just a layout need.

**Rule 3: The reference line earns its presence.**
The benchmark line at 70 is present because it represents a meaningful threshold for interview preparation (above 70 indicates a candidate is likely performing at a competitive level). Any reference line must have a documented justification. A reference line without meaning is removed.

**Rule 4: Axes are minimal.**
The X-axis shows date labels. The Y-axis shows only the benchmark line value. No Y-axis tick marks, grid lines, or scale labels. The user does not need to read the Y-axis — the line's trajectory communicates direction; the data point hover communicates exact value.

**Rule 5: Color is restrained.**
The chart uses two colors: the accent color (for the line and area) and the text-muted color (for the benchmark line, axis labels). No second series color. No gradient fill. No colored data points in their persistent state.

**Rule 6: Data points on hover only.**
Persistent data points (always-visible dots on every data point) create visual clutter on a time-series chart with 10–20 sessions. Data point markers appear only on hover. The hover tooltip provides exact value and date.

**Rule 7: The trend summary is required.**
Every chart is accompanied by a plain-language insight sentence below it. The chart shows the trend visually; the insight sentence names it explicitly. Both are required. A user who does not process the chart will read the insight sentence and have the same understanding.

---

## 33. Iconography Rules

InterviewSim uses the Lucide icon set exclusively. This decision is permanent for v1. No custom icons, no alternative icon libraries, no emoji used as functional icons.

**Size Scale**
- 12px: within very compact contexts (Score Pill supplementary, badge indicator)
- 14px: default UI icon size (button trailing icons, section label icons if used)
- 15px: leading icon in the Primary button
- 16px: standalone contextual icons (rare)
- 20px+: never used in the dashboard UI layer

**Color**
Icons inherit the color of their parent text element. An icon adjacent to a `color-text-accent` label is `color-text-accent`. An icon inside a Primary button is `color-text-inverse`. Icons are never given an independent color that differs from their adjacent label.

**Directional Icons**
ArrowRight and ArrowLeft are the only directional icons in the dashboard. On LTR (English): ArrowRight for forward navigation, trailing position. On RTL (Hebrew): icons are mirrored — ArrowLeft for forward navigation. All other icons are non-directional and do not mirror.

**Section Label Icons**
Section labels do not use icons. The label text alone is sufficient orientation. (The current CSS hides section label icons with `display: none` — this is correct behavior and should remain.)

**Decorative Icons**
No icon is used purely for decoration. Every icon communicates either: the type of action (Play for "start"), the direction of navigation (Arrow), or the state of a metric (TrendingUp for improving trend). If an icon communicates nothing that the adjacent text does not already communicate, it is removed.

**Icon Accessibility**
All icons that appear without an adjacent text label must have an `aria-label` or `aria-hidden="true"` depending on their role. Icons that supplement a text label use `aria-hidden="true"` — the text communicates the meaning; the icon is decorative.

---

## 34. Illustration Rules

**Rule 1: The product's data is the primary illustration.**
Charts, scores, progress, and trends are the visual narrative of InterviewSim. Before adding any decorative illustration, ask whether a data visualization could serve the same purpose more authentically.

**Rule 2: Illustrations appear in empty and onboarding states only.**
In all other contexts, the UI is data-driven. Illustrations do not appear in populated dashboard sections.

**Rule 3: Style specification.**
- Single-weight line art (stroke weight consistent with Lucide icon set: 1.5px at 24px reference size)
- Maximum two colors: `color-accent` at 70% opacity, and `color-canvas` as background
- No gradients
- No fills other than `color-canvas`
- No representational figures (no faces, no people, no hands)
- Abstract and geometric — a microphone is represented as a geometric capsule form, not a realistic render

**Rule 4: Size constraints.**
- Empty state illustration: 80px × 80px
- Onboarding illustration: maximum 120px × 120px
- No full-bleed or oversized illustrations

**Rule 5: Illustrations are never animated.**
The product's single animation exception is the score count-up on session result. Illustrations have no animation.

**Rule 6: Voice.**
Calm, considered, professional. Not celebratory. Not alarming. An empty state illustration communicates "here is where your data will live" — not "wow, you haven't started yet!"

---

## 35. Accessibility Rules

**Non-negotiable baseline:** InterviewSim must meet WCAG 2.1 AA across all components and screens. Where a design decision would violate this baseline, the design decision is revised — not the accessibility requirement.

### Color Contrast
- `color-text-primary` on `color-surface`: minimum ratio 7:1 (current #0F0F12 on white ≈ 21:1 — passes)
- `color-text-secondary` on `color-surface`: minimum ratio 4.5:1 (current #4A4A5C on white ≈ 7.3:1 — passes)
- `color-text-muted` on `color-surface`: minimum ratio 3:1 for large text (≥ 18px or bold ≥ 14px); 4.5:1 for small text. (current #8A8A9C on white ≈ 3.6:1 — passes for Label tier at 11px Medium because this falls under large text exception due to weight; must be verified)
- `color-text-inverse` on `color-accent`: minimum ratio 4.5:1 (white on #534AB7 ≈ 6.2:1 — passes)
- Performance colors: all score pill combinations (perf-*-text on perf-*-bg) must maintain 4.5:1 minimum. Verify on implementation.
- `color-accent-text` on `color-accent-subtle`: (#26215C on #DDD4FF ≈ 8.1:1 — passes)

### Touch Targets
- Minimum touch target: 44px × 44px on mobile viewports
- Minimum touch target: 36px × 36px on desktop
- Adjacent interactive elements must have a minimum 8px gap between their touch areas

### Focus Management
- All interactive components have a visible `:focus-visible` state (2px `color-accent` outline, 2px offset)
- Modal dialogs trap focus within the dialog until dismissed
- After modal dismissal, focus returns to the element that triggered the modal
- No element uses `outline: none` without a replacement focus indicator

### Screen Reader
- All icons paired with text use `aria-hidden="true"`
- Icon-only buttons have descriptive `aria-label` values
- The trend chart SVG has a text alternative (via `aria-label` on the SVG element) describing the trend in plain language: "Score trend: 12 sessions, current score 72, improving over the last 3 sessions"
- Section cards use `<section>` element with an associated heading
- The Page Header greeting is a live region if it changes dynamically (`aria-live="polite"`)

### Motion
- All animations respect `prefers-reduced-motion: reduce`. When this preference is set: all durations collapse to 100ms, the score count-up animation is disabled (score renders at final value), and the skeleton shimmer is replaced with a static state.

### Bilingual / RTL
- All layout uses logical CSS properties (margin-inline-start, padding-inline-end, etc.)
- Directional icons (ArrowRight, ArrowLeft) are swapped for RTL — not mirrored via CSS transform, but the correct variant is rendered in JSX based on the `isRTL` flag
- Text alignment is not set to left or right — it inherits from the document direction
- The Lucide icon set's non-directional icons do not require mirroring

### Semantic HTML
- Dashboard sections use `<section>` with associated `aria-labelledby` pointing to their Section Label
- Action buttons use `<button type="button">` — never `<div>` or `<span>` with click handlers
- The trend chart, if implemented as SVG, requires a `<title>` element and a text alternative
- Score values that update dynamically use `aria-live="polite"` or equivalent

---

## Appendix: Design System Governance

### Freeze Notice
This document is frozen for v1 implementation as of the date above. No implementation decision may introduce a new color, spacing value, type size, or component that is not defined in this specification without a documented amendment.

### How to Amend
An amendment requires: (1) identification of the gap — what is missing or incorrect in the current specification; (2) a proposed new definition following the same format as the existing system; (3) review and approval before implementation proceeds.

### What Is Not In Scope
The following are explicitly out of scope for this specification and will be addressed in a future version:
- Dark mode token mapping
- Animation library / motion design system expansion
- Marketing page design system (separate from the product UI)
- Mobile-native (iOS/Android) adaptation guidelines
- Data export and print stylesheets

---

*InterviewSim Design System v2.0 — Complete. Frozen for v1 implementation.*
