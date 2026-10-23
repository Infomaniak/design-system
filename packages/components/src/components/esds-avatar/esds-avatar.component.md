- [Figma ↗](TODO)

## Usage

Import and register the custom element `esds-avatar`:

```ts
import { EsdsAvatarComponent } from '@infomaniak-design-system/components';

EsdsAvatarComponent.define();
```

[//]: # 'TODO doc'

```html
<esds-avatar></esds-avatar>
```

## Description

Represents an avatar.

### Styles

#### Types

List of all available button types:

- `lg` (default): primary style
- `destructive`: destructive style
- `neutral`: neutral style

##### Import

To import all avatar types:

```css
@import '@infomaniak-design-system/tokens/css/modifiers/avatar-type/all.attr.css';
```

Or individually:

```css
@import '@infomaniak-design-system/tokens/css/modifiers/avatar-type/[type].attr.css';
/* example: @import '@infomaniak-design-system/tokens/css/modifiers/avatar-type/primary.attr.css'; */
```

##### Apply

Add the attribute `data-esds-avatar-type="[type]"` to apply a avatar type:

```html
<esds-avatar data-esds-avatar-type="primary">3</esds-avatar>
```

## Demo
