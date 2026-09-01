import type { Config } from 'stylelint';

export default {
  extends: ['stylelint-config-standard-scss'],
  // https://stylelint.io/user-guide/rules
  // https://github.com/stylelint-scss/stylelint-scss/tree/master/src/rules
  rules: {
    'comment-empty-line-before': null, // allow flexibility in comments
    'comment-whitespace-inside': null, // allow flexibility in comments
    'declaration-no-important': [true, { severity: 'warning' }], // allow !important, but warn to avoid accidental or over-use
    'import-notation': 'string', // use string instead of url
    'no-unknown-animations': true, // prevent global animations
    'no-unknown-custom-media': true, // prevent global media queries
    // 'no-unknown-custom-properties': false, // allow DS tokens
    'relative-selector-nesting-notation': 'explicit', // make nested selectors more readable
    'selector-class-pattern': '^[a-z]+((__|-|--)[a-z]+)*$', // allow dash-case and BEM notation
    'selector-no-deprecated': true, // prevent deprecated selectors
    'selector-no-invalid': true, // prevent invalid selectors
    // scss
    'scss/at-rule-no-unknown': [true, { ignoreAtRules: ['reference'] }], // for tailwind support
    'scss/operator-no-newline-after': null, // for prettier compatibility
  },
  ignoreFiles: [
    '**/dist/**',
    '**/coverage/**',
    '**/storybook-static/**',
    '**/.idea/**',
    '**/.yarn/**',
    '**/.git/**',
    '**/.svn/**',
    '**/.hg/**',
    '**/node_modules/**',
  ],
} satisfies Config;
