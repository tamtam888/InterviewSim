import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

/**
 * Shown only in development when VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
 * are absent. Reminds the developer that auth is disabled.
 * Completely absent from production builds.
 */
export default function DevAuthBanner() {
  const { configured } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (configured || dismissed || !import.meta.env.DEV) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "16px",
        insetInlineEnd: "16px",
        zIndex: 9999,
        maxWidth: "340px",
        background: "#1e1b2e",
        color: "#e2d9f3",
        borderRadius: "12px",
        padding: "14px 16px",
        fontSize: "13px",
        lineHeight: "1.5",
        boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
      role="status"
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
        <strong style={{ color: "#c4a4ff", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Auth disabled — dev mode
        </strong>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          style={{ background: "none", border: "none", color: "#a89bc2", cursor: "pointer", padding: 0, fontSize: "16px", lineHeight: 1 }}
        >
          ×
        </button>
      </div>
      <p style={{ margin: "6px 0 0" }}>
        <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 4px", borderRadius: "4px", fontSize: "11px" }}>
          VITE_SUPABASE_URL
        </code>{" "}
        and{" "}
        <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 4px", borderRadius: "4px", fontSize: "11px" }}>
          VITE_SUPABASE_ANON_KEY
        </code>{" "}
        are missing from <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 4px", borderRadius: "4px", fontSize: "11px" }}>.env</code>.
      </p>
      <p style={{ margin: "6px 0 0", color: "#a89bc2" }}>
        Add them to enable sign-up / sign-in. See <strong>.env.example</strong> for instructions.
        Guest mode is fully active.
      </p>
    </div>
  );
}
