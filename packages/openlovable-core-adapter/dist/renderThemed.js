function themeClasses(theme) {
    switch (theme) {
        case 'playful':
            return { body: 'bg-yellow-50 text-slate-900', h1: 'text-4xl font-extrabold text-pink-600', h2: 'text-2xl font-bold text-pink-500', button: 'px-4 py-2 rounded-xl bg-pink-600 text-white hover:opacity-90 transition', card: 'rounded-2xl shadow-md p-5 bg-white', grid: 'grid grid-cols-1 md:grid-cols-3 gap-6', accent: '#ec4899' };
        case 'elegant':
            return { body: 'bg-white text-slate-900', h1: 'text-4xl font-semibold tracking-tight', h2: 'text-2xl font-medium text-slate-700', button: 'px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 transition', card: 'rounded-lg border border-slate-200 p-5 bg-white', grid: 'grid grid-cols-1 md:grid-cols-3 gap-6', accent: '#0f172a' };
        case 'cyber':
            return { body: 'bg-black text-green-300', h1: 'text-4xl font-black text-green-400', h2: 'text-2xl font-bold text-green-300', button: 'px-4 py-2 rounded-md bg-green-500 text-black hover:bg-green-400 transition', card: 'rounded-lg border border-green-800 p-5 bg-black/40', grid: 'grid grid-cols-1 md:grid-cols-3 gap-6', accent: '#22c55e' };
        case 'minimal':
        default:
            return { body: 'bg-white text-slate-900', h1: 'text-4xl font-bold', h2: 'text-2xl font-semibold text-slate-700', button: 'px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition', card: 'rounded-md border border-slate-200 p-5 bg-white', grid: 'grid grid-cols-1 md:grid-cols-3 gap-6', accent: '#3b82f6' };
    }
}
export function renderThemedHTML(spec) {
    const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const T = themeClasses(spec.theme);
    const accentFromSpec = spec.accent;
    const tokens = spec.themeTokens || {};
    const accent = esc(tokens.accent || accentFromSpec || T.accent);
    const radius = esc(tokens.radius || '10px');
    const fontKey = (tokens.font || 'system');
    const fontFamily = fontKey === 'inter'
        ? "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji','Segoe UI Emoji'"
        : fontKey === 'serif'
            ? "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif"
            : "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji','Segoe UI Emoji'";
    const featureItems = spec.features.items.map(it => {
        if (typeof it === 'string')
            return `<li class="${T.card} rounded-token"><span>${esc(it)}</span></li>`;
        const icon = it.icon ? `<img src="${esc(it.icon)}" alt="" class="inline-block mr-2 h-6 w-6 align-middle">` : '';
        return `<li class="${T.card} rounded-token">${icon}<span class="align-middle">${esc(it.label)}</span></li>`;
    }).join('\n');
    const testimonials = spec.testimonials ? `
    <section id="testimonials" class="space-y-4">
      ${spec.testimonials.title ? `<h2 class="${T.h2}">${esc(spec.testimonials.title)}</h2>` : ''}
      <div class="${T.grid}">
        ${spec.testimonials.items.map(i => {
        const qt = `<blockquote class="italic">“${esc(i.quote)}”</blockquote>`;
        const cite = (i.avatar || i.author) ? `<div class="mt-3 flex items-center gap-3">${i.avatar ? ` <img src="${esc(i.avatar)}" alt="${i.author ? esc(i.author) : ''}" class="h-8 w-8 rounded-full">` : ''}${i.author ? ` <span class="text-sm text-slate-600">— ${esc(i.author)}</span>` : ''}</div>` : '';
        return `<article class="${T.card} rounded-token">${qt}${cite}</article>`;
    }).join('')}
      </div>
    </section>` : '';
    const pricing = spec.pricing ? `
    <section id="pricing" class="space-y-4">
      ${spec.pricing.title ? `<h2 class="${T.h2}">${esc(spec.pricing.title)}</h2>` : ''}
      <div class="${T.grid}">
        ${spec.pricing.plans.map(p => {
        const feats = p.features?.length ? `<ul class="mt-3 space-y-1">${p.features.map(f => ` <li>• ${esc(f)}</li>`).join('')}</ul>` : '';
        const btn = p.ctaText ? `<button class="${T.button} mt-3 rounded-token" style="background: var(--accent)">${esc(p.ctaText)}</button>` : '';
        const ring = p.highlight ? 'ring-2 ring-[var(--accent)]' : 'ring-0';
        return `<article class="${T.card} rounded-token ${ring}"><h3 class="text-xl font-semibold">${esc(p.name)}</h3><p class="price text-3xl font-bold mt-1" style="color: var(--accent)">${esc(p.price)}</p>${feats}${btn}</article>`;
    }).join('')}
      </div>
    </section>` : '';
    const faq = spec.faq ? `
    <section id="faq" class="space-y-4">
      ${spec.faq.title ? `<h2 class="${T.h2}">${esc(spec.faq.title)}</h2>` : ''}
      <dl class="space-y-3">
        ${spec.faq.items.map(i => `<div class="${T.card} rounded-token"><dt class="font-semibold">${esc(i.q ?? i.question)}</dt><dd class="text-slate-600 mt-1">${esc(i.a ?? i.answer)}</dd></div>`).join('')}
      </dl>
    </section>` : '';
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(spec.title)}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    :root{
      --accent:${accent};
      --radius:${radius};
      --font:${fontFamily};
    }
    .rounded-token{ border-radius: var(--radius); }
    .font-token{ font-family: var(--font); }
  </style>
</head>
<body class="${T.body} font-token" data-theme="${esc(spec.theme || 'minimal')}">
  <main class="container mx-auto px-6 py-10 space-y-12">
    <section id="hero" class="space-y-3">
      <h1 class="${T.h1}">${esc(spec.hero.headline)}</h1>
      ${spec.subtitle ? `<h2 class="${T.h2}">${esc(spec.subtitle)}</h2>` : ''}
      ${spec.hero.subheadline ? `<p class="text-slate-600">${esc(spec.hero.subheadline)}</p>` : ''}
      ${spec.hero.ctaText ? `<button class="${T.button} rounded-token" style="background: var(--accent)">${esc(spec.hero.ctaText)}</button>` : ''}
    </section>

    <section id="features" class="space-y-4">
      <h2 class="${T.h2}">${esc(spec.features.title)}</h2>
      <ul class="${T.grid}">
${featureItems}
      </ul>
    </section>

    ${testimonials}${pricing}${faq}

    <section id="cta" class="space-y-3">
      <h2 class="${T.h2}">${esc(spec.cta.headline)}</h2>
      <button class="${T.button} rounded-token" style="background: var(--accent)">${esc(spec.cta.ctaText)}</button>
    </section>
  </main>
</body>
</html>`;
}
