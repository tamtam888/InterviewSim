import { handleSaveSession, handleGetSessions } from "../server/core.js";

export default async function handler(req, res) {
  if (req.method === "POST") return handleSaveSession(req, res);
  if (req.method === "GET")  return handleGetSessions(req, res);
  return res.status(405).json({ error: "method_not_allowed" });
}
