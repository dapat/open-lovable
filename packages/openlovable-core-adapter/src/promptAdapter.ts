import { PageSpec } from './spec'
import { renderLegacyHTML } from './render'
import { renderThemedHTML } from './renderThemed'
import { getPreset, applyPresetToSpec, ThemeName } from './presets'

/**
 * Stub LLM adapter: map any prompt to a deterministic PageSpec.
 * Later, replace this with a real LLM call.
 */
export async function promptToSpec(prompt: string): Promise<PageSpec> {
  // Naive, deterministic mapping for demo only
  const wantsKids = /kids|เด็ก/i.test(prompt)
  const wantsTestimonials = /testimonials?/i.test(prompt)
  const wantsPricing = /pricing|price|plan/i.test(prompt)
  const wantsFaq = /faq|questions?/i.test(prompt)
  const includeAll = !(wantsTestimonials || wantsPricing || wantsFaq)

  const title = wantsKids ? 'AI Math for Kids' : 'AI Product Landing'
  const subtitle = 'Generated from a single prompt using the PageSpec adapter'

  const spec: PageSpec = {
    title,
    subtitle,
    accent: '#3b82f6',
    hero: {
      headline: wantsKids ? 'Make Math Fun!' : 'Make It Real in Seconds',
      subheadline: wantsKids
        ? 'Interactive exercises for elementary school students'
        : 'Type a prompt → get a full landing page preview',
      ctaText: 'Get Started',
    },
    features: {
      title: wantsKids ? 'Why choose us?' : 'Highlights',
      items: wantsKids
        ? [
            { label: 'Interactive exercises', icon: '/icons/check.svg' },
            { label: 'Progress tracking', icon: '/icons/check.svg' },
            { label: 'Designed for kids', icon: '/icons/check.svg' },
          ]
        : [
            { label: 'Prompt → Spec → HTML', icon: '/icons/check.svg' },
            { label: 'Deterministic preview', icon: '/icons/check.svg' },
            { label: 'Export-ready output', icon: '/icons/check.svg' },
          ],
    },
    cta: {
      headline: wantsKids ? 'Start your free trial today!' : 'Ready to ship your page?',
      ctaText: wantsKids ? 'Sign Up' : 'Export Now',
    },
    footer: { smallprint: '© 2025 Flowgami – Demo only' },
  }

  if (wantsTestimonials || includeAll) {
    ;(spec as any).testimonials = {
      title: 'Loved by teams',
      items: [
        { quote: 'It just works.', author: 'Jane', avatar: '/avatars/jane.png' },
        { quote: 'Boosted our speed 10x.', author: 'Alex' },
      ],
    }
  }
  if (wantsPricing || includeAll) {
    ;(spec as any).pricing = {
      title: 'Simple pricing',
      plans: [
        { name: 'Starter', price: '$9/mo', features: ['1 project', 'Email support'] },
        { name: 'Pro', price: '$29/mo', features: ['Unlimited projects', 'Priority support'] },
      ],
    }
  }
  if (wantsFaq || includeAll) {
    ;(spec as any).faq = {
      title: 'FAQ',
      items: [
        { q: 'Can I export?', a: 'Yes, as HTML or Next.js.' },
        { q: 'Is there a free plan?', a: 'Yes, with basic features.' },
      ],
    }
  }

  return spec
}

// === New: detect Theme from prompt keywords
export function detectThemeFromPrompt(prompt: string): ThemeName | null {
  const p = (prompt || '').toLowerCase()
  if (/(playful|fun|vibrant|friendly|cute|kid|kids|youth)/.test(p)) return 'playful'
  if (/(elegant|sleek|refined|sophisticated|lux|premium)/.test(p)) return 'elegant'
  if (/(cyber|neon|matrix|hacker|terminal|green on black|futuristic)/.test(p)) return 'cyber'
  if (/(pastel|soft color|soft-colou?r|mint|peach|lavender)/.test(p)) return 'pastel'
  if (/(newspaper|editorial|monochrome|print|press|headline|serif)/.test(p)) return 'newspaper'
  if (/(glassmorphism|neon glass|glass|frosted|blur|glassy)/.test(p)) return 'neon-glass'
  if (/(minimal|minimalist|simple|clean)/.test(p)) return 'minimal'
  return null
}

// Overload signatures for backward compatibility
export async function generateFromPrompt(
  prompt: string,
  seed?: number,
  theme?: 'minimal' | 'playful' | 'elegant' | 'cyber'
): Promise<{ spec: any; html: string; seed: number; chosenTheme?: ThemeName; themeSource?: 'prompt' | 'explicit' | 'none' }>

export async function generateFromPrompt(
  prompt: string,
  seed?: number,
  theme?: 'minimal' | 'playful' | 'elegant' | 'cyber',
  themeTokens?: { accent?: string; radius?: string; font?: 'system' | 'inter' | 'serif' },
  autoStyle?: boolean
): Promise<{ spec: any; html: string; seed: number; chosenTheme?: ThemeName; themeSource?: 'prompt' | 'explicit' | 'none' }>

export async function generateFromPrompt(
  prompt: string,
  seed?: number,
  themeOrUndefined?: any,
  themeTokensOrUndefined?: any,
  autoStyleOrUndefined?: any
) {
  const spec = await promptToSpec(prompt)

  const actualSeed = typeof seed === 'number' && Number.isFinite(seed) ? seed : Math.floor(Math.random() * 100000)
  const hasSeed = typeof seed === 'number' && Number.isFinite(seed)

  const explicitTheme = themeOrUndefined as ThemeName | undefined
  const explicitTokens = themeTokensOrUndefined as { accent?: string; radius?: string; font?: any } | undefined
  const autoStyle = typeof autoStyleOrUndefined === 'boolean' ? autoStyleOrUndefined : true

  let chosenTheme: ThemeName | undefined
  let themeSource: 'prompt' | 'explicit' | 'none' = 'none'

  if (explicitTheme) {
    ;(spec as any).theme = explicitTheme
    if (explicitTokens) {
      ;(spec as any).themeTokens = { ...(spec as any).themeTokens, ...explicitTokens }
    }
    chosenTheme = explicitTheme
    themeSource = 'explicit'
  } else if (autoStyle) {
    const detected = detectThemeFromPrompt(prompt)
    if (detected) {
      const preset = getPreset(detected)
      if (preset) {
        const s2 = applyPresetToSpec(spec, preset)
        Object.assign(spec, s2)
        chosenTheme = detected
        themeSource = 'prompt'
      }
    }
  }

  if (hasSeed) {
    try {
      if (actualSeed % 2 === 0 && (spec as any).features?.items) {
        ;(spec as any).features.items = [...(spec as any).features.items].reverse()
      }
      if (actualSeed % 3 === 0 && (spec as any).pricing?.plans) {
        ;(spec as any).pricing.plans = seededShuffle([...(spec as any).pricing.plans], actualSeed)
      }
    } catch {}
  }

  const html = (spec as any).theme ? renderThemedHTML(spec) : renderLegacyHTML(spec)
  return { spec, html, seed: actualSeed, chosenTheme, themeSource }
}

// --- deterministic PRNG (mulberry32)
export function mulberry32(seed: number) {
  let t = seed >>> 0
  return function () {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

// --- seeded shuffle (Fisher–Yates)
export function seededShuffle<T>(arr: T[], seed: number): T[] {
  const rand = mulberry32(seed)
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

