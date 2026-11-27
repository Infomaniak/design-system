## Setup

Import and register the icon component in your application's entry file (e.g., `main.ts` or `index.ts`):

```ts
import { EsdsIconComponent } from '@infomaniak-design-system/components';

EsdsIconComponent.define();
```

> **Important:** `define()` must be called before any component renders `<esds-icon>`.

## Usage

The icon inherits its size based on the **local** `font-size`.
It is by default `inline-block` making it suitable to integrate into `flex` container.

```html
<esds-icon
  name="esds:headset"
  style="font-size: var(--esds-icon-size-md); /* or let it be inherited from a parent element */"
></esds-icon>
```

### Tailwind

You may set the icon size using the tailwind `text-icon-{size}` class:

```html
<esds-icon
  name="esds:headset"
  class="text-icon-md"
></esds-icon>
```

## Configuration (Optional)

If you need custom icon resources (e.g., a specific icon server), set the `InjectionContext`:

```ts
import { ICONIFY_API, InjectionContext, IconifyApi } from '@infomaniak-design-system/components';

InjectionContext.root = new InjectionContext([
  ICONIFY_API.define(
    new IconifyApi({
      resources: ['https://iconify.preprod.dev.infomaniak.ch'],
    }),
  ),
]);
```

> `InjectionContext` is only required when the default icon resources are insufficient.

## Content Security Policy (Optional)

Most Infomaniak applications enforce a strict Content Security Policy (CSP). Since icons are fetched at runtime, add the API host to the `connect-src` directive:

```txt
connect-src 'self' https://iconify.infomaniak.com;
```

If your application uses the shared `docker/default.conf` template, add the host to the `$CSP_CONNECT` variable.

> If you configured a custom icon resource (see Configuration above), allow its host instead of the default one.

## Demo
