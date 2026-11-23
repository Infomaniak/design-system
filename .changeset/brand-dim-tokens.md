---
'@infomaniak-design-system/tokens': minor
---

**Breaking:** brand background and foreground tokens now come in three dimensions, mirroring the data-viz palette. Existing values become `dim1`:

- `color.background.brand` → `color.background.brand.dim1` (`--esds-color-background-brand` → `--esds-color-background-brand-dim1`)
- `color.content.on.brand` → `color.content.on.brand.dim1` (`--esds-color-content-on-brand` → `--esds-color-content-on-brand-dim1`)
- Per-product tokens follow the same rule, e.g. `color.background.brand.mail` → `color.background.brand.mail.dim1`.

New tokens:

- `color.background.brand.dim2` / `dim3`: soft and subtle brand backgrounds.
- `color.content.on.brand.dim2` / `dim3`: foreground colors for those backgrounds.
- `color.border.on.brand.dim1` / `dim2` / `dim3`: borders placed on brand backgrounds (`dim1` is transparent).

All of them resolve per product through the `product` modifier. `color.border.brand` and `color.content.brand` are unchanged. The button tokens now reference `dim1`, so buttons look the same.
