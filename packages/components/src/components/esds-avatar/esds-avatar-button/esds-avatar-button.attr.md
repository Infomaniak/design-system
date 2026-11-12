[Figma ↗](https://www.figma.com/design/OgklXBGhUgpzlYPnVusMpw/Edelweiss---Token-Core?node-id=2854-2&p=f&t=utLUqVyj1askiodz-0)

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
>
> On this POC branch the `esds-avatar` component is not present (it lives in PR #457): render any
> content instead.

## Description

A wrapper to create a _button_ around an avatar.

It inherits the same **behavior** as the [esds-headless-button](./?path=/docs/components-headless-button--docs) attribute and owns the avatar-button look.

## Demo
