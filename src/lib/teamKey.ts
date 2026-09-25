// Team keys look like "CREEPER-482913": easy to read off a teammate's screen, hard to guess.
// Shared by the browser (admin "new key") and the server (/api/dragon team setup).
const WORDS = [
  'CREEPER', 'ENDER', 'BLAZE', 'GHAST', 'PIGLIN', 'WITHER', 'SLIME', 'GOLEM',
  'AXOLOTL', 'PHANTOM', 'WARDEN', 'SNIFFER', 'STRIDER', 'ALLAY', 'BREEZE', 'SHULKER',
] as const

/** `randomInt(n)` must return a uniformly random integer in [0, n). */
export function makeTeamKey(randomInt: (n: number) => number): string {
  const digits = String(randomInt(1_000_000)).padStart(6, '0')
  return `${WORDS[randomInt(WORDS.length)]}-${digits}`
}

/** "creeper 482913", "Creeper-482913 " → "CREEPER-482913". */
export function normalizeTeamKey(input: string): string {
  const compact = input.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const m = compact.match(/^([A-Z]+)(\d+)$/)
  return m ? `${m[1]}-${m[2]}` : compact
}
