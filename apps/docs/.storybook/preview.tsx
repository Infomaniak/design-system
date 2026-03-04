import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import type { Preview } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';
import { Globals, GlobalsUpdatedPayload } from 'storybook/internal/types';
import Table from '../src/components/Table.tsx';

// Import base CSS tokens
import '@infomaniak-design-system/tokens/dist/web/css/tokens.root.css';

// Import all product modifiers (for dynamic switching via data-esds-product attribute)
import '@infomaniak-design-system/tokens/dist/web/css/modifiers/product/calendar.attr.css';
import '@infomaniak-design-system/tokens/dist/web/css/modifiers/product/contacts.attr.css';
import '@infomaniak-design-system/tokens/dist/web/css/modifiers/product/euria.attr.css';
import '@infomaniak-design-system/tokens/dist/web/css/modifiers/product/infomaniak.attr.css';
import '@infomaniak-design-system/tokens/dist/web/css/modifiers/product/kchat.attr.css';
import '@infomaniak-design-system/tokens/dist/web/css/modifiers/product/kdrive.attr.css';
import '@infomaniak-design-system/tokens/dist/web/css/modifiers/product/knote.attr.css';
import '@infomaniak-design-system/tokens/dist/web/css/modifiers/product/mail.attr.css';
import '@infomaniak-design-system/tokens/dist/web/css/modifiers/product/security.attr.css';
import '@infomaniak-design-system/tokens/dist/web/css/modifiers/product/swisstransfer.attr.css';

// Import all theme modifiers (for dynamic switching via data-esds-theme attribute)
import '@infomaniak-design-system/tokens/dist/web/css/modifiers/theme/dark.attr.css';
import '@infomaniak-design-system/tokens/dist/web/css/modifiers/theme/light.attr.css';

/**
 * Utility function to set data attributes on document.body for CSS theming
 * Used by both CustomDocsContainer (for MDX docs) and decorator (for stories)
 */
const setBodyAttributes = (product: string, theme: string) => {
  if (typeof document !== 'undefined') {
    document.body.setAttribute('data-esds-product', product);
    document.body.setAttribute('data-esds-theme', theme);
  }
};

/**
 * Custom wrapper for MDX files
 */
const CustomDocsContainer = (props: DocsContainerProps) => {
  const { context } = props;
  const [globals, setGlobals] = useState<Globals>(() => {
    // @ts-expect-error: store is internal API
    const currentGlobals = context.store?.userGlobals?.globals || {};

    return {
      product: currentGlobals.product,
      theme: currentGlobals.theme,
    };
  });

  // Listen to GLOBALS_UPDATED events from Storybook's channel via context
  useEffect(() => {
    const handleGlobalsUpdated = (event: GlobalsUpdatedPayload) => {
      setGlobals(event?.globals || {});
    };

    context.channel.on(GLOBALS_UPDATED, handleGlobalsUpdated);

    return () => {
      context.channel.off(GLOBALS_UPDATED, handleGlobalsUpdated);
    };
  }, [context.channel]);

  const product = globals.product || 'infomaniak';
  const theme = globals.theme || 'light';

  useEffect(() => {
    setBodyAttributes(product, theme);
  }, [product, theme]);

  return <DocsContainer {...props} />;
};

const preview: Preview = {
  parameters: {
    controls: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
    docs: {
      container: CustomDocsContainer,
      components: {
        Table,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  decorators: [
    // Apply data attributes to body based on global toolbar selections
    (StoryFn, context) => {
      const product = context.globals.product || 'infomaniak';
      const theme = context.globals.theme || 'light';
      setBodyAttributes(product, theme);

      return StoryFn();
    },
  ],
};

export default preview;

/**
 * Global types for toolbar selectors with URL persistence.
 * Storybook automatically persists these in the URL (e.g., ?globals=product:mail;theme:dark)
 */
export const globalTypes = {
  product: {
    name: 'Product',
    description: 'Product selector',
    defaultValue: 'infomaniak',
    toolbar: {
      icon: 'box',
      items: [
        { value: 'infomaniak', title: 'Infomaniak' },
        { value: 'mail', title: 'Mail' },
        { value: 'kdrive', title: 'kDrive' },
        { value: 'kchat', title: 'kChat' },
        { value: 'calendar', title: 'Calendar' },
        { value: 'contacts', title: 'Contacts' },
        { value: 'knote', title: 'kNote' },
        { value: 'security', title: 'Security' },
        { value: 'euria', title: 'Euria' },
        { value: 'swisstransfer', title: 'SwissTransfer' },
      ],
      showName: true,
      dynamicTitle: true,
    },
  },
  theme: {
    name: 'Theme',
    description: 'Theme selector',
    defaultValue: 'light',
    toolbar: {
      icon: 'eye',
      items: [
        { value: 'light', title: 'Light' },
        { value: 'dark', title: 'Dark' },
      ],
      showName: true,
      dynamicTitle: true,
    },
  },
};
