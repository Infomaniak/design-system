# Contributing

This project is open to everyone. Feel free to test the library, share it, improve it, and create merge requests.

## Getting started

### Tools

#### [nvm](https://github.com/nvm-sh/nvm)

We recommend using [nvm](https://github.com/nvm-sh/nvm) to manage your Node.js versions.

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

#### [Node](https://nodejs.org)

```shell
nvm use

# Verify the Node.js version:
node -v
```

#### [Yarn](https://yarnpkg.com)

```shell
corepack enable yarn

# Verify Yarn version:
yarn -v

# Install the dependencies:
yarn install
```

### Environment variables

```shell
# Copy the example file into .env:
cp .env.example .env
```

And replace the corresponding variables:

- `FIGMA_API_TOKEN` ([guide](docs/figma/api-token/figma-api-token.md))
- `FIGMA_TOKENS_FILE_KEY`
- `FIGMA_ICON_FILE_KEY`
- `FIGMA_ILLUSTRATION_FILE_KEY`
- `NPM_TOKEN` (required for npm publish workflows)
- `KCHAT_WEBHOOK_ID` (used by PR ready workflow notifications)

Optional local CI publish variables (for manual checks):

- `GITHUB_REF_NAME` (`main` or `develop`)
- `CI_PUBLISH_STRICT_VERSION_POLICY` (`true` by default)
- `CI_PUBLISH_DRY_RUN` (`true`/`false`)

## Submit a pull request

### Rules

- The branches must follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) convention:
  - `feat/xxx`: for a new feature
  - `fix/xxx`: for a bug fix
  - `docs/xxx`: for documentation changes
  - etc...
- The commits must follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) convention.
  - NOTE: to preserve the commit history, do not squash the commits when working on or merging a PR.
- The PR must be based on the `main` branch and target the `main` branch.
- The PR must be marked as `Draft` while you're working on the feature/fix.
- The PR must be marked as `Ready` for review when all the following conditions are met:
  - The PR must be up to date with the `main` branch.
  - The PR must include tests for the new feature/fix with a target of 100% code coverage (`yarn test:coverage`)
  - The PR must be formated using `yarn format`.
- Approval must meet these conditions:
  - The PR must be reviewed by at least one of the maintainers, different from the author.
  - All comments on the PR must be resolved:
    - Authors of comments must follow the [Conventional Comments](https://conventionalcomments.org/) convention.
    - When an update linked to a comment has been done, the author of this update adds a `DONE` comment to the correspondong thread (the author must not resolve the comment by itself).
    - Then, the author of the comment:
      - accepts the update by resolving the comment
      - or adds another comment asking for a better alternative.
    - **NOTE:** only the author of the comment can resolve it, not the author of the PR.
- When the PR is approved:
  - If the author is a maintainer: the author merges the PR.
  - If the author is an external contributor: a maintainer merges the PR (usually the one having done the review).

### For infomaniak's team / project's maintainers

Create a new branch from `main` following the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) convention, and create the associated `Draft` PR.

### For external contributors

Fork the repository, update the code, create a PR from your repository to the upstream repository, explaining clearly what was added/fixed.

## Code

- The repository is a monorepo:
  - `packages/` for libraries and token tooling
  - `apps/` for deployable apps (Storybook docs)
  - `scripts/` for automation and CI helpers
- The project uses [prettier](https://prettier.io/) to format the code. You'll want to enable and configure it in your IDE.
- The tests run with [vitest](https://vitest.dev).

## Commands

- `yarn install`: install dependencies
- `yarn build`: build all workspaces in topological order
- `yarn build:tokens`: build tokens package
- `yarn build:docs`: build Storybook docs
- `yarn test`: run test suite
- `yarn test:coverage`: run tests with coverage
- `yarn format`: format source files
- `yarn ci:on-pull-request`: run PR-ready automation script
- `yarn ci:storybook-pr --mode=prepare|comment`: run Storybook PR CI helper locally
- `yarn ci:storybook-pages --mode=prepare|postbuild`: run Storybook Pages helper locally
- `GITHUB_REF_NAME=develop yarn ci:publish`: run branch-based publish orchestration manually

## CI Workflows

- `.github/workflows/publish.yml`
  - Trigger: `push` on `main` and `develop`
  - Steps: `yarn install --immutable`, `yarn build`, `yarn test`, `yarn ci:publish`
  - Publish behavior:
    - Reads package `name` and `version` from each package `package.json`
    - Checks npm registry first (`name@version`)
    - Publishes only missing versions (idempotent workflow)
    - Uses branch dist-tags: `develop => rc`, `main => latest`
    - With `CI_PUBLISH_STRICT_VERSION_POLICY=true`:
      - `develop` requires `x.y.z-rc.n`
      - `main` requires stable `x.y.z`

- `.github/workflows/build-on-pr.yml`
  - Trigger: PR events (`opened`, `synchronize`, `reopened`, `ready_for_review`, `converted_to_draft`) and manual dispatch.
  - Uses `scripts/ci/storybook-pr/storybook-pr.script.ts` to:
    - detect relevant changed files (docs/packages/build-related)
    - decide build vs skip for draft/non-relevant updates
    - post/update a sticky PR comment with status and deployment URL
  - Uses `scripts/ci/storybook-pages/storybook-pages.script.ts` to resolve deploy context and normalize Storybook output for subpath hosting.
  - Builds Storybook from `apps/docs`, deploys to GitHub Pages on `mr/<pr-number>/`, and uploads PR artifact.

- `.github/workflows/build-storybook.yml`
  - Trigger: `push` on `main`, `develop`, tags, and manual dispatch.
  - Builds Storybook from `apps/docs`, normalizes subpath hosting assets, deploys to GitHub Pages with env segments:
    - `main` => `main/`
    - `develop` => `develop/`
    - `tag` => `tags/<tag>/`
  - Uploads a short-lived build artifact.

- `.github/workflows/pr-ready-for-review.yml`
  - Trigger: PR `opened` and `ready_for_review`
  - Runs `yarn ci:on-pull-request`.
