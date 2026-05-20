# @infomaniak-design-system/components

Web components library for Infomaniak's Design System. Built with Lit and published as standard ES modules with full TypeScript support.

## Installation

```bash
yarn add @infomaniak-design-system/components
```

Requires a peer-like dependency on `lit` for the consuming project:

```bash
yarn add lit
```

## Quick Start

Import all components:

```typescript
import '@infomaniak-design-system/components';
```

Import a single component for tree-shaking:

```typescript
import { EsdsIconComponent } from '@infomaniak-design-system/components/esds-icon';
```

## Usage Example

```html
<!-- Configure once with your Iconify API instance -->
<script type="module">
  import { configure } from '@infomaniak-design-system/components';
  import { IconifyApi } from '@infomaniak-design-system/esds-icon';

  configure(new IconifyApi({ url: 'https://your-iconify-instance.com' }));
</script>

<!-- Use the icon component anywhere -->
<esds-icon name="my-icons:home" mode="svg" inline></esds-icon>
```

## Configuration

The `configure()` function must be called **once** before using any icon component:

```typescript
import { configure } from '@infomaniak-design-system/components';
import { IconifyApi } from '@infomaniak-design-system/esds-icon';

const api = new IconifyApi({
  url: 'https://your-iconify-instance.com',
});

configure(api);
```

Calling `configure()` more than once will throw an error. If not configured, a default `IconifyApi` instance is created internally.

## API Reference

### `<esds-icon>`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | `string` | `""` | Icon identifier in `<prefix>:<name>` format |
| `mode` | `"svg" | "bg" | "mask"` | `"svg"` | Rendering mode |
| `inline` | `boolean` | `false` | Adjusts vertical alignment for inline use |
| `nolazy` | `boolean` | `false` | Disables lazy loading; fetches icon immediately |

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `status` | `"loading" | "rendered" | "error"` | Read-only loading state of the icon |

**Modes:**

- `svg` (default): Renders SVG inline inside the component
- `bg`: Uses CSS `background-image` with the SVG encoded as a data URL
- `mask`: Uses CSS `mask-image` for color-current icon rendering

## Migration from Vanilla Web Components

If you were previously using `esds-icon` as a standalone vanilla web component without the wrapper:

```typescript
// Before (vanilla)
import { register } from 'some-vanilla-lib';
register('esds-icon');

// After (design system)
import { configure } from '@infomaniak-design-system/components';
import { EsdsIconComponent } from '@infomaniak-design-system/components/esds-icon';
import { IconifyApi } from '@infomaniak-design-system/esds-icon';

configure(new IconifyApi({ url: '...' }));
// EsdsIconComponent auto-registers as <esds-icon>
```

The component API (attributes, properties, and behavior) remains identical. The main difference is the need to call `configure()` to provide the Iconify API instance.

## TypeScript

Type declarations are included. Import types directly:

```typescript
import type { EsdsIconComponent, EsdsIconComponentMode } from '@infomaniak-design-system/components/esds-icon';
```
