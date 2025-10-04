import { NextRequest, NextResponse } from 'next/server'
import { PRESETS } from '@flowgami/openlovable-core-adapter'

export async function GET(_req: NextRequest) {
  return NextResponse.json({
    ok: true,
    presets: PRESETS.map((p) => ({
      id: p.id,
      label: p.label,
      description: p.description,
      theme: p.theme,
      themeTokens: p.themeTokens,
    })),
  })
}
