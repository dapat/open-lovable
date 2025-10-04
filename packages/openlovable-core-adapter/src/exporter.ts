import JSZip from 'jszip'
import { PageSpec } from './spec'

const nextJsTemplate = `import React from "react"

type FeatureItem = string | { label: string; icon?: string }

type PageSpec = {
  title: string
  subtitle?: string
  hero: { headline: string; subheadline?: string; ctaText?: string }
  features: { title: string; items: FeatureItem[] }
  testimonials?: { title?: string; items: { quote: string; author: string; avatar?: string }[] }
  pricing?: { title?: string; plans: { name: string; price: string; features: string[] }[] }
  faq?: { title?: string; items: { question?: string; answer?: string; q?: string; a?: string }[] }
  cta: { headline: string; ctaText: string }
}

export const sampleSpec: PageSpec = {
  title: "AI Math SaaS",
  subtitle: "Fun math for kids",
  hero: {
    headline: "Make Math Fun!",
    subheadline: "Interactive exercises for elementary school students",
    ctaText: "Get Started"
  },
  features: {
    title: "Why choose us?",
    items: [
      { label: "Interactive exercises", icon: "/icons/check.svg" },
      { label: "Progress tracking", icon: "/icons/check.svg" },
      { label: "Designed for kids", icon: "/icons/check.svg" }
    ]
  },
  testimonials: {
    title: "Loved by teams",
    items: [
      { quote: "It just works.", author: "Jane", avatar: "/avatars/jane.png" },
      { quote: "Boosted our speed 10x.", author: "Alex" }
    ]
  },
  pricing: {
    title: "Simple pricing",
    plans: [
      { name: "Starter", price: "$9/mo", features: ["1 project", "Email support"] },
      { name: "Pro", price: "$29/mo", features: ["Unlimited projects", "Priority support"] }
    ]
  },
  faq: {
    title: "FAQ",
    items: [
      { question: "Can I export?", answer: "Yes, as HTML or Next.js." },
      { question: "Is there a free plan?", answer: "Yes, with basic features." }
    ]
  },
  cta: { headline: "Start your free trial today!", ctaText: "Sign Up" }
}
`

const nextJsComponent = `export default function LandingPage({ spec }: { spec: PageSpec }) {
  const s = spec
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{s.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <section id="hero">
          <h1>{s.hero.headline}</h1>
          {s.subtitle ? <h2>{s.subtitle}</h2> : null}
          {s.hero.subheadline ? <p className="subheadline">{s.hero.subheadline}</p> : null}
          {s.hero.ctaText ? <button>{s.hero.ctaText}</button> : null}
        </section>

        <section id="features">
          <h2>{s.features.title}</h2>
          <ul className="grid">
            {s.features.items.map((it, idx) => (
              typeof it === 'string' ? (
                <li key={idx}><span>{it}</span></li>
              ) : (
                <li key={idx}>
                  {it.icon ? <img src={it.icon} alt="icon" /> : null}
                  <span>{it.label}</span>
                </li>
              )
            ))}
          </ul>
        </section>

        {s.testimonials ? (
          <section id="testimonials">
            {s.testimonials.title ? <h2>{s.testimonials.title}</h2> : null}
            <div className="cards">
              {s.testimonials.items.map((t, i) => (
                <article className="testimonial" key={i}>
                  {t.avatar ? <img src={t.avatar} alt={t.author || "avatar"} /> : null}
                  <blockquote>{t.quote}</blockquote>
                  {t.author ? <cite>{t.author}</cite> : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {s.pricing ? (
          <section id="pricing">
            {s.pricing.title ? <h2>{s.pricing.title}</h2> : null}
            <div className="plans">
              {s.pricing.plans.map((p, i) => (
                <article className="plan" key={i}>
                  <h3>{p.name}</h3>
                  <p className="price">{p.price}</p>
                  {p.features?.length ? (
                    <ul className="features">
                      {p.features.map((f, j) => <li key={j}>{f}</li>)}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {s.faq ? (
          <section id="faq">
            {s.faq.title ? <h2>{s.faq.title}</h2> : null}
            <dl className="faq-list">
              {s.faq.items.map((q, i) => {
                const qq = 'question' in q ? (q as any).question : (q as any).q
                const aa = 'answer' in q ? (q as any).answer : (q as any).a
                return (
                  <div className="faq-item" key={i}>
                    <dt>{qq}</dt>
                    <dd>{aa}</dd>
                  </div>
                )
              })}
            </dl>
          </section>
        ) : null}

        <section id="cta">
          <h2>{s.cta.headline}</h2>
          <button>{s.cta.ctaText}</button>
        </section>
      </body>
    </html>
  )
}
`

const readmeTemplate = (seed?: number, theme?: string, tokens?: { accent?: string; radius?: string; font?: string }) => `# Prompt-to-UI Export

This ZIP contains:
- \`page.html\`           — Static HTML preview
- \`page.json\`           — Spec used to generate the page
- \`nextjs-page.tsx\`     — React component for Next.js
- \`README.md\`           — This file

## Reproducibility
Seed: ${typeof seed === 'number' ? seed : '(not provided)'}
Theme: ${theme ?? '(not provided)'}
Theme Tokens:
  - accent: ${tokens?.accent ?? '(n/a)'}
  - radius: ${tokens?.radius ?? '(n/a)'}
  - font:   ${tokens?.font ?? '(n/a)'}

## Quick Start (Next.js App Router)
1. Copy \`nextjs-page.tsx\`  to \`app/landing/page.tsx\`
2. Import \`sampleSpec\`  (in the same file) or read \`page.json\`
3. Run \`npm run dev\`  and open \`/landing\`

> Note: No Tailwind required; markup matches the generator output.`

export async function buildExportZip({
  spec,
  html,
  seed,
  theme,
  themeTokens,
}: {
  spec: PageSpec
  html: string
  seed?: number
  theme?: 'minimal' | 'playful' | 'elegant' | 'cyber'
  themeTokens?: { accent?: string; radius?: string; font?: 'system' | 'inter' | 'serif' }
}): Promise<Buffer> {
  const zip = new JSZip()
  zip.file('page.html', html)
  zip.file('page.json', JSON.stringify(spec, null, 2))
  const component = `import React from "react"\n\n${nextJsTemplate}\n\n${nextJsComponent}`
  zip.file('nextjs-page.tsx', component)
  zip.file('README.md', readmeTemplate(seed, theme ?? (spec as any).theme, themeTokens))
  return await zip.generateAsync({ type: 'nodebuffer' })
}
