# Playground share format: full frozen config as base64url in the URL hash

---

status: accepted
date: 2026-11-20
---

Playground snippets are shared by serializing the complete playground project
config — all three visible files, including the versions the snippet references —
to JSON, encoding it as base64url into `location.hash` (`#code=…`), updated live
(debounced `replaceState`) as the user edits. A shared link therefore keeps
running exactly what it was created with: `@latest` stays dynamic only when the
user chose `latest`; explicit pins reproduce forever.

## Considered Options

- **Serialize user files only, resolving versions at load time**: links would
  always run against "whatever the site currently serves" — a fixed bug would
  make old repro links silently stop reproducing, which defeats the primary
  "reproduce an issue" use case.
- **Copy-link-only sharing** (URL only changes on demand): simpler, but a
  refresh mid-edit loses work and the address bar is often stale.
- **Server-side short URLs**: rejected — the playground must stay purely
  frontend, with no database.

## Consequences

- The base64url hash format is a compatibility contract: changing it breaks
  already-shared links, so it should only evolve additively (e.g. a versioned
  prefix, later compression).
- URL length grows with snippet size; acceptable for v1, with
  `CompressionStream` deflate as a planned additive improvement.
