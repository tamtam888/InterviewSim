import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { Loader } from "lucide-react";
import { LanguageProvider } from "./i18n/LanguageContext";
import { AuthProvider } from "./context/auth";
import { useAuth } from "./hooks/useAuth";
import { useLanguage } from "./i18n/useLanguage";
import { buildSession } from "./data/questions";
import { generateInterviewQuestions } from "./lib/questionGenerator.js";
import { saveActiveSession, loadActiveSession, clearActiveSession } from "./lib/activeSession.js";
import { evaluationClient } from "./api/evaluationClient";
import AppHeader from "./components/AppHeader";
import AppSidebar from "./components/AppSidebar";
import AppFooter from "./components/AppFooter";
import HomeScreen from "./screens/HomeScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import RoleSelectScreen from "./screens/RoleSelectScreen";
import SetupScreen from "./screens/SetupScreen";
import InterviewScreen from "./screens/InterviewScreen";
import { getInterviewerIdForType } from "./data/interviewers";
import FeedbackScreen from "./screens/FeedbackScreen";
import SummaryScreen from "./screens/SummaryScreen";
import QuestionBankScreen from "./screens/QuestionBankScreen";
import ProgressScreen from "./screens/ProgressScreen";
import ResumeScreen from "./screens/ResumeScreen";
import JobMatchScreen from "./screens/JobMatchScreen";
import SettingsScreen from "./screens/SettingsScreen";
import AuthScreen from "./screens/AuthScreen";
import GeneratingScreen from "./screens/GeneratingScreen";
import DevAuthBanner from "./components/DevAuthBanner";
import "./styles/App.css";

// Pages that survive a browser refresh. Practice flow is excluded:
// mid-interview refresh always returns to dashboard.
const PERSIST_PAGE_KEY = "interviewsim.lastPage";
const NAVIGABLE_PAGES = new Set([
  "welcome", "dashboard", "questionBank", "progress", "resume", "jobMatch", "settings",
]);

function getPersistedPage() {
  try {
    const p = localStorage.getItem(PERSIST_PAGE_KEY);
    // Always show the introduction when opening the app; practice restoration is handled above.
    return "welcome";
  } catch {
    return "welcome";
  }
}

/* ── Summary-screen persistence ─────────────────────────────────────────────
   Separate from activeSession (which covers in-progress interview/feedback).
   Allows a browser refresh on the Summary screen to restore the completed
   session results instead of bouncing to Dashboard.
   Cleared on Go Home, New Interview, Practice Again, and any non-practice
   navigation so stale results never bleed into a future session.
   ──────────────────────────────────────────────────────────────────────── */
const SUMMARY_KEY = "interviewsim.summarySession.v1";

function saveSummarySession(state) {
  try {
    localStorage.setItem(SUMMARY_KEY, JSON.stringify({
      page:            "practice",
      screen:          "summary",
      sessionId:       state.sessionId,
      roleId:          state.roleId,
      interviewType:   state.interviewType,
      interviewerId:   state.interviewerId,
      questionCount:   state.questionCount,
      experienceLevel: state.experienceLevel,
      difficulty:      state.difficulty,
      results:         state.results,
      focusAreas:      state.focusAreas  ?? null,
      matchScore:      state.matchScore  ?? null,
      _savedAt:        Date.now(),
    }));
  } catch { /* storage full / unavailable */ }
}

function loadSummarySession() {
  try {
    const raw = localStorage.getItem(SUMMARY_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (
      s.screen !== "summary" ||
      s.page   !== "practice" ||
      !s.roleId ||
      !s.interviewType ||
      !Array.isArray(s.results) ||
      s.results.length === 0
    ) {
      localStorage.removeItem(SUMMARY_KEY);
      return null;
    }
    return s;
  } catch {
    localStorage.removeItem(SUMMARY_KEY);
    return null;
  }
}

function clearSummarySession() {
  try { localStorage.removeItem(SUMMARY_KEY); } catch { /* ignore */ }
}

// BASE_STATE: always dashboard — used by GO_HOME and any hard-reset action.
const BASE_STATE = {
  page: "welcome",
  screen: "home", // practice flow: role | setup | interview | feedback | summary
  sessionId: null,
  roleId: null,
  interviewType: null,
  interviewerId: "sarah",
  questionCount: 6,
  experienceLevel: "junior",
  difficulty: "mixed",
  questions: [],
  currentIndex: 0,
  results: [],
  followUpQueue: [], // { id, type, text, tip, model }
  // matchContext: set when user starts a tailored interview from Job Match.
  // Shape: { gaps: string[], recommendedTopics: string[], tailoredFocus: string, matchScore: number }
  matchContext: null,
  // Preserved from matchContext through the interview so InterviewScreen + SummaryScreen can show metadata.
  focusAreas: null,  // string[] | null
  matchScore: null,  // number | null
};


function reducer(state, action) {
  switch (action.type) {
    case "NAVIGATE":
      return { ...state, page: action.page };

    case "GO_HOME":
      return { ...BASE_STATE };

    case "GO_ROLE_SELECT":
      // Preserve matchContext so a tailored-interview flow survives the navigation
      return { ...BASE_STATE, page: "practice", screen: "role", matchContext: state.matchContext ?? null };

    case "SET_MATCH_CONTEXT":
      return { ...state, matchContext: action.matchContext ?? null };

    case "SELECT_ROLE":
      return { ...state, page: "practice", roleId: action.roleId, screen: "setup" };

    case "BACK_TO_ROLE":
      return { ...state, screen: "role" };

    case "START_INTERVIEW": {
      // action.questions is pre-generated by generateInterviewQuestions() (async).
      // If generation failed at the call site, action.questions is undefined
      // and we fall back to the static bank here (with level/difficulty passed through).
      const questions =
        action.questions ??
        buildSession(state.roleId, action.interviewType, action.questionCount, {
          experienceLevel: state.experienceLevel,
          difficulty: state.difficulty,
        });
      return {
        ...state,
        page: "practice",
        sessionId: action.sessionId,
        interviewType: action.interviewType,
        interviewerId: action.interviewerId,
        questionCount: action.questionCount,
        experienceLevel: action.experienceLevel ?? state.experienceLevel,
        difficulty: action.difficulty ?? state.difficulty,
        questions,
        currentIndex: 0,
        results: [],
        followUpQueue: [],
        focusAreas: action.focusAreas ?? null,
        matchScore:  action.matchScore  ?? null,
        // Non-null only when AI fallback fired during a tailored session.
        focusAreasFallback: action.focusAreasFallback ?? null,
        screen: "interview",
      };
    }

    case "ANSWER_EVALUATED":
      return {
        ...state,
        results: [
          ...state.results,
          { question: action.question, answer: action.answer, feedback: action.feedback },
        ],
        screen: "feedback",
      };

    case "NEXT_QUESTION": {
      // Inject a queued follow-up before the next regular question if present
      if (state.followUpQueue.length > 0) {
        const [followUp, ...rest] = state.followUpQueue;
        const nextQuestions = [
          ...state.questions.slice(0, state.currentIndex + 1),
          followUp,
          ...state.questions.slice(state.currentIndex + 1),
        ];
        return {
          ...state,
          questions: nextQuestions,
          currentIndex: state.currentIndex + 1,
          followUpQueue: rest,
          screen: "interview",
        };
      }
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.questions.length) {
        return { ...state, screen: "summary" };
      }
      return { ...state, currentIndex: nextIndex, screen: "interview" };
    }

    case "QUEUE_FOLLOW_UP":
      return { ...state, followUpQueue: [...state.followUpQueue, action.question] };

    // PRACTICE_FOLLOW_UP: atomically inject exactly ONE follow-up question right
    // after the current question and navigate to the interview screen.
    // Clears followUpQueue to prevent NEXT_QUESTION from injecting a second
    // follow-up from any residual queue items.
    case "PRACTICE_FOLLOW_UP": {
      const followUp = action.question;
      const nextQuestions = [
        ...state.questions.slice(0, state.currentIndex + 1),
        followUp,
        ...state.questions.slice(state.currentIndex + 1),
      ];
      return {
        ...state,
        questions: nextQuestions,
        currentIndex: state.currentIndex + 1,
        followUpQueue: [],   // ← critical: prevents NEXT_QUESTION queue path
        screen: "interview",
      };
    }

    case "INTERVIEW_ENDED":
      return {
        ...state,
        results: [...state.results, ...action.remainingResults],
        screen: "summary",
      };

    case "RESTART":
      // "New Interview" from SummaryScreen — go back to role selection, reset everything.
      return { ...BASE_STATE, page: "practice", screen: "role" };

    case "RESTART_SAME": {
      // Restart uses the static bank for speed — variation comes from the
      // anti-repeat rotation already baked into buildSession().
      // Clear focusAreas and matchScore: the restarted interview uses static
      // questions so the tailored banner must not appear.
      const questions = buildSession(
        state.roleId,
        state.interviewType,
        state.questionCount,
        { experienceLevel: state.experienceLevel, difficulty: state.difficulty }
      );
      return {
        ...state,
        sessionId: action.sessionId,
        questions,
        currentIndex: 0,
        results: [],
        followUpQueue: [],
        focusAreas: null,
        matchScore: null,
        focusAreasFallback: null,
        screen: "interview",
      };
    }

    default:
      return state;
  }
}

function AppContent() {
  // Lazy initializer: try to restore an in-progress interview from localStorage.
  // Falls back to the last navigable page, then dashboard.
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    const active = loadActiveSession();
    if (active) {
      return {
        ...BASE_STATE,
        ...active,
        matchContext: null, // pre-interview context is not persisted
      };
    }
    const summary = loadSummarySession();
    if (summary) {
      return {
        ...BASE_STATE,
        ...summary,
        matchContext: null,
      };
    }
    return { ...BASE_STATE, page: getPersistedPage() };
  });
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  // Generating state: shown immediately after Start Interview is clicked,
  // replacing SetupScreen while /api/generate-questions runs.
  const [generatingMode, setGeneratingMode] = useState(null); // null | "tailored" | "regular"
  const [generateFailed, setGenerateFailed] = useState(false);
  const [lastGenerateArgs, setLastGenerateArgs] = useState(null);
  // Monotonic token: incremented every time generation is cancelled.
  // startInterview captures the token at call time and checks it before
  // dispatching START_INTERVIEW — stale async continuations bail out silently.
  const generationTokenRef = useRef(0);
  const { resetMode } = useAuth();

  // Auto-open auth modal when user arrives via a password-reset link
  useEffect(() => { if (resetMode) setShowAuth(true); }, [resetMode]);
  const { lang } = useLanguage();
  const { page, screen } = state;

  // Persist the active navigable page so refresh stays on the same page.
  // Practice pages are NOT persisted: refreshing mid-interview goes to dashboard.
  useEffect(() => {
    try {
      if (NAVIGABLE_PAGES.has(page)) {
        localStorage.setItem(PERSIST_PAGE_KEY, page);
      } else {
        // Keep the focused landing page as the destination after practice.
        localStorage.setItem(PERSIST_PAGE_KEY, "welcome");
      }
    } catch { /* ignore */ }
  }, [page]);

  // DEV: log every navigation change so the tailored-interview flow is traceable.
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log("[App] nav →", page, screen ?? "-", {
        roleId: state.roleId,
        hasMatchContext: !!state.matchContext,
        matchContextGaps: state.matchContext?.gaps?.length ?? 0,
        inferredRoleId: state.matchContext?.inferredRoleId ?? null,
      });
    }
  }, [page, screen, state.roleId, state.matchContext]);

  // Persist practice-flow state so browser refresh can restore the correct screen.
  // interview/feedback  → activeSession (live progress, current question index)
  // summary             → summarySession (completed results)
  // anything else       → clear both (navigated away / flow ended)
  useEffect(() => {
    if (page === "practice" && (screen === "interview" || screen === "feedback")) {
      saveActiveSession(state);
      clearSummarySession();
    } else if (page === "practice" && screen === "summary") {
      clearActiveSession();
      saveSummarySession(state);
    } else {
      clearActiveSession();
      clearSummarySession();
    }
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  const newSessionId = () =>
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

  const evaluationContext = {
    roleId: state.roleId,
    interviewType: state.interviewType,
    interviewerId: getInterviewerIdForType(state.interviewType === "mixed"
      ? state.questions[state.currentIndex]?.type
      : state.interviewType),
    questionNumber: state.currentIndex + 1,
    totalQuestions: state.questions.length,
  };

  /**
   * Generate questions via AI then dispatch START_INTERVIEW.
   * The overlay blocks the UI while generation runs (typically 1-3 s).
   * generateInterviewQuestions() never throws — it has an internal static fallback.
   */
  // Cancel any in-flight generation: invalidates the token so the async
  // continuation ignores its result, and resets UI state immediately.
  const cancelGeneration = useCallback(() => {
    generationTokenRef.current += 1;
    setGeneratingMode(null);
    setGenerateFailed(false);
  }, []);

  const startInterview = useCallback(async (args) => {
    const { roleId, interviewType, questionCount, interviewerId,
            experienceLevel, difficulty, sid, focusAreas, matchScore } = args;
    // Snapshot the current token. If cancelGeneration() is called while we
    // await, the token increments and we bail out before touching state.
    const token = generationTokenRef.current;
    // Clear any stale persisted session before starting a new one.
    clearActiveSession();
    // Show the generating screen immediately — replace SetupScreen before AI call.
    const mode = focusAreas?.length > 0 ? "tailored" : "regular";
    setGeneratingMode(mode);
    setGenerateFailed(false);
    setLastGenerateArgs(args);
    // Track success with a local flag to avoid stale-closure on generateFailed state.
    let succeeded = false;
    try {
      const questions = await generateInterviewQuestions({
        roleId,
        interviewType,
        count: questionCount,
        lang,
        experienceLevel,
        difficulty,
        focusAreas: focusAreas ?? null,
      });
      // If the user navigated away while we were awaiting, discard the result.
      if (token !== generationTokenRef.current) return;
      succeeded = true;
      // Read and clear the fallback metadata before dispatching.
      // _fallbackMeta is non-null only when AI failed during a tailored session.
      const fallbackMeta = questions._fallbackMeta ?? null;
      delete questions._fallbackMeta;
      dispatch({
        type: "START_INTERVIEW",
        interviewType,
        questionCount,
        interviewerId,
        experienceLevel,
        difficulty,
        sessionId: sid,
        questions,
        focusAreas: focusAreas ?? null,
        matchScore:  matchScore  ?? null,
        focusAreasFallback: fallbackMeta?.focusAreasDropped ?? null,
      });
    } catch (err) {
      if (token !== generationTokenRef.current) return; // already cancelled
      // generateInterviewQuestions() has an internal static-bank fallback and should
      // never throw — but if it does, show the error state with a retry option.
      console.error("[App] Question generation failed:", err);
      setGenerateFailed(true);
    } finally {
      // On success the dispatch(START_INTERVIEW) drives the screen change;
      // clear generatingMode so SetupScreen can re-render if the user goes back.
      // On error, leave generatingMode set — GeneratingScreen shows the error UI.
      // On cancel, cancelGeneration() already cleared it — skip to avoid re-setting.
      if (succeeded) setGeneratingMode(null);
    }
  }, [lang]);

  const submitAnswer = async (answer) => {
    if (isEvaluating) return;
    const question = state.questions[state.currentIndex];
    setIsEvaluating(true);
    try {
      const feedback = await evaluationClient.evaluateAnswer(
        question,
        answer,
        lang,
        evaluationContext
      );
      dispatch({ type: "ANSWER_EVALUATED", question, answer, feedback });
    } finally {
      setIsEvaluating(false);
    }
  };

  const endInterview = async () => {
    const remainingResults = await Promise.all(
      state.questions.slice(state.currentIndex).map(async (question) => ({
        question,
        answer: "",
        feedback: await evaluationClient.evaluateAnswer(question, "", lang),
      }))
    );
    dispatch({ type: "INTERVIEW_ENDED", remainingResults });
  };

  const navigate = (pageId) => {
    setSidebarOpen(false);
    cancelGeneration();
    if (pageId === "practice") {
      dispatch({ type: "GO_ROLE_SELECT" });
    } else {
      dispatch({ type: "NAVIGATE", page: pageId });
    }
  };

  const startPractice = () => navigate("practice");

  return (
    <>
      <AppHeader
        showBack={page !== "welcome"}
        onBack={() => {
          if (page === "practice") {
            if (screen === "setup") {
              // Cancel any in-flight generation so its result doesn't
              // force the user back into InterviewScreen after backing out.
              cancelGeneration();
              // In a tailored flow (matchContext present), Back should return to
              // Job Match — not role select — since the user started from there.
              if (state.matchContext) {
                dispatch({ type: "SET_MATCH_CONTEXT", matchContext: null });
                dispatch({ type: "NAVIGATE", page: "jobMatch" });
              } else {
                dispatch({ type: "BACK_TO_ROLE" });
              }
            } else {
              dispatch({ type: "GO_HOME" });
            }
          } else {
            // Non-practice pages return to the welcoming start screen.
            dispatch({ type: "NAVIGATE", page: "welcome" });
          }
        }}
        onLogoClick={() => { cancelGeneration(); dispatch({ type: "GO_HOME" }); }}
        onMenuToggle={() => setSidebarOpen((o) => !o)}
        onSignIn={() => setShowAuth(true)}
      />

      <div className="app-body">
        <AppSidebar
          currentPage={page}
          onNavigate={navigate}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSignIn={() => { setSidebarOpen(false); setShowAuth(true); }}
        />

        <div className="app-main">
          {page === "welcome" && (
            <WelcomeScreen
              onStart={startPractice}
              onDashboard={() => navigate("dashboard")}
              onJobMatch={() => navigate("jobMatch")}
            />
          )}
          {page === "dashboard" && (
            <HomeScreen
              onStart={startPractice}
              onSelectRole={(roleId) => dispatch({ type: "SELECT_ROLE", roleId })}
              onQuickStart={async ({ roleId, interviewType, questionCount, interviewerId, experienceLevel, difficulty }) => {
                if (generatingMode) return; // ignore double-click while generation is running
                dispatch({ type: "SELECT_ROLE", roleId });
                await startInterview({
                  roleId, interviewType, questionCount, interviewerId,
                  experienceLevel: experienceLevel ?? BASE_STATE.experienceLevel,
                  difficulty:      difficulty      ?? BASE_STATE.difficulty,
                  sid: newSessionId(),
                });
              }}
            />
          )}

          {page === "questionBank" && <QuestionBankScreen />}
          {page === "progress" && <ProgressScreen onStart={startPractice} />}
          {page === "resume" && <ResumeScreen />}
          {page === "jobMatch" && (
            <JobMatchScreen
              onStartTailored={(matchContext) => {
                const resolvedRoleId = matchContext.inferredRoleId ?? "general";
                if (import.meta.env.DEV) {
                  console.group("[tailored] ▶ Start Tailored Interview");
                  console.log("matchContext:", matchContext);
                  console.log("inferredRoleId:", matchContext.inferredRoleId, "→ resolvedRoleId:", resolvedRoleId);
                  console.log("gaps:", matchContext.gaps);
                  console.log("recommendedTopics:", matchContext.recommendedTopics);
                  console.log("focusAreas that will be sent:", [
                    ...(matchContext.gaps ?? []),
                    ...(matchContext.recommendedTopics ?? []),
                  ]);
                  console.log("dispatching: SET_MATCH_CONTEXT, then SELECT_ROLE →", resolvedRoleId, "(screen will become 'setup')");
                  console.groupEnd();
                }
                dispatch({ type: "SET_MATCH_CONTEXT", matchContext });
                // SELECT_ROLE sets screen:"setup" — user goes directly to SetupScreen,
                // skipping the generic role-select screen entirely.
                dispatch({ type: "SELECT_ROLE", roleId: resolvedRoleId });
              }}
            />
          )}
          {page === "settings" && <SettingsScreen />}

          {page === "practice" && screen === "role" && (
            <RoleSelectScreen
              onSelect={(roleId) => dispatch({ type: "SELECT_ROLE", roleId })}
              matchContext={state.matchContext}
            />
          )}

          {page === "practice" && screen === "setup" && generatingMode && (
            <GeneratingScreen
              isTailored={generatingMode === "tailored"}
              failed={generateFailed}
              onRetry={() => startInterview(lastGenerateArgs)}
            />
          )}

          {page === "practice" && screen === "setup" && !generatingMode && (
            <SetupScreen
              roleId={state.roleId}
              matchContext={state.matchContext}
              onStart={async ({ interviewType, questionCount, interviewerId, experienceLevel, difficulty }) => {
                const focusAreas = state.matchContext
                  ? [...(state.matchContext.gaps ?? []), ...(state.matchContext.recommendedTopics ?? [])]
                  : null;
                const matchScore = state.matchContext?.matchScore ?? null;
                // DEV: verify focusAreas is populated before clearing matchContext
                if (import.meta.env.DEV) {
                  console.log("[tailored] onStart — focusAreas being sent to generateInterviewQuestions:", focusAreas);
                }
                // Clear match context after use so subsequent interviews start fresh
                dispatch({ type: "SET_MATCH_CONTEXT", matchContext: null });
                await startInterview({
                  roleId: state.roleId,
                  interviewType,
                  questionCount,
                  interviewerId,
                  experienceLevel,
                  difficulty,
                  focusAreas,
                  matchScore,
                  sid: newSessionId(),
                });
              }}
            />
          )}

          {page === "practice" && screen === "interview" && (() => {
            const currentQ = state.questions[state.currentIndex];
            const isFollowUp = currentQ?.id?.startsWith("followup-") ?? false;
            // Count non-follow-up questions from start through currentIndex:
            // for a normal question this gives its 1-based position;
            // for a follow-up we count up to (not including) currentIndex
            // so progress stays frozen at the parent question's level.
            const normalQCount = state.questions
              .slice(0, state.currentIndex + (isFollowUp ? 0 : 1))
              .filter((q) => !q.id?.startsWith("followup-")).length;
            return (
              <InterviewScreen
                key={`${state.currentIndex}-${currentQ?.id}`}
                question={currentQ}
                isFollowUp={isFollowUp}
                normalQCount={normalQCount}
                originalTotal={state.questionCount}
                roleId={state.roleId}
                interviewerId={state.interviewerId}
                focusAreas={state.focusAreas}
                matchScore={state.matchScore}
                focusAreasFallback={state.focusAreasFallback}
                evaluating={isEvaluating}
                onSubmit={(answer) => submitAnswer(answer)}
                onSkip={() => submitAnswer("")}
                onEnd={() => endInterview()}
              />
            );
          })()}

          {page === "practice" && screen === "feedback" && (
            <FeedbackScreen
              result={state.results[state.results.length - 1]}
              isLast={state.currentIndex + 1 >= state.questions.length}
              onNext={() => {
                if (import.meta.env.DEV) {
                  console.log("[followUp] NEXT_QUESTION", {
                    currentIndex: state.currentIndex,
                    followUpQueueLength: state.followUpQueue.length,
                    nextQuestion: state.questions[state.currentIndex + 1]?.id ?? "(summary)",
                  });
                }
                dispatch({ type: "NEXT_QUESTION" });
              }}
              onPracticeFollowUp={(followUpQuestion) => {
                if (import.meta.env.DEV) {
                  console.log("[followUp] PRACTICE_FOLLOW_UP", {
                    currentIndex: state.currentIndex,
                    currentQuestionId: state.questions[state.currentIndex]?.id,
                    followUpId: followUpQuestion.id,
                    nextOriginalQuestionId: state.questions[state.currentIndex + 1]?.id ?? "(none — was last)",
                  });
                }
                dispatch({ type: "PRACTICE_FOLLOW_UP", question: followUpQuestion });
              }}
            />
          )}

          {page === "practice" && screen === "summary" && (
            <SummaryScreen
              results={state.results}
              roleId={state.roleId}
              interviewType={state.interviewType}
              interviewerId={state.interviewerId}
              questionCount={state.questionCount}
              experienceLevel={state.experienceLevel}
              difficulty={state.difficulty}
              sessionId={state.sessionId}
              focusAreas={state.focusAreas}
              onRestartSame={() => dispatch({ type: "RESTART_SAME", sessionId: newSessionId() })}
              onNewInterview={() => dispatch({ type: "RESTART" })}
              onHome={() => dispatch({ type: "GO_HOME" })}
            />
          )}
        </div>
      </div>

      {showAuth && (
        <AuthScreen onClose={() => setShowAuth(false)} />
      )}
      <DevAuthBanner />
      <AppFooter />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
