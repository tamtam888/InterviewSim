/**
 * Server-side OpenAI client. The API key is read from process.env only —
 * it never leaves this process and is never sent to the browser.
 */

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const DEFAULT_MODEL = "gpt-4o-mini";

export function hasApiKey() {
  return Boolean(process.env.OPENAI_API_KEY);
}

/**
 * Calls the chat completions API with a strict JSON schema so the response
 * is guaranteed to be parseable structured JSON.
 */
export async function completeJson({ system, user, schemaName, schema, maxTokens = 700, temperature = 0.4 }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const err = new Error("OPENAI_API_KEY is not configured");
    err.code = "missing_api_key";
    throw err;
  }

  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: {
        type: "json_schema",
        json_schema: { name: schemaName, strict: true, schema },
      },
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    const err = new Error(`OpenAI API error ${response.status}: ${body.slice(0, 300)}`);
    err.code = "openai_error";
    throw err;
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    const err = new Error("OpenAI returned an empty response");
    err.code = "openai_empty";
    throw err;
  }
  return JSON.parse(content);
}

export const EVALUATE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "score",
    "strengths",
    "improvements",
    "suggestedAnswer",
    "nextPracticeTip",
    "shouldAskFollowUp",
    "followUpQuestion",
    "followUpReason",
  ],
  properties: {
    score: { type: "integer", minimum: 0, maximum: 100 },
    strengths: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 3 },
    improvements: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 3 },
    suggestedAnswer: { type: "string" },
    nextPracticeTip: { type: "string" },
    shouldAskFollowUp: { type: "boolean" },
    followUpQuestion: { type: "string" },
    followUpReason: { type: "string" },
  },
};

export const SUMMARIZE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["overall", "summary", "recommendations"],
  properties: {
    overall: { type: "integer", minimum: 0, maximum: 100 },
    summary: { type: "string" },
    recommendations: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 3 },
  },
};

export const MATCH_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["matchScore", "strengths", "gaps", "recommendedTopics", "preparationPlan", "tailoredFocus"],
  properties: {
    matchScore: { type: "integer", minimum: 0, maximum: 100 },
    strengths: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 5 },
    gaps: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 5 },
    recommendedTopics: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 6 },
    preparationPlan: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 5 },
    tailoredFocus: { type: "string" },
  },
};

export const GENERATE_QUESTIONS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["questions"],
  properties: {
    questions: {
      type: "array",
      minItems: 1,
      maxItems: 12,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["text_en", "text_he", "type", "tip_en", "tip_he", "category", "difficulty", "tags", "focusAreaTag"],
        properties: {
          text_en:      { type: "string" },
          text_he:      { type: "string" },
          type:         { type: "string", enum: ["technical", "hr", "behavioral"] },
          tip_en:       { type: "string" },
          tip_he:       { type: "string" },
          category:     { type: "string" },
          difficulty:   { type: "string", enum: ["junior", "mid", "senior"] },
          tags:         { type: "array", items: { type: "string" }, minItems: 0, maxItems: 5 },
          focusAreaTag: { type: "string" },
        },
      },
    },
  },
};
