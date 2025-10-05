# Changelog

## v0.1.0-next

### Added
- Theme & Preset Engine:
  - Theme Fine-Tuner (accent/radius/font)
  - Preset Library + `PRESETS_VERSION=1`
  - Brand Import (`<meta name="theme-color">`, Google Fonts)
  - Prompt Auto-Style (keyword detection)
  - Style Mode: seeded (deterministic by seed)
- Variation Controls: `auto` / `none` / `reverse-features` / `shuffle-pricing` / `both`
- Share Link & URL state (hydrate + copy link)
- Export ZIP README: Seed, Style Mode, Chosen Theme, Presets Version, Variation Strategy
- Tests: brand, variation, urlState (seeded round-trip), exporter README

### Dev
- Next.js `transpilePackages` → hot reload core adapter
- 32/32 tests passed ✅
