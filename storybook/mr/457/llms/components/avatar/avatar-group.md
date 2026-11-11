# Components/Avatar/Avatar Group

> [Figma ↗](https://www.figma.com/design/OgklXBGhUgpzlYPnVusMpw/Edelweiss---Token-Core?node-id=2854-425&t=utLUqVyj1aski...

[Figma ↗](https://www.figma.com/design/OgklXBGhUgpzlYPnVusMpw/Edelweiss---Token-Core?node-id=2854-425&t=utLUqVyj1askiodz-0)

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

You may apply [the same styles](../avatar.md#styles) as the avatar component.

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

## API

### Attributes

| Name | Type | Default | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| shape | 'circle' \| 'square' | — | No | Avatar's shape. |

## Examples

### Default

```html
<esds-avatar-group
    >
    </esds-avatar-group>
```
