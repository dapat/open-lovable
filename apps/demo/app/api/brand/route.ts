import { NextRequest, NextResponse } from 'next/server'
import { getBrandTokensFromURL } from '@flowgami/openlovable-core-adapter'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ ok: false, error: 'Missing url' }, { status: 400 })
    }
    const themeTokens = await getBrandTokensFromURL(url)
    return NextResponse.json({ ok: true, themeTokens }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message ?? err) }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const u = new URL(req.url)
    const url = u.searchParams.get('url')
    if (!url) return NextResponse.json({ ok: false, error: 'Missing url' }, { status: 400 })
    const themeTokens = await getBrandTokensFromURL(url)
    return NextResponse.json({ ok: true, themeTokens }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message ?? err) }, { status: 500 })
  }
}
