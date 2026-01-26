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

## Code

- The source code is located in the `src` directory.
- The projet uses [prettier](https://prettier.io/) to format the code. You'll want to enable and configure it in your IDE.
- The tests run with [vitest](https://vitest.dev)

## Commands

[//]: # 'TODO'

- `build`: builds the library.
- `test`: tests the library.

## Create a pull request

1. fork the repository
1. add the feature/fix by modifying the existing code
1. add/write some tests until 100% code coverage is reached (run the tests with `yarn test:coverage`)
1. format the code, using the command `yarn format`
1. commit and push your work following the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) convention
1. create a PR from your repository to the upstream repository, explaining clearly what was added/fixed.
