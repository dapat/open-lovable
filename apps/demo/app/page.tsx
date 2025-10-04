import Link from 'next/link'
import path from 'node:path'
import fs from 'node:fs'
import { getCoreInfo } from '@flowgami/openlovable-core-adapter'

export default async function Page() {
  const info = await getCoreInfo()
  const coreExists = fs.existsSync(path.resolve(process.cwd(), '../../packages/openlovable-core'))

  return (
    <div className="space-y-4">
      {!coreExists && (
        <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-yellow-900">
          <strong>Warning:</strong> packages/openlovable-core ไม่พบในโปรเจกต์ (ยังรัน demo ได้ด้วย fallback)
        </div>
      )}
      <h1 className="text-2xl font-semibold">OpenLovable core detected</h1>
      <p className="text-sm text-slate-600">SHA: <code className="font-mono">{info.sha}</code></p>
      <p className="text-sm text-slate-600">Path: <code className="font-mono">{info.path}</code></p>
      {fs.existsSync(path.join(info.path, 'README.md')) && (
        <p>
          <Link href={path.relative(process.cwd(), path.join(info.path, 'README.md'))} className="text-blue-600 underline">
            Open core README
          </Link>
        </p>
      )}
      <div className="mt-6 space-x-4">
        <Link className="underline text-blue-600" href="/api/preview?example=true">
          🔍 Preview Example
        </Link>
        <Link className="underline text-blue-600" href="/api/health">
          💓 Health Check
        </Link>
      </div>
    </div>
  )
}
