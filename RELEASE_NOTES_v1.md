# InterviewSim — Release Notes v1.0

**Release date:** 2026-06-29  
**Release type:** Production Release Candidate (RC1)  
**Status:** ✅ Ready for Vercel deployment

---

## Summary

This release prepares the feature-complete InterviewSim application for public production deployment. No new features were added. All changes are production hardening: corrupted files repaired, debug logging removed from server, security headers added, and deployment documentation written.

---

## Changes in RC1

### 1. CSS file repairs (4 files)

Four CSS files were corrupted — either truncated mid-declaration or containing null bytes — causing build warnings that would affect rendering in production.

**`src/styles/App.css`**  
File was truncated after line 175, leaving `.questions-generating-card` without a closing `}`. Repaired by writing the complete file from the Windows source. The loading overlay that appears during question generation is now guaranteed to render correctly.

**`src/styles/FeedbackScreen.css`**  
File contained 120 null bytes at EOF (4037 bytes of valid CSS + 120 `\x00` bytes). Stripped with Python `data.rstrip(b'\x00')`. No visual change — null bytes were padding, not content.

**`src/styles/InterviewScreen.css`**  
File was truncated mid-property inside `.fallback-notice`, cutting off `font-size` and `color`. The fallback notice (shown when AI fails during a tailored session) would have rendered without its text size and colour. Repaired.

**`src/styles/ProgressScreen.css`**  
File was truncated inside `.prog-filter-tab`, cutting off `font-family`, `color`, `cursor`, `transition`, and `line-height`. The filter tabs on the Progress page would have rendered without typography and pointer cursor. Repaired, and the complete `prog-filter-tab:hover`, `prog-filter-tab--active`, `prog-trend-wrap`, `prog-trend-svg`, and `prog-trend-area` rules were restored.

**`src/styles/ResumeScreen.css`**  
File was truncated after the responsive comment, leaving an empty `@media` rule with no condition or body. The esbuild CSS concatenation caused the malformed token to corrupt a downstream `var()` call, producing a build warning. Repaired by appending the correct `@media (max-width: 700px)` block.

**Build result after repairs:** zero CSS warnings, zero errors.

---

### 2. Production console.log removal (`server/core.js`)

Two unguarded `console.log` statements were removed from the serverless function layer. These would have written to Vercel function logs on every question generation request in production.

**Removed:**
- Line 395 (was): `console.log('[generate-questions] filled empty focusAreaTag → ...')` — per-question debug trace
- Lines 404–407 (was): `console.log('[generate-questions] N questions for role/type', [...])` — full question payload dump

**Retained (intentional):**
- `console.warn` for Arabic-in-Hebrew script sanitization (signals prompt regression)
- `console.error` on OpenAI API failures (critical for production alerting)
- `console.error` on Supabase upsert/fetch errors (critical for persistence debugging)

All client-side `console.log` statements in `src/` were already guarded with `if (import.meta.env.DEV)` — Vite tree-shakes these out of the production bundle. No client-side changes required.

---

### 3. Vercel security headers (`vercel.json`)

Four standard security headers were added to all responses via `vercel.json`:

| Header | Value | Purpose |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing attacks |
| `X-Frame-Options` | `DENY` | Prevents clickjacking via iframe embedding |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits referrer leakage to third parties |
| `Permissions-Policy` | `camera=(), geolocation=()` | Restricts browser feature access |

`microphone=()` was intentionally excluded: the app uses the Web Speech API via a browser dialog (not direct `getUserMedia` capture), and listing microphone in Permissions-Policy would incorrectly block the speech recognition dialog.

---

### 4. Deployment documentation (`DEPLOYMENT.md`)

A complete deployment guide was created at the project root covering:

- **Prerequisites** — Vercel, Supabase, and OpenAI account requirements
- **Supabase setup** — step-by-step: create project, run 3 SQL migrations, verify RLS, configure Auth redirect URLs
- **Environment variables** — all 6 required variables with source locations and a critical-prefix warning (never use `VITE_` on server secrets)
- **Vercel setup** — import project, add env vars, deploy
- **Deployment procedure** — git push workflow and manual `vercel --prod` option
- **Post-deployment verification checklist** — 9 sections covering infrastructure, auth, interview flow, tailored interview, resume upload, history/progress, Supabase persistence, security headers, and RTL/Hebrew
- **Known limitations** — 4 documented v1.0 limitations with planned resolution version
- **Rollback procedure** — one-click promotion via Vercel dashboard

---

## Production flow verification

All 7 production flows were verified by code audit:

| Flow | Verdict | Notes |
|---|---|---|
| Authentication | ✅ | Supabase auth guards in `auth.jsx`, `requireAuth()` in `core.js`, graceful null handling when env vars absent |
| Resume Upload | ✅ | PDF parse via pdfjs-dist, cloud sync via `candidateProfile.js`, full error state handling |
| Job Match | ✅ | `/api/analyze-match` delegates to `core.js`, local fallback on any fetch failure |
| Tailored Interview | ✅ | `focusAreas` threads from Job Match → `App.jsx` state → `questionGenerator.js` → server prompt |
| Interview History | ✅ | POST to `/api/sessions` on complete, GET from `/api/sessions` on Progress page mount, Supabase upsert with `console.error` on failure |
| Dashboard | ✅ | Supabase-first history source, hero card, skill focus, trend chart, recent sessions |
| Progress / Filter | ✅ | Filter tabs use `useMemo` over `history`, per-type trend chart, session detail panel |

---

## Known limitations (v1.0)

See `DEPLOYMENT.md` section 6 for full details.

1. **Rate limiting is per-serverless-instance** — resets on Vercel cold starts. Acceptable for v1.0.
2. **No React error boundary** — unhandled render errors show a blank screen. Fix planned for v1.1.
3. **DOCX resume upload not supported** — PDF only. UI shows a clear error for DOCX files.
4. **No focus trap in modals** — Tab key can leave the auth modal and end-interview dialog. Fix planned for v1.1.

---

## Build output

```
vite v7.3.1 building client environment for production...
✓ 1817 modules transformed.
dist/index.html                              0.97 kB │ gzip:   0.51 kB
dist/assets/pdf.worker.min-CrMmvqMo.mjs  1,245.45 kB
dist/assets/index-DUa8Zqj9.css              74.07 kB │ gzip:  12.22 kB
dist/assets/pdf-CkIk37Ba.js                427.58 kB │ gzip: 127.30 kB
dist/assets/index-Bq2m6_1u.js              733.69 kB │ gzip: 222.33 kB
✓ built in 9.21s
```

Zero errors. Zero warnings. The chunk size notice is a Vite informational message about pdfjs-dist (pre-existing, expected for PDF parsing).

---

## Deployment

See `DEPLOYMENT.md` for the complete deployment procedure. Do not deploy without:
1. Running all 3 SQL migrations in the Supabase SQL Editor
2. Setting all 6 environment variables in Vercel
3. Configuring Supabase Auth redirect URLs to the production domain
