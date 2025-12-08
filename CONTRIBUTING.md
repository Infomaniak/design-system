# Contributing

This projet is open to everyone. Feel free to test the library, share it, improve it, and create merge requests.

### Getting started

The library requires [Node.js](https://nodejs.org/en) `24+` and [yarn](https://yarnpkg.com/).

First, we have to use the correct version of node:

```shell
nvm use
```

If you don't have [nvm](https://github.com/nvm-sh/nvm), you may manually install and use Node.js 24+.

Then, we have to use the proper package manager (here `yarn`):

```shell
corepack enable
```

And install the dependencies:

```shell
yarn install
```

### Code

- The source code is located in the `src` directory.
- The projet uses [prettier](https://prettier.io/) to format the code. You'll want to enable and configure it in your IDE.
- The tests run with [vitest](https://vitest.dev)

### Commands

- `build`: builds the library.
- `test`: builds the library.


### To create an MR

1. fork the repository
1. add the feature/fix by modifying the code in the `src/` directory
1. add/write some tests until 100% code coverage is reached (run the tests with `yarn test:coverage`)
1. format the code, using the command `yarn format`
1. commit and push your work following the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) convention
1. create an MR from your repository to the upstream repository, explaining clearly what was added/fixed.

