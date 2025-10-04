import { NextResponse } from 'next/server'
import path from 'node:path'
import fs from 'node:fs/promises'

async function readFirstExisting(paths: string[]) {
  for (const p of paths) {
    try {
      const raw = await fs.readFile(p, 'utf8')
      return raw
    } catch {}
  }
  throw new Error(`example.json not found in candidates: ${paths.join(', ')}`)
}

export async function GET() {
  try {
    const cwd = process.cwd()
    const candidates = [
      path.resolve(cwd, 'tests/specs/example.json'),
      path.resolve(cwd, '../../tests/specs/example.json'),
      path.resolve(cwd, '../../../tests/specs/example.json'),
    ]
    const raw = await readFirstExisting(candidates)
    const json = JSON.parse(raw)
    return NextResponse.json(json)
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message ?? err) }, { status: 400 })
  }
}
