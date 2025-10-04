import { NextResponse } from 'next/server'
import { getCoreInfo } from '@flowgami/openlovable-core-adapter'

export async function GET() {
  const info = await getCoreInfo()
  return NextResponse.json({ ok: true, core: info.sha })
}
