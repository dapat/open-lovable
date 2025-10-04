import { PageSpec } from './spec'

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const optional = (condition: any, content: string) => (condition ? content : '')

const normalizeFaqItem = (item: { question?: string; answer?: string; q?: string; a?: string }) => {
  const question = item.question ?? item.q ?? ''
  const answer = item.answer ?? item.a ?? ''
  return { question, answer }
}

export function renderHTML(spec: PageSpec): string {
  const features = spec.features.items
    .map((item) => {
      if (typeof item === 'string') {
        return `<li class="list-disc ml-5">${escapeHtml(item)}</li>`
      }
      const icon = item.icon ? `<img src="${escapeHtml(item.icon)}" alt=""> ` : ''
      return `<li class="list-disc ml-5">${icon}${escapeHtml(item.label)}</li>`
    })
    .join('')

  const testimonials = spec.testimonials
    ? (() => {
        const title = optional(spec.testimonials!.title, `<h2>${escapeHtml(spec.testimonials!.title!)}</h2>`)
        const cards = spec.testimonials!.items
          .map((item) => {
            const avatar = item.avatar ? `<img src="${escapeHtml(item.avatar)}" alt="${item.author ? escapeHtml(item.author) : 'avatar'}" />` : ''
            const cite = item.author ? `<cite>${escapeHtml(item.author)}</cite>` : ''
            return `<article class="testimonial">${avatar}<blockquote>${escapeHtml(item.quote)}</blockquote>${cite}</article>`
          })
          .join('')
        return `<section class="testimonials">${title}<div class="cards">${cards}</div></section>`
      })()
    : ''

  const pricing = spec.pricing
    ? (() => {
        const title = optional(spec.pricing!.title, `<h2>${escapeHtml(spec.pricing!.title!)}</h2>`)
        const plans = spec.pricing!.plans
          .map((plan) => {
            const classes = `plan${plan.highlight ? ' highlight' : ''}`
            const featuresList = plan.features?.length
              ? `<ul class="features">${plan.features.map((f) => `<li>${escapeHtml(f)}</li>`).join('')}</ul>`
              : ''
            const cta = plan.ctaText ? `<button>${escapeHtml(plan.ctaText)}</button>` : ''
            return `<article class="${classes}"><h3>${escapeHtml(plan.name)}</h3><p class="price">${escapeHtml(plan.price)}</p>${featuresList}${cta}</article>`
          })
          .join('')
        return `<section class="pricing">${title}<div class="plans">${plans}</div></section>`
      })()
    : ''

  const faq = spec.faq
    ? (() => {
        const title = optional(spec.faq!.title, `<h2>${escapeHtml(spec.faq!.title!)}</h2>`)
        const entries = spec.faq!.items
          .map((item) => {
            const { question, answer } = normalizeFaqItem(item as any)
            return `<dt>${escapeHtml(question)}</dt><dd>${escapeHtml(answer)}</dd>`
          })
          .join('')
        return `<section class="faq">${title}<dl>${entries}</dl></section>`
      })()
    : ''

  return `<!DOCTYPE html><html lang="en"><head><meta charSet="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${escapeHtml(
    spec.title
  )}</title><script src="https://cdn.tailwindcss.com"></script></head><body class="text-slate-900"><main class="container mx-auto px-6 py-10 space-y-12"><section class="hero"><h1>${escapeHtml(
    spec.hero.headline
  )}</h1>${optional(spec.subtitle, `<h2>${escapeHtml(spec.subtitle!)}</h2>`)}${optional(
    spec.hero.subheadline,
    `<p class="subheadline">${escapeHtml(spec.hero.subheadline!)}</p>`
  )}${optional(spec.hero.ctaText, `<button>${escapeHtml(spec.hero.ctaText!)}</button>`)}</section><section class="features"><h2>${escapeHtml(
    spec.features.title
  )}</h2><ul class="grid">${features}</ul></section>${testimonials}${pricing}${faq}<section class="cta"><h2>${escapeHtml(
    spec.cta.headline
  )}</h2><button>${escapeHtml(spec.cta.ctaText)}</button></section></main></body></html>`
}

export function renderLegacyHTML(spec: PageSpec): string {
  const featureItems = spec.features.items
    .map((item) => {
      if (typeof item === 'string') {
        return `<li>${escapeHtml(item)}</li>`
      }
      const icon = item.icon ? `<img src="${escapeHtml(item.icon)}" alt="icon" />` : ''
      return `<li>${icon}<span>${escapeHtml(item.label)}</span></li>`
    })
    .join('')

  const testimonials = spec.testimonials
    ? (() => {
        const title = optional(spec.testimonials!.title, `<h2>${escapeHtml(spec.testimonials!.title!)}</h2>`)
        const cards = spec.testimonials!.items
          .map((item) => {
            const avatar = item.avatar ? `<img src="${escapeHtml(item.avatar)}" alt="${item.author ? escapeHtml(item.author) : 'avatar'}" />` : ''
            const cite = item.author ? `<cite>${escapeHtml(item.author)}</cite>` : ''
            return `<article class="testimonial">${avatar}<blockquote>${escapeHtml(item.quote)}</blockquote>${cite}</article>`
          })
          .join('')
        return `<section id="testimonials">${title}<div class="cards">${cards}</div></section>`
      })()
    : ''

  const pricing = spec.pricing
    ? (() => {
        const title = optional(spec.pricing!.title, `<h2>${escapeHtml(spec.pricing!.title!)}</h2>`)
        const plans = spec.pricing!.plans
          .map((plan) => {
            const features = plan.features?.length
              ? `<ul class="features"> ${plan.features.map((f) => `<li>${escapeHtml(f)}</li>`).join('')}</ul>`
              : ''
            return `<article class="plan">
  <h3>${escapeHtml(plan.name)}</h3>
  <p class="price">${escapeHtml(plan.price)}</p>
  ${features}
</article>`
          })
          .join('')
        return `<section id="pricing">${title}<div class="plans">${plans}</div></section>`
      })()
    : ''

  const faq = spec.faq
    ? (() => {
        const title = optional(spec.faq!.title, `<h2>${escapeHtml(spec.faq!.title!)}</h2>`)
        const entries = spec.faq!.items
          .map((item) => {
            const { question, answer } = normalizeFaqItem(item as any)
            return `<div class="faq-item"><dt>${escapeHtml(question)}</dt><dd>${escapeHtml(answer)}</dd></div>`
          })
          .join('')
        return `<section id="faq">${title}<dl class="faq-list">${entries}</dl></section>`
      })()
    : ''

  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><title>${escapeHtml(
    spec.title
  )}</title><meta name="viewport" content="width=device-width, initial-scale=1" /></head><body>

  <section id="hero">
    <h1>${escapeHtml(spec.hero.headline)}</h1>
    ${optional(spec.subtitle, `<h2>${escapeHtml(spec.subtitle!)}</h2>`)}
    ${optional(spec.hero.subheadline, `<p class="subheadline">${escapeHtml(spec.hero.subheadline!)}</p>`)}
    ${optional(spec.hero.ctaText, `<button>${escapeHtml(spec.hero.ctaText!)}</button>`)}
  </section>

  <section id="features">
    <h2>${escapeHtml(spec.features.title)}</h2>
    <ul class="grid">
      ${featureItems}
    </ul>
  </section>

  ${testimonials}
  ${pricing}
  ${faq}

  <section id="cta">
    <h2>${escapeHtml(spec.cta.headline)}</h2>
    <button>${escapeHtml(spec.cta.ctaText)}</button>
  </section>

</body></html>`
}
