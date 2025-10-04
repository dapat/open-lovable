[![Core Auto Update](https://github.com/dapat/open-lovable/actions/workflows/core-auto-update.yml/badge.svg)](https://github.com/dapat/open-lovable/actions/workflows/core-auto-update.yml)
[![Core Guard](https://github.com/dapat/open-lovable/actions/workflows/core-guard.yml/badge.svg)](https://github.com/dapat/open-lovable/actions/workflows/core-guard.yml)

# Flowgami Monorepo

> IMPORTANT: Do NOT modify files under `packages/openlovable-core/**`. This directory is treated as read-only (e.g., via Git submodule).

- Demo app: `apps/demo`
- Core adapter: `packages/openlovable-core-adapter`
- Core (read-only): `packages/openlovable-core`

## Dev

- Install: `pnpm install`
- Start demo: `pnpm dev` (http://localhost:3001)

### Quick links

- Preview example: http://localhost:3001/api/preview?example=true
- Health: http://localhost:3001/api/health

If `packages/openlovable-core` is missing, the demo will still run with a visible banner and will report `local-core` as the SHA.

## OpenLovable core – read-only (Git submodule)

This repository treats `packages/openlovable-core/` as a read-only Git submodule.

### Update submodule to latest upstream

```
git submodule update --remote --merge packages/openlovable-core
git add packages/openlovable-core
git commit -m "chore: update openlovable core to latest"
```

### Pin submodule to a specific SHA

```
cd packages/openlovable-core && git checkout <sha>
cd - && git add packages/openlovable-core
git commit -m "chore: pin openlovable core @ <sha>"
```

### Guardrails

- Commits that attempt to modify files under `packages/openlovable-core/**` are blocked by `.githooks/pre-commit`.
- If the submodule is dirty (status shows a leading `+`), commits are blocked with guidance on how to proceed.

### Production SHA availability

During `pnpm install`, the script `tools/write-core-version.mjs` writes the current core short SHA to `packages/openlovable-core/CORE_VERSION`. The adapter will read this file as a fallback when `.git` is unavailable (e.g., in production builds), ensuring `/api/health` can still report the core version.

## PageSpec – Spec fields reference

This repository converts a JSON spec (`PageSpec`) into HTML via the adapter under `packages/openlovable-core-adapter/`.

Schema source: `packages/openlovable-core-adapter/src/spec.ts`

### Shape

Required unless marked optional:

- `title: string`
- `subtitle?: string`
- `accent: string` (CSS color, e.g. `#3b82f6`)
- `hero: {`
  - `headline: string`
  - `subheadline?: string`
  - `ctaText?: string`
  - `}`
- `features: {`
  - `title: string`
  - `items: Array<string | { label: string; icon?: string }>`
  - `}`
- `testimonials?: {`
  - `title?: string`
  - `items: Array<{ quote: string; author?: string; avatar?: string }>`
  - `}`
- `pricing?: {`
  - `title?: string`
  - `plans: Array<{ name: string; price: string; features?: string[]; ctaText?: string; highlight?: boolean }>`
  - `}`
- `faq?: {`
  - `title?: string`
  - `items: Array<{ q: string; a: string }>`
  - `}`
- `cta: {`
  - `headline: string`
  - `ctaText: string`
  - `}`
- `footer: {`
  - `smallprint: string`
  - `}`

### Minimal example

```json
{
  "title": "My Landing",
  "accent": "#3b82f6",
  "hero": { "headline": "Hello" },
  "features": { "title": "Features", "items": ["Fast", "Simple"] },
  "cta": { "headline": "Try now", "ctaText": "Get Started" },
  "footer": { "smallprint": " 2025" }
}
```

### Full example (like tests/specs/example.json)

```json
{
  "title": "Flowgami Landing",
  "subtitle": "This is a subtitle",
  "accent": "#3b82f6",
  "hero": {
    "headline": "Build UIs from Specs",
    "subheadline": "Turn structured specs into production-ready UI previews",
    "ctaText": "Get Started"
  },
  "features": {
    "title": "Features",
    "items": [
      "Zod-validated schema",
      { "label": "Fast setup", "icon": "/icons/check.svg" },
      "HTML preview rendering",
      "Tailwind-based styling"
    ]
  },
  "testimonials": {
    "title": "What users say",
    "items": [
      { "quote": "This tool changed our workflow.", "author": "Jane", "avatar": "/avatars/jane.png" },
      { "quote": "Fast and reliable." }
    ]
  },
  "pricing": {
    "title": "Choose your plan",
    "plans": [
      { "name": "Starter", "price": "$0", "features": ["1 project", "Community support"], "ctaText": "Start Free" },
      { "name": "Pro", "price": "$19/mo", "features": ["Unlimited projects", "Priority support"], "ctaText": "Upgrade", "highlight": true }
    ]
  },
  "faq": {
    "title": "FAQ",
    "items": [
      { "q": "Can I export components?", "a": "Yes, Next.js and HTML zip are supported." },
      { "q": "Can I bring my own design tokens?", "a": "Token mapping is planned." }
    ]
  },
  "cta": {
    "headline": "Ship faster with Flowgami",
    "ctaText": "Try Now"
  },
  "footer": {
    "smallprint": " 2025 Flowgami. All rights reserved."
  }
}
```

### Preview API

- Use the example spec:
  - `GET /api/preview?example=true`
- Inject minimal CSS for local preview without Tailwind CDN:
  - `GET /api/preview?example=true&dev=1`
- Provide your own spec inline (URL-encode JSON):
  - `GET /api/preview?spec=<url-encoded-json>`

Notes

- The HTML renderer (`packages/openlovable-core-adapter/src/render.ts`) includes a Tailwind CDN tag, but if the CDN is blocked, use `dev=1` to inject minimal CSS just for preview. Tests and golden snapshots are not affected (they call `renderHTML()` directly).
- Static assets for the demo live in `apps/demo/public/` (e.g., `/icons/check.svg`, `/avatars/jane.png`).
- Do not modify files under `packages/openlovable-core/**` (read-only submodule).

## Core maintenance

This repository maintains `packages/openlovable-core/` as a read-only submodule. Updates are automated and safeguarded:

### Automated monthly update

- Workflow: `.github/workflows/core-auto-update.yml`
- Schedule: runs on the 1st of every month at 07:00 UTC
- What it does:
  - Checks out repo with submodules
  - Updates `packages/openlovable-core` to latest upstream (`git submodule update --init --remote --merge packages/openlovable-core`)
  - Commits submodule pointer if changed
  - Opens a PR using `peter-evans/create-pull-request`
- PR details:
  - Title: `chore(core): monthly auto-update openlovable-core submodule`
  - Branch: `chore/core-auto-update` (with timestamp suffix)
  - Labels: `dependencies`, `automated pr`

### Manual trigger

- From GitHub Actions UI, run workflow "Core Auto Update" (workflow_dispatch)
- The workflow skips PR creation if there are no submodule changes

### Guardrails (CI & local)

- CI: `.github/workflows/core-guard.yml` prevents direct modifications under `packages/openlovable-core/**`
- Local: `.githooks/pre-commit` blocks commits that attempt to modify files in the submodule or commit with a dirty submodule state

### Manual maintenance commands

- Update to latest upstream:

```bash
git submodule update --remote --merge packages/openlovable-core
git add packages/openlovable-core
git commit -m "chore: update openlovable core to latest"
```

- Pin to a specific SHA:

```bash
cd packages/openlovable-core && git checkout <sha>
cd - && git add packages/openlovable-core
git commit -m "chore: pin openlovable core @ <sha>"
```

### Troubleshooting

- Private upstream submodule: if the upstream requires authentication, configure a PAT in repository `secrets` and adjust the checkout/submodule steps to use that token
- Production SHA availability: see "Production SHA availability" above; `/api/health` reports the current core version even without `.git`
- Local dev: if the submodule folder is missing, the demo still runs and reports `local-core` as SHA with a visible banner

## CI ↔ Archon Integration

**Secrets ที่ต้องตั้งใน GitHub → Settings → Secrets and variables → Actions**
- `ARCHON_URL`  = `http://localhost:3737`  (หรือ URL ของ Archon MCP จริง)
- `ARCHON_TOKEN`  = API token ของ Archon MCP

**Workflows ที่เกี่ยวข้อง**
- **Core Auto Update**: `.github/workflows/core-auto-update.yml`   
  - ผูก externalId = `ops/core-update-<run_id>`   
  - task lifecycle: doing → review  
- **Archon – Close task on merge**: `.github/workflows/archon-close-on-merge.yml`   
  - เมื่อ PR ที่มี label `core-update`  ถูก merge → ปิด task (done)

**วิธี Trigger รอบอัปเดต**
1. ไปที่ **Actions → Core Auto Update → Run workflow**  
2. ถ้ามี diff → จะได้ PR พร้อม labels: `core-update, dependencies, automated pr`   
3. เมื่อ review เสร็จ → กด merge  
4. ระบบจะปิด task ใน Archon ให้อัตโนมัติ (done)

**ตรวจสุขภาพ**
- Task ใน Archon: doing → review → done  
- Endpoint เดโม:
  - Preview: `http://localhost:3001/api/preview?example=true`   
  - Health: `http://localhost:3001/api/health` 

**โน้ต**
- ถ้าไม่ได้ตั้ง Secrets → steps ฝั่ง Archon จะ `continue-on-error`  (workflow ไม่ล้ม แต่ task ไม่อัปเดต)
