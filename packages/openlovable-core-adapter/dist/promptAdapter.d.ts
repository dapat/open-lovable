import { PageSpec } from './spec';
/**
 * Stub LLM adapter: map any prompt to a deterministic PageSpec.
 * Later, replace this with a real LLM call.
 */
export declare function promptToSpec(prompt: string): Promise<PageSpec>;
export declare function generateFromPrompt(prompt: string, seed?: number, theme?: 'minimal' | 'playful' | 'elegant' | 'cyber', themeTokens?: {
    accent?: string;
    radius?: string;
    font?: 'system' | 'inter' | 'serif';
}): Promise<{
    spec: {
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
    };
    html: string;
    seed: number;
}>;
export declare function mulberry32(seed: number): () => number;
export declare function seededShuffle<T>(arr: T[], seed: number): T[];
//# sourceMappingURL=promptAdapter.d.ts.map