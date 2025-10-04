// Browser-safe index: export only adapter APIs that do not require Node built-ins

export { parseSpec } from './spec'
export type { PageSpec } from './spec'
export { renderHTML, renderLegacyHTML } from './render'
export { renderThemedHTML } from './renderThemed'
export { promptToSpec, generateFromPrompt, mulberry32, seededShuffle } from './promptAdapter'
export { buildExportZip } from './exporter'
export { parseBrandTokensFromHTML, getBrandTokensFromURL } from './brand'
export { PRESETS, getPreset, applyPresetToSpec } from './presets'
export type { ThemePreset, ThemeName } from './presets'

