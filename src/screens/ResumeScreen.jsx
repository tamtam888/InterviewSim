import { useState, useEffect, useRef, useCallback } from "react";
import {
  Save, RotateCcw, Tag, ShieldCheck, UploadCloud,
  CheckCircle, AlertCircle, Loader, Cloud, CloudOff, LogIn,
} from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";
import { useAuth } from "../hooks/useAuth";
import { parseResumeFile } from "../lib/parseResume.js";
import {
  loadCandidateProfile,
  saveCandidateProfile,
  deleteCandidateProfile,
} from "../lib/candidateProfile.js";
import "../styles/ResumeScreen.css";

const STORAGE_KEY = "interviewsim.resumeText";

const STOPWORDS = new Set([
  "the","and","or","of","in","to","for","with","on","at","is","are","was",
  "were","be","been","by","as","from","this","that","it","we","our","you",
  "your","their","its","will","have","has","had","not","but","if","can",
  "do","did","so","than","then","when","which","who","what","how","all",
  "any","each","also","both","other","into","about","after","up","out",
  "over","such","a","an","my","am","me","he","she","they","them","his",
  "her","work","worked","using","used","based","new","years","year","team",
  "project","projects","experience","skills","responsible","responsibilities",
  "ability","strong","good","excellent",
]);

function extractKeywords(text) {
  if (!text.trim()) return [];
  const tokens = text.toLowerCase().match(/[a-z][a-z0-9+#.]{2,}/g) ?? [];
  const freq = {};
  for (const t of tokens) {
    if (!STOPWORDS.has(t)) freq[t] = (freq[t] ?? 0) + 1;
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([word]) => word);
}

function loadStored() {
  try { return localStorage.getItem(STORAGE_KEY) ?? ""; } catch { return ""; }
}

// Upload parse state
const UPLOAD_IDLE    = "idle";
const UPLOAD_PARSING = "parsing";
const UPLOAD_SUCCESS = "success";
const UPLOAD_ERROR   = "error";

// Cloud sync state
const SYNC_IDLE   = "idle";
const SYNC_SAVING = "saving";
const SYNC_SAVED  = "saved";
const SYNC_ERROR  = "error";

export default function ResumeScreen() {
  const { t } = useLanguage();
  const { user, configured } = useAuth();

  const [text, setText] = useState(loadStored);
  const [saved, setSaved] = useState(false);
  const [keywords, setKeywords] = useState(() => extractKeywords(loadStored()));

  const [uploadState, setUploadState] = useState(UPLOAD_IDLE);
  const [uploadError, setUploadError] = useState("");
  const [uploadFileName, setUploadFileName] = useState("");

  const [syncState, setSyncState] = useState(SYNC_IDLE);
  const [syncErrorDetail, setSyncErrorDetail] = useState("");
  const [lastSaved, setLastSaved] = useState(null);

  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Load cloud profile on mount when authenticated
  useEffect(() => {
    if (!user) return;
    loadCandidateProfile().then((profile) => {
      if (profile?.resume_text) {
        const local = loadStored();
        const noLocal = !local.trim();
        if (noLocal) {
          setText(profile.resume_text);
          setKeywords(extractKeywords(profile.resume_text));
          try { localStorage.setItem(STORAGE_KEY, profile.resume_text); } catch { /* ignore */ }
        }
        setLastSaved(new Date(profile.updated_at));
      }
    });
  }, [user]);

  // Persist to localStorage + Supabase
  const persistText = useCallback(async (newText) => {
    try { localStorage.setItem(STORAGE_KEY, newText); } catch { /* ignore */ }
    setKeywords(extractKeywords(newText));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

    if (user) {
      setSyncState(SYNC_SAVING);
      const result = await saveCandidateProfile({ resumeText: newText });
      if (result?.ok) {
        setSyncState(SYNC_SAVED);
        setLastSaved(new Date());
        setTimeout(() => setSyncState(SYNC_IDLE), 3000);
      } else {
        const detail = result?.code
          ? `[${result.code}] ${result.error}`
          : (result?.error ?? "unknown");
        setSyncErrorDetail(detail);
        setSyncState(SYNC_ERROR);
        setTimeout(() => { setSyncState(SYNC_IDLE); setSyncErrorDetail(""); }, 8000);
      }
    }
  }, [user]);

  // Full clear: wipes React state, localStorage, and Supabase row
  const handleClear = useCallback(async () => {
    // 1. Reset all React state immediately so the UI clears at once
    setText("");
    setKeywords([]);
    setSaved(false);
    setUploadState(UPLOAD_IDLE);
    setUploadFileName("");
    setUploadError("");
    setSyncState(SYNC_IDLE);
    setSyncErrorDetail("");
    setLastSaved(null);

    // 2. Clear localStorage
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }

    // 3. Delete Supabase row so refresh does not restore old resume
    if (user) {
      await deleteCandidateProfile();
    }
  }, [user]);

  const handleSave = () => persistText(text);

  // File processing
  const processFile = useCallback(async (file) => {
    if (!file) return;
    setUploadState(UPLOAD_PARSING);
    setUploadError("");
    setUploadFileName(file.name);

    try {
      const extracted = await parseResumeFile(file);
      if (!extracted.trim()) throw Object.assign(new Error("Empty"), { code: "empty" });

      setText(extracted);
      setUploadState(UPLOAD_SUCCESS);
      await persistText(extracted);
      // Auto-dismiss after 3 s — only if still in success state (not a new upload)
      setTimeout(() => setUploadState((s) => s === UPLOAD_SUCCESS ? UPLOAD_IDLE : s), 3000);
    } catch (err) {
      setUploadState(UPLOAD_ERROR);
      if (err.code === "docx_not_supported") {
        setUploadError(t("resumeUploadErrorDocx"));
      } else {
        setUploadError(t("resumeUploadErrorGeneric"));
      }
    }
  }, [persistText, t]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  const CloudStatus = () => {
    if (!user) return null;
    if (syncState === SYNC_SAVING) return (
      <span className="resume-cloud-sync sync-saving">
        <Loader size={12} aria-hidden="true" />{t("resumeCloudSaving")}
      </span>
    );
    if (syncState === SYNC_SAVED) return (
      <span className="resume-cloud-sync sync-saved">
        <Cloud size={12} aria-hidden="true" />{t("resumeCloudSaved")}
      </span>
    );
    if (syncState === SYNC_ERROR) return (
      <span className="resume-cloud-sync sync-error" title={syncErrorDetail}>
        <CloudOff size={12} aria-hidden="true" />{t("resumeCloudError")}
        {syncErrorDetail && import.meta.env.DEV && (
          <code style={{ marginInlineStart: 6, fontSize: "0.65rem", opacity: 0.85 }}>{syncErrorDetail}</code>
        )}
      </span>
    );
    if (lastSaved) return (
      <span className="resume-cloud-sync">
        <Cloud size={12} aria-hidden="true" />
        {t("resumeLastSaved")}: {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
    );
    return null;
  };

  return (
    <main className="screen container resume-page">
      <header className="screen-head">
        <h1 className="section-title">{t("resumeTitle")}</h1>
        <p className="screen-subtitle">{t("resumeSubtitle")}</p>
      </header>

      <div className="resume-privacy">
        <ShieldCheck size={15} aria-hidden="true" />
        <p>{t("resumePrivacyNote")}</p>
      </div>

      <div className="resume-layout">
        <section className="resume-editor-col">
          {/* Upload dropzone */}
          <div className="card resume-editor-card">
            <h2 className="resume-section-title">{t("resumeUploadTitle")}</h2>

            <div
              className={`resume-dropzone${dragOver ? " drag-over" : ""}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
                aria-label={t("resumeUploadAccept")}
              />
              <UploadCloud size={32} className="resume-dropzone-icon" aria-hidden="true" />
              <span className="resume-dropzone-text">{t("resumeUploadHint")}</span>
              <span className="resume-dropzone-btn">{t("resumeUploadAccept")}</span>
            </div>

            {uploadState === UPLOAD_PARSING && (
              <div className="resume-upload-status status-parsing">
                <Loader size={14} aria-hidden="true" />
                {t("resumeUploading")}
                {uploadFileName && <span style={{ opacity: 0.7 }}> &mdash; {uploadFileName}</span>}
              </div>
            )}
            {uploadState === UPLOAD_SUCCESS && (
              <div className="resume-upload-status status-success">
                <CheckCircle size={14} aria-hidden="true" />
                {t("resumeUploadSuccess")}
                {uploadFileName && <span style={{ opacity: 0.7 }}> &mdash; {uploadFileName}</span>}
              </div>
            )}
            {uploadState === UPLOAD_ERROR && (
              <div className="resume-upload-status status-error">
                <AlertCircle size={14} aria-hidden="true" />
                {uploadError}
              </div>
            )}
          </div>

          {/* Text editor */}
          <div className="card resume-editor-card">
            <h2 className="resume-section-title">{t("resumePasteLabel")}</h2>
            <textarea
              className="resume-textarea"
              value={text}
              onChange={(e) => { setText(e.target.value); setSaved(false); }}
              placeholder={t("resumeTextareaPlaceholder")}
              rows={20}
              spellCheck={false}
            />
            <div className="resume-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
                disabled={!text.trim()}
              >
                {saved
                  ? <CheckCircle size={16} aria-hidden="true" />
                  : <Save size={16} aria-hidden="true" />}
                {saved ? t("resumeSaved") : t("resumeSave")}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleClear}
                disabled={!text && uploadState === UPLOAD_IDLE && syncState === SYNC_IDLE && !lastSaved}
              >
                <RotateCcw size={15} aria-hidden="true" />
                {t("resumeClear")}
              </button>
            </div>
            <CloudStatus />

            {configured && !user && (
              <div className="resume-sync-nudge">
                <LogIn size={13} aria-hidden="true" />
                {t("resumeSignInToSync")}
              </div>
            )}
          </div>
        </section>

        <aside className="resume-keywords-col">
          <div className="card resume-keywords-card">
            <h2 className="resume-section-title">
              <Tag size={14} aria-hidden="true" />
              {t("resumeKeywordsTitle")}
            </h2>
            {keywords.length === 0 ? (
              <p className="resume-keywords-empty">{t("resumeKeywordsEmpty")}</p>
            ) : (
              <>
                <p className="resume-keywords-note">{t("resumeKeywordsNote")}</p>
                <div className="resume-keyword-chips">
                  {keywords.map((kw) => (
                    <span key={kw} className="resume-keyword-chip">{kw}</span>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="card resume-tip-card">
            <h2 className="resume-section-title">{t("resumeTipTitle")}</h2>
            <ul className="resume-tip-list">
              <li>{t("resumeTip1")}</li>
              <li>{t("resumeTip2")}</li>
              <li>{t("resumeTip3")}</li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
