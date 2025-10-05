import { z } from 'zod';
export declare const PricingPlanSchema: z.ZodObject<{
    name: z.ZodString;
    price: z.ZodString;
    features: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    price: string;
    features: string[];
}, {
    name: string;
    price: string;
    features: string[];
}>;
export declare const FeatureItemSchema: z.ZodUnion<[z.ZodString, z.ZodObject<{
    label: z.ZodString;
    icon: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    label: string;
    icon?: string | undefined;
}, {
    label: string;
    icon?: string | undefined;
}>]>;
export declare const PageSpecSchema: z.ZodObject<{
    title: z.ZodString;
    subtitle: z.ZodOptional<z.ZodString>;
    theme: z.ZodOptional<z.ZodEnum<["minimal", "playful", "elegant", "cyber"]>>;
    accent: z.ZodOptional<z.ZodString>;
    themeTokens: z.ZodOptional<z.ZodObject<{
        accent: z.ZodOptional<z.ZodString>;
        radius: z.ZodOptional<z.ZodString>;
        font: z.ZodOptional<z.ZodEnum<["system", "inter", "serif"]>>;
    }, "strip", z.ZodTypeAny, {
        accent?: string | undefined;
        radius?: string | undefined;
        font?: "system" | "inter" | "serif" | undefined;
    }, {
        accent?: string | undefined;
        radius?: string | undefined;
        font?: "system" | "inter" | "serif" | undefined;
    }>>;
    hero: z.ZodObject<{
        headline: z.ZodString;
        subheadline: z.ZodOptional<z.ZodString>;
        ctaText: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        headline: string;
        subheadline?: string | undefined;
        ctaText?: string | undefined;
    }, {
        headline: string;
        subheadline?: string | undefined;
        ctaText?: string | undefined;
    }>;
    features: z.ZodObject<{
        title: z.ZodString;
        items: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
            label: z.ZodString;
            icon: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            label: string;
            icon?: string | undefined;
        }, {
            label: string;
            icon?: string | undefined;
        }>]>, "many">;
    }, "strip", z.ZodTypeAny, {
        title: string;
        items: (string | {
            label: string;
            icon?: string | undefined;
        })[];
    }, {
        title: string;
        items: (string | {
            label: string;
            icon?: string | undefined;
        })[];
    }>;
    cta: z.ZodObject<{
        headline: z.ZodString;
        ctaText: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        headline: string;
        ctaText: string;
    }, {
        headline: string;
        ctaText: string;
    }>;
    footer: z.ZodObject<{
        smallprint: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        smallprint: string;
    }, {
        smallprint: string;
    }>;
    testimonials: z.ZodOptional<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        items: z.ZodArray<z.ZodObject<{
            quote: z.ZodString;
            author: z.ZodOptional<z.ZodString>;
            avatar: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            quote: string;
            author?: string | undefined;
            avatar?: string | undefined;
        }, {
            quote: string;
            author?: string | undefined;
            avatar?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        items: {
            quote: string;
            author?: string | undefined;
            avatar?: string | undefined;
        }[];
        title?: string | undefined;
    }, {
        items: {
            quote: string;
            author?: string | undefined;
            avatar?: string | undefined;
        }[];
        title?: string | undefined;
    }>>;
    pricing: z.ZodOptional<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        plans: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            price: z.ZodString;
            features: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            ctaText: z.ZodOptional<z.ZodString>;
            highlight: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            price: string;
            features?: string[] | undefined;
            ctaText?: string | undefined;
            highlight?: boolean | undefined;
        }, {
            name: string;
            price: string;
            features?: string[] | undefined;
            ctaText?: string | undefined;
            highlight?: boolean | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        plans: {
            name: string;
            price: string;
            features?: string[] | undefined;
            ctaText?: string | undefined;
            highlight?: boolean | undefined;
        }[];
        title?: string | undefined;
    }, {
        plans: {
            name: string;
            price: string;
            features?: string[] | undefined;
            ctaText?: string | undefined;
            highlight?: boolean | undefined;
        }[];
        title?: string | undefined;
    }>>;
    faq: z.ZodOptional<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        items: z.ZodArray<z.ZodUnion<[z.ZodObject<{
            q: z.ZodString;
            a: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            q: string;
            a: string;
        }, {
            q: string;
            a: string;
        }>, z.ZodObject<{
            question: z.ZodString;
            answer: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            question: string;
            answer: string;
        }, {
            question: string;
            answer: string;
        }>]>, "many">;
    }, "strip", z.ZodTypeAny, {
        items: ({
            q: string;
            a: string;
        } | {
            question: string;
            answer: string;
        })[];
        title?: string | undefined;
    }, {
        items: ({
            q: string;
            a: string;
        } | {
            question: string;
            answer: string;
        })[];
        title?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    features: {
        title: string;
        items: (string | {
            label: string;
            icon?: string | undefined;
        })[];
    };
    title: string;
    hero: {
        headline: string;
        subheadline?: string | undefined;
        ctaText?: string | undefined;
    };
    cta: {
        headline: string;
        ctaText: string;
    };
    footer: {
        smallprint: string;
    };
    subtitle?: string | undefined;
    theme?: "minimal" | "playful" | "elegant" | "cyber" | undefined;
    accent?: string | undefined;
    themeTokens?: {
        accent?: string | undefined;
        radius?: string | undefined;
        font?: "system" | "inter" | "serif" | undefined;
    } | undefined;
    testimonials?: {
        items: {
            quote: string;
            author?: string | undefined;
            avatar?: string | undefined;
        }[];
        title?: string | undefined;
    } | undefined;
    pricing?: {
        plans: {
            name: string;
            price: string;
            features?: string[] | undefined;
            ctaText?: string | undefined;
            highlight?: boolean | undefined;
        }[];
        title?: string | undefined;
    } | undefined;
    faq?: {
        items: ({
            q: string;
            a: string;
        } | {
            question: string;
            answer: string;
        })[];
        title?: string | undefined;
    } | undefined;
}, {
    features: {
        title: string;
        items: (string | {
            label: string;
            icon?: string | undefined;
        })[];
    };
    title: string;
    hero: {
        headline: string;
        subheadline?: string | undefined;
        ctaText?: string | undefined;
    };
    cta: {
        headline: string;
        ctaText: string;
    };
    footer: {
        smallprint: string;
    };
    subtitle?: string | undefined;
    theme?: "minimal" | "playful" | "elegant" | "cyber" | undefined;
    accent?: string | undefined;
    themeTokens?: {
        accent?: string | undefined;
        radius?: string | undefined;
        font?: "system" | "inter" | "serif" | undefined;
    } | undefined;
    testimonials?: {
        items: {
            quote: string;
            author?: string | undefined;
            avatar?: string | undefined;
        }[];
        title?: string | undefined;
    } | undefined;
    pricing?: {
        plans: {
            name: string;
            price: string;
            features?: string[] | undefined;
            ctaText?: string | undefined;
            highlight?: boolean | undefined;
        }[];
        title?: string | undefined;
    } | undefined;
    faq?: {
        items: ({
            q: string;
            a: string;
        } | {
            question: string;
            answer: string;
        })[];
        title?: string | undefined;
    } | undefined;
}>;
export type PageSpec = z.infer<typeof PageSpecSchema>;
export declare function parseSpec(json: unknown): PageSpec;
//# sourceMappingURL=spec.d.ts.map