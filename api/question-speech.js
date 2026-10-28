/**
 * Optional high-quality question narration via OpenAI Speech API.
 * Every generated voice is AI-generated. Never expose the API key to the browser.
 * Call costs are incurred only after users press Listen.
 */
const windows = new Map();
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });
  res.setHeader("Cache-Control", "no-store");
  const key = process.env.OPENAI_API_KEY;
  if (!key || process.env.AI_TTS_ENABLED === "false") {
    return res.status(503).json({ error: "voice_unavailable" });
  }
  const ip = String(req.headers?.["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0];
  const now = Date.now();
  const prev = windows.get(ip);
  const bucket = prev && prev.until > now ? prev : { count: 0, until: now + 60000 };
  windows.set(ip, bucket);
  if (++bucket.count > 10) return res.status(429).json({ error: "rate_limited" });
  if (windows.size > 1000) {
    for (const [candidate, item] of windows) if (item.until < now) windows.delete(candidate);
  }

  const { text, lang } = req.body ?? {};
  if (typeof text !== "string" || text.trim().length < 8 || text.length > 900 ||
      !["en", "he"].includes(lang)) {
    return res.status(400).json({ error: "invalid_input" });
  }
  try {
    const result = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice: "marin",
        input: text.trim(),
        response_format: "mp3",
        instructions: lang === "he"
          ? "Speak ONLY in Israeli Hebrew with natural conversational intonation, clear pauses and relaxed pacing. You are a warm, professional interviewer. Read the supplied interview question verbatim, including any English technical terms as normally pronounced in Israeli tech interviews. Do not translate, add introductions, explain, answer or paraphrase the question."
          : "Speak naturally as a calm professional job interviewer. Read the provided question exactly as written; do not add, change, translate or explain anything.",
      }),
      signal: AbortSignal.timeout(18000),
    });
    if (!result.ok) {
      console.error("[question-speech] upstream status:", result.status);
      return res.status(503).json({ error: "voice_unavailable" });
    }
    const audio = Buffer.from(await result.arrayBuffer());
    if (!audio.length || audio.length > 2000000) return res.status(503).json({ error: "voice_unavailable" });
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("X-Voice-Engine", "ai");
    res.setHeader("Content-Length", String(audio.length));
    return res.status(200).send(audio);
  } catch (err) {
    console.error("[question-speech] unavailable:", err?.message);
    return res.status(503).json({ error: "voice_unavailable" });
  }
}
