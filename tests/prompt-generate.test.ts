import { describe, it, expect } from 'vitest'
import { generateFromPrompt, renderHTML } from '@flowgami/openlovable-core-adapter'
import fs from 'node:fs/promises'
import path from 'node:path'

function normalizeHtml(s: string) {
  return s
    .replace(/\r\n/g, '\n')
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim()
}

describe('Prompt → Spec → HTML', () => {
  it('returns full landing (testimonials, pricing, faq) matching golden', async () => {
    const prompt = 'landing page with testimonials, pricing, faq'
    const { spec, html } = await generateFromPrompt(prompt)
    // sanity: spec contains blocks
    expect(spec.testimonials?.items?.length).toBeGreaterThan(0)
    expect(spec.pricing?.plans?.length).toBeGreaterThan(0)
    expect(spec.faq?.items?.length).toBeGreaterThan(0)

    const got = normalizeHtml(html)
    const goldenPath = path.resolve(process.cwd(), 'tests/__golden__/prompt-landing-full.html')
    const goldenRaw = await fs.readFile(goldenPath, 'utf8')
    const golden = normalizeHtml(goldenRaw)
    expect(got).toBe(golden)
  })

  it('returns default full landing when no keywords present', async () => {
    const prompt = 'landing page'
    const { spec, html } = await generateFromPrompt(prompt)

    // should include all three blocks by default
    expect(spec.testimonials?.items?.length).toBeGreaterThan(0)
    expect(spec.pricing?.plans?.length).toBeGreaterThan(0)
    expect(spec.faq?.items?.length).toBeGreaterThan(0)

    const minIds = ['id="hero"', 'id="features"', 'id="testimonials"', 'id="pricing"', 'id="faq"', 'id="cta"']
    for (const id of minIds) {
      expect(html.includes(id)).toBe(true)
    }
  })
})
