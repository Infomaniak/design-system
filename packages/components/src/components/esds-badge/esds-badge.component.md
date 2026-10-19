- [Figma ↗](TODO)

## Usage

Import and register the custom element `esds-badge`:

```ts
import { EsdsBadgeComponent } from '@infomaniak-design-system/components';

EsdsBadgeComponent.define();
```

```html
<esds-badge>3</esds-badge>
```

## Description

Represents a badge. If no content is provided, the badge will be compacted as a small _dot_.

### Styles

#### Types

List of all available button types:

- `neutral` (default): neutral style
- `primary`: primary style
- `destructive`: destructive style

##### Import

To import all badge types:

```css
@import '@infomaniak-design-system/tokens/css/modifiers/badge-type/all.attr.css';
```

Or individually:

```css
@import '@infomaniak-design-system/tokens/css/modifiers/badge-type/[type].attr.css';
/* example: @import '@infomaniak-design-system/tokens/css/modifiers/badge-type/primary.attr.css'; */
```

##### Apply

Add the attribute `data-esds-badge-type="[type]"` to apply a badge type:

```html
<esds-badge data-esds-badge-type="primary">3</esds-badge>
```

## Demo
