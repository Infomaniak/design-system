[//]: # (- [Figma ↗]&#40;TODO&#41;)

## Usage

Import and register the custom element `esds-avatar-group`:

```ts
import { EsdsAvatarGroupComponent } from '@infomaniak-design-system/components';

EsdsAvatarGroupComponent.define();
```

```html
<esds-avatar-group>
  <esds-avatar initials="AB"></esds-avatar>
  <esds-avatar initials="CD"></esds-avatar>
  <esds-avatar initials="EF"></esds-avatar>
</esds-avatar-group>
```

## Description

Groups many avatars.

### Styles

You may apply [the same styles](./?path=/docs/components-avatar--docs#styles) as the avatar component.

#### Example:

```html
<esds-avatar-group
  data-esds-avatar-size="extra-large"
  shape="square"
>
  <esds-avatar initials="AB"></esds-avatar>
  <esds-avatar initials="CD"></esds-avatar>
  <esds-avatar initials="EF"></esds-avatar>
</esds-avatar-group>
```

## Demo
