"use client"

import React, { useEffect, useState } from 'react'

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

  function handleToggle(keyword: string) {
    if (!prompt.toLowerCase().includes(keyword.toLowerCase())) {
      setPrompt((prev) => (prev.trim() ? prev + ' ' + keyword : keyword))
    }
  }

  async function handleGenerate(customSeed?: number) {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          prompt,
          seed: customSeed ?? seed,
          theme,
          themeTokens: { accent, radius: `${radius}px`, font },
        }),
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
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          prompt,
          seed,
          theme,
          themeTokens: { accent, radius: `${radius}px`, font },
        }),
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
        </div>

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
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="flex-1">
        {html && <iframe className="w-full h-full" srcDoc={html} title="Preview" />}
      </div>
    </div>
  )
}

