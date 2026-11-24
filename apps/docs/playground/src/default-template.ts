/**
 * The four default files of a new playground project.
 *
 * Zero-magic principle: every file is visible and editable in the editor. The
 * template is intentionally copy-pasteable integration code — what a consumer
 * would actually write on a plain HTML page to use the design system.
 *
 * JS dependency versions live in the visible `package.json` (playground's
 * module resolution reads it, like npm); CSS dependency versions live in the
 * `<link>` URLs.
 */

const TEMPLATE_INDEX_HTML = `<!doctype html>
<head>
  <!-- Design tokens + theming. Update @latest to a version (e.g. @0.10.0) to pin. -->
  <link rel="stylesheet" href="https://unpkg.com/@infomaniak-design-system/tokens@latest/css/tokens.root.css">
  <link rel="stylesheet" href="https://unpkg.com/@infomaniak-design-system/tokens@latest/css/modifiers/all.attr.css">
  <link rel="stylesheet" href="https://fonts.storage.infomaniak.com/design-system/latest/infomaniak-sans.min.css">
  <script type="module" src="./setup.js"></script>
  <script type="module" src="./script.js"></script>
</head>
<body data-esds-product="infomaniak" data-esds-theme="light">
  <h1 esds-heading="2xl">
    Hello world <esds-icon name="esds:megaphone" />
  </h1>
  <esds-separator></esds-separator>
  <p esds-body="md">
    And welcome to the Playground.
  </p>
  <button esds-button data-esds-avatar-size="small">
    <esds-avatar></esds-avatar>
    Click me!
  </button>
</body>
`;

const TEMPLATE_PACKAGE_JSON = `{
  "dependencies": {
    "@infomaniak-design-system/components": "latest",
    "lit": "^3.3.3"
  }
}
`;

const TEMPLATE_SETUP_TS = `import {
  EsdsAvatarButtonAttr,
  EsdsAvatarComponent,
  EsdsAvatarGroupComponent,
  EsdsBadgeComponent,
  EsdsBodyAttr,
  EsdsButtonAttr,
  EsdsHeadingAttr,
  EsdsIconComponent,
  EsdsKbdAttr,
  EsdsSeparatorComponent,
  EsdsTextLinkAttr,
  IconifyApi,
  ICONIFY_API,
  InjectionContext,
} from '@infomaniak-design-system/components';

// Register every component and custom attribute of the design system.
EsdsAvatarComponent.define();
EsdsAvatarGroupComponent.define();
EsdsBadgeComponent.define();
EsdsSeparatorComponent.define();
EsdsIconComponent.define();
EsdsAvatarButtonAttr.define();
EsdsBodyAttr.define();
EsdsButtonAttr.define();
EsdsHeadingAttr.define();
EsdsKbdAttr.define();
EsdsTextLinkAttr.define();

// Configure the icon API used by <esds-icon>.
InjectionContext.root = new InjectionContext([
  ICONIFY_API.define(new IconifyApi({ resources: ['https://iconify.infomaniak.com'] })),
]);
`;

const TEMPLATE_SCRIPT_TS = `// Your code — the design system is ready, write away!
const button = document.querySelector('button');

button?.addEventListener('click', () => {
  console.log('clicked', button);
});
`;

export interface PlaygroundFileConfig {
  readonly content: string;
  readonly selected?: boolean;
}

export interface PlaygroundProjectManifest {
  readonly files: Record<string, PlaygroundFileConfig>;
}

export const DEFAULT_PROJECT_FILES: Readonly<Record<string, PlaygroundFileConfig>> = {
  'index.html': { content: TEMPLATE_INDEX_HTML, selected: true },
  'package.json': { content: TEMPLATE_PACKAGE_JSON },
  'setup.ts': { content: TEMPLATE_SETUP_TS },
  'script.ts': { content: TEMPLATE_SCRIPT_TS },
};
