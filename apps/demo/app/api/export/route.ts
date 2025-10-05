import { NextRequest, NextResponse } from 'next/server'
import { buildExportZip, generateFromPrompt } from '@flowgami/openlovable-core-adapter'

export async function POST(req: NextRequest) {
  try {
    const { prompt, seed, theme, themeTokens, autoStyle, styleMode, variationStrategy } = await req.json()
    const input = typeof prompt === 'string' && prompt.trim().length > 0 ? prompt : 'Landing page for AI Math SaaS for kids'
    const usedSeed = typeof seed === 'number' && Number.isFinite(seed) ? seed : undefined
    const result = await generateFromPrompt(input, usedSeed, theme, themeTokens, autoStyle, styleMode, variationStrategy)
    const { spec, html, seed: adapterSeed, chosenTheme, presetsVersion, variationStrategy: applied, themeSource } = result
    const zipBuffer = await buildExportZip({ spec, html, seed: adapterSeed, theme, themeTokens, variationStrategy: applied, styleMode, chosenTheme, presetsVersion })
    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'content-type': 'application/zip',
        'content-disposition': 'attachment; filename="export.zip"',
        'cache-control': 'no-store',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message ?? err) }, { status: 400 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const q = url.searchParams.get('prompt') || 'Landing page for AI Math SaaS for kids'
    const seedParam = url.searchParams.get('seed')
    const seed = seedParam != null ? Number(seedParam) : undefined
    const usedSeed = typeof seed === 'number' && Number.isFinite(seed) ? seed : undefined
    const theme = url.searchParams.get('theme') as any
    const autoStyleParam = url.searchParams.get('autoStyle')
    const autoStyle = autoStyleParam == null ? true : (autoStyleParam === 'true' || autoStyleParam === '1')
    const styleMode = (url.searchParams.get('styleMode') as 'auto' | 'explicit' | 'seeded' | null) || undefined
    const variationStrategy = url.searchParams.get('variationStrategy') as any
    const tokens = {
      accent: url.searchParams.get('accent') || undefined,
      radius: url.searchParams.get('radius') || undefined,
      font: (url.searchParams.get('font') as any) || undefined,
    }
    const result = await generateFromPrompt(q, usedSeed, theme, tokens, autoStyle, styleMode, variationStrategy)
    const { spec, html, seed: adapterSeed, chosenTheme, presetsVersion, variationStrategy: applied, themeSource } = result
    const zipBuffer = await buildExportZip({ spec, html, seed: adapterSeed, theme, themeTokens: tokens, variationStrategy: applied, styleMode, chosenTheme, presetsVersion })
    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'content-type': 'application/zip',
        'content-disposition': 'attachment; filename="export.zip"',
        'cache-control': 'no-store',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message ?? err) }, { status: 500 })
  }
}
