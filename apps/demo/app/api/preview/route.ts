import { NextResponse } from 'next/server'
import path from 'node:path'
import fs from 'node:fs/promises'
import { parseSpec, renderHTML } from '@flowgami/openlovable-core-adapter'

function injectDevCss(html: string) {
  const devStyles = `\n<style>
        :root { --slate-100: #f1f5f9; --slate-200: #e2e8f0; --slate-800: #1f2937; --blue-500: #3b82f6; }
        * { box-sizing: border-box; }
        body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Noto Sans, "Apple Color Emoji", "Segoe UI Emoji"; color: var(--slate-800); }
        main { max-width: 960px; margin: 0 auto; padding: 24px; }
        h1 { font-size: 2rem; margin-bottom: 0.25rem; }
        h2 { font-size: 1.25rem; margin: 0.25rem 0 0.5rem; }
        .hero .subheadline { color: #475569; margin: 0.25rem 0 0.5rem; }
        button { background: var(--blue-500); color: white; border: 0; padding: 8px 14px; border-radius: 8px; cursor: pointer; }
        .features .grid { display: grid; gap: 8px; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
        .features li { list-style: disc; margin-left: 1.25rem; }
        .testimonials .cards { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
        .testimonials .card { border: 1px solid var(--slate-200); border-radius: 10px; padding: 12px; background: white; }
        .testimonials footer { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
        .testimonials footer img { width: 40px; height: 40px; border-radius: 9999px; border: 2px solid var(--slate-200); background: #fff; object-fit: cover; }
        .pricing .plans { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
        .pricing .plan { border: 1px solid var(--slate-200); border-radius: 10px; padding: 12px; }
        .pricing .plan.highlight { border-color: var(--blue-500); box-shadow: 0 0 0 2px rgba(59,130,246,0.15); }
        .pricing .price { font-weight: 600; margin: 6px 0; }
        .faq dt { font-weight: 600; margin-top: 8px; }
        .faq dd { margin: 4px 0 8px 0; color: #334155; }
        .cta { text-align: center; padding-top: 6px; }
      </style>\n`
  return html.replace('</head>', `${devStyles}</head>`)
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const isExample = url.searchParams.get('example') === 'true'
    const isDevPreview = url.searchParams.get('dev') === '1'

    let specData: unknown
    if (isExample) {
      const p = path.resolve(process.cwd(), '../../tests/specs/example.json')
      const raw = await fs.readFile(p, 'utf8')
      specData = JSON.parse(raw)
    } else {
      const specParam = url.searchParams.get('spec')
      if (!specParam) {
        return NextResponse.json({ ok: false, error: 'spec or example=true required' }, { status: 400 })
      }
      specData = JSON.parse(specParam)
    }

    const spec = parseSpec(specData)
    let html = renderHTML(spec)

    // Dev-only minimal CSS injection for nicer preview without Tailwind
    // This does NOT affect tests, since tests call renderHTML() directly.
    if (isDevPreview) {
      html = injectDevCss(html)
    }
    return new Response(html, {
      status: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message ?? err) }, { status: 400 })
  }
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url)
    const isDevPreview = url.searchParams.get('dev') === '1'

    const raw = await req.text()
    const specData = JSON.parse(raw)

    const spec = parseSpec(specData)
    let html = renderHTML(spec)

    if (isDevPreview) {
      html = injectDevCss(html)
    }

    return new Response(html, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message ?? err) }, { status: 400 })
  }
}
