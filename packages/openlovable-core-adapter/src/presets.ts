import type { PageSpec } from './spec'

export type ThemeName = 'minimal' | 'playful' | 'elegant' | 'cyber' | 'pastel' | 'newspaper' | 'neon-glass'
export type FontToken = 'system' | 'inter' | 'serif'

export interface ThemePreset {
  id: ThemeName
  label: string
  description?: string
  theme: ThemeName
  themeTokens: {
    accent?: string
    radius?: string
    font?: FontToken
  }
}

export const PRESETS: ThemePreset[] = [
  {
    id: 'minimal',
    label: 'Minimal',
    description: 'Clean, blue accent, system font',
    theme: 'minimal',
    themeTokens: { accent: '#3b82f6', radius: '10px', font: 'system' },
  },
  {
    id: 'playful',
    label: 'Playful',
    description: 'Pink accent, rounded, Inter',
    theme: 'playful',
    themeTokens: { accent: '#ec4899', radius: '16px', font: 'inter' },
  },
  {
    id: 'elegant',
    label: 'Elegant',
    description: 'Slate / black, crisp shapes',
    theme: 'elegant',
    themeTokens: { accent: '#0f172a', radius: '8px', font: 'serif' },
  },
  {
    id: 'cyber',
    label: 'Cyber',
    description: 'Green-on-black, bold',
    theme: 'cyber',
    themeTokens: { accent: '#22c55e', radius: '8px', font: 'system' },
  },
  {
    id: 'pastel',
    label: 'Pastel',
    description: 'Soft mint accent, rounded',
    theme: 'minimal',
    themeTokens: { accent: '#86efac', radius: '14px', font: 'inter' },
  },
  {
    id: 'newspaper',
    label: 'Newspaper',
    description: 'Monochrome, serif headlines',
    theme: 'elegant',
    themeTokens: { accent: '#111827', radius: '4px', font: 'serif' },
  },
  {
    id: 'neon-glass',
    label: 'Neon Glass',
    description: 'Neon cyan accent, glassy cards',
    theme: 'cyber',
    themeTokens: { accent: '#06b6d4', radius: '12px', font: 'inter' },
  },
  {
    id: 'test-test',
    label: 'Test',
    description: 'Neon cyan accent, glassy cards',
    theme: 'cyber',
    themeTokens: { accent: '#06b6d4', radius: '12px', font: 'inter' },
  },
]

export function getPreset(id: ThemeName): ThemePreset | undefined {
  return PRESETS.find((p) => p.id === id)
}

export function applyPresetToSpec(spec: PageSpec, preset: ThemePreset): PageSpec {
  return {
    ...spec,
    theme: preset.theme as any,
    themeTokens: {
      ...(spec as any).themeTokens,
      ...preset.themeTokens,
    } as any,
  }
}
