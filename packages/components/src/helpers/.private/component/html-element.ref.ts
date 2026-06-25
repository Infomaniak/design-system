import { ref } from 'lit/directives/ref.js';
import type { CleanUpFunction } from '../misc/clean-up-function.ts';

export interface HTMLElementRefCallback {
  (element: HTMLElement): CleanUpFunction | void | undefined;
}

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
