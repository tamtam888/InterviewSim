import { useCallback, useEffect, useMemo, useState } from "react";
import { LanguageContext } from "./context";
import { STRINGS } from "./strings";

const LANG_KEY = "interviewsim.lang";

function getInitialLang() {
  try {
    const saved = window.localStorage.getItem(LANG_KEY);
    return saved === "he" || saved === "en" ? saved : "en";
  } catch {
    return "en";
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
    try {
      window.localStorage.setItem(LANG_KEY, lang);
    } catch {
      /* preference just won't persist */
    }
  }, [lang]);

  const t = useCallback(
    (key) => {
      const entry = STRINGS[key];
      if (!entry) return key;
      return entry[lang] ?? entry.en ?? key;
    },
    [lang]
  );

  const value = useMemo(
    () => ({ lang, setLang, t, isRTL: lang === "he" }),
    [lang, t]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}
