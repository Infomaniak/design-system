# Designers Guide/Android/Exporting Token Updates

> This guide walks you through updating the Material color tokens in Figma and exporting them for the Android team. **N...

This guide walks you through updating the Material color tokens in Figma and exporting them for the
Android team. **Never export before an Android developer has approved the changes.**

---

## Before you start

Make sure you have:

- edit access to the [Material kit](https://www.figma.com/design/r4D2DKWIyzVoigyiTh16Hh/Edelweiss---Material-Kit?m=auto&t=6Praqzvd4yFcNUmT-6).
- access to the **[HCT Tonal Palette](hct-tonal-palette.md)** generator, our in-house tool (only needed if you create a new color palette).
- a Figma variables export plugin (e.g. [Variables Pro](https://www.figma.com/community/plugin/1264578192495051449/variables-pro-swap-import-export-variables)).
- an Android developer who will review your changes.

---

## Step 1: Create the new color palette (if needed)

Skip this step if you are only changing values in existing palettes.

1. Open the **[HCT Tonal Palette](hct-tonal-palette.md)** generator.
2. Enter the source color (hex) of the new palette.
3. Generate the full tonal palette, including tones you don't plan to use yet: Material roles rely on many different tones across all contrast modes.
4. Add the palette to the **Primitives** collection.
5. Name the new palette exactly like the existing ones: same structure, same tone steps. Do not rename or reorder existing palettes.

## Step 2: Apply the values following Material's logic

For each scheme, Material defines which tone of which palette each color role uses. Reproduce that mapping exactly: **do not adjust tones by eye**, even if a color looks slightly off.

- Example: in the default Light scheme, `primary` uses tone 40 of the primary palette. In the Dark scheme, it uses tone 80.
- Apply the mapping to **every mode** of the Theme collection (Light, Light medium contrast, Light high contrast, and their Dark counterparts). Tones change from one mode to another, so check each one separately.
- Theme values must **alias the Primitives variables**: never paste a raw hex value into Theme.
- Update the **Product** and **Dataviz** collections if your change affects them.

**Source of truth for the mapping:** [Material 3 - Color roles](https://m3.material.io/styles/color/roles)

If you are unsure about a mapping, ask an Android developer rather than guessing.

## Step 3: Get approval from an Android developer

Before exporting, always share the following with an Android developer:

- the new or modified palette,
- the tone-to-role mapping for each mode,
- screenshots of the main components affected, in Light and Dark.

## Step 4: Export the tokens

Only once your changes are approved.

1. Run the export plugin.
2. Select **only** these four collections:
   - **Primitives**
   - **Product**
   - **Theme**
   - **Dataviz**
3. Deselect every other collection, even if it seems related.
4. Export in `.json` format.

## Step 5: Hand off

1. Send the exported file to the related outputs mobile channel on kChat.
2. Add a short summary of what changed (new palette, modified roles, affected modes).
