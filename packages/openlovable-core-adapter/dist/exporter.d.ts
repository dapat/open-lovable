import { PageSpec } from './spec';
export declare function buildExportZip({ spec, html, seed, theme, themeTokens, }: {
    spec: PageSpec;
    html: string;
    seed?: number;
    theme?: 'minimal' | 'playful' | 'elegant' | 'cyber';
    themeTokens?: {
        accent?: string;
        radius?: string;
        font?: 'system' | 'inter' | 'serif';
    };
}): Promise<Buffer>;
//# sourceMappingURL=exporter.d.ts.map