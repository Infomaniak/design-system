import type { CleanUpFunction } from '../../helpers/.private/misc/clean-up-function.ts';
import {
  AttributeRegistry,
  CustomAttribute,
  type CustomAttributeDefinition,
} from '../../helpers/custom-attribute/custom-attribute.ts';
import { InjectableStyle } from '../../helpers/style/injectable-style.ts';

import style from './esds-link.component.css?inline';

const styleSheet = InjectableStyle.parse(style);

export interface EsdsLinkAttrDefineOptions {
  readonly registry?: AttributeRegistry;
}

export class EsdsLinkAttr extends CustomAttribute implements CustomAttributeDefinition {
  static define({ registry = AttributeRegistry.root }: EsdsLinkAttrDefineOptions = {}): void {
    registry.defineOptionally('esds-link', EsdsLinkAttr);
  }

  #undo: CleanUpFunction | undefined;

  connectedCallback(): void {
    this.#undo = styleSheet.injectFrom(this.ownerElement!);
  }

  disconnectedCallback(): void {
    this.#undo?.();
    this.#undo = undefined;
  }
}
