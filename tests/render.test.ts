import { describe, it, expect } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'
import { parseSpec, renderHTML } from '@flowgami/openlovable-core-adapter'

const root = process.cwd()

describe('Spec → HTML renderer', () => {
  it('renders example spec equal to golden HTML', async () => {
    const specPath = path.resolve(root, 'tests/specs/example.json')
    const goldenPath = path.resolve(root, 'tests/__golden__/example.html')

    const raw = await fs.readFile(specPath, 'utf8')
    const json = JSON.parse(raw)
    const spec = parseSpec(json)
    const html = renderHTML(spec)

    const golden = await fs.readFile(goldenPath, 'utf8')
    const normalize = (s: string) => s
      .replace(/\r\n/g, '\n')
      .replace(/^\s+/gm, '') // strip leading indentation per line
      .replace(/\s+$/gm, '') // strip trailing spaces per line
      .replace(/>\s+</g, '><') // collapse whitespace between tags
      .replace(/\s{2,}/g, ' ') // collapse runs of spaces
      .replace(/\n{2,}/g, '\n') // collapse multiple blank lines
      .trim()
    expect(normalize(html)).toBe(normalize(golden))
  })
})
