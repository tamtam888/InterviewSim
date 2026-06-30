/**
 * Vercel serverless function: POST /api/generate-questions
 * Generates varied, realistic interview questions via OpenAI.
 * The API key lives only in server env — never sent to the browser.
 */
import { handleGenerateQuestions } from "../server/core.js";

export default async function handler(req, res) {
  return handleGenerateQuestions(req, res);
}
