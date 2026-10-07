# @infomaniak-design-system/figma-plugin-icons

## 0.1.0

### Minor Changes

- [#386](https://github.com/Infomaniak/design-system/pull/386) [`8706409`](https://github.com/Infomaniak/design-system/commit/87064096c155b35e044b59c055656e95f37c796f): Added the ESDS icons Figma plugin, a multi-size icon generator for the Infomaniak Design System. Given a 24×24px Component (or ComponentSet), the plugin generates scaled variants (16, 20, 24, 32, 40 px), vectorizes their strokes and assembles everything into a `[generated]` ComponentSet with `size` and `filled` variant properties. Stroke weights per size are configurable and persist per user, and stroke variables from enabled team libraries can be adopted automatically. The plugin is distributed as a GitHub Release asset (`esds-icons.zip`) and imported locally in Figma Desktop as a development plugin — it is not published to the Figma Community. See the [designer guide](https://infomaniak.github.io/design-system/storybook/main/?path=/docs/designers-guide-figma-plugins--docs) for installation and usage.
