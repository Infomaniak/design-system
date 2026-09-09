import type { StorybookTheme } from 'storybook/theming';

// Storybook's bundled d.ts breaks its internal `interface Theme extends StorybookTheme {}`
// augmentation for consumers, so `theme` in styled callbacks resolves to emotion's empty Theme.
// Re-apply the augmentation for this app.
declare module 'storybook/theming' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Theme extends StorybookTheme {}
}
