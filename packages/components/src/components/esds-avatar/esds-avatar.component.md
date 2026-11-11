[Figma ↗](https://www.figma.com/design/OgklXBGhUgpzlYPnVusMpw/Edelweiss---Token-Core?node-id=2854-2&p=f&t=utLUqVyj1askiodz-0)

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

- `extra-large` (default): extra-large avatar (48px)
- `large`: large avatar (40px)
- `medium`: medium avatar (32px)
- `small`: small avatar (24px)

##### Import

To import all avatar sizes:

```css
@import '@infomaniak-design-system/tokens/css/modifiers/avatar-size/all.attr.css';
```

Or individually:

```css
@import '@infomaniak-design-system/tokens/css/modifiers/avatar-size/[size].attr.css';
/* example: @import '@infomaniak-design-system/tokens/css/modifiers/avatar-size/large.attr.css'; */
```

##### Apply

Add the attribute `data-esds-avatar-size="[size]"` to apply an avatar size:

```html
<esds-avatar
  data-esds-avatar-size="extra-large"
  initials="AB"
></esds-avatar>
```

## Demo
