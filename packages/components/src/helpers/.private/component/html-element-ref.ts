import { ref } from 'lit/directives/ref.js';
import type { CleanUpFunction } from '../misc/clean-up-function.ts';

export interface HTMLElementRefCallback {
  (element: HTMLElement): CleanUpFunction | void | undefined;
}

/**
 * Creates a `lit` reference to an HTML element and invokes a callback function when the element becomes available.
 *
 * @param {HTMLElementRefCallback} callback - A function that is invoked when the referenced HTML element is available.
 *    It receives the element as an argument and can return a clean-up function to be executed when the reference changes or is removed.
 * @return {ReturnType<typeof ref>} A `lit` reference that can be assigned to an HTML element to trigger the callback.
 */
export function htmlElementRef(callback: HTMLElementRefCallback): ReturnType<typeof ref> {
  let undo: CleanUpFunction | void | undefined;

  return ref((element: Element | undefined): void => {
    if (undo !== undefined) {
      undo();
      undo = undefined;
    }

    if (element !== undefined && element instanceof HTMLElement) {
      undo = callback(element);
    }
  });
}
