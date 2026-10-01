# ESDS icons — Figma plugin

Multi-size icon generator for the Infomaniak Design System. Given a 24×24px
Component (or ComponentSet), the plugin generates scaled variants (16, 20, 24,
32, 40 px), vectorizes their strokes and assembles everything into a
`[generated]` ComponentSet with `size` and `filled` variant properties.

> This plugin is used locally ("development plugin"): it is imported from this
> repository, not distributed through the Figma Community.

## Install (designers)

1. Open the
   [GitHub Releases page](https://github.com/Infomaniak/design-system/releases):
   every merge to `develop` automatically publishes a new build of the plugin,
   so the newest release is always up to date.
2. Download the `esds-icons.zip` asset from the latest release (builds from
   `develop` are marked **Pre-release**; stable releases are published from
   `main`).
3. Unzip it.
4. In Figma Desktop: **Plugins → Development → Import plugin from manifest…**
5. Select the unzipped `esds-icons/manifest.json`.

The plugin then appears under **Plugins → Development → ESDS icons**.

To update, download the latest zip, unzip over the previous folder and reload
the plugin in Figma (**Plugins → Development → ESDS icons → Reload**).

## Develop (engineers)

- `yarn dev:figma-plugin-icons` runs the build in watch mode; Figma reloads the
  plugin on each rebuild.
- `yarn build:figma-plugin-icons --debug` (or `yarn dev:figma-plugin-icons` +
  editing the script flags) enables verbose logging and the on-screen debug
  console. Debug logging is stripped from regular builds.
- `packages/figma/figma-plugin-icons/manifest.json` contains a placeholder `id`;
  Figma assigns a real one on first import. Do not publish the plugin to the
  Figma Community.

### Publishing

The plugin is published automatically as a GitHub Release by the CI publish
job (`yarn ci:publish`) when it lands on `develop` (prereleases tagged
`@infomaniak-design-system/figma-plugin-icons@<version>-rc.<timestamp>`) or
`main` (stable releases tagged
`@infomaniak-design-system/figma-plugin-icons@<version>`).

The release asset is a zip (`esds-icons.zip`) containing `manifest.json` and
the built plugin, ready to be imported in Figma. The version comes from
`package.json`: bump it when you want a new stable release (re-publishing an
existing version fails, preventing accidental overwrites). Prereleases from
`develop` are timestamped and always unique — no version bump needed.

### Structure

```
packages/figma/figma-plugin-icons/
├── manifest.json    # Figma plugin manifest (points to dist/)
├── src/             # Sandbox code (bundled to dist/code.js)
│   ├── code.ts      # Entry point: message router
│   ├── tokens.ts    # Icon sizes, stroke weights, colors (single source)
│   ├── messages.ts  # Typed UI ⇄ sandbox protocol + parsers
│   ├── validation.ts
│   ├── variants.ts
│   ├── generation.ts
│   ├── stroke-config.ts
│   └── stroke-variables.ts
├── ui/              # Plugin iframe (bundled + inlined into dist/ui.html)
│   ├── ui.html
│   └── ui.ts
├── scripts/         # Build + publish scripts
│   └── scripts/
│       ├── build-figma-plugin/   # esbuild bundling to dist/
│       └── publish-figma-plugin-icons/  # GitHub Release publishing (CI)
└── dist/            # Build output (gitignored)
```

## Usage

1. Select a Component or ComponentSet of a 24×24px icon containing strokes.
2. **Analyser la sélection** validates the selection (multi-select supported).
3. **Générer les icônes** creates the variants and a `[generated]` ComponentSet.

Variants are generated in interleaved order (`filled=false` first), so Figma
uses `filled=false` as the default value of the generated ComponentSet.

### Settings

Stroke weights per size (16/20/24/32/40) are configurable in **Paramètres** and
persisted per user via `figma.clientStorage`. **Utiliser les variables** detects
stroke variables (names containing `stroke` + a known size) from the enabled
team libraries and adopts their values.
