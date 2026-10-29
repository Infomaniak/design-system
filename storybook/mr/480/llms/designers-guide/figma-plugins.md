# Designers Guide/Figma Plugins

> Infomaniak's design system Figma plugins are distributed as zip files built automatically by CI on every merge to `de...

Infomaniak's design system Figma plugins are distributed as zip files built automatically by CI on
every merge to `develop`. They are installed locally in Figma Desktop as development plugins and
are not published to the Figma Community.

- **ESDS icons** — generates multi-size variants (16, 20, 24, 32, 40 px) of a 24×24px system icon.

---

## ESDS icons

The **ESDS icons** plugin generates multi-size variants of a 24×24px system icon (16, 20, 24, 32,
40 px). It is distributed as a zip file built automatically by CI on every merge to `develop` —
install it locally in Figma Desktop as a development plugin.

### 1. Download the plugin

Open the
[plugin releases page](https://github.com/Infomaniak/design-system/releases?q=figma-plugin-icons)
and download the `esds-icons.zip` asset of the newest release.

### 2. Install it in Figma

Unzip the archive, then in Figma Desktop: **Plugins → Development → Import plugin from
manifest…** and select the unzipped `esds-icons/manifest.json`.

The plugin appears under **Plugins → Development → ESDS icons**. To generate the icon variants, follow the steps in the [icon contribution guide](./?path=/docs/icons-icon-contribution--docs#4-select-icon-and-run-esds-icons-plugin).

### Update the plugin

Download the latest zip, unzip it over the previous folder and reload the plugin in Figma
(**Plugins → Development → ESDS icons → Reload**).
