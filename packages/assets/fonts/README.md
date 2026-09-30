# Infomaniak's Design System - Fonts

Contains the list of Infomaniak's Design System fonts.

- [Documentation ↗](https://infomaniak.github.io/design-system/storybook/main/?path=/docs/typography--docs)
- [Handbook ↗](https://handbook.design-ik.ch/procedure-inter-infomaniaksans/)
- [CONTRIBUTING](./CONTRIBUTING.md)

## Platforms

### Desktop (Figma, Keynote, …)

To use the font in desktop apps (e.g. Figma), download the TTF files and install them locally.

Full guide in the [Storybook docs ↗](https://infomaniak.github.io/design-system/storybook/main/?path=/docs/designers-guide-install-the-font--docs).

### Web

The fonts are distributed by our S3 server: `https://fonts.storage.infomaniak.com/design-system/latest/infomaniak-sans.min.css`.

#### HTML

```html
<link
  rel="stylesheet"
  href="https://fonts.storage.infomaniak.com/design-system/latest/infomaniak-sans.min.css"
/>
```

#### CSS

```css
@import 'https://fonts.storage.infomaniak.com/design-system/latest/infomaniak-sans.min.css';
```

#### Direct download

- [infomaniak-sans](./fonts/infomaniak-sans)

#### Consumption

```css
font-family: var(--esds-font-family-base), sans-serif;
```
