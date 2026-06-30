import "../styles/ScoreRing.css";

/**
 * Animated circular score indicator (SVG).
 * size: px diameter; score: 0–100.
 */
export default function ScoreRing({ score, size = 120, label }) {
  const stroke = Math.max(6, Math.round(size / 14));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  const tone = score >= 85 ? "ring-excellent" : score >= 65 ? "ring-good" : score >= 40 ? "ring-fair" : "ring-low";

  return (
    <div
      className={`score-ring ${tone}`}
      role="img"
      aria-label={`${label ?? "Score"}: ${score}/100`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="score-ring-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          className="score-ring-value"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="score-ring-center">
        <span className="score-ring-number">{score}</span>
        <span className="score-ring-max">/100</span>
      </div>
    </div>
  );
}
