# Contributing

This projet is open to everyone. Feel free to test the library, share it, improve it, and create merge requests.

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

- [FIGMA_API_TOKEN](docs/figma/api-token/figma-api-token.md)

## Submit a pull request

### Rules

- The branches must follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) convention:
  - `feat/xxx`: for a new feature
  - `fix/xxx`: for a bug fix
  - `docs/xxx`: for documentation changes
  - etc...
- The commits must follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) convention.
- The PR must be marked as `Draft` while you're working on the feature/fix.
- The PR must be marked and as `Ready` for review when all the following conditions are met:
  - The PR must be up-to-date with the `main` branch.
  - The PR must include tests for the new feature/fix with a target of 100% code coverage (`yarn test:coverage`)
  - The PR must be formated using `yarn format`.
  - All comments on the PR must be resolved before approval:
    - Authors of comments must follow the [Conventional Comments](https://conventionalcomments.org/) convention.
    - When an update linked to a comment has been done, the author of this update adds a `DONE` comment to the correspondong thread (the author must not resolve the comment by itself).
    - Then, the author of the comment:
      - accepts the fix by resolving the comment
      - or adds another comment asking for a better alternative.
    - **NOTE:** only the author of the comment can resolve it, not the author of the PR.
- The PR must be reviewed by at least one of the maintainers, different from the author, before approval.
- When the PR is approved:
  - If the author is a maintainer: the author merges the PR.
  - If the author is an external contributor: a maintainer merges the PR (usually the one having done the review).

### For infomaniak's team / project's maintainers

Create a new branch from `main` following the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) convention, and create the associated `Draft` PR.

### For external contributors

Fork the repository, update the code, create a PR from your repository to the upstream repository, explaining clearly what was added/fixed.

## Code

- The source code is located in the `src` directory.
- The projet uses [prettier](https://prettier.io/) to format the code. You'll want to enable and configure it in your IDE.
- The tests run with [vitest](https://vitest.dev)

## Commands

[//]: # 'TODO'

- `build`: builds the library.
- `test`: tests the library.
