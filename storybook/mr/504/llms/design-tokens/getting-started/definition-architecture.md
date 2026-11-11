# Design Tokens/Getting Started/Definition & Architecture

> define the visual language of Infomaniak products. Tokens ensure consistency across platforms while remaining flexibl...

<div className="welcome-section">
  <h1>Design Tokens</h1>
  <p className="welcome-description">
    Our design system is powered by design tokens: <strong>name-value</strong> <em>pairs</em> that
    define the visual language of Infomaniak products. Tokens ensure consistency across platforms
    while remaining flexible enough for different contexts.
  </p>
</div>

## Token Architecture

Our token system follows the Design Tokens Community Group (DTCG) standard with a three-tier architecture:

- <a href="../t1.md">T1 Primitive tokens</a> for foundational token
  values
- <a href="../t2.md">T2 Semantic tokens</a> for semantic abstraction
  tokens
- <a href="../t3.md">T3 Component tokens</a> for component-specific
  tokens

## How It Works

### Token Resolution Chain

Token values reference each other in a hierarchy, ensuring consistency across the system:

```
T3-Component  →  button.background.error
                    ↓
T2-Semantic   →  color.background.error.default
                    ↓
T1-Primitive  →  color.red.600 (#E21C40)
```

When a primitive value changes, every token referencing it updates automatically.

### Modifiers Override by Path Matching

Modifiers let you swap the values of existing tokens without changing their names. They work by matching the path of a T2 (semantic) or T3 (component) token and replacing its value for specific contexts.

**How it works:**

1. A modifier file contains the same token path as the base token
2. When applied, it replaces that path's value in the CSS cascade
3. Resolution continues with the new value

**Example**: The `euria` product modifier

The `euria.tokens.json` modifier overrides `color.background.brand` (the default brand background) by including the same path with a different value:

Base `t2-semantic/color.tokens.json`:

```json
{
  "color": {
    "background": {
      "brand": {
        "$root": { "$value": "{color.background.brand.infomaniak}" },
        "infomaniak": { "$value": "{color.blue.600}" },
        "euria": { "$value": "{color.ocean.700}" }
      }
    }
  }
}
```

`modifiers/product/euria.tokens.json`:

```json
{
  "color": {
    "background": {
      "brand": {
        "$value": "{color.background.brand.euria}"
      }
    }
  }
}
```

**Resolution with modifiers:**

Multiple modifiers can be applied simultaneously. In the example below, the `euria` modifier points the brand background to the Euria brand token, then `dark` further adjusts it for the dark theme:

```
With data-esds-product="euria" data-esds-theme="dark":

              T3: button.background.color
                      ↓
              T2: color.background.brand
                      ↓
  Euria modifier: color.background.brand.euria (color.ocean.700)
                      ↓
   Dark modifier: color.background.brand.euria (color.ocean.400)
                      ↓
              T1: color.ocean.400
```

_**Web example -** apply modifiers using data attributes:_

```html
<body
  data-esds-product="euria"
  data-esds-theme="dark"
>
  <!-- All children resolve with both modifiers applied -->
  <button style="background: var(--esds-color-background-brand)">
    Gets a color.ocean.400 background
  </button>
</body>
```
