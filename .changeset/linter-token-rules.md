---
'@infomaniak-design-system/figma-plugin-linter': minor
---

The linter now understands design tokens. It reads the file's variables live (local collections in bulk, tokens bound from published libraries resolved on demand) and gains six rules: raw (unbound) fill/stroke/padding/gap/radius/stroke-weight values (`unbound-value`), variables used outside their Figma scope (`wrong-scope`), semantic tokens used on the wrong property — background on text, content on a background (…`wrong-token`), primitive tokens used where semantic tokens are expected, directly or through alias chains (`primitive-misuse`), tokens bound from unrecognized collections (`unknown-collection` — with bindings inside `esds/icon/…` instances exempt, since the icon library ships its own token collection) and deleted/unresolvable bindings (`unresolved-binding`). Third-party kit tokens re-pointed to published DS tokens through alias chains are accepted instead of warned.
