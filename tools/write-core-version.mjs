#!/usr/bin/env node
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import fs from 'node:fs/promises'
import path from 'node:path'

const pExecFile = promisify(execFile)

async function main() {
  const coreDir = path.resolve(process.cwd(), 'packages/openlovable-core')
  const outFile = path.join(coreDir, 'CORE_VERSION')

  let sha = ''
  try {
    const { stdout } = await pExecFile('git', ['-C', coreDir, 'rev-parse', '--short', 'HEAD'])
    sha = stdout.trim()
  } catch {
    // ignore, no git available in prod or not a repo
  }

  if (!sha) sha = 'local-core'

  await fs.writeFile(outFile, sha + '\n', 'utf8')
  // eslint-disable-next-line no-console
  console.log(`[write-core-version] core SHA = ${sha} -> ${path.relative(process.cwd(), outFile)}`)
}

main().catch((err) => {
  console.error('[write-core-version] failed:', err)
  process.exit(0) // do not block install
})
