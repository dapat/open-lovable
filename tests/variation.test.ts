import { describe, it, expect } from 'vitest'
import { loadAsync as loadZipAsync } from 'jszip'
import {
  mulberry32,
  seededShuffle,
  promptToSpec,
  generateFromPrompt,
} from '@flowgami/openlovable-core-adapter'
import { GET as generateGET, POST as generatePOST } from '../apps/demo/app/api/generate/route'
import { GET as exportGET, POST as exportPOST } from '../apps/demo/app/api/export/route'

const PROMPT = 'Landing page for AI Math SaaS for kids'

describe('PRNG and seeded shuffle (deterministic)', () => {
  it('mulberry32(seed) is stable for the same seed', () => {
    const a = mulberry32(123)
    const b = mulberry32(123)
    // compare first 5 numbers
    for (let i = 0; i < 5; i++) {
      expect(a()).toBeCloseTo(b())
    }
  })

  it('mulberry32(seedA) != mulberry32(seedB) on first value (usually)', () => {
    const a = mulberry32(1)
    const b = mulberry32(2)
    expect(a()).not.toBeCloseTo(b())
  })

  it('seededShuffle(array, seed) is stable for same seed and differs for different seeds', () => {
    const base = [1, 2, 3, 4, 5, 6]
    const s1a = seededShuffle(base, 42)
    const s1b = seededShuffle(base, 42)
    const s2 = seededShuffle(base, 7)

    expect(s1a).toEqual(s1b)
    expect(s1a).not.toEqual(s2)
    // original array not mutated
    expect(base).toEqual([1, 2, 3, 4, 5, 6])
  })
})

describe('Adapter generateFromPrompt(prompt, seed) – deterministic variations', () => {
  it('seed=2 reverses features.items compared to baseline', async () => {
    const baselineSpec = await promptToSpec(PROMPT)
    const { spec: s2 } = await generateFromPrompt(PROMPT, 2)

    const baseItems = (baselineSpec as any).features.items
    const reversed = [...baseItems].reverse()
    expect((s2 as any).features.items).toEqual(reversed)
  })

  it('seed=3 shuffles pricing.plans deterministically', async () => {
    const baselineSpec = await promptToSpec(PROMPT)
    const { spec: s3 } = await generateFromPrompt(PROMPT, 3)

    const basePlans = (baselineSpec as any).pricing.plans
    const expected = seededShuffle(basePlans, 3)
    expect((s3 as any).pricing.plans).toEqual(expected)
  })

  it('seed=6 triggers both reverse and shuffle', async () => {
    const baselineSpec = await promptToSpec(PROMPT)
    const { spec: s6 } = await generateFromPrompt(PROMPT, 6)

    const baseItems = (baselineSpec as any).features.items
    const reversed = [...baseItems].reverse()
    expect((s6 as any).features.items).toEqual(reversed)

    const basePlans = (baselineSpec as any).pricing.plans
    const expected = seededShuffle(basePlans, 6)
    expect((s6 as any).pricing.plans).toEqual(expected)
  })

  it('omitted seed returns a numeric seed in response', async () => {
    const { seed } = await generateFromPrompt(PROMPT)
    expect(typeof seed).toBe('number')
  })
})

describe('API /api/generate – deterministic with seed', () => {
  it('GET includes seed and stable html for same seed', async () => {
    const req1: any = { url: `http://localhost/api/generate?prompt=${encodeURIComponent(PROMPT)}&seed=123` }
    const res1 = await generateGET(req1)
    const data1 = await (res1 as Response).json()

    expect(data1.seed).toBe(123)
    expect(typeof data1.html).toBe('string')

    const req2: any = { url: `http://localhost/api/generate?prompt=${encodeURIComponent(PROMPT)}&seed=123` }
    const res2 = await generateGET(req2)
    const data2 = await (res2 as Response).json()

    expect(data2.seed).toBe(123)
    expect(data2.html).toBe(data1.html)
  })

  it('POST includes seed and is honored', async () => {
    const req: any = { json: async () => ({ prompt: PROMPT, seed: 456 }) }
    const res = await generatePOST(req)
    const data = await (res as Response).json()
    expect(data.seed).toBe(456)
  })
})

describe('API /api/export – ZIP reproducibility with seed', () => {
  it('GET returns ZIP with README containing Seed and page.html stable for same seed', async () => {
    const url = `http://localhost/api/export?prompt=${encodeURIComponent(PROMPT)}&seed=789`
    const res1 = await exportGET({ url } as any)
    const buf1 = Buffer.from(await (res1 as Response).arrayBuffer())

    const res2 = await exportGET({ url } as any)
    const buf2 = Buffer.from(await (res2 as Response).arrayBuffer())

    expect(buf2.equals(buf1)).toBe(true) // entire ZIP bytes equal (strongest check)

    const zip = await loadZipAsync(buf1)
    const readme = await zip.file('README.md')!.async('string')
    expect(readme).toMatch(/Seed:\s*789/) // README shows seed

    const pageHtml = await zip.file('page.html')!.async('string')
    expect(typeof pageHtml).toBe('string')
    expect(pageHtml.length).toBeGreaterThan(0)
  })
})
