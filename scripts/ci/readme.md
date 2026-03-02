# Release Workflow Handover

> Technical handover for the npm release workflow (monorepo) and integration guide for future publishable libraries.

## Purpose

This document describes:

- the current publishing workflow (`PR` / `develop` / `main`)
- the scripts involved
- the CI environment contract
- how to make a new library compatible with CI publishing without duplicating logic

## Workflow Summary

### 1. Pull Request to `main` or `develop`

- The `publish.yml` workflow runs on `pull_request`
- The `yarn ci:publish` step runs **only if** the PR has the `dev` label
- Impacted packages are published as:
- `x.y.z-dev.<timestamp>`
- npm dist-tag: `dev`

### 2. Push to `develop`

- Impacted packages are published as:
- `x.y.z-rc.<timestamp>`
- npm dist-tag: `rc`

### 3. Push to `main`

- Stable publication:
- `x.y.z`
- npm dist-tag: `latest`
- Only if `name@x.y.z` does not already exist on npm

## Important Rules

- `package.json` files in the repo must keep stable versions (`x.y.z`)
- `-dev` / `-rc` suffixes are generated in CI
- A single timestamp is shared across the whole CI run
- Internal dependents of an impacted package are republished on prerelease tags (`dev`/`rc`)

## Key Files

### CI Orchestrator (root)

- `.github/workflows/publish.yml`
- `scripts/ci/publish/ci-publish.script.ts`
- `scripts/ci/publish/src/ci-publish.ts`
- `scripts/ci/publish/src/branch-policy.ts`

### Shared Helper (new foundation for publishable libraries)

- `scripts/helpers/npm/publish-package-directory.ts`

This helper centralizes:

- published version resolution (publish `tag` + CI override)
- temporary rewrite of internal dependencies (`NPM_INTERNAL_DEP_OVERRIDES_JSON`)
- `npm publish`
- `package.json` restoration

### Current Implementation (concrete example)

- `packages/tokens/scripts/scripts/publish-tokens/publish-tokens.script.ts`
- `packages/tokens/scripts/scripts/publish-tokens/src/publish-tokens.ts`

`tokens` is the first consumer of the shared helper.

## CI Environment Contract

These variables are driven by `scripts/ci/publish/ci-publish.script.ts` and/or the GitHub Actions workflow.

### CI Context Variables

- `GITHUB_EVENT_NAME`: `push` | `pull_request`
- `GITHUB_REF_NAME`: current GitHub ref
- `CI_PUBLISH_TARGET_BRANCH`: target branch (useful for PRs)
- `CI_PUBLISH_PR_LABELS`: JSON array of PR labels
- `CI_PUBLISH_GIT_BASE_SHA`: diff base SHA
- `CI_PUBLISH_GIT_HEAD_SHA`: diff head SHA
- `CI_PUBLISH_TIMESTAMP`: run timestamp

### Publish Variables (env passed to package `publish:ci`)

- `NPM_DIST_TAG`: `dev` | `rc` | `latest`
- `NPM_PUBLISH_VERSION`: exact version to publish
- `NPM_INTERNAL_DEP_OVERRIDES_JSON`: JSON object `<packageName, version>`
- `NPM_TOKEN`: npm token

## Impacted Package Detection (prerelease)

For `dev` / `rc` prerelease tags, `scripts/ci/publish/src/ci-publish.ts`:

1. detects changed files via `git diff --name-only <base> <head>`
2. maps files to publishable packages (`packages/*`)
3. propagates impact to internal dependents (dependency graph)
4. publishes in topological order

## Internal Dependency Rewrite for Prerelease Publishes

Problem addressed:

- if `lib-b` depends on `lib-a`, publishing `lib-b` in `rc/dev` without rewriting its dependency may leave it pointing to the stable version of `lib-a`

Implemented solution:

- the orchestrator computes a mapping of prerelease versions published in the run
- this mapping is passed through `NPM_INTERNAL_DEP_OVERRIDES_JSON`
- the shared helper temporarily rewrites these fields:
- `dependencies`
- `peerDependencies`
- `optionalDependencies`
- `devDependencies`

## Add a New Publishable Library (checklist)

### Prerequisites

- The library lives in `packages/<name>` (the CI discoverer scans `packages/*`)
- The library has a `package.json` with stable `name` and `version` (`x.y.z`)
- The library exposes a `publish:ci` script

### Recommended Steps

1. Produce a publishable artifact with a `package.json` in a target directory (e.g. `dist/web`, `dist/npm`)
2. Create a `publish:ci` wrapper that calls the shared helper `publishNpmPackageDirectory(...)`
3. Parse standard CI env vars:

- `NPM_DIST_TAG`
- `NPM_PUBLISH_VERSION`
- `CI_PUBLISH_TIMESTAMP`
- `NPM_INTERNAL_DEP_OVERRIDES_JSON`

4. Add minimum unit tests for the wrapper (or at least for package-specific logic)
5. Verify the package is discovered as “publishable” (presence of `scripts.publish:ci`)

## Minimal Template (package wrapper)

```ts
import process from 'node:process';
import { join } from 'node:path';
import { Logger } from '.../scripts/helpers/log/logger.ts';
import { parseJsonStringRecord, parseNumber } from '.../scripts/helpers/env/parse-value.ts';
import { publishNpmPackageDirectory } from '.../scripts/helpers/npm/publish-package-directory.ts';

export async function publishMyPackage(): Promise<void> {
  const logger = Logger.root();

  await publishNpmPackageDirectory({
    packageDirectory: join(process.cwd(), 'dist/npm'),
    tag: process.env['NPM_DIST_TAG'],
    publishTimestamp: parseNumber(process.env['CI_PUBLISH_TIMESTAMP']),
    versionOverride: process.env['NPM_PUBLISH_VERSION'],
    internalDependencyVersionOverrides: parseJsonStringRecord(
      process.env['NPM_INTERNAL_DEP_OVERRIDES_JSON'],
      'NPM_INTERNAL_DEP_OVERRIDES_JSON',
    ),
    logger,
  });
}
```

Note:

- Use `tag: 'latest'` (or omit `tag`) for stable publishes, and `tag: 'dev' | 'rc'` for prereleases
- The helper handles temporary `package.json` rewrite/restoration

## Recommended Verification (before merge)

### Unit Tests

```bash
yarn vitest run scripts/ci/publish/src/*.test.ts \
  scripts/helpers/npm/publish-package-directory.test.ts \
  packages/<lib>/.../publish-*.test.ts
```

### GitHub Actions Scenarios to Validate at Least Once

- Internal PR without `dev` label -> no `ci:publish` step
- Internal PR with `dev` label -> `dev` publish
- Fork PR with `dev` label -> dry-run
- push `develop` -> `rc` publish
- push `main` -> stable publish if version is missing on npm

## Limitations / Watchouts

- The current CI discoverer only scans `packages/*` (not `apps/*`)
- Each new publishable library still needs a `publish:ci` wrapper (but the heavy logic is now shared)
- External PRs (forks) do not have access to `NPM_TOKEN`, so real publish is not possible (dry-run is expected)

## Test References (current evidence)

Tests covering the workflow and the shared helper:

- `scripts/ci/publish/src/ci-publish.test.ts`
- `scripts/ci/publish/src/ci-publish.workspace-publisher.test.ts`
- `scripts/helpers/npm/publish-package-directory.test.ts`
- `packages/tokens/scripts/scripts/publish-tokens/src/publish-tokens.test.ts`
