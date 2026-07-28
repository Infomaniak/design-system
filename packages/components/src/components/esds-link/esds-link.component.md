## Usage

Import and register the link component:

```ts
import { EsdsLinkComponent } from '@infomaniak-design-system/components';

EsdsLinkComponent.define();
```

```html
<esds-link href="https://example.com">Link text</esds-link>
```

## Click Interception

Subscribe to the `esds-link-click` event to intercept clicks for SPA routing:

```ts
link.addEventListener('esds-link-click', (e) => {
  e.preventDefault(); // Cancels native navigation
  router.navigate(e.target.href);
});
```

## Accessibility

- Uses native `<a>` in shadow DOM with `delegatesFocus`
- Tab key focus behaves like a native link
- Auto-adds `noopener noreferrer` when `target="_blank"`
