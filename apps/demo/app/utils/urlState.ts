// Pure helpers for encoding/decoding Playground UI state into URL query strings.
// No Next.js or DOM APIs used, safe for unit testing.

export type ThemeName = 'minimal' | 'playful' | 'elegant' | 'cyber'
export type FontToken = 'system' | 'inter' | 'serif'
export type VariationStrategy = 'none' | 'reverse-features' | 'shuffle-pricing' | 'both'

export interface ThemeTokens {
  accent?: string // hex color like #1e90ff
  radius?: string // e.g. "10px"
  font?: FontToken
}

export interface UIState {
  prompt?: string
  seed?: number
  theme?: ThemeName
  themeTokens?: ThemeTokens
  autoStyle?: boolean
  styleMode?: 'auto' | 'explicit' | 'seeded'
  variationStrategy?: VariationStrategy
}

/**
 * Build a URLSearchParams from UIState.
 * Notes:
 * - If autoStyle is true, theme and themeTokens are omitted (backend infers style from prompt).
 * - Undefined/empty values are omitted.
 */
export function encodeStateToQuery(state: UIState): string {
  const sp = new URLSearchParams()

  const trimmedPrompt = state.prompt?.trim()
  if (trimmedPrompt) sp.set('prompt', trimmedPrompt)

  if (typeof state.seed === 'number' && Number.isFinite(state.seed)) {
    sp.set('seed', String(state.seed))
  }

  const mode = state.styleMode ?? (state.autoStyle ? 'auto' : 'explicit')
  const auto = mode === 'auto'
  if (auto) {
    sp.set('autoStyle', '1')
    sp.set('styleMode', 'auto')
  } else if (state.autoStyle === false) {
    sp.set('autoStyle', '0')
    sp.set('styleMode', mode)
  }

  // Only include theme/tokens when not in auto style mode
  if (!auto && mode !== 'seeded') {
    if (state.theme) sp.set('theme', state.theme)
    if (state.themeTokens?.accent) sp.set('accent', state.themeTokens.accent)
    if (state.themeTokens?.radius) sp.set('radius', state.themeTokens.radius)
    if (state.themeTokens?.font) sp.set('font', state.themeTokens.font)
  }

  if (state.variationStrategy) {
    sp.set('variationStrategy', state.variationStrategy)
  }

  // Return without leading "?"
  return sp.toString()
}

/**
 * Parse query string or URLSearchParams into UIState.
 * - Accepts booleans as '1'/'0' or 'true'/'false' (case-insensitive).
 * - Coerces seed to number if finite; otherwise undefined.
 * - If autoStyle resolves to true, theme and themeTokens will be dropped.
 */
export function parseQueryToState(qs: string | URLSearchParams): UIState {
  const sp = typeof qs === 'string' ? new URLSearchParams(qs.startsWith('?') ? qs.slice(1) : qs) : qs

  const getBool = (key: string): boolean | undefined => {
    if (!sp.has(key)) return undefined
    const v = sp.get(key)?.toLowerCase()
    if (v === '1' || v === 'true') return true
    if (v === '0' || v === 'false') return false
    return undefined
  }

  const state: UIState = {}

  const prompt = sp.get('prompt') ?? undefined
  if (prompt && prompt.trim().length > 0) state.prompt = prompt

  const seedRaw = sp.get('seed')
  if (seedRaw != null && seedRaw !== '') {
    const n = Number(seedRaw)
    if (Number.isFinite(n)) state.seed = n
  }

  const autoStyle = getBool('autoStyle')
  if (typeof autoStyle !== 'undefined') state.autoStyle = autoStyle

  const styleMode = (sp.get('styleMode') as 'auto' | 'explicit' | 'seeded' | null) || null
  if (styleMode) state.styleMode = styleMode
  if (!styleMode && typeof state.autoStyle === 'boolean') {
    state.styleMode = state.autoStyle ? 'auto' : 'explicit'
  }

  const theme = sp.get('theme') as ThemeName | null
  const accent = sp.get('accent') ?? undefined
  const radius = sp.get('radius') ?? undefined
  const font = sp.get('font') as FontToken | null

  const variationStrategy = sp.get('variationStrategy') as VariationStrategy | null
  if (variationStrategy) state.variationStrategy = variationStrategy

  // If autoStyle=true OR styleMode=seeded, ignore explicit theme/tokens (frontend will derive)
  const allowExplicit = !(autoStyle === true || styleMode === 'seeded')

  if (allowExplicit) {
    if (theme) state.theme = theme
    const tokens: ThemeTokens = {}
    if (accent) tokens.accent = accent
    if (radius) tokens.radius = radius
    if (font) tokens.font = font
    if (Object.keys(tokens).length > 0) state.themeTokens = tokens
  }

  return state
}

/**
 * Build a full shareable URL by appending the encoded query to a base URL.
 * If base already has a query, it will be replaced.
 */
export function buildShareURL(baseUrl: string, state: UIState): string {
  const q = encodeStateToQuery(state)
  const hasHash = baseUrl.includes('#') ? baseUrl.indexOf('#') : -1
  const [beforeHash, hash] = hasHash >= 0 ? [baseUrl.slice(0, hasHash), baseUrl.slice(hasHash)] : [baseUrl, '']
  const baseNoQuery = beforeHash.split('?')[0]
  const sep = baseNoQuery.includes('?') ? '' : '?'
  return `${baseNoQuery}${sep}${q}${hash}`
}
