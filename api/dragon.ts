// Vercel Function: /api/dragon. All logic lives in server/dragon.ts (also used by `npm run dev`).
import { handleDragon } from '../server/dragon.js'

export function GET(request: Request) {
  return handleDragon(request, process.env)
}

export function POST(request: Request) {
  return handleDragon(request, process.env)
}
