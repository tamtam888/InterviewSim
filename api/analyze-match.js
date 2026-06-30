import { handleAnalyzeMatch } from "../server/core.js";

export default async function handler(req, res) {
  return handleAnalyzeMatch(req, res);
}
