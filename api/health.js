/**
 * Vercel serverless function: GET /api/health
 * Reports whether the AI key is configured (never the key itself).
 */
import { handleHealth } from "../server/core.js";

export default function handler(req, res) {
  return handleHealth(req, res);
}
