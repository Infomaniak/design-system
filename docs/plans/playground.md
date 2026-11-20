# Playground — Implementation Plan

> **Status:** Validated (grilled design session, 2026-11-20) — ready for spike
> **Branch:** `vjo/feat/playground-storybook`
> **Decisions log:** §8 — ADRs: `docs/adr/0001`, `docs/adr/0002`

---

## 1. Goal

A CodePen-like playground for the design system: somewhere users can write HTML/TS
using ESDS components **with no install, no hosting, no build** — to quickly
prototype an idea or reproduce a bug, then **share it as a plain URL**.

Requirements:

- Purely frontend — no database, no backend, no new hosting
- Components, tokens, fonts and theming available automatically, **with zero hidden
  machinery** (see §2)
- Product/theme switchable by users via the dedicated `data-esds-product` /
  `data-esds-theme` attributes, visible in their own markup
- Component version selectable by the user (`latest`, `rc`, `dev` dist-tags or an
  exact semver) so an issue can be shown against any published release
- State encoded in the URL (base64) so any snippet is shareable by link
- Lives alongside the Storybook docs and deploys with it

**Non-goals (v1):** console drawer (devs use browser devtools on the preview
iframe), multi-file project management, saving accounts, backend persistence,
mobile editor UX, autocompletion of `esds-*` APIs, "Edit in Playground" links on
component docs pages (all phase 2 unless noted).

---

## 2. Design principle: zero magic

Everything the playground does is **visible, editable, standard code**. There are
no hidden files, no hidden regions, no generated config behind a UI field. The
default template **is** copy-pasteable integration code: what a consumer would
actually write on a plain HTML page to use the design system from a CDN.

Consequences (deliberate):

- The version lives in two visible places — the visible **`package.json`** tab
  (for JS; playground's module machinery resolves dependencies from it exactly
  like npm) and the CSS `<link>` URLs (the published tokens package has no
  exports map, so its CSS can only be loaded as a stylesheet). The template
  comments point at both.
- Registration boilerplate (the `define()` calls) is visible in its own tab
  (`setup.ts`) rather than hidden in a bootstrap.
- Reproducibility is the user's choice: leave `latest` to always demo the current
  release, pin an exact version (or `rc`/`dev`) when filing a bug.

> **Spike correction (validated):** an `<script type="importmap">` inside the
> preview's `index.html` does **not** work — playground's TypeScript worker
> rewrites bare imports itself (reading the project `package.json`, then each
> dependency's own `package.json` transitively) and never consults a document
> import map. The visible `package.json` tab is the mechanically-correct
> equivalent, and arguably even more standard.

---

## 3. Investigation summary

### Decision

Use **[`playground-elements`](https://github.com/google/playground-elements)**
(Google/Lit team, BSD-3, v0.21.2 — the engine behind lit.dev's playground),
hosted as a **standalone Vite-built page** inside `apps/docs`, deployed with the
existing Storybook gh-pages pipeline. Preview code loads our packages from
**unpkg with user-editable versions**. See ADR-0001 for the trade-off analysis.

### Why playground-elements

| Need                      | How it is covered                                                                                                                                                                |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No backend / no hosting   | Previews run through a **service worker** creating a virtual URL-space, 100% in-browser.                                                                                         |
| No build for users        | Two editable surfaces: HTML markup and TS (compiled in a Web Worker).                                                                                                            |
| Security for shared links | Untrusted preview code executes on a **different origin** (`unpkg.com/playground-elements@<version>/playground-projects/`) — a malicious shared link cannot touch the docs site. |
| Fits the stack            | It is itself a web component, themable with CSS custom properties / ESDS tokens. CodeMirror 6 editor, resizable panes, live preview.                                             |

### Codebase enablers verified

- `@infomaniak-design-system/components` and `@infomaniak-design-system/tokens`
  are **published on npm** and CDN-servable:
  - components: `/public-api.js` (ESM, preserveModules; **only bare imports are
    `lit` and `lit/*`** — verified across all 103 published files)
  - tokens: `/css/tokens.root.css`, `/css/modifiers/all.attr.css` (scoped
    `:root, :host`; no exports map → CSS must be `<link>`-ed)
- npm dist-tags exist: `latest` (0.7.1), `rc`, `dev` — unpkg serves all of them.
- All components/attributes expose `static define()`; icons need
  `InjectionContext.root` + `ICONIFY_API` registration.
- Modifiers CSS selects on `[data-esds-theme]` / `[data-esds-product]` on **any
  element** — the user's own `<body>` tag is enough.
- Fonts (`fonts.storage.infomaniak.com`) and the iconify endpoint already work
  cross-origin; GitHub Pages serves `access-control-allow-origin: *` on the
  deployed Storybook (verified), so the sandbox can import our CDN assets.
- Deploy contexts: `…/storybook/mr/<pr>/`, `/develop/`, `/main/`, `/tags/<tag>/`
  → a `/playground/` folder ships **per context**, so every PR gets its own
  playground preview automatically.
- `apps/docs/public/` content ships with the Storybook build (same mechanism as
  `DESIGN.md`); the deploy action runs the root `yarn build` chain.

---

## 4. Architecture

```
apps/docs/playground/                 ← SOURCE (committed)
  index.html                            page shell (header bar, <playground-ide>, buttons)
  src/main.ts                           page logic: hash encode/decode, config assembly
  src/default-template.ts               the three template files (see §4.1)
  src/theme.css                         page + IDE theming (ESDS tokens, neutral chrome)
  vite.playground.config.ts             Vite config (base './', outDir public/playground)

apps/docs/public/playground/          ← BUILD OUTPUT (gitignored, ships with storybook)
  index.html / assets/…                 bundled page + playground-elements + worker
```

Build & deploy wiring:

- `apps/docs/package.json`:
  - `"build:playground": "vite build --config vite.playground.config.ts"`
  - `"build": "yarn build:playground && storybook build && yarn build:llms"`
  - devDependency: `playground-elements`
- `.gitignore`: add `apps/docs/public/playground/`
- Deploy: unchanged — the existing `build-deploy-storybook` action runs `yarn build`,
  and `public/playground/` rides along to
  `infomaniak.github.io/design-system/storybook/<context>/playground/`.
- Local dev: `yarn build:playground --watch` once, then the Storybook dev server
  serves it at `/playground/` (Vite `publicDir`).

### 4.1 The four visible tabs (default template — spike-validated)

**`index.html`** — real integration code; CSS versions editable in place:

```html
<!doctype html>
<head>
  <!-- Design tokens + theming. Bump @latest to a version (e.g. @0.10.0)
       or a dist-tag (@rc, @dev) to pin. -->
  <link
    rel="stylesheet"
    href="https://unpkg.com/@infomaniak-design-system/tokens@latest/css/tokens.root.css"
  />
  <link
    rel="stylesheet"
    href="https://unpkg.com/@infomaniak-design-system/tokens@latest/css/modifiers/all.attr.css"
  />
  <link
    rel="stylesheet"
    href="https://fonts.storage.infomaniak.com/design-system/latest/infomaniak-sans.min.css"
  />
  <script
    type="module"
    src="./setup.js"
  ></script>
  <script
    type="module"
    src="./script.js"
  ></script>
</head>
<body
  data-esds-product="infomaniak"
  data-esds-theme="light"
>
  <!-- products: infomaniak, mail, kdrive, kchat, calendar, contacts,
       knote, security, euria, swisstransfer — themes: light, dark -->
  <button esds-button>
    <esds-avatar></esds-avatar>
    Hello playground
  </button>
</body>
```

**`package.json`** — JS dependency versions, resolved by playground's module
machinery like a real npm install (`latest`/`rc`/`dev` dist-tags and semver all
work; verified in the spike):

```json
{
  "dependencies": {
    "@infomaniak-design-system/components": "latest",
    "lit": "^3.3.3"
  }
}
```

**`setup.ts`** — visible registration; rarely touched, fully editable:

```ts
import {
  EsdsAvatarButtonAttr,
  EsdsAvatarComponent,
  EsdsAvatarGroupComponent,
  EsdsBadgeComponent,
  EsdsBodyAttr,
  EsdsButtonAttr,
  EsdsHeadingAttr,
  EsdsIconComponent,
  EsdsKbdAttr,
  EsdsSeparatorComponent,
  EsdsTextLinkAttr,
  IconifyApi,
  ICONIFY_API,
  InjectionContext,
} from '@infomaniak-design-system/components';

EsdsAvatarComponent.define();
EsdsAvatarGroupComponent.define();
EsdsBadgeComponent.define();
EsdsSeparatorComponent.define();
EsdsIconComponent.define();
EsdsAvatarButtonAttr.define();
EsdsBodyAttr.define();
EsdsButtonAttr.define();
EsdsHeadingAttr.define();
EsdsKbdAttr.define();
EsdsTextLinkAttr.define();

InjectionContext.root = new InjectionContext([
  ICONIFY_API.define(new IconifyApi({ resources: ['https://iconify.infomaniak.com'] })),
]);
```

(The iconify URL is **hardcoded production** — stable across deploy contexts.
Note: playground serves compiled `.ts` as `.js`; `index.html` references
`./setup.js` / `./script.js`.)

**`script.ts`** — 100% user code, e.g.:

```ts
const button = document.querySelector('button');
button.addEventListener('click', () => console.log('clicked'));
```

Module resolution (source-verified in `bare-module-transformer.ts`): playground's
TypeScript worker rewrites bare imports in project files using the project's
`package.json`, then processes each fetched dependency recursively using **its
own** `package.json` — so the `lit` imports inside the unpkg-served
`public-api.js` chunks resolve transitively (`lit`/`lit/*` are the only bare
specifiers in the published bundle). No import map involved anywhere.

### 4.2 Sharing via URL

- The playground project config is a plain JSON object → serialize **all four
  files** (the full, frozen config) to JSON → **base64url** → `location.hash` as
  `#code=…`, debounced (`replaceState`, no history spam) after each
  `compileDone`.
- On load: `#code=` present → decode → `project.config = …`; otherwise the
  default template. Same-document fragment navigations don't re-run the page —
  shared links always arrive as full loads (verified roundtrip in the spike).
- Header bar: **Copy link** (copies the current URL, reusing the repo's
  copy-tooltip pattern) and **Reset** (restores the default template + clears
  the hash).
- A shared link keeps running whatever versions it was created with: `latest`
  stays dynamic by the user's own choice, explicit pins stay pinned. See
  ADR-0002.

---

## 5. UX (v1)

- Header bar: ESDS-branded (title, Copy link, Reset, link to docs). Neutral
  chrome — it is a tool, not a demo; only the **preview** is themed.
- Custom layout (`playground-project` + `playground-tab-bar` +
  `playground-file-editor` + `playground-preview`, wired via the `project`
  property): editor left, live preview right. `editableFileSystem` off; four
  fixed tabs: `index.html`, `package.json`, `setup.ts`, `script.ts`.
- Theming is user-driven via the visible `<body data-esds-*>` tag + values
  comment in the template.
- No console drawer: the preview is a real document in an iframe — devtools
  attach normally (context selector in the browser console).
- Untrusted-code note (same model as lit.dev): shared links execute on the unpkg
  sandbox origin, isolated from the docs site — documented on the docs page.

---

## 6. Phases

### Phase 0 — Spike ✅ **VALIDATED (2026-11-20)**

Minimal `apps/docs/playground/` page + `vite.playground.config.ts`, hardcoded
template, `playground-elements` from npm. Results:

- [x] Vite build keeps `playground-typescript-worker.js` loadable — emitted as
      its own chunk; **plus** `internal/typescript.js` (the vendored TS compiler)
      must be copied next to it (Vite externalizes the worker's static import
      without emitting it — solved by a `closeBundle` copy plugin in
      `vite.playground.config.ts`)
- [x] Module resolution — resolved **differently than planned**: an import map
      in the preview HTML is never consulted (the worker rewrites bare imports
      from the project `package.json`, transitively using each dependency's own
      `package.json`). Fixed design: visible `package.json` tab (§4.1)
- [x] dist-tag + semver resolution through the SW — `latest` default and `rc`
      verified live in the editor flow (`dev`/exact semver use the same
      mechanism; CDN URLs pre-verified)
- [x] Relative-chunk loading of `preserveModules` `public-api.js` against unpkg
      URLs
- [x] Tokens/modifiers/fonts CSS render in the sandbox; `data-esds-theme="dark"`
      on the user's `<body>` flips the preview (verified visually); icons
      resolve via the production iconify URL
- [x] Works locally and under a gh-pages-like subpath (`/playground/` with
      relative base)
- [x] Sharing roundtrip: base64url `#code=` hash (live-debounced on
      `compileDone`), restore across document boundaries, Reset

**Spike corrections to carry into Phase 1:**

1. `sandboxBaseUrl` **must be set explicitly** to
   `https://unpkg.com/playground-elements@<installed version>/` (package root —
   where the SW + proxy files actually live; the README's `playground-projects/`
   path is outdated). The built-in default resolves relative to the _bundle_
   (same origin → insecure + broken).
2. The worker's TS-compiler chunk must be copied (see above).
3. Hash updates listen to **`compileDone`** (not `urlChanged`, which only fires
   on sandbox-URL changes).
4. playground infers `contentType: "video/mp2t"` for `.ts` files (harmless at
   runtime — the SW serves the compiled `.js` — but normalize it when
   serializing share links for cleanliness).

Exit criteria: **met** — `<button esds-button><esds-avatar/></button>` renders
styled, themed, with icons, from only visible standard code.

### Phase 1 — Productize

- Hash encode/decode + Copy link + Reset (§4.2)
- Default template module (§4.1) — the single source for the three files
- Page + IDE theming with ESDS tokens; header bar; neutral chrome
- `build:playground` wired into `apps/docs` build; `.gitignore` entry
- **Top-level "Playground" section in Storybook** (visible like Welcome / Design
  Tokens / Components) with a **link-only** docs page: what it is, how sharing
  works, how to pin versions
- PR: Conventional Commits, `yarn format`; no changeset (app/docs-only); no
  `vr-test` tags (VRT is per-story opt-in and must stay unaffected)
- AGENTS.md context map: add `apps/docs/playground/` entry (and `docs/plans/`,
  `docs/adr/`, `GLOSSARY.md` now exist)

### Phase 2 — Enhancements (optional, prioritized)

1. **"Edit in Playground" buttons on component docs pages** — pre-filled snippet
   per component; the natural next step now that the URL format is stable
2. **Autocomplete** for `esds-*` tags/attributes/CSS props via CodeMirror
   `extensions`, generated from the existing `custom-elements.json`
3. **`registerAll()`** (or side-effect `register`) export in the components
   package, collapsing `setup.ts` to one line — changeset required; only if the
   boilerplate proves annoying
4. **Snippet gallery** — curated examples per component / per product
5. Compressed share URLs (`CompressionStream`), jsDelivr `cdnBaseUrl` toggle,
   page-level theme toggle

---

## 7. Risks & mitigations

| Risk                                                                                                                                           | Mitigation                                                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| ~~Import-map bypass by the TS worker~~ **Resolved in spike** — design corrected to a visible `package.json` tab (playground-native resolution) | —                                                                                                                                           |
| Bare-import resolution of `public-api.js` chunks via unpkg                                                                                     | **Verified in spike** — only `lit`/`lit/*` are bare; the worker resolves them transitively from the components package's own `package.json` |
| `latest` drift breaks old snippets                                                                                                             | Users choose: pin exact/`rc`/`dev` when filing bugs (that is the point of the visible version); `lit` is pinned in the template regardless  |
| Published-releases-only tradeoff                                                                                                               | Accepted (ADR-0001): unreleased components become demoable once published as `rc`/`dev`/`latest`                                            |
| unpkg outage                                                                                                                                   | `cdnBaseUrl` → jsDelivr is a small change (phase 2 toggle); sandbox origin mirror exists on jsDelivr                                        |
| Shared-link abuse (untrusted code)                                                                                                             | Sandbox origin (unpkg) isolates it from the docs site — `sandboxBaseUrl` explicitly pinned (spike correction #1); documented like lit.dev   |
| URL length for big snippets                                                                                                                    | Fine for v1 (3322 chars observed for the default snippet); deflate compression in phase 2                                                   |
| playground-elements maintenance cadence                                                                                                        | Stable/mature (648★, used by lit.dev); LiveCodes is the identified runner-up; our integration surface (config object) is small and portable |

---

## 8. Decisions log (grilled session, 2026-11-20)

| #       | Decision                     | Outcome                                                                                                                                                                               |
| ------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q1      | Preview component source     | unpkg, **user-editable version** (dist-tag or semver), default `latest` — rejected: same-deploy vendor bundle (less flexible), baked pinned versions (breaks on PRs, no rc/dev repro) |
| Q2/Q12  | Editor surface               | Three visible tabs: `index.html`, `setup.ts`, `script.ts` (lit.dev-style)                                                                                                             |
| Q3      | What a shared link freezes   | **Full config** (all three files) — reproducibility at the version filed; Reset = current template                                                                                    |
| Q4      | URL update timing            | Live debounced `replaceState` + Copy link button                                                                                                                                      |
| Q5      | Console output               | **No drawer** — devs use browser devtools on the preview iframe                                                                                                                       |
| Q6/Q10  | Theming                      | User-driven via visible `<body data-esds-*>` + values comment; host chrome neutral                                                                                                    |
| Q7      | Version UX                   | Visible in code (import map + CSS links) — **no header field, no magic**                                                                                                              |
| Q8      | Tokens version               | Also visible/editable (`<link>` URLs; no exports map on the published tokens package)                                                                                                 |
| Q9/Q13  | Registration glue            | Visible `setup.ts` with explicit `define()` list — no hidden bootstrap, no guard test; `registerAll()` only as phase 2                                                                |
| Q14     | Iconify endpoint             | Hardcoded **production** `https://iconify.infomaniak.com` in the template                                                                                                             |
| Q11/Q15 | Docs discoverability         | **Top-level "Playground" section**, link-only page; "Edit in Playground" per component = phase 2                                                                                      |
| —       | Placement / engine / sharing | Standalone Vite page + `playground-elements` + base64url-in-hash (from initial investigation)                                                                                         |

---

## 9. References

- playground-elements: https://github.com/google/playground-elements (README
  covers project files, module resolution, import maps, sandbox security,
  theming, bundling)
- LiveCodes embeds: https://livecodes.io/docs/features/embeds (runner-up)
- ADRs: `docs/adr/0001` (runtime: playground-elements + unpkg user-pinned
  versions), `docs/adr/0002` (share format: frozen config in hash)
- Glossary: `GLOSSARY.md` (Playground, Preview, Sandbox, Setup, Snippet)
- Repo internals: `apps/docs/.storybook/preview.tsx` (define/injection pattern),
  `packages/components/src/public-api.ts`, tokens README (`data-esds-*` usage),
  `.github/actions/build-deploy-storybook/action.yml`
