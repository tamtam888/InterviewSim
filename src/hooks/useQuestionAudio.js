import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Plays exactly the displayed interview question. Prefer a natural AI voice,
 * falling back to the browser's built-in SpeechSynthesis on API errors.
 */
export function useQuestionAudio({ lang, questionText }) {
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef(null);
  const abortRef = useRef(null);
  const urlRef = useRef(null);
  const playIdRef = useRef(0);
  const canSpeak = typeof window !== "undefined" &&
    (typeof Audio !== "undefined" || "speechSynthesis" in window);

  const stopSpeech = useCallback(() => {
    playIdRef.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    audioRef.current?.pause();
    audioRef.current = null;
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  useEffect(() => () => {
    playIdRef.current += 1;
    abortRef.current?.abort();
    audioRef.current?.pause();
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    window.speechSynthesis?.cancel();
  }, [questionText, lang]);

  const speakWithBrowser = useCallback((text, playId) => {
    if (!("speechSynthesis" in window)) {
      setSpeaking(false);
      return;
    }
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const expected = lang === "he" ? "he-IL" : "en-US";
    utterance.lang = expected;
    const voices = synth.getVoices();
    const voice = voices.find((v) => v.lang.toLowerCase() === expected.toLowerCase())
      || voices.find((v) => v.lang.toLowerCase().startsWith(lang + "-"));
    if (voice) utterance.voice = voice;
    utterance.rate = 0.94;
    utterance.onend = utterance.onerror = () => {
      if (playIdRef.current === playId) setSpeaking(false);
    };
    synth.speak(utterance);
  }, [lang]);

  const speak = useCallback(async (overrideText = null) => {
    stopSpeech();
    const text = (overrideText ?? questionText)?.trim();
    if (!text) return;
    const currentId = playIdRef.current;
    setSpeaking(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const response = await fetch("/api/question-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lang }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("speech_unavailable");
      const blob = await response.blob();
      if (currentId !== playIdRef.current) return;
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = audio.onerror = () => {
        if (currentId === playIdRef.current) stopSpeech();
      };
      await audio.play();
    } catch (error) {
      if (currentId !== playIdRef.current || error?.name === "AbortError") return;
      // Browser speech remains available offline and when AI audio is unavailable.
      speakWithBrowser(text, currentId);
    }
  }, [lang, questionText, speakWithBrowser, stopSpeech]);

  return { canSpeak, speaking, speak, stopSpeech };
}
