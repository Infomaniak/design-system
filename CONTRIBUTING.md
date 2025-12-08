# Contributing

This projet is open to everyone. Feel free to test the library, share it, improve it, and create merge requests.

## Getting started

The library requires [Node.js](https://nodejs.org/en) `24+` and [yarn](https://yarnpkg.com/).

First, we use the expected node's version:

```shell
nvm use
```

> [!TIP]  
> If you don't have [nvm](https://github.com/nvm-sh/nvm), you may manually [install and use](https://nodejs.org/en/download) Node.js 24+.

Then, let's use the proper package manager (`yarn`):

```shell
corepack enable
```

And install the dependencies:

```shell
yarn install
```

Next, we'll have to create a file named `.env`:

```shell
cp .env.example .env
```

And replace the corresponding variables:

### Generate a `FIGMA_API_TOKEN`

Go to https://www.figma.com

On the top left corner, hover the menu, and click on `Settings`:

![](./assets/tokens/figma/figma-token-generation--settings-menu.png)

Then, click on the `Security` tab, and click on `Generate new token`:

![](./assets/tokens/figma/figma-token-generation--settings-security.png)

This will open a modal to set-up your token. Fill the form and click `Generate token`:

![](./assets/tokens/figma/figma-token-generation--settings--generate-token.png)

Finally, **COPY THIS TOKEN**. This is the only time you'll be able to do so, so don't skip this step.

![](./assets/tokens/figma/figma-token-generation--settings--copy-token.png)

#### Store the token locally in your `.env` file

You may put this token inside your `.env` file:

```dotenv
FIGMA_API_TOKEN="figd_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

## Code

- The source code is located in the `src` directory.
- The projet uses [prettier](https://prettier.io/) to format the code. You'll want to enable and configure it in your IDE.
- The tests run with [vitest](https://vitest.dev)

## Commands

- `build`: builds the library.
- `test`: builds the library.


## To create an MR

1. fork the repository
1. add the feature/fix by modifying the code in the `src/` directory
1. add/write some tests until 100% code coverage is reached (run the tests with `yarn test:coverage`)
1. format the code, using the command `yarn format`
1. commit and push your work following the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) convention
1. create an MR from your repository to the upstream repository, explaining clearly what was added/fixed.

