# Infomaniak's Design System - Fonts - Contributing

## Architecture

Fonts are located in the [`fonts`](./fonts) directory.

### Font architecture

```
fonts/font-name/
├── font-name.json              # Font definition
├── font-name.[variantA].ttf    # TTF files
├── font-name.[variantB].ttf
├── ...
└── OFL.txt                     # Font license
```

### JSON Font description

A font is described by a JSON file containing the following properties:

```ts
interface FontDescription {
  readonly family: string;
  readonly license?: string;
  readonly variants: readonly FontVariant[];
}

interface FontVariant {
  readonly src: string;
  readonly style: FontStyle;
  readonly weight: FontWeight;
  readonly opticalSizing?: FontOpticalSizing;
}

type FontStyle = 'normal' | 'italic' | 'oblique';
type FontWeight = FontWeightStatic | FontWeightRange;
type FontWeightStatic = number;
type FontWeightRange = readonly [start: number, end: number];
type FontOpticalSizing = 'none' | 'auto';
```

#### Example

```json
{
  "family": "Infomaniak Sans",
  "license": "OFL",
  "variants": [
    {
      "src": "./infomaniak-sans.variable.normal.[opsz,wght].ttf",
      "style": "normal",
      "weight": [100, 900],
      "opticalSizing": "auto"
    },
    {
      "src": "./infomaniak-sans.variable.italic.[opsz,wght].ttf",
      "style": "italic",
      "weight": [100, 900],
      "opticalSizing": "auto"
    }
  ]
}
```

## Adding a new font

From these, you can create a new font by adding it to the `fonts` directory and following the structure and format shown in the previous example.

### Variable fonts

Variable fonts are fonts that can be customized by adjusting their weight, width, optical size and more.
They are created by defining a set of axes that can be adjusted to create different variations of the font.
Variable fonts are supported by modern browsers and can provide a more flexible and dynamic typography experience.

> [!NOTE]
> Prefer variable fonts over static fonts.

Helpful links:

- https://fonts.google.com/knowledge/using_variable_fonts_on_the_web/variable_fonts_are_here
- https://fonts.google.com/knowledge/using_variable_fonts_on_the_web/web_font_comparisons_variable_vs_static
- https://fonts.google.com/knowledge/using_type/switching_from_static_to_variable_fonts

### Build the fonts

Run the following command to build the fonts:

```bash
yarn build
```

You may verify the output into the `dist` directory.
