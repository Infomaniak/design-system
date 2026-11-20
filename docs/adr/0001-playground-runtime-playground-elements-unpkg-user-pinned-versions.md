# Playground runtime: playground-elements with user-pinned unpkg versions and a fully visible setup

---

status: accepted
date: 2026-11-20
---

The design-system playground (a CodePen-like page for prototyping and reproducing
issues with ESDS components) runs on `playground-elements`, deployed as a static
page with the Storybook gh-pages pipeline. Preview code loads
`@infomaniak-design-system/components` and `/tokens` from unpkg at a version the
user can see and edit in the snippet itself — a visible `package.json` tab for JS
(resolved by playground's module machinery exactly like npm, validated by the
Phase 0 spike) and CSS `<link>` URLs for tokens — defaulting to `latest`, also
accepting `rc`/`dev` dist-tags or exact semvers. The design-system registration
is a visible, editable `setup.ts` tab — no hidden files, no header version field,
no generated glue.

## Considered Options

- **Same-deploy vendor bundle** (compile our packages into the playground build
  and serve them next to it): PR previews would test unreleased components, but
  the user loses control over which version runs — killing the "show the issue
  against `rc`/`dev`/an old release" use case — and the runtime becomes invisible
  to the user.
- **unpkg at fixed, build-baked versions**: breaks PR previews (a version bumped
  in a PR is not on npm yet) and still hides the mechanism.
- **Storybook docs page as host, community addons (monday.com playground,
  code-editor), Playroom, LiveCodes, full DIY**: rejected — JSX/React-based
  addons can't run native web components with custom attributes; a docs-page
  host is cramped and couples us to Storybook's Vite pipeline; LiveCodes is
  heavier than needed; DIY rebuilds what playground-elements solved.

## Consequences

- The playground can only demo **published** releases (including `rc`/`dev`
  dist-tags); unreleased work becomes demoable once published. Accepted
  deliberately.
- The snippet's visible `package.json` and CSS links are the single source of
  truth for versions — `latest` stays dynamic on purpose; pinning is the user's
  choice when filing bugs.
- Untrusted shared code executes on the unpkg sandbox origin (different origin
  from the docs site), which is what makes shareable links safe; unpkg (or a
  mirror such as jsDelivr) becomes a runtime dependency, and `sandboxBaseUrl`
  must be pinned explicitly to the installed playground-elements version.
- The registration list in `setup.ts` must be extended when new components ship;
  if the boilerplate proves annoying, a `registerAll()` export in the components
  package can collapse it later (visible one-liner, still no magic).
