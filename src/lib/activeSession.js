/**
 * activeSession.js
 *
 * Persist and restore an in-progress interview across browser refreshes.
 *
 * Only "interview" and "feedback" screens are saved.
 * Summary screen, setup, and all non-practice pages are NOT saved,
 * so completed interviews and deliberate exits are never restored.
 */

const KEY = "interviewsim.activeSession.v1";
const RESTORABLE_SCREENS = new Set(["interview", "feedback"]);

/**
 * Persist the active interview state snapshot to localStorage.
 * Call this on every state change while screen is "interview" or "feedback".
 */
export function saveActiveSession(state) {
  try {
    const snapshot = {
      page: "practice",
      screen: state.screen,
      sessionId: state.sessionId,
      roleId: state.roleId,
      interviewType: state.interviewType,
      interviewerId: state.interviewerId,
      questionCount: state.questionCount,
      experienceLevel: state.experienceLevel,
      difficulty: state.difficulty,
      questions: state.questions,
      currentIndex: state.currentIndex,
      results: state.results,
      followUpQueue: state.followUpQueue ?? [],
      focusAreas: state.focusAreas ?? null,
      matchScore: state.matchScore ?? null,
      _savedAt: Date.now(),
    };
    localStorage.setItem(KEY, JSON.stringify(snapshot));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

/**
 * Load and validate a previously persisted active session.
 * Returns the snapshot object if valid, null otherwise.
 * Clears the key on validation failure to avoid a stuck bad state.
 */
export function loadActiveSession() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;

    const s = JSON.parse(raw);

    // Structural validation — anything that fails means the data is corrupt or stale
    if (
      s.page !== "practice" ||
      !RESTORABLE_SCREENS.has(s.screen) ||
      !s.roleId ||
      !s.interviewType ||
      !Array.isArray(s.questions) ||
      s.questions.length === 0 ||
      typeof s.currentIndex !== "number" ||
      s.currentIndex < 0 ||
      s.currentIndex >= s.questions.length ||
      !Array.isArray(s.results)
    ) {
      clearActiveSession();
      return null;
    }

    return s;
  } catch {
    // Corrupt JSON or other error
    clearActiveSession();
    return null;
  }
}

/**
 * Remove the persisted active session.
 * Call this when the user finishes, navigates away, or starts a new interview.
 */
export function clearActiveSession() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
