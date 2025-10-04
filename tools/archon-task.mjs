#!/usr/bin/env node
// Minimal Archon task CLI: create/update tasks via ARCHON_URL + ARCHON_TOKEN
// Usage examples:
// node tools/archon-task.mjs create --title "..." --project "Prompt-to-UI" --status todo --labels core,maintenance --externalId ops/core-update-123 --description "..."
// node tools/archon-task.mjs update --externalId ops/core-update-123 --status review

import fs from 'node:fs'
import path from 'node:path'

const ARCHON_URL = process.env.ARCHON_URL || ''
const ARCHON_TOKEN = process.env.ARCHON_TOKEN || ''

function die(msg, code = 1) {
  console.error(`[archon-task] ${msg}`)
  process.exit(code)
}

function readProjectManifest() {
  const p = path.resolve(process.cwd(), '.archon/project.json')
  if (!fs.existsSync(p)) return null
  try {
    const raw = fs.readFileSync(p, 'utf8')
    return JSON.parse(raw)
  } catch (e) {
    return null
  }
}

function parseArgs(argv) {
  const args = { _: [] }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith('--')) {
      const key = a.slice(2)
      const val = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true
      args[key] = val
    } else {
      args._.push(a)
    }
  }
  return args
}

async function http(method, url, body) {
  const headers = { 'content-type': 'application/json' }
  if (ARCHON_TOKEN) headers['authorization'] = `Bearer ${ARCHON_TOKEN}`
  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined })
  const text = await res.text()
  let json
  try { json = JSON.parse(text) } catch { json = { raw: text } }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`)
  }
  return json
}

async function main() {
  const args = parseArgs(process.argv)
  const cmd = args._[0]
  if (!cmd) die('missing command: create | update')

  const manifest = readProjectManifest()
  if (!manifest) die('missing .archon/project.json')

  if (!ARCHON_URL) die('ARCHON_URL is not set in environment')

  if (cmd === 'create') {
    const title = args.title || die('missing --title')
    const description = args.description || ''
    const projectName = args.project || manifest.name
    const status = args.status || 'todo'
    const labels = (args.labels || '').split(',').filter(Boolean)
    const externalId = args.externalId || ''

    const body = {
      title,
      description,
      status,
      labels,
      externalId,
      project_id: manifest.project_id,
      project_name: projectName,
      github_repo: manifest.github_repo || undefined,
    }
    try {
      const json = await http('POST', `${ARCHON_URL}/tasks/create`, body)
      console.log(JSON.stringify(json))
    } catch (e) {
      die(`create failed: ${e.message}`)
    }
    return
  }

  if (cmd === 'update') {
    const externalId = args.externalId || die('missing --externalId')
    const status = args.status || die('missing --status')
    const body = { externalId, status, project_id: manifest.project_id }
    try {
      const json = await http('POST', `${ARCHON_URL}/tasks/update`, body)
      console.log(JSON.stringify(json))
    } catch (e) {
      die(`update failed: ${e.message}`)
    }
    return
  }

  die(`unknown command: ${cmd}`)
}

main().catch(e => die(e.message))
