export { parseSpec } from './spec';
export type { PageSpec } from './spec';
export { renderHTML, renderLegacyHTML } from './render';
export { renderThemedHTML } from './renderThemed';
export { promptToSpec, generateFromPrompt, mulberry32, seededShuffle } from './promptAdapter';
export { buildExportZip } from './exporter';
export declare function getCoreInfo(): Promise<{
    sha: string;
    path: string;
}>;
//# sourceMappingURL=index.d.ts.map