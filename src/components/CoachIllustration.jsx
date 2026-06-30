/**
 * Coach illustration — woman in 3/4 profile seated at a laptop, small plant.
 * Thin line-art SVG, single stroke color (currentColor → violet).
 * No filled blobs. Professional semi-profile posture.
 */
export default function CoachIllustration({ width = 210 }) {
  return (
    <svg
      width={width}
      viewBox="0 0 210 160"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="coach-illustration"
    >

      {/* ── DESK LINE ── */}
      <line x1="28" y1="134" x2="200" y2="134" />

      {/* ── CHAIR BACK ── */}
      <path d="M 34 132 L 34 78 Q 35 70 42 68" strokeWidth="1.8" />
      {/* subtle seat arc */}
      <path d="M 34 132 Q 58 138 86 132" strokeWidth="1.3" opacity="0.45" />

      {/* ══════════════════════════════
          LAPTOP — base + screen
         ══════════════════════════════ */}

      {/* Base (keyboard unit) — thin flat rect, trapezoid for perspective */}
      <path d="M 92 132 L 94 120 L 164 120 L 166 132 Z" />
      {/* Trackpad detail on base */}
      <rect x="116" y="123" width="26" height="6" rx="2" strokeWidth="1" opacity="0.35" />
      {/* Keyboard row hints */}
      <line x1="98" y1="122" x2="112" y2="122" strokeWidth="1" opacity="0.3" />
      <line x1="115" y1="122" x2="115" y2="129" strokeWidth="1" opacity="0.25" />

      {/* Screen lid — slightly angled for perspective depth */}
      <path d="M 94 120 L 94 62 L 164 62 L 164 120 Z" />
      {/* Screen bezel / inner frame */}
      <rect x="100" y="68" width="58" height="46" rx="1.5" strokeWidth="1.1" opacity="0.42" />
      {/* Hinge shadow line */}
      <line x1="94" y1="120" x2="164" y2="120" strokeWidth="1.4" opacity="0.5" />

      {/* UI content on screen */}
      <line x1="106" y1="77" x2="132" y2="77" strokeWidth="1.6" />
      <line x1="106" y1="84" x2="150" y2="84" strokeWidth="1.1" opacity="0.68" />
      <line x1="106" y1="90" x2="145" y2="90" strokeWidth="1.1" opacity="0.68" />
      <line x1="106" y1="96" x2="148" y2="96" strokeWidth="1.1" opacity="0.68" />
      <line x1="106" y1="102" x2="120" y2="102" strokeWidth="1.6" opacity="0.52" />
      {/* small chart / UI element top-right of screen */}
      <rect x="138" y="74" width="14" height="10" rx="1.5" strokeWidth="1" opacity="0.35" />

      {/* ══════════════════════════════
          BODY — seated, slightly forward
         ══════════════════════════════ */}

      {/* Shoulder line */}
      <path d="M 54 72 Q 68 66 82 70" strokeWidth="2" />

      {/* Left (far) side of torso */}
      <path d="M 54 72 Q 48 88 48 108 Q 48 118 52 126" />

      {/* Right (near) side of torso */}
      <path d="M 82 70 Q 88 86 88 106 Q 88 118 84 126" />

      {/* Hip / seat line */}
      <path d="M 52 126 Q 68 130 84 126" strokeWidth="1.4" opacity="0.48" />

      {/* NECK — two close strokes */}
      <line x1="63" y1="58" x2="61" y2="70" strokeWidth="1.9" />
      <line x1="71" y1="57" x2="73" y2="70" strokeWidth="1.9" />

      {/* LEFT ARM — far arm, crossing body to keyboard */}
      <path d="M 50 86 Q 46 100 54 116 Q 68 130 94 132" strokeWidth="1.9" />

      {/* RIGHT ARM — near arm, reaching forward to keyboard */}
      <path d="M 86 82 Q 94 98 96 116 Q 100 126 120 130" strokeWidth="1.9" />

      {/* ══════════════════════════════
          HEAD — 3/4 profile, facing right
         ══════════════════════════════ */}
      <ellipse cx="68" cy="40" rx="14" ry="16" />

      {/* Jaw definition line (3/4 profile) */}
      <path d="M 80 46 Q 80 54 72 58 Q 66 60 62 58" strokeWidth="1.4" />

      {/* ── FACE — semi-profile, no cartoon ── */}

      {/* Nose — elegant side profile bump, right side of face */}
      <path d="M 80 38 Q 84 43 82 48 Q 80 50 77 50" strokeWidth="1.3" />

      {/* Eye — single almond shape, right/forward facing side */}
      <path d="M 71 36 Q 76 33 79 36 Q 76 39 71 36" strokeWidth="1.4" />
      {/* Upper eyelid line (softens it) */}
      <path d="M 72 35 Q 76 32 79 35" strokeWidth="1" opacity="0.48" />

      {/* Ear — left/back side, small and clean */}
      <path d="M 55 38 Q 52 41 52 46 Q 53 51 56 50" strokeWidth="1.3" />
      <path d="M 55 42 Q 54 44 55 47" strokeWidth="0.9" opacity="0.5" />

      {/* ── HAIR — elegant updo with bun ── */}

      {/* Bun at back of head — clean oval */}
      <ellipse cx="46" cy="32" rx="9" ry="8" />
      {/* Bun inner texture arc */}
      <path d="M 39 32 Q 46 27 53 32" strokeWidth="1.1" opacity="0.55" />
      {/* Hairband / tie mark */}
      <line x1="40" y1="36" x2="52" y2="36" strokeWidth="1" opacity="0.4" />

      {/* Crown arc — hair flowing from bun over head to forehead */}
      <path d="M 54 28 Q 68 16 80 26" strokeWidth="2.3" />

      {/* Hair line on right side (front/forehead hairline) */}
      <path d="M 80 26 Q 82 34 80 42" strokeWidth="1.6" />

      {/* Hair flowing behind ear along neck */}
      <path d="M 54 28 Q 50 36 50 44 Q 51 52 55 58" strokeWidth="1.8" />

      {/* ══════════════════════════════
          PLANT — small, right side
         ══════════════════════════════ */}

      {/* Pot — clean trapezoid */}
      <path d="M 182 134 L 179 122 L 196 122 L 193 134 Z" />
      {/* Pot rim */}
      <line x1="177" y1="122" x2="198" y2="122" />
      {/* Pot base band */}
      <line x1="181" y1="130" x2="194" y2="130" strokeWidth="1" opacity="0.4" />

      {/* Stem */}
      <path d="M 187 122 Q 187 112 186 104" strokeWidth="1.8" />

      {/* Leaf pairs — graceful curves */}
      <path d="M 186 116 Q 178 110 174 114" strokeWidth="1.8" />
      <path d="M 186 112 Q 194 106 198 110" strokeWidth="1.8" />
      <path d="M 186 106 Q 180 100 177 103" strokeWidth="1.5" />
      <path d="M 186 104 Q 192 97 196 101" strokeWidth="1.5" />
      {/* top leaf */}
      <path d="M 186 104 Q 184 97 186 94" strokeWidth="1.3" opacity="0.7" />

    </svg>
  );
}
