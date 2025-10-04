// tests/brand.test.ts
import { describe, it, expect } from 'vitest'
import { parseBrandTokensFromHTML } from '@flowgami/openlovable-core-adapter'

describe('brand parser (HTML → themeTokens)', () => {
  it('reads <meta name="theme-color"> as accent', () => {
    const html = `<meta name="theme-color" content="#ff00aa">`
    expect(parseBrandTokensFromHTML(html).accent).toBe('#ff00aa')
  })

  it('falls back to first hex color when no theme-color', () => {
    const html = `<style>body{background:#1e90ff}</style>`
    expect(parseBrandTokensFromHTML(html).accent).toBe('#1e90ff')
  })

  it('expands short hex #abc → #aabbcc', () => {
    const html = `<style>.c{color:#abc}</style>`
    expect(parseBrandTokensFromHTML(html).accent).toBe('#aabbcc')
  })

  it('maps Google Fonts Inter → font=inter', () => {
    const html = `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap">`
    expect(parseBrandTokensFromHTML(html).font).toBe('inter')
  })

  it('maps serif hints → font=serif', () => {
    const html = `<div style="font-family: Merriweather, serif">x</div>`
    expect(parseBrandTokensFromHTML(html).font).toBe('serif')
  })

  it('defaults to system when no hints', () => {
    expect(parseBrandTokensFromHTML('<html></html>').font).toBe('system')
  })

  it('accepts rgb()/rgba() color formats', () => {
    const html = `<meta name="theme-color" content="rgba(34, 139, 34, 0.9)">`
    expect(parseBrandTokensFromHTML(html).accent).toBe('#228b22') // forestgreen
  })
})
