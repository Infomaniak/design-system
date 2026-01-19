import type { SerializeOptions } from 'colorjs.io';
import { DesignTokensCollection } from '../../design-tokens-collection.ts';
import type { GenericDesignTokensCollectionTokenWithType } from '../../token/design-tokens-collection-token.ts';
import type { DesignTokenNameLike } from '../../token/name/design-token-name-like.ts';
import type { CssVariableDeclaration } from './css-variable-declaration.ts';
import { designTokensCollectionToCssVariableDeclarations } from './token/design-tokens-collection-to-css-variable-declarations.ts';
import { designTokensCollectionTokenToCssVariableDeclaration } from './token/design-tokens-collection-token-to-css-variable-declaration.ts';
import { DEFAULT_GENERATE_CSS_VARIABLE_NAME_FUNCTION } from './token/name/default-generate-css-variable-name-function.ts';
import type { GenerateCssVariableNameFunction } from './token/name/generate-css-variable-name-function.ts';

export interface CssVariablesCollectionOptions {
  readonly generateCssVariableName?: GenerateCssVariableNameFunction;
  readonly formatColorOptions?: SerializeOptions;
}

export class CssVariablesCollection {
  readonly #generateCssVariableName: GenerateCssVariableNameFunction;
  readonly #formatColorOptions: SerializeOptions;

  readonly #variableDeclarations: Map<string /* name */, CssVariableDeclaration>;

  constructor({
    generateCssVariableName = DEFAULT_GENERATE_CSS_VARIABLE_NAME_FUNCTION,
    formatColorOptions = {
      format: 'color',
    },
  }: CssVariablesCollectionOptions = {}) {
    this.#generateCssVariableName = generateCssVariableName;
    this.#formatColorOptions = formatColorOptions;
    this.#variableDeclarations = new Map();
  }

  /* NAME */

  generateCssVariableName(tokenName: DesignTokenNameLike): string {
    return this.#generateCssVariableName(
      DesignTokensCollection.designTokenNameLikeToArray(tokenName),
    );
  }

  /* FROM */

  fromDesignTokensCollectionToken(token: GenericDesignTokensCollectionTokenWithType): this {
    this.setCssVariableDeclaration(
      designTokensCollectionTokenToCssVariableDeclaration(token, {
        generateCssVariableName: this.#generateCssVariableName,
        formatColorOptions: this.#formatColorOptions,
      }),
    );

    return this;
  }

  fromDesignTokensCollection(collection: DesignTokensCollection): this {
    designTokensCollectionToCssVariableDeclarations(collection, {
      generateCssVariableName: this.#generateCssVariableName,
      formatColorOptions: this.#formatColorOptions,
    });

    return this;
  }

  /* MAP */

  get variableDeclarations(): ReadonlyMap<string, CssVariableDeclaration> {
    return this.#variableDeclarations;
  }

  hasCssVariableDeclaration(name: string): boolean {
    return this.#variableDeclarations.has(name);
  }

  setCssVariableDeclaration(declaration: CssVariableDeclaration): void {
    if (this.#variableDeclarations.has(declaration.name)) {
      throw new Error(`CSS variable "${declaration.name}" already exists.`);
    }

    this.#variableDeclarations.set(declaration.name, declaration);
  }

  /* TO */

  cssCssVariableDeclarationToString(declaration: CssVariableDeclaration): string {
    let output: string = '';

    if (declaration.description !== undefined || declaration.deprecated) {
      output += '/*\n';
      const prefix: string = ' * ';

      if (declaration.description) {
        for (const line of declaration.description.split('\n')) {
          output += `${prefix}${line}\n`;
        }
      }

      if (declaration.deprecated) {
        output += `${prefix}@deprecated${typeof declaration.deprecated === 'string' ? ` ${declaration.deprecated}` : ''}\n`;
      }

      output += ' */\n';
    }

    output += `${declaration.name}: ${declaration.value};`;

    return output;
  }

  toString(selector: string): string {
    let output: string = `${selector} {\n`;

    for (const declaration of this.#variableDeclarations.values()) {
      for (const line of this.cssCssVariableDeclarationToString(declaration).split('\n')) {
        output += `  ${line}\n`;
      }
    }

    output += '}';

    return output;
  }
}
