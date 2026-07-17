<h1 align="center">Infomaniak's Design System</h1>

<p align="center">
  <img
    src="./assets/images/infomaniak-logo.svg"
    alt="infomaniak-design-system-logo"
    width="278"
    height="38"
    style="object-fit: contain"
    />
  <br>
  <br>
  <em>The Infomaniak's Design System, featuring design tokens, robust web components and comprehensive guidelines.</em>
  <br>
</p>

<p align="center">
  <a href="https://infomaniak.github.io/design-system/storybook/main"><strong>Documentation</strong></a>
  <br>
</p>

<p align="center">
  <a href="CONTRIBUTING.md">Contributing Guidelines</a>
  ·
  <a href="https://github.com/Infomaniak/design-system/issues">Submit an Issue</a>
  ·
  <a href="https://handbook.design-ik.ch/tag/design-system">Blog (internal)</a>
  <br>
  <br>
</p>

<hr>

## Project structure

- `packages/`: contains the libraries, utilities, ...
  - [tokens/](packages/tokens): contains the design tokens
    - web: [@infomaniak-design-system/components ↗](https://www.npmjs.com/package/@infomaniak-design-system/tokens)
    - ios: [ios-design-system ↗](https://github.com/Infomaniak/ios-design-system)
    - android: [android-design-system ↗](https://github.com/Infomaniak/android-design-system)
  - [components/](packages/components): contains the web components library
    - [@infomaniak-design-system/components ↗](https://www.npmjs.com/package/@infomaniak-design-system/components)
  - [assets/images/svg/](packages/assets/images/svg): contains the SVG icons and illustrations
    - [explore ↗](https://infomaniak.github.io/design-system/storybook/main/?path=/docs/icons-icon-gallery--docs&collection=esds)
- `apps/`: contains the deployable apps
  - [docs/](apps/docs): contains the storybook used as documentation support
    - [explore ↗](https://infomaniak.github.io/design-system/storybook/main)

## Documentation

- Figma:
  - [TokensBrücke](docs/figma/tokens-bruecke/figma-tokens-bruecke.md)
