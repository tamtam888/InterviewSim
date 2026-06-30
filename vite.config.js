import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Vite plugin: mounts all /api/* Express handlers directly on the Vite
 * dev server so no separate Express process or proxy is needed.
 *
 * In production (Vercel) the api/*.js serverless functions handle these
 * routes -- nothing changes there.
 */
function apiPlugin() {
  return {
    name: 'api-server',
    async configureServer(server) {
      // Load ALL .env vars (not just VITE_-prefixed) into process.env so
      // server-side code (OPENAI_API_KEY, SUPABASE_*) can read them.
      const env = loadEnv(server.config.mode, process.cwd(), '')
      Object.assign(process.env, env)

      const { default: express } = await import('express')
      const { rateLimit } = await import('express-rate-limit')
      const {
        handleHealth,
        handleEvaluateAnswer,
        handleSummarizeSession,
        handleAnalyzeMatch,
        handleGenerateQuestions,
        handleSaveSession,
        handleGetSessions,
      } = await import('./server/core.js')

      const app = express()
      app.use(express.json({ limit: '400kb' }))

      const mkLimit = (max) => rateLimit({ windowMs: 60000, max })

      app.get('/api/health',              handleHealth)
      app.post('/api/evaluate-answer',    mkLimit(60),  handleEvaluateAnswer)
      app.post('/api/summarize-session',  mkLimit(30),  handleSummarizeSession)
      app.post('/api/analyze-match',      mkLimit(15),  handleAnalyzeMatch)
      app.post('/api/generate-questions', mkLimit(20),  handleGenerateQuestions)
      app.post('/api/sessions',           mkLimit(30),  handleSaveSession)
      app.get('/api/sessions',            mkLimit(30),  handleGetSessions)

      // Mount Express app on Vite's connect dev server
      server.middlewares.use(app)

      console.log(
        '[api] routes mounted on Vite dev server |',
        'AI key:', process.env.OPENAI_API_KEY ? 'present' : 'MISSING -- AI will 503',
      )
    },
  }
}

export default defineConfig({
  plugins: [react(), apiPlugin()],
})
