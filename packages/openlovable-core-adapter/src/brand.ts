import type { PageSpec } from './spec'

export type BrandThemeTokens = {
  accent?: string
  font?: 'system' | 'inter' | 'serif' | string
}

/** Parse meta & hints from raw HTML into BrandThemeTokens */
export function parseBrandTokensFromHTML(html: string): BrandThemeTokens {
  const tokens: BrandThemeTokens = {}

  // --- Accent color heuristics ---
  // 1) <meta name="theme-color" content="#...">
  const metaThemeColor =
    html.match(/<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']theme-color["']/i)?.[1]

  const colorCandidate = metaThemeColor || findFirstHexColor(html) || undefined
  if (colorCandidate) {
    const hex = toHexColor(colorCandidate)
    if (hex) tokens.accent = hex
  }

  // --- Font heuristics ---
  const googleFontsHref = html.match(/<link[^>]+href=["']([^"']*fonts\.googleapis\.com[^"']*)["'][^>]*>/i)?.[1]
  const family = googleFontsHref?.match(/family=([^:&]+)/i)?.[1] ?? ''
  const lower = decodeURIComponent(family).toLowerCase()

  const fontFromLink = lower.includes('inter')
    ? 'inter'
    : (lower.includes('merriweather') || lower.includes('georgia') || lower.includes('lora'))
      ? 'serif'
      : undefined

  // fallback by inline font-family hints
  const inlineFont = /font-family\s*:\s*([^;}{]+)/i.exec(html)?.[1]?.toLowerCase() ?? ''
  const fontFromInline = inlineFont.includes('inter')
    ? 'inter'
    : (inlineFont.includes('serif') || inlineFont.includes('georgia') || inlineFont.includes('merriweather'))
      ? 'serif'
      : undefined

  tokens.font = (fontFromLink || fontFromInline || 'system') as BrandThemeTokens['font']
  return tokens
}

/** Fetch the URL and return BrandThemeTokens using the parser */
export async function getBrandTokensFromURL(url: string, timeoutMs = 8000): Promise<BrandThemeTokens> {
  const safe = sanitizeUrl(url)
  if (!safe) return {}

  const ac = new AbortController()
  const id = setTimeout(() => ac.abort(), timeoutMs)

  const res = await fetch(safe, {
    headers: { 'User-Agent': 'Prompt-to-UI BrandBot/1.0' },
    signal: ac.signal,
    cache: 'no-store',
  }).catch(() => null)

  clearTimeout(id)
  if (!res || !res.ok) return {}
  const html = await res.text()
  return parseBrandTokensFromHTML(html)
}

// ---------- helpers ----------
function sanitizeUrl(u: string): string {
  try {
    const url = new URL(u)
    if (!/^https?:$/.test(url.protocol)) throw new Error('unsupported protocol')
    return url.toString()
  } catch {
    // if user typed without protocol
    try {
      const url = new URL(`https://${u}`)
      return url.toString()
    } catch {
      return ''
    }
  }
}

function findFirstHexColor(html: string): string | undefined {
  // finds first #rrggbb or #rgb
  const m = html.match(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/)
  return m?.[0]
}

function toHexColor(input: string): string | null {
  const s = input.trim().toLowerCase()
  if (/^#[0-9a-f]{6}\b/.test(s)) return s
  if (/^#[0-9a-f]{3}\b/.test(s)) {
    // expand #abc → #aabbcc
    const r = s[1], g = s[2], b = s[3]
    return `#${r}${r}${g}${g}${b}${b}`
  }
  // rgb/rgba(…)
  const rgb = s.match(/rgba?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i)
  if (rgb) {
    const [, r, g, b] = rgb
    const to2 = (n: number) => n.toString(16).padStart(2, '0')
    return `#${to2(clamp(+r))}${to2(clamp(+g))}${to2(clamp(+b))}`
  }
  return null
}
const clamp = (n: number) => Math.max(0, Math.min(255, n))
