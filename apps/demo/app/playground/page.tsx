"use client"

import React, { useEffect, useState } from 'react'
import { PRESETS } from '@flowgami/openlovable-core-adapter'

const THEMES = ['minimal', 'playful', 'elegant', 'cyber'] as const
type Theme = typeof THEMES[number]
const FONTS = ['system', 'inter', 'serif'] as const
type FontKey = typeof FONTS[number]

export default function PlaygroundPage() {
  const [prompt, setPrompt] = useState<string>('Landing page for AI Math SaaS for kids')
  const [error, setError] = useState<string>('')
  const [html, setHtml] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [exporting, setExporting] = useState<boolean>(false)
  const [seed, setSeed] = useState<number | undefined>(undefined)
  const [theme, setTheme] = useState<Theme>('minimal')
  const [accent, setAccent] = useState<string>('#3b82f6')
  const [radius, setRadius] = useState<number>(10)
  const [font, setFont] = useState<FontKey>('system')
  const [brandUrl, setBrandUrl] = useState<string>('')
  // Auto-style from prompt
  const [autoStyle, setAutoStyle] = useState<boolean>(true)
  const [chosenTheme, setChosenTheme] = useState<string | undefined>(undefined)
  const [themeSource, setThemeSource] = useState<'prompt' | 'explicit' | 'none' | undefined>(undefined)

  function handleToggle(keyword: string) {
    if (!prompt.toLowerCase().includes(keyword.toLowerCase())) {
      setPrompt((prev) => (prev.trim() ? prev + ' ' + keyword : keyword))
    }
  }

  function applyPreset(p: (typeof PRESETS)[number]) {
    setTheme(p.theme as any)
    if (p.themeTokens.accent) setAccent(p.themeTokens.accent)
    if (p.themeTokens.radius) {
      const px = String(p.themeTokens.radius).trim()
      const n = Number(px.endsWith('px') ? px.slice(0, -2) : px)
      if (Number.isFinite(n)) setRadius(n)
    }
    if (p.themeTokens.font) setFont(p.themeTokens.font as FontKey)
    // regenerate with current/kept seed to preserve determinism
    void handleGenerate()
  }

  async function handleImportBrand() {
    if (!brandUrl.trim()) return
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/brand', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: brandUrl.trim() }),
      })
      const data = await res.json()
      if (data?.ok && data?.themeTokens) {
        if (data.themeTokens.accent) setAccent(data.themeTokens.accent)
        if (data.themeTokens.font) setFont(data.themeTokens.font as FontKey)
        // keep radius as-is
        await handleGenerate()
      } else if (data?.error) {
        setError(String(data.error))
      }
    } catch (e: any) {
      setError(String(e?.message || e))
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerate(customSeed?: number) {
    setError('')
    setLoading(true)
    try {
      const payload: any = {
        prompt,
        seed: customSeed ?? seed,
        autoStyle,
      }
      if (!autoStyle) {
        payload.theme = theme
        payload.themeTokens = { accent, radius: `${radius}px`, font }
      }
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const contentType = res.headers.get('content-type') || ''
      if (!res.ok) {
        if (contentType.includes('application/json')) {
          const data = await res.json()
          throw new Error(data?.error || `HTTP ${res.status}`)
        }
        const txt = await res.text()
        throw new Error(`HTTP ${res.status}: ${txt}`)
      }
      const data = await res.json()
      setHtml(String(data?.html || ''))
      if (typeof data?.seed === 'number') setSeed(data.seed)
      setChosenTheme(data?.chosenTheme)
      setThemeSource(data?.themeSource)
    } catch (e: any) {
      setHtml('')
      setError(String(e.message || e))
    } finally {
      setLoading(false)
    }
  }

  function handleRegenerate() {
    const newSeed = Math.floor(Math.random() * 100000)
    setSeed(newSeed)
    handleGenerate(newSeed)
  }

  async function handleExport() {
    setError('')
    setExporting(true)
    try {
      const exportPayload: any = { prompt, seed }
      if (!autoStyle) {
        exportPayload.theme = theme
        exportPayload.themeTokens = { accent, radius: `${radius}px`, font }
      }
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(exportPayload),
      })
      if (!res.ok) {
        const contentType = res.headers.get('content-type') || ''
        if (contentType.includes('application/json')) {
          const data = await res.json()
          throw new Error(data?.error || `HTTP ${res.status}`)
        }
        const txt = await res.text()
        throw new Error(`HTTP ${res.status}: ${txt}`)
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'export.zip'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e: any) {
      setError(String(e.message || e))
    } finally {
      setExporting(false)
    }
  }

  useEffect(() => {
    // Auto-generate once on mount with default prompt
    handleGenerate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 border-b space-y-2">
        <h1 className="text-xl font-bold">Prompt Playground</h1>

        {/* Quick toggles */}
        <div className="space-x-2">
          <button onClick={() => handleToggle('testimonials')} className="px-2 py-1 border rounded">
            +Testimonials
          </button>
          <button onClick={() => handleToggle('pricing')} className="px-2 py-1 border rounded">
            +Pricing
          </button>
          <button onClick={() => handleToggle('faq')} className="px-2 py-1 border rounded">
            +FAQ
          </button>
        </div>

        {/* Applied tokens indicator */}
        <div className="mt-2 text-sm text-gray-700 flex gap-4 items-center">
          <span className="font-medium">Applied tokens:</span>
          <span className="inline-flex items-center gap-2">
            <span className="text-gray-500">accent</span>
            <span
              className="inline-block w-4 h-4 rounded border"
              style={{ background: accent }}
              aria-label={`accent ${accent}`}
              title={accent}
            />
            <code className="text-gray-600">{accent}</code>
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="text-gray-500">radius</span>
            <code className="text-gray-600">{radius}px</code>
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="text-gray-500">font</span>
            <code className="text-gray-600">{font}</code>
          </span>
        </div>

        {/* Controls row */}
        <div className="flex gap-3 items-start">
          <textarea
            className="flex-1 p-2 border rounded"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your landing page..."
          />
          <div className="min-w-48">
            <label className="block text-sm mb-1 font-medium">Theme</label>
            <select
              className="w-full p-2 border rounded"
              value={theme}
              onChange={(e) => setTheme(e.target.value as Theme)}
            >
              {THEMES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>
          {/* Auto style from prompt toggle */}
          <div className="flex items-center gap-2 mt-6">
            <input id="auto-style" type="checkbox" checked={autoStyle} onChange={(e)=>setAutoStyle(e.target.checked)} />
            <label htmlFor="auto-style" className="text-sm">Auto style from prompt</label>
          </div>
          <div className="min-w-40">
            <label className="block text-sm mb-1 font-medium">Accent</label>
            <input
              type="color"
              className="w-full h-[40px] border rounded"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              aria-label="Accent Color"
            />
          </div>
          <div className="min-w-48">
            <label className="block text-sm mb-1 font-medium">Radius: {radius}px</label>
            <input
              type="range"
              min={0}
              max={24}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full"
              aria-label="Border Radius"
            />
          </div>
          <div className="min-w-48">
            <label className="block text-sm mb-1 font-medium">Font</label>
            <select
              className="w-full p-2 border rounded"
              value={font}
              onChange={(e) => setFont(e.target.value as FontKey)}
            >
              {FONTS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-60">
            <label className="block text-sm mb-1 font-medium">Brand URL</label>
            <div className="flex gap-2">
              <input
                className="w-full p-2 border rounded"
                placeholder="https://example.com"
                value={brandUrl}
                onChange={(e) => setBrandUrl(e.target.value)}
              />
              <button
                onClick={handleImportBrand}
                className="px-3 py-2 bg-slate-800 text-white rounded"
                disabled={loading || !brandUrl.trim()}
              >
                Import brand
              </button>
            </div>
          </div>
        </div>

        {/* Presets grid */}
        <section className="mt-6">
          <h3 className="text-sm font-semibold mb-2">Presets</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p)}
                className="border rounded-md p-3 text-left hover:bg-gray-50 transition"
                title={p.description ?? p.label}
                type="button"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{p.label}</div>
                    {p.description ? (
                      <div className="text-xs text-gray-500">{p.description}</div>
                    ) : null}
                  </div>
                  <div
                    className="h-6 w-6 rounded"
                    style={{ background: (p.themeTokens.accent ?? '#999') as string }}
                    aria-hidden
                  />
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  <span>font: {p.themeTokens.font ?? 'system'}</span>
                  <span className="mx-1">•</span>
                  <span>radius: {p.themeTokens.radius ?? '10px'}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <button
          onClick={() => handleGenerate()}
          disabled={loading}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
        >
          {loading ? 'Generating…' : 'Generate'}
        </button>
        <button
          onClick={handleRegenerate}
          className="mt-2 ml-2 px-4 py-2 bg-purple-600 text-white rounded"
        >
          Regenerate
        </button>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="mt-2 ml-2 px-4 py-2 bg-emerald-600 text-white rounded disabled:opacity-60"
        >
          {exporting ? 'Exporting…' : 'Export'}
        </button>
        {typeof seed === 'number' && (
          <p className="text-sm text-gray-600 mt-1">Seed: {seed}</p>
        )}
        {(chosenTheme || themeSource) && (
          <p className="text-xs text-gray-600 mt-1">
            Style: <span className="font-medium">{chosenTheme ?? '(none)'}</span>
            {themeSource ? <><span className="mx-1">•</span> source: {themeSource}</> : null}
          </p>
        )}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="flex-1">
        {html && <iframe className="w-full h-full" srcDoc={html} title="Preview" />}
      </div>
    </div>
  )
}

