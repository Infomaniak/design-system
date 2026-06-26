import { type Context, ContextProvider } from '@lit/context';
import { ref } from 'lit/directives/ref.js';
import { batchedEffect } from 'signal-utils/subtle/batched-effect';
import type { CleanUpFunction } from '../misc/clean-up-function.ts';
import { isSignal } from '../signal/signal/is-signal.ts';
import type { Signal } from '../signal/signal/signal.ts';
import { htmlElementRef } from './html-element-ref.ts';

// NOTE: re-export `provider` parts of `@lit/context` to make it available to `@infomaniak-design-system/components` consumers
export {
  ContextProvider,
  ContextRoot,
  type Context,
  type ContextCallback,
  type ContextEvent,
  type ContextType,
} from '@lit/context';

export type GenericContext = Context<unknown, unknown>;

export type GenericContextProvider = ContextProvider<GenericContext, HTMLElement>;

export type ProvideContextEntry<GKey, GValue> = readonly [
  Context<GKey, GValue>,
  GValue | Signal<GValue>,
];

export type GenericProvideContextEntry = ProvideContextEntry<unknown, unknown>;

export type ProvideContextEntries = Iterable<GenericProvideContextEntry>;

/**
 * Provides context as a `lit` directive to apply to an HTML element.
 *
 * @inheritDoc https://github.com/webcomponents-cg/community-protocols/blob/main/proposals/context.md
 * @param {ProvideContextEntries} entries - A collection of context-value pairs to be provided.
 * @return {ReturnType<typeof ref>} A `lit` reference that can be assigned to an HTML element to set up the context.
 */
export function provideContext(entries: ProvideContextEntries): ReturnType<typeof ref> {
  return htmlElementRef((element: HTMLElement): CleanUpFunction => {
    const cleanupFunctions: CleanUpFunction[] = [];

    for (const [context, value] of entries) {
      if (isSignal(value)) {
        const contextProvider = new ContextProvider(element, {
          context,
          initialValue: value.get(),
        });

        cleanupFunctions.push((): void => {
          contextProvider.clearCallbacks();
        });

        cleanupFunctions.push(
          batchedEffect((): void => {
            contextProvider.setValue(value.get());
          }),
        );
      } else {
        const contextProvider = new ContextProvider(element, {
          context,
          initialValue: value,
        });

        cleanupFunctions.push((): void => {
          contextProvider.clearCallbacks();
        });
      }
    }

    return (): void => {
      for (let i: number = 0; i < cleanupFunctions.length; i++) {
        cleanupFunctions[i]();
      }
    };
  });
}
