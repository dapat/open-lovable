import { z } from 'zod'

export const PricingPlanSchema = z.object({
  name: z.string(),
  price: z.string(),
  features: z.array(z.string()),
})

export const FeatureItemSchema = z.union([
  z.string(),
  z.object({
    label: z.string(),
    icon: z.string().optional(),
  }),
])

export const PageSpecSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  theme: z.enum(['minimal', 'playful', 'elegant', 'cyber']).optional(),
  accent: z.string().optional(),
  themeTokens: z
    .object({
      accent: z.string().optional(),
      radius: z.string().optional(),
      font: z.enum(['system', 'inter', 'serif']).optional(),
    })
    .optional(),
  hero: z.object({
    headline: z.string(),
    subheadline: z.string().optional(),
    ctaText: z.string().optional(),
  }),
  features: z.object({
    title: z.string(),
    items: z.array(FeatureItemSchema),
  }),
  cta: z.object({
    headline: z.string(),
    ctaText: z.string(),
  }),
  footer: z.object({
    smallprint: z.string(),
  }),
  testimonials: z
    .object({
      title: z.string().optional(),
      items: z.array(
        z.object({
          quote: z.string(),
          author: z.string().optional(),
          avatar: z.string().optional(),
        })
      ),
    })
    .optional(),
  pricing: z
    .object({
      title: z.string().optional(),
      plans: z.array(
        z.object({
          name: z.string(),
          price: z.string(),
          features: z.array(z.string()).optional(),
          ctaText: z.string().optional(),
          highlight: z.boolean().optional(),
        })
      ),
    })
    .optional(),
  faq: z
    .object({
      title: z.string().optional(),
      items: z.array(
        z.union([
          z.object({ q: z.string(), a: z.string() }),
          z.object({ question: z.string(), answer: z.string() }),
        ])
      ),
    })
    .optional(),
})

export type PageSpec = z.infer<typeof PageSpecSchema>

export function parseSpec(json: unknown): PageSpec {
  return PageSpecSchema.parse(json)
}
