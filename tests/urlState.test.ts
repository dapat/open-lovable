import { describe, it, expect } from 'vitest'
import { encodeStateToQuery, parseQueryToState, buildShareURL, UIState } from '../apps/demo/app/utils/urlState'

describe('urlState helpers', () => {
  it('round-trip explicit state (autoStyle=false) keeps theme & tokens', () => {
    const state: UIState = {
      prompt: ' Hello  ',
      seed: 123,
      autoStyle: false,
      theme: 'elegant',
      themeTokens: { accent: '#0ea5e9', radius: '12px', font: 'serif' },
      variationStrategy: 'both',
    }
    const q = encodeStateToQuery(state)
    expect(q).toContain('prompt=Hello')
    expect(q).toContain('seed=123')
    expect(q).toContain('autoStyle=0')
    expect(q).toContain('theme=elegant')
    expect(q).toContain('accent=%230ea5e9')
    expect(q).toContain('radius=12px')
    expect(q).toContain('font=serif')
    expect(q).toContain('variationStrategy=both')

    const parsed = parseQueryToState(q)
    expect(parsed).toEqual({
      prompt: 'Hello',
      seed: 123,
      autoStyle: false,
      theme: 'elegant',
      themeTokens: { accent: '#0ea5e9', radius: '12px', font: 'serif' },
      variationStrategy: 'both',
    })
  })

  it('autoStyle=true omits theme & tokens in query and decode drops them', () => {
    const state: UIState = {
      prompt: 'Landing',
      seed: 42,
      autoStyle: true,
      theme: 'playful',
      themeTokens: { accent: '#ff00ff', radius: '10px', font: 'inter' },
    }
    const q = encodeStateToQuery(state)
    expect(q).toContain('autoStyle=1')
    expect(q).not.toContain('theme=')
    expect(q).not.toContain('accent=')
    expect(q).not.toContain('radius=')
    expect(q).not.toContain('font=')

    const parsed = parseQueryToState(q)
    expect(parsed.autoStyle).toBe(true)
    expect(parsed.theme).toBeUndefined()
    expect(parsed.themeTokens).toBeUndefined()
  })

  it('parses booleans and numbers robustly', () => {
    const parsed1 = parseQueryToState('autoStyle=true&seed=100')
    expect(parsed1.autoStyle).toBe(true)
    expect(parsed1.seed).toBe(100)

    const parsed2 = parseQueryToState('autoStyle=0&seed=NaN')
    expect(parsed2.autoStyle).toBe(false)
    expect(parsed2.seed).toBeUndefined()
  })

  it('ignores blank prompt', () => {
    const parsed = parseQueryToState('prompt=%20%20%20')
    expect(parsed.prompt).toBeUndefined()
  })

  it('buildShareURL composes URL, replaces query, preserves hash', () => {
    const state: UIState = { prompt: 'Hello', autoStyle: true, seed: 1 }
    const url = buildShareURL('http://localhost:3001/playground#top', state)
    expect(url.startsWith('http://localhost:3001/playground?')).toBe(true)
    expect(url).toContain('prompt=Hello')
    expect(url).toContain('autoStyle=1')
    expect(url).toContain('#top')

    const url2 = buildShareURL('http://localhost:3001/playground?old=1#x', state)
    expect(url2).not.toContain('old=1')
    expect(url2).toContain('#x')
  })
})
