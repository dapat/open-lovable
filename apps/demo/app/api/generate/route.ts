import { NextRequest, NextResponse } from 'next/server'
import { generateFromPrompt } from '@flowgami/openlovable-core-adapter'

export async function POST(req: NextRequest) {
  try {
    const { prompt, seed, theme, themeTokens, autoStyle } = await req.json()
    const input = typeof prompt === 'string' && prompt.trim().length > 0 ? prompt : 'Landing page for AI Math SaaS for kids'
    const usedSeed = typeof seed === 'number' && Number.isFinite(seed) ? seed : undefined
    const result = await generateFromPrompt(input, usedSeed, theme, themeTokens, autoStyle)
    // Return the adapter's seed (may be randomly generated inside adapter)
    return NextResponse.json(result, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message ?? err) }, { status: 400 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const q = url.searchParams.get('prompt') || 'Landing page for AI Math SaaS for kids'
    const seedParam = url.searchParams.get('seed')
    const theme = url.searchParams.get('theme') as any
    const autoStyleParam = url.searchParams.get('autoStyle')
    const autoStyle = autoStyleParam == null ? true : autoStyleParam === 'true'
    const tokens = {
      accent: url.searchParams.get('accent') || undefined,
      radius: url.searchParams.get('radius') || undefined,
      font: (url.searchParams.get('font') as any) || undefined,
    }
    const seed = seedParam != null ? Number(seedParam) : undefined
    const usedSeed = typeof seed === 'number' && Number.isFinite(seed) ? seed : undefined
    const result = await generateFromPrompt(q, usedSeed, theme, tokens, autoStyle)
    // Return the adapter's seed (may be randomly generated inside adapter)
    return NextResponse.json(result, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message ?? err) }, { status: 500 })
  }
}

