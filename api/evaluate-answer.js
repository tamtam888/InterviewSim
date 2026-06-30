/**
 * Vercel serverless function: POST /api/evaluate-answer
 * Reads OPENAI_API_KEY from Vercel environment variables (server-side only).
 */
import { handleEvaluateAnswer } from "../server/core.js";

export default async function handler(req, res) {
  return handleEvaluateAnswer(req, res);
}
