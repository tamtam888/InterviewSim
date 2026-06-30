/**
 * InterviewSim brand mark — two people seated across a desk,
 * one speaking (speech bubble). Clean, professional line-art feel
 * with filled shapes for small-size legibility.
 *
 * Composition:
 *   - Speech bubble (center-top, primary symbol)
 *   - Left figure: interviewer, listening
 *   - Right figure: candidate, speaking
 *   - Desk: narrow center slab between the two figures
 *
 * Single-color (currentColor) — works in header, sidebar, and favicon.
 */
export default function BrandMark({ size = 44 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      {/* ── Speech bubble (center-top) ──────────────────────────────── */}
      <rect x="20" y="2" width="24" height="14" rx="5"
        fill="currentColor" fillOpacity="0.95" />
      {/* Tail — points down-left toward interviewer */}
      <path d="M26 16 L23 23 L35 16 Z"
        fill="currentColor" fillOpacity="0.95" />
      {/* Content lines */}
      <rect x="25" y="6.5" width="11" height="2" rx="1"
        fill="white" fillOpacity="0.9" />
      <rect x="25" y="11" width="7.5" height="2" rx="1"
        fill="white" fillOpacity="0.65" />

      {/* ── Left figure — interviewer (listening) ───────────────────── */}
      <circle cx="12" cy="23" r="7" fill="currentColor" fillOpacity="0.85" />
      <path d="M2 50 C2 37 6 33 12 33 C18 33 22 37 22 44"
        fill="currentColor" fillOpacity="0.7" />

      {/* ── Right figure — candidate (speaking) ─────────────────────── */}
      <circle cx="52" cy="23" r="7" fill="currentColor" fillOpacity="0.95" />
      <path d="M62 50 C62 37 58 33 52 33 C46 33 42 37 42 44"
        fill="currentColor" fillOpacity="0.8" />

      {/* ── Desk — narrow center slab between the two figures ───────── */}
      <rect x="22" y="42" width="20" height="4" rx="2"
        fill="currentColor" fillOpacity="0.18" />
      {/* Desk leg */}
      <rect x="30" y="46" width="4" height="9" rx="2"
        fill="currentColor" fillOpacity="0.12" />
    </svg>
  );
}
