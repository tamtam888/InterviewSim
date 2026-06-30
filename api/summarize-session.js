/**
 * Vercel serverless function: POST /api/summarize-session
 */
import { handleSummarizeSession } from "../server/core.js";

export default async function handler(req, res) {
  return handleSummarizeSession(req, res);
}
