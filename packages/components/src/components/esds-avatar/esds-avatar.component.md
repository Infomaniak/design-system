[//]: # (- [Figma ↗]&#40;TODO&#41;)

## Usage

Import and register the custom element `esds-avatar`:

```ts
import { EsdsAvatarComponent } from '@infomaniak-design-system/components';

EsdsAvatarComponent.define();
```

```html
<esds-avatar initials="AB"></esds-avatar>
```

## Description

Represents an avatar.

### Styles

#### Sizes

List of all available avatar sizes:

- `large`: large avatar
- `medium` (default): medium avatar
- `small`: small avatar
- `extra-small`: tiny avatar

##### Import

To import all avatar sizes:

```css
@import '@infomaniak-design-system/tokens/css/modifiers/avatar-size/all.attr.css';
```

Or individually:

```css
@import '@infomaniak-design-system/tokens/css/modifiers/avatar-size/[size].attr.css';
/* example: @import '@infomaniak-design-system/tokens/css/modifiers/avatar-size/medium.attr.css'; */
```

##### Apply

Add the attribute `data-esds-avatar-size="[size]"` to apply an avatar size:

```html
<esds-avatar
  data-esds-avatar-size="large"
  initials="AB"
></esds-avatar>
```

## Demo
