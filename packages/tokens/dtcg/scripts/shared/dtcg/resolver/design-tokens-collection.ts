import { glob, readFile } from 'node:fs/promises';
import { removeUndefinedProperties } from '../../../../../../../scripts/helpers/misc/remove-undefined-properties.ts';
import { isDesignTokenReference } from '../design-token/reference/is-design-token-reference.ts';
import { designTokenReferenceToCurlyReference } from '../design-token/reference/to/curly-reference/design-token-reference-to-curly-reference.ts';
import type { CurlyReference } from '../design-token/reference/types/curly/curly-reference.ts';
import { isCurlyReference } from '../design-token/reference/types/curly/is-curly-reference.ts';
import { curlyReferenceToSegmentsReference } from '../design-token/reference/types/curly/to/segments-reference/curly-reference-to-segments-reference.ts';
import type { UpdateCurlyReference } from '../design-token/reference/types/curly/update/update-curly-reference.ts';
import { segmentsReferenceToCurlyReference } from '../design-token/reference/types/segments/to/curly-reference/segments-reference-to-curly-reference.ts';
import { isDesignToken } from '../design-token/token/is-design-token.ts';
import { designTokensTreeSchema } from '../design-token/tree/design-tokens-tree.schema.ts';
import type { DesignTokensTree } from '../design-token/tree/design-tokens-tree.ts';
import type {
  DesignTokensCollectionTokenWithType,
  GenericDesignTokensCollectionToken,
  GenericResolvedDesignTokensCollectionToken,
} from './token/design-tokens-collection-token.ts';
import { designTokenValueToDesignTokensCollectionTokenValue } from './token/from/design-token-value-to-design-tokens-collection-token-value.ts';
import type { ArrayDesignTokenNameOrToken } from './token/name/array-design-token-name-or-token.ts';
import type { ArrayDesignTokenName } from './token/name/array-design-token-name.ts';
import type { DesignTokenNameLikeOrToken } from './token/name/design-token-name-like-or-token.ts';
import type { DesignTokenNameLike } from './token/name/design-token-name-like.ts';
import { isBorderDesignTokensCollectionToken } from './token/types/composite/border/is-border-design-tokens-collection-token.ts';
import { updateBorderDesignTokensCollectionTokenValueReferences } from './token/types/composite/border/value/update/update-border-design-tokens-collection-token-value-references.ts';
import { isGradientDesignTokensCollectionToken } from './token/types/composite/gradient/is-gradient-design-tokens-collection-token.ts';
import { updateGradientDesignTokensCollectionTokenValueReferences } from './token/types/composite/gradient/value/update/update-gradient-design-tokens-collection-token-value-references.ts';
import { isShadowDesignTokensCollectionToken } from './token/types/composite/shadow/is-shadow-design-tokens-collection-token.ts';
import { updateShadowDesignTokensCollectionTokenValueReferences } from './token/types/composite/shadow/value/update/update-shadow-design-tokens-collection-token-value-references.ts';
import { isStrokeStyleDesignTokensCollectionToken } from './token/types/composite/stroke-style/is-stroke-style-design-tokens-collection-token.ts';
import { updateStrokeStyleDesignTokensCollectionTokenValueReferences } from './token/types/composite/stroke-style/value/update/update-stroke-style-design-tokens-collection-token-value-references.ts';
import { isTransitionDesignTokensCollectionToken } from './token/types/composite/transition/is-transition-design-tokens-collection-token.ts';
import { updateTransitionDesignTokensCollectionTokenValueReferences } from './token/types/composite/transition/value/update/update-transition-design-tokens-collection-token-value-references.ts';
import { isTypographyDesignTokensCollectionToken } from './token/types/composite/typography/is-typography-design-tokens-collection-token.ts';
import { updateTypographyDesignTokensCollectionTokenValueReferences } from './token/types/composite/typography/value/update/update-typography-design-tokens-collection-token-value-references.ts';

/**
 * The `DesignTokensCollection` class provides utilities to manage, resolve, and manipulate
 * design tokens in a hierarchical structure. It includes methods to parse design tokens from
 * various sources, store them in a collection, and resolve their references and dependencies.
 */
export class DesignTokensCollection {
  static isCurlyReference(input: unknown): input is CurlyReference {
    return isCurlyReference(input);
  }

  static curlyReferenceToArrayDesignTokenName(input: CurlyReference): ArrayDesignTokenName {
    return curlyReferenceToSegmentsReference(input);
  }

  static arrayDesignTokenNameToCurlyReference(input: ArrayDesignTokenName): CurlyReference {
    return segmentsReferenceToCurlyReference(input);
  }

  static #tokenNamesEqual(a: ArrayDesignTokenName, b: ArrayDesignTokenName): boolean {
    return (
      a.length === b.length &&
      a.every((token: string, index: number): boolean => token === b[index])
    );
  }

  static #stringDesignTokenNameToArray(input: string): ArrayDesignTokenName {
    return isCurlyReference(input) ? curlyReferenceToSegmentsReference(input) : input.split('.');
  }

  static #designTokenNameLikeToArray(input: DesignTokenNameLike): ArrayDesignTokenName {
    return typeof input === 'string' ? this.#stringDesignTokenNameToArray(input) : input;
  }

  static #designTokenNameLikeOrTokenToArrayOrToken(
    input: DesignTokenNameLikeOrToken,
  ): ArrayDesignTokenNameOrToken {
    return typeof input === 'string' ? this.#stringDesignTokenNameToArray(input) : input;
  }

  readonly #tokens: GenericDesignTokensCollectionToken[];

  constructor() {
    this.#tokens = [];
  }

  /* FROM */

  async fromFiles(sources: Iterable<string>): Promise<this> {
    for (const path of sources) {
      for await (const entry of glob(path)) {
        this.fromDesignTokensTree(
          designTokensTreeSchema.parse(
            JSON.parse(
              await readFile(entry, {
                encoding: 'utf-8',
              }),
            ),
          ) as DesignTokensTree,
          entry,
        );
      }
    }

    return this;
  }

  fromDesignTokensTree(root: DesignTokensTree, file?: string | undefined): this {
    // TODO extract explore ?
    const explore = (path: readonly string[], tree: DesignTokensTree): void => {
      if (isDesignToken(tree)) {
        const { $value, $type, $deprecated, $description, $extensions } = tree;

        if (isDesignTokenReference($value)) {
          this.append({
            file,
            name: path,
            value: designTokenReferenceToCurlyReference($value),
            ...removeUndefinedProperties({
              type: $type,
              deprecated: $deprecated,
              description: $description,
              extensions: $extensions,
            }),
          } satisfies GenericDesignTokensCollectionToken);
        } else {
          if ($type === undefined) {
            throw new Error('Unable to resolve $type.');
          }

          this.append({
            file,
            name: path,
            type: $type,
            value: designTokenValueToDesignTokensCollectionTokenValue($type, $value, root),
            ...removeUndefinedProperties({
              deprecated: $deprecated,
              description: $description,
              extensions: $extensions,
            }),
          } satisfies DesignTokensCollectionTokenWithType<any, any>);
        }
      } else {
        const { $description, $type, $extends, $ref, $deprecated, $extensions, ...children } = tree;

        if ($extends !== undefined || $ref !== undefined) {
          throw new Error('Missing $extends and $ref implementation on DesignTokensGroup.'); // TODO
        }

        for (const [name, child] of Object.entries(children)) {
          explore([...path, name], {
            ...removeUndefinedProperties({ $description, $type, $deprecated, $extensions }),
            ...child,
          });
        }
      }
    };

    explore([], root);

    return this;
  }

  /* MAP */

  get size(): number {
    return this.#tokens.length;
  }

  /**
   * Appends a token to the collection and returns the current instance.
   *
   * @param {GenericDesignTokensCollectionToken} token The token to be added to the collection.
   * @return {this} The current instance for method chaining.
   */
  append(token: GenericDesignTokensCollectionToken): this {
    this.#tokens.push(token);

    return this;
  }

  /**
   * Adds a given token to the collection after removing any existing token with the same name.
   *
   * @param {GenericDesignTokensCollectionToken} token - The token to be added to the collection.
   * @return {this} The current instance for method chaining.
   */
  set(token: GenericDesignTokensCollectionToken): this {
    this.delete(token.name);
    this.append(token);

    return this;
  }

  /**
   * Checks if the collection contains a specific design token or token name.
   *
   * @param {DesignTokenNameLikeOrToken} nameOrToken - The token name or token instance to check for existence.
   * @return {boolean} True if the token or token name exists in the collection, otherwise false.
   */
  has(nameOrToken: DesignTokenNameLikeOrToken): boolean {
    nameOrToken = DesignTokensCollection.#designTokenNameLikeOrTokenToArrayOrToken(nameOrToken);

    const isArrayTokenName: boolean = Array.isArray(nameOrToken);

    for (let i: number = 0; i < this.#tokens.length; i++) {
      const token: GenericDesignTokensCollectionToken = this.#tokens[i];

      if (
        isArrayTokenName
          ? DesignTokensCollection.#tokenNamesEqual(token.name, nameOrToken as readonly string[])
          : token === nameOrToken
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * Retrieves a GenericDesignTokensCollectionToken based on the provided design token name.
   *
   * @param {DesignTokenNameLike} name - The design token name to retrieve.
   * @return {GenericDesignTokensCollectionToken} The token associated with the provided name.
   * @throws {Error} If the token is not found.
   */
  get(name: DesignTokenNameLike): GenericDesignTokensCollectionToken {
    const token: GenericDesignTokensCollectionToken | undefined = this.getOptional(name);

    if (token === undefined) {
      throw new Error(
        `Missing token: ${DesignTokensCollection.#designTokenNameLikeToArray(name).join('.')}`,
      );
    } else {
      return token;
    }
  }

  /**
   * Optionally retrieves a design token from the collection by its name.
   *
   * Note: the search is performed from last to first, so the most recently added token will be returned if multiple tokens match the provided name.
   *
   * @param {DesignTokenNameLike} name - The name of the design token to retrieve.
   * @return {GenericDesignTokensCollectionToken | undefined} The design token if found, or undefined if no matching token exists.
   */
  getOptional(name: DesignTokenNameLike): GenericDesignTokensCollectionToken | undefined {
    name = DesignTokensCollection.#designTokenNameLikeToArray(name);

    for (let i: number = this.#tokens.length - 1; i >= 0; i--) {
      const token: GenericDesignTokensCollectionToken = this.#tokens[i];

      if (DesignTokensCollection.#tokenNamesEqual(token.name, name)) {
        return token;
      }
    }

    return undefined;
  }

  /**
   * Retrieves all tokens that match the specified design token name.
   *
   * @param {DesignTokenNameLike} name - The name or array of names to filter the tokens.
   * @return {GenericDesignTokensCollectionToken[]} An array of tokens that match the specified name.
   */
  getAll(name: DesignTokenNameLike): GenericDesignTokensCollectionToken[] {
    name = DesignTokensCollection.#designTokenNameLikeToArray(name);

    return this.#tokens.filter((token: GenericDesignTokensCollectionToken): boolean => {
      return DesignTokensCollection.#tokenNamesEqual(token.name, name);
    });
  }

  /**
   * Resolves a design token to its final value by following references and merging properties.
   *
   * @param {DesignTokenNameLike} name - The name or reference of the design token to resolve.
   * @return {GenericResolvedDesignTokensCollectionToken} The fully resolved design token, including its value, properties, and resolution trace.
   * @throws {Error} If a circular reference is detected or if the token cannot be found.
   */
  getResolved(name: DesignTokenNameLike): GenericResolvedDesignTokensCollectionToken {
    name = DesignTokensCollection.#designTokenNameLikeToArray(name);

    let resolvedToken: Partial<DesignTokensCollectionTokenWithType<any, any>> = {};
    const explored: Set<CurlyReference> = new Set<CurlyReference>();

    const getTrace = (): string => Array.from(explored).join(' -> ');

    while (true) {
      const key: CurlyReference = DesignTokensCollection.arrayDesignTokenNameToCurlyReference(name);

      if (explored.has(key)) {
        throw new Error(`Circular reference detected: ${getTrace()} -> ${key}`);
      }

      explored.add(key);

      const token: GenericDesignTokensCollectionToken | undefined = this.getOptional(name);

      if (token === undefined) {
        throw new Error(`Unable to find referenced token: ${getTrace()}`);
      }

      const { value, ...properties } = token;

      resolvedToken = {
        ...removeUndefinedProperties(properties),
        ...resolvedToken,
      };

      if (DesignTokensCollection.isCurlyReference(value)) {
        name = DesignTokensCollection.curlyReferenceToArrayDesignTokenName(value);
      } else {
        return {
          ...(resolvedToken as Omit<DesignTokensCollectionTokenWithType<any, any>, 'value'>),
          value,
          trace: Array.from(explored, (reference: CurlyReference): ArrayDesignTokenName => {
            return DesignTokensCollection.curlyReferenceToArrayDesignTokenName(reference);
          }),
        };
      }
    }
  }

  /**
   * Deletes the design token or tokens matching the provided name or token.
   *
   * @param {DesignTokenNameLikeOrToken} nameOrToken - A design token or an array representing the name of the token(s) to delete. It can either be a token object or a name-like structure.
   * @return {number} The number of tokens deleted.
   */
  delete(nameOrToken: DesignTokenNameLikeOrToken): number {
    nameOrToken = DesignTokensCollection.#designTokenNameLikeOrTokenToArrayOrToken(nameOrToken);

    const isArrayTokenName: boolean = Array.isArray(nameOrToken);
    let deleted: number = 0;

    for (let i: number = 0; i < this.#tokens.length; i++) {
      const token: GenericDesignTokensCollectionToken = this.#tokens[i];

      if (
        isArrayTokenName
          ? DesignTokensCollection.#tokenNamesEqual(token.name, nameOrToken as readonly string[])
          : token === nameOrToken
      ) {
        this.#tokens.splice(i, 1);
        i--;
        deleted++;
      }
    }

    return deleted;
  }

  /**
   * Clears all tokens from the internal collection.
   *
   * @return {this} The current instance for method chaining.
   */
  clear(): this {
    this.#tokens.length = 0;
    return this;
  }

  /* LIST */

  get tokens(): readonly GenericDesignTokensCollectionToken[] {
    return this.#tokens;
  }

  /**
   * Merges and filters design tokens by ensuring that only the most recent token definitions with unique names are retained.
   *
   * This method traverses the list of design tokens and eliminates duplicate tokens based on their names.
   * If multiple tokens share the same name, the latest occurrence in the list is kept. The resulting collection contains
   * unique tokens with their respective updated or original values.
   *
   * @return {GenericDesignTokensCollectionToken[]} An array of unique design tokens, preserving the latest token definitions for duplicate names.
   */
  getMergedTokens(): GenericDesignTokensCollectionToken[] {
    const tokens: GenericDesignTokensCollectionToken[] = [];
    const processed: Set<string> = new Set();

    for (let i: number = 0; i < this.#tokens.length; i++) {
      let token: GenericDesignTokensCollectionToken = this.#tokens[i];

      const key: string = JSON.stringify(token.name);

      if (processed.has(key)) {
        continue;
      }

      processed.add(key);

      for (let j: number = this.#tokens.length - 1; j > i; j--) {
        const lastToken: GenericDesignTokensCollectionToken = this.#tokens[j];

        if (DesignTokensCollection.#tokenNamesEqual(token.name, lastToken.name)) {
          token = lastToken;
          break;
        }
      }

      tokens.push(token);
    }

    return tokens;
  }

  /**
   * Resolves and returns a collection of design tokens by processing merged tokens and mapping each token
   * to its resolved form.
   *
   * @return {GenericResolvedDesignTokensCollectionToken[]} An array containing resolved design tokens.
   */
  getResolvedTokens(): GenericResolvedDesignTokensCollectionToken[] {
    return this.getMergedTokens().map(
      (token: GenericDesignTokensCollectionToken): GenericResolvedDesignTokensCollectionToken => {
        return this.getResolved(token.name);
      },
    );
  }

  /* OPERATIONS */

  /**
   * Renames a design token by updating its name and any references to it within the tokens collection.
   *
   * @param {DesignTokenNameLike} from - The current name of the design token.
   * @param {DesignTokenNameLike} to - The new name to assign to the design token.
   * @return {void} This method does not return anything but updates the relevant tokens' names and references in-place.
   */
  rename(from: DesignTokenNameLike, to: DesignTokenNameLike): void {
    from = DesignTokensCollection.#designTokenNameLikeToArray(from);
    to = DesignTokensCollection.#designTokenNameLikeToArray(to);

    if (DesignTokensCollection.#tokenNamesEqual(from, to)) {
      return;
    }

    const fromAsCurlyReference: CurlyReference =
      DesignTokensCollection.arrayDesignTokenNameToCurlyReference(from);
    const toAsCurlyReference: CurlyReference =
      DesignTokensCollection.arrayDesignTokenNameToCurlyReference(to);

    for (let i: number = 0; i < this.#tokens.length; i++) {
      const token: GenericDesignTokensCollectionToken = this.#tokens[i];

      let updatedToken: GenericDesignTokensCollectionToken = token;

      if (DesignTokensCollection.#tokenNamesEqual(token.name, from)) {
        updatedToken = {
          ...updatedToken,
          name: to,
        };
      }

      if (DesignTokensCollection.isCurlyReference(token.value)) {
        if (token.value === fromAsCurlyReference) {
          updatedToken = {
            ...updatedToken,
            value: toAsCurlyReference,
          };
        }
      } else {
        console.assert(token.type !== undefined);

        const update: UpdateCurlyReference = (reference: CurlyReference): CurlyReference => {
          return reference === fromAsCurlyReference ? toAsCurlyReference : reference;
        };

        if (isBorderDesignTokensCollectionToken(token)) {
          updatedToken = {
            ...updatedToken,
            value: updateBorderDesignTokensCollectionTokenValueReferences(token.value, update),
          };
        } else if (isGradientDesignTokensCollectionToken(token)) {
          updatedToken = {
            ...updatedToken,
            value: updateGradientDesignTokensCollectionTokenValueReferences(token.value, update),
          };
        } else if (isShadowDesignTokensCollectionToken(token)) {
          updatedToken = {
            ...updatedToken,
            value: updateShadowDesignTokensCollectionTokenValueReferences(token.value, update),
          };
        } else if (isStrokeStyleDesignTokensCollectionToken(token)) {
          updatedToken = {
            ...updatedToken,
            value: updateStrokeStyleDesignTokensCollectionTokenValueReferences(token.value, update),
          };
        } else if (isTransitionDesignTokensCollectionToken(token)) {
          updatedToken = {
            ...updatedToken,
            value: updateTransitionDesignTokensCollectionTokenValueReferences(token.value, update),
          };
        } else if (isTypographyDesignTokensCollectionToken(token)) {
          updatedToken = {
            ...updatedToken,
            value: updateTypographyDesignTokensCollectionTokenValueReferences(token.value, update),
          };
        }
      }

      if (updatedToken !== token) {
        this.#tokens[i] = updatedToken;
      }
    }
  }
}

/*------------------*/

/**
 * @deprecated
 * TODO remove
 */
export async function debugDesignTokensCollection(sources: Iterable<string>): Promise<void> {
  const collection: DesignTokensCollection = new DesignTokensCollection();

  await collection.fromFiles(sources);

  console.log(collection.get('button.background.color'));
  collection.rename('color.brand.200', 't1.color.brand.200');
  console.log(collection.getResolved('t1.color.brand.200'));
  console.log(collection.getResolved('button.background.color'));
  // console.log(collection.getResolved('a'));
  // console.log(Array.from(collection.tokens()));
}
