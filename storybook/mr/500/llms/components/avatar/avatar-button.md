# Components/Avatar/Avatar Button

> [//]: # (- [Figma ↗]&#40;TODO&#41;)

[//]: # (- [Figma ↗]&#40;TODO&#41;)

## Usage

Import and register the custom attribute `esds-avatar-button`:

```ts
import { EsdsAvatarButtonAttr } from '@infomaniak-design-system/components';

EsdsAvatarButtonAttr.define();
```

```html
<button
  esds-avatar-button
  data-esds-avatar-size="large"
>
  <esds-avatar
    shape="square"
    initials="AB"
  ></esds-avatar>
</button>
```

> [!NOTE]
> The `data-esds-avatar-size` **MUST** be placed on the `button` instead of the `avatar`.

## Description

A wrapper to create a _button_ around an avatar.

It inherits the same behavior and properties as the [esds-button](../button.md).

## Demo

## API

### Attributes

| Name | Type | Default | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| disabled | — | — | No | Disables the button |
| loading | — | — | No | No loading state |

## Examples

### Default

```html
<button esds-avatar-button></button>
```

### With Image

```html
<button esds-avatar-button></button>
```

### With Icon

```html
<button esds-avatar-button></button>
```

### With Initials

```html
<button esds-avatar-button></button>
```
