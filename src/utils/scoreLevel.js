/**
 * Maps a 0–100 score to a UI label key. Pure presentation logic —
 * independent of which evaluation backend produced the score.
 */
export function scoreLevelKey(score) {
  if (score >= 85) return "scoreExcellent";
  if (score >= 65) return "scoreGood";
  if (score >= 40) return "scoreFair";
  return "scoreNeedsWork";
}
