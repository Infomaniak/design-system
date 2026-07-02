import { EsdsIconComponent, IconifyApi } from '@infomaniak-design-system/esds-icon';
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import type { Preview } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';
import { Globals, GlobalsUpdatedPayload } from 'storybook/internal/types';
import MaterialThemeBuilderLink from '../src/components/MaterialThemeBuilderLink.tsx';
import Table from '../src/components/Table.tsx';

import '../src/styles/data-preview-value.css';
import '../src/styles/main.css';
import '../src/styles/token-tables.css';

// Import base CSS tokens
import '@infomaniak-design-system/tokens/dist/web/css/material/tokens.root.css';

// Import all product modifiers (for dynamic switching via data-esds-product attribute)
import '@infomaniak-design-system/tokens/dist/web/css/material/modifiers/product/calendar.attr.css';
import '@infomaniak-design-system/tokens/dist/web/css/material/modifiers/product/contacts.attr.css';
import '@infomaniak-design-system/tokens/dist/web/css/material/modifiers/product/euria.attr.css';
import '@infomaniak-design-system/tokens/dist/web/css/material/modifiers/product/infomaniak.attr.css';
import '@infomaniak-design-system/tokens/dist/web/css/material/modifiers/product/kchat.attr.css';
import '@infomaniak-design-system/tokens/dist/web/css/material/modifiers/product/kdrive.attr.css';
import '@infomaniak-design-system/tokens/dist/web/css/material/modifiers/product/knote.attr.css';
import '@infomaniak-design-system/tokens/dist/web/css/material/modifiers/product/mail.attr.css';
import '@infomaniak-design-system/tokens/dist/web/css/material/modifiers/product/security.attr.css';
import '@infomaniak-design-system/tokens/dist/web/css/material/modifiers/product/swisstransfer.attr.css';

// Import all theme modifiers (for dynamic switching via data-esds-theme attribute)
import '@infomaniak-design-system/tokens/dist/web/css/material/modifiers/theme/dark.attr.css';
import '@infomaniak-design-system/tokens/dist/web/css/material/modifiers/theme/light.attr.css';

// Initialize EsdsIconComponent for the <esds-icon> elements
const iconifyEndpoint =
  import.meta.env.VITE_ICONIFY_API_URL ?? 'https://iconify.preprod.dev.infomaniak.ch';
EsdsIconComponent.init(
  new IconifyApi({
    resources: [iconifyEndpoint],
  }),
);

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

const TOOLTIP_HIDE_DELAY_MS = 1500;
const TOOLTIP_OFFSET_Y = 35;

/**
 * Creates and manages a singleton tooltip for copy-to-clipboard functionality
 */
const tooltipManager = (() => {
  let tooltip: HTMLElement | null = null;

  const create = () => {
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'copy-tooltip';
      tooltip.setAttribute('role', 'status');
      tooltip.setAttribute('aria-live', 'polite');
      document.body.appendChild(tooltip);
    }
    return tooltip;
  };

  const show = (text: string, x: number, y: number) => {
    const el = create();
    el.textContent = text;
    // Use CSS custom properties for positioning
    el.style.setProperty('--tooltip-x', `${x}px`);
    el.style.setProperty('--tooltip-y', `${y - TOOLTIP_OFFSET_Y}px`);
    el.style.opacity = '1';
  };

  const hide = () => {
    if (tooltip) {
      tooltip.style.opacity = '0';
    }
  };

  const destroy = () => {
    if (tooltip && tooltip.parentNode) {
      tooltip.parentNode.removeChild(tooltip);
      tooltip = null;
    }
  };

  return { show, hide, destroy };
})();

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

  // Handle copy-to-clipboard functionality for token tables with tooltip
  useEffect(() => {
    let hideTimeout: ReturnType<typeof setTimeout> | null = null;

    const showTooltipForElement = (element: HTMLElement, text: string) => {
      const rect = element.getBoundingClientRect();
      tooltipManager.show(text, rect.left + rect.width / 2, rect.top);
    };

    const handleMouseEnter = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement) {
        const clipboardEl = target.closest('[data-clipboard]') as HTMLElement;

        if (clipboardEl) {
          showTooltipForElement(clipboardEl, 'Copy to clipboard');
        }
      }
    };

    const handleMouseLeave = (event: MouseEvent) => {
      const target = event.target;
      const relatedTarget = event.relatedTarget;
      if (
        target instanceof HTMLElement &&
        (relatedTarget instanceof HTMLElement || relatedTarget === null)
      ) {
        const clipboardEl = target.closest('[data-clipboard]');
        const relatedClipboardEl = relatedTarget?.closest('[data-clipboard]');

        if (clipboardEl && !relatedClipboardEl) {
          tooltipManager.hide();
        }
      }
    };

    const handleScroll = () => {
      // Hide tooltip on scroll to prevent it from floating in wrong position
      tooltipManager.hide();
    };

    const handleClick = async (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement) {
        const clipboardEl = target.closest('[data-clipboard]');

        if (clipboardEl) {
          event.preventDefault();
          const value = clipboardEl.getAttribute('data-clipboard');
          if (value) {
            try {
              await navigator.clipboard.writeText(value);
              showTooltipForElement(clipboardEl as HTMLElement, 'Copied!');

              if (hideTimeout) clearTimeout(hideTimeout);
              hideTimeout = setTimeout(() => tooltipManager.hide(), TOOLTIP_HIDE_DELAY_MS);
            } catch (err) {
              console.error('Failed to copy:', err);
            }
          }
        }
      }
    };

    // Use a flag to track if we've already initialized (prevents duplicate listeners)
    const isInitialized = document.body.hasAttribute('data-clipboard-initialized');

    if (!isInitialized) {
      document.body.setAttribute('data-clipboard-initialized', 'true');
      document.addEventListener('click', handleClick);
      document.addEventListener('mouseenter', handleMouseEnter, true);
      document.addEventListener('mouseleave', handleMouseLeave, true);
      window.addEventListener('scroll', handleScroll, { passive: true });

      // Cleanup on unmount only if this was the initializing instance
      return () => {
        document.removeEventListener('click', handleClick);
        document.removeEventListener('mouseenter', handleMouseEnter, true);
        document.removeEventListener('mouseleave', handleMouseLeave, true);
        window.removeEventListener('scroll', handleScroll);
        if (hideTimeout) clearTimeout(hideTimeout);
        tooltipManager.destroy();
        document.body.removeAttribute('data-clipboard-initialized');
      };
    }
  }, []);

  // Resolve color preview values browser-side so they reflect
  // theme/product CSS overrides dynamically.
  useEffect(() => {
    function rgbToHex(rgb: string): string {
      const match = rgb.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+)?\s*\)$/);
      if (!match) return rgb;
      const [, r, g, b] = match;
      return (
        '#' +
        [r, g, b]
          .map((n) => Number(n).toString(16).padStart(2, '0'))
          .join('')
          .toUpperCase()
      );
    }

    function resolveColorPreviewValues(): void {
      if (typeof document === 'undefined') return;
      const elements: NodeListOf<Element> = document.querySelectorAll('[data-preview-value]');
      if (elements.length === 0) return;

      const temp: HTMLDivElement = document.createElement('div');
      temp.style.position = 'fixed';
      temp.style.opacity = '0';
      temp.style.pointerEvents = 'none';
      temp.style.left = '-9999px';
      document.body.appendChild(temp);

      try {
        elements.forEach((element): void => {
          const cssVar: string | null = element.getAttribute('data-preview-value');
          if (!cssVar) return;

          temp.style.backgroundColor = '';
          temp.style.backgroundColor = `var(${cssVar})`;

          const resolved: string = window
            .getComputedStyle(temp)
            .getPropertyValue('background-color');
          const hexValue: string = rgbToHex(resolved.trim());

          if (element.textContent !== hexValue) {
            element.textContent = hexValue;
          }
        });
      } finally {
        document.body.removeChild(temp);
      }
    }

    // Resolve immediately and after a short delay (docs render tables asynchronously)
    resolveColorPreviewValues();
    const timeout: ReturnType<typeof setTimeout> = setTimeout(resolveColorPreviewValues, 500);

    // Watch for newly added color preview elements (e.g. when navigating between docs pages)
    const observer: MutationObserver = new MutationObserver((mutations: MutationRecord[]): void => {
      const hasNewColorElements: boolean = mutations.some((mutation: MutationRecord): boolean => {
        return Array.from(mutation.addedNodes).some((node: Node): boolean => {
          if (!(node instanceof Element)) return false;
          return (
            node.matches('[data-preview-value]') ||
            node.querySelector('[data-preview-value]') !== null
          );
        });
      });

      if (hasNewColorElements) {
        resolveColorPreviewValues();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return (): void => {
      clearTimeout(timeout);
      observer.disconnect();
    };
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
        MaterialThemeBuilderLink,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
    options: {
      storySort: {
        order: [
          'Welcome',
          'Design Tokens',
          ['Getting Started', '*', 'Material'],
          'Icons',
          ['Getting Started', '*'],
          '*',
        ],
      },
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
