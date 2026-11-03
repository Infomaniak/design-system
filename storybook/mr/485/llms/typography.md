# Typography

> This page describes the typography basics of the design system.

This page describes the typography basics of the design system.

## Font Family

The main font family is "**Infomaniak Sans**".

It is available in different font weights.

<table>
  <tr>
    <td style={{ fontWeight: 'var(--esds-font-weight-regular)' }}>
      <FontPreview></FontPreview>
    </td>
    <td>font.weight.regular</td>
  </tr>
  <tr>
    <td style={{ fontWeight: 'var(--esds-font-weight-medium)' }}>
      <FontPreview></FontPreview>
    </td>
    <td>font.weight.medium</td>
  </tr>
</table>

> Installing the font locally to use it in Figma or another desktop app? Follow the
> [Install the Font](designers-guide/install-the-font.md) guide.

### Usage

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

### Applying the font

Use the CSS variable `--esds-font-family-base` to apply the font to the `<html>` element:

```css
html {
  font-family: var(--esds-font-family-base), sans-serif;
}
```

> It's a good practice to apply the font-family to the `<html>` element, as it allows you to later use a different font-family based on the user's language.
>
> ```css
> html[lang^='zh-'] {
>   font-family: var(--esds-font-family-zh), sans-serif;
> }
> ```

## Font Sizes & Line Heights

### Base Font Size

The default font size is `16px`. This corresponds to the CSS value of `1rem`.
Users are able to change the default font size in their browser.
By using `rem`, the font-sizes scale nicely with the user defined value.

### Tokens

[Text tokens](design-tokens/t2/text.md) (font sizes and line-heights) are defined by the `text.{xs..5xl}.{size|line-height|letter-spacing}` design tokens.

## Typography

[Typography tokens](design-tokens/t2/typography.md) group the font family, size, weight, etc. into a single token: `typography.{xs..5xl}.{base|emphasized}`.

It makes it easier to apply the expected font:

```css
font: var(--esds-typography-md-base);
```

## Elements

### Headings

Headings are used to break up content into sections to provide a clear hierarchy of information.

#### Custom attribute _(recommended)_

The [esds-heading](components/heading.md) attribute **must** be used to apply `heading` text styles to elements:

```html
<h1 esds-heading="xl">Large text</h1>
```

#### Tailwind

On projects using Tailwind-based UI elements, we provide the custom class `esds-heading-*` to apply `heading` text styles to elements:

```html
<h1 class="esds-heading-xl">Large text</h1>
```

For `emphasized` text, you may use the `esds-heading-{xs..2xl}-emphasized` class.

#### Tokens

[Heading tokens](design-tokens/t3/heading.md) are defined by the `heading.{xs..2xl}.{font}` design tokens, and are used by the `esds-heading` custom attribute.

Here's an example of how to apply raw styles:

```html
<h1 style="font: var(--esds-heading-xl-font-base)">Heading 1</h1>
```

### Body Text

Body texts are used as blocks or lines of text.

#### Custom attribute _(recommended)_

The [esds-body](components/body.md) attribute **must** be used to apply `body` text styles to elements:

```html
<p esds-body="md">
  This is a sample paragraph showing how text will appear in your application. It demonstrates the
  font style, size, and spacing that will be used throughout your content.
</p>
```

#### Tailwind

On projects using Tailwind-based UI elements, we provide the custom class `esds-body-*` to apply `body` text styles to elements:

```html
<p class="esds-body-sm">
  This is a sample paragraph showing how text will appear in your application. It demonstrates the
  font style, size, and spacing that will be used throughout your content.
</p>
```

For `emphasized` text, you may use the `esds-body-{xs..lg}-emphasized` class.

#### Tokens

[Body tokens](design-tokens/t3/body.md) are defined by the `body.{xs..lg}.{font}` design tokens, and are used by the `esds-body` custom attribute.

Here's an example of how to apply raw styles:

```html
<p style="font: var(--esds-body-md-font)">
  This is a sample paragraph showing how text will appear in your application. It demonstrates the
  font style, size, and spacing that will be used throughout your content.
</p>
```

### Text styles

<Table
  headers={['Text style', 'Code', 'Result']}
  rows={[
    [
      <DocsLink href={'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/sup'}>
        Superscript
      </DocsLink>,
      <Source
        language="html"
        code={'Infomaniak<sup>TM</sup>'}
      />,
      <p style={{ font: 'var(--esds-body-md-font)', margin: 0 }}>
        Infomaniak<sup>TM</sup>
      </p>,
    ],
    [
      <DocsLink href={'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/sub'}>
        Subscript
      </DocsLink>,
      <Source
        language="html"
        code={'H<sub>2</sub>O'}
      />,
      <p style={{ font: 'var(--esds-body-md-font)', margin: 0 }}>
        H<sub>2</sub>O
      </p>,
    ],
    [
      <DocsLink href={'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/em'}>
        Italic
      </DocsLink>,
      <Source
        language="html"
        code={'<em>italic</em>'}
      />,
      <p style={{ font: 'var(--esds-body-md-font)', margin: 0 }}>
        <em>italic</em>
      </p>,
    ],
    [
      <DocsLink
        href={
          'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-decoration'
        }
      >
        Underlined
      </DocsLink>,
      <Source
        language="html"
        code={'<span style="text-decoration: underline">underlined</span>'}
      />,
      <p style={{ font: 'var(--esds-body-md-font)', margin: 0 }}>
        <span style={{ textDecoration: 'underline', /* textDecorationSkipInk: 'auto' */ }}>underlined</span>
      </p>,
    ],
    [
      <DocsLink
        href={
          'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-decoration'
        }
      >
        {/*TODO: make a component*/}
        Underlined Dashed
      </DocsLink>,
      <Source
        language="html"
        code={
          `
            <span
              style="text-decoration: underline dashed;
              text-underline-offset: var(--esds-spacing-2xs)"
            >underlined dashed</span>
          `
        }
      />,
      <p style={{ font: 'var(--esds-body-md-font)', margin: 0 }}>
        <span
          style={{
            textDecoration: 'underline dashed',
            textUnderlineOffset: 'var(--esds-spacing-2xs)',
            /* textDecorationSkipInk: 'auto' */
        }}
        >
          underlined dashed
        </span>
      </p>,
    ],
    [
      <DocsLink href={'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/del'}>
        Strike Through
      </DocsLink>,
      <Source
        language="html"
        code={'<del>deleted</del>'}
      />,
      <p style={{ font: 'var(--esds-body-md-font)', margin: 0 }}>
        <del>deleted</del>
      </p>,
    ],
    [
      <DocsLink
        href={
          'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-transform'
        }
      >
        Uppercase
      </DocsLink>,
      <Source
        language="html"
        code={'<span style="text-transform: uppercase">uppercase</span>'}
      />,
      <p style={{ font: 'var(--esds-body-md-font)', margin: 0 }}>
        <span style={{ textTransform: 'uppercase' }}>uppercase</span>
      </p>,
    ],

]}
/>
