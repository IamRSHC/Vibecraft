import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/** Serves /api/dragon during `npm run dev` with the same handler Vercel runs in production. */
function dragonDevApi(env: Record<string, string>): Plugin {
  return {
    name: 'dragon-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/dragon', async (req, res) => {
        const chunks: Buffer[] = []
        for await (const chunk of req) chunks.push(chunk as Buffer)
        const request = new Request('http://localhost/api/dragon', {
          method: req.method,
          headers: { 'content-type': req.headers['content-type'] ?? 'application/json' },
          body: req.method === 'POST' ? Buffer.concat(chunks) : undefined,
        })
        const { handleDragon } = await server.ssrLoadModule('/server/dragon.ts')
        const response: Response = await handleDragon(request, env)
        res.statusCode = response.status
        response.headers.forEach((value, name) => res.setHeader(name, value))
        res.end(Buffer.from(await response.arrayBuffer()))
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // '' prefix: the dev API also needs server-only vars like DRAGON_SECRET (never sent to the browser)
  plugins: [react(), dragonDevApi(loadEnv(mode, process.cwd(), ''))],
}))
