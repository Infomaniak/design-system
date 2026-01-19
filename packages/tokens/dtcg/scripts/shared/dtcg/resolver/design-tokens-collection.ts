import { glob, readFile } from 'node:fs/promises';
import { removeUndefinedProperties } from '../../../../../../../scripts/helpers/misc/remove-undefined-properties.ts';
import { isDesignTokenReference } from '../design-token/reference/is-design-token-reference.ts';
import { designTokenReferenceToCurlyReference } from '../design-token/reference/to/curly-reference/design-token-reference-to-curly-reference.ts';
import type { CurlyReference } from '../design-token/reference/types/curly/curly-reference.ts';
import { isCurlyReference } from '../design-token/reference/types/curly/is-curly-reference.ts';
import { curlyReferenceToSegmentsReference } from '../design-token/reference/types/curly/to/segments-reference/curly-reference-to-segments-reference.ts';
import { traceCurlyReferences } from '../design-token/reference/types/curly/trace/trace-curly-references.ts';
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

  static #designTokenNameLikeOrTokenToFilterFunction(
    input: DesignTokenNameLikeOrToken,
  ): DesignTokensCollectionTokenFilterFunction {
    input = typeof input === 'string' ? this.#stringDesignTokenNameToArray(input) : input;

    return Array.isArray(input)
      ? (token: GenericDesignTokensCollectionToken): boolean =>
          DesignTokensCollection.#tokenNamesEqual(token.name, input)
      : (token: GenericDesignTokensCollectionToken): boolean => token === input;
  }

  readonly #tokens: GenericDesignTokensCollectionToken[];

  constructor() {
    this.#tokens = [];
  }

  /* FROM */

  /**
   * Reads all files in order from the `sources` input (_glob pattern_ supported).
   *
   * Then, it extracts the design tokens and appends them to this collection.
   *
   * @param {Iterable<string>} sources - An iterable collection of file paths (glob) to be processed.
   * @return {Promise<this>} A promise that resolves with the current instance for method chaining.
   */
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

  #exploreDesignTokensTree(
    root: DesignTokensTree,
    path: readonly string[],
    tree: DesignTokensTree,
    file: string | undefined,
  ): void {
    if (isDesignToken(tree)) {
      const { $value, $type, $deprecated, $description, $extensions } = tree;

      if (isDesignTokenReference($value)) {
        this.append({
          name: path,
          value: designTokenReferenceToCurlyReference($value),
          ...removeUndefinedProperties({
            file,
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
          name: path,
          type: $type,
          value: designTokenValueToDesignTokensCollectionTokenValue($type, $value, root),
          ...removeUndefinedProperties({
            file,
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
        this.#exploreDesignTokensTree(
          root,
          [...path, name],
          {
            ...removeUndefinedProperties({ $description, $type, $deprecated, $extensions }),
            ...child,
          },
          file,
        );
      }
    }
  }

  /**
   * Explores a design tokens tree and appends all design tokens found to the collection.
   *
   * @param {DesignTokensTree} root - The root node of the design tokens tree to process.
   * @param {string} [file] - An optional file name associated with the design tokens tree.
   * @return {this} The current instance for method chaining.
   */
  fromDesignTokensTree(root: DesignTokensTree, file?: string | undefined): this {
    this.#exploreDesignTokensTree(root, [], root, file);

    return this;
  }

  /* MAP */

  get size(): number {
    return this.#tokens.length;
  }

  /**
   * Retrieves all tokens from the collection.
   *
   * Note: this list may contain duplicate tokens, as tokens with the same name can be defined multiple times in different files.
   * Use `getMergedToken` if you want a consolidated list of unique tokens.
   *
   * @return {readonly GenericDesignTokensCollectionToken[]} An array of all tokens in the collection.
   */
  get allTokens(): readonly GenericDesignTokensCollectionToken[] {
    return this.#tokens;
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
    const predicate: DesignTokensCollectionTokenFilterFunction =
      DesignTokensCollection.#designTokenNameLikeOrTokenToFilterFunction(nameOrToken);

    for (let i: number = 0; i < this.#tokens.length; i++) {
      if (predicate(this.#tokens[i])) {
        return true;
      }
    }

    return false;
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
   * Deletes the design token or tokens matching the provided name or token.
   *
   * @param {DesignTokenNameLikeOrToken} nameOrToken - A design token or an array representing the name of the token(s) to delete. It can either be a token object or a name-like structure.
   * @return {number} The number of tokens deleted.
   */
  delete(nameOrToken: DesignTokenNameLikeOrToken): number {
    const predicate: DesignTokensCollectionTokenFilterFunction =
      DesignTokensCollection.#designTokenNameLikeOrTokenToFilterFunction(nameOrToken);

    let deleted: number = 0;

    for (let i: number = 0; i < this.#tokens.length; i++) {
      if (predicate(this.#tokens[i])) {
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

  /*--*/

  /**
   * Optionally retrieves a design token from the collection by its name.
   *
   * Note: the search is performed from last to first, and tokens with the selected name are aggregated to form one token with all properties merged.
   *
   * @param {DesignTokenNameLike} name - The name of the design token to retrieve.
   * @return {GenericDesignTokensCollectionToken | undefined} The design token if found, or undefined if no matching token exists.
   */
  getOptional(name: DesignTokenNameLike): GenericDesignTokensCollectionToken | undefined {
    const tokens: GenericDesignTokensCollectionToken[] = this.getAll(name);

    if (tokens.length === 0) {
      return undefined;
    } else if (tokens.length === 1) {
      return tokens[0];
    } else {
      let {
        file,
        name,
        type,
        value,
        description,
        deprecated,
        extensions,
      }: GenericDesignTokensCollectionToken = tokens[tokens.length - 1];

      for (let i: number = tokens.length - 2; i >= 0; i--) {
        const {
          type: superType,
          description: superDescription,
          deprecated: superDeprecated,
          extensions: superExtensions,
        }: GenericDesignTokensCollectionToken = tokens[i];

        type ??= superType;
        description ??= superDescription;
        deprecated ??= superDeprecated;

        if (extensions === undefined) {
          extensions = superExtensions;
        } else if (superExtensions !== undefined) {
          extensions = { ...superExtensions, ...extensions };
        }
      }

      return removeUndefinedProperties({
        file,
        name,
        type,
        value,
        description,
        deprecated,
        extensions,
      });
    }
  }

  /**
   * Retrieves a GenericDesignTokensCollectionToken based on the provided design token name.
   *
   * Note: the search is performed from last to first, and tokens with the selected name are aggregated to form one token with all properties merged.
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
   * Resolves a design token to its final value by following references and merging properties.
   *
   * @param {GenericDesignTokensCollectionToken} token - The design token to resolve.
   * @return {GenericResolvedDesignTokensCollectionToken} The fully resolved design token, including its value, properties, and resolution trace.
   * @throws {Error} If a circular reference is detected or if the token cannot be found.
   */
  resolve(token: GenericDesignTokensCollectionToken): GenericResolvedDesignTokensCollectionToken {
    let {
      file,
      name,
      type,
      value,
      description,
      deprecated,
      extensions,
    }: GenericDesignTokensCollectionToken = token;

    let nameToExplore: ArrayDesignTokenName = name;
    const explored: Set<CurlyReference> = new Set<CurlyReference>();
    explored.add(DesignTokensCollection.arrayDesignTokenNameToCurlyReference(name));

    while (true) {
      if (isCurlyReference(value)) {
        nameToExplore = DesignTokensCollection.curlyReferenceToArrayDesignTokenName(value);

        if (explored.has(value)) {
          throw new Error(
            `Circular reference detected: ${traceCurlyReferences([...explored, value])}`,
          );
        }

        explored.add(value);

        const resolvedToken: GenericDesignTokensCollectionToken | undefined =
          this.getOptional(nameToExplore);

        if (resolvedToken === undefined) {
          throw new Error(`Unable to find referenced token: ${traceCurlyReferences(explored)}`);
        }

        const {
          type: superType,
          value: superValue,
          description: superDescription,
          deprecated: superDeprecated,
          extensions: superExtensions,
        }: GenericDesignTokensCollectionToken = resolvedToken;

        type ??= superType;
        value = superValue;
        description ??= superDescription;
        deprecated ??= superDeprecated;

        if (extensions === undefined) {
          extensions = superExtensions;
        } else if (superExtensions !== undefined) {
          extensions = { ...superExtensions, ...extensions };
        }
      } else {
        return removeUndefinedProperties({
          file,
          name,
          type,
          value,
          description,
          deprecated,
          extensions,
          trace: Array.from(explored, (reference: CurlyReference): ArrayDesignTokenName => {
            return DesignTokensCollection.curlyReferenceToArrayDesignTokenName(reference);
          }),
        });
      }
    }
  }

  /**
   * Resolves a design token to its final value by following references and merging properties.
   *
   * @deprecated
   * @param {DesignTokenNameLike} name - The name or reference of the design token to resolve.
   * @return {GenericResolvedDesignTokensCollectionToken} The fully resolved design token, including its value, properties, and resolution trace.
   * @throws {Error} If a circular reference is detected or if the token cannot be found.
   */
  getResolved(name: DesignTokenNameLike): GenericResolvedDesignTokensCollectionToken {
    return this.resolve(this.get(name));
  }

  /* LIST */

  /**
   * Returns a list of _merged_ design tokens:
   *
   * Starts from first to last, then, for each unique token (identified by their name), get all tokens with the same name and merge their properties (most recent ones overload earlier ones).
   *
   * @return {GenericDesignTokensCollectionToken[]} An array of merged tokens, where redundant properties are consolidated, and undefined properties are populated with values from matching earlier tokens.
   */
  getMergedTokens(): GenericDesignTokensCollectionToken[] {
    const tokens: GenericDesignTokensCollectionToken[] = [];
    const done: Set<CurlyReference> = new Set<CurlyReference>();

    for (let i: number = 0; i < this.#tokens.length; i++) {
      let {
        file,
        name,
        type,
        value,
        description,
        deprecated,
        extensions,
      }: GenericDesignTokensCollectionToken = this.#tokens[i];

      const nameAsCurlyReference: CurlyReference =
        DesignTokensCollection.arrayDesignTokenNameToCurlyReference(name);
      if (done.has(nameAsCurlyReference)) {
        continue;
      }
      done.add(nameAsCurlyReference);

      let overloaded: boolean = false;

      for (let j: number = i + 1; j < this.#tokens.length; j++) {
        const {
          file: superFile,
          name: superName,
          type: superType,
          value: superValue,
          description: superDescription,
          deprecated: superDeprecated,
          extensions: superExtensions,
        }: GenericDesignTokensCollectionToken = this.#tokens[j];

        if (DesignTokensCollection.#tokenNamesEqual(name, superName)) {
          overloaded = true;

          file = superFile;
          type = superType ?? type;
          value = superValue;
          description = superDescription ?? description;
          deprecated = superDeprecated ?? deprecated;

          if (superExtensions !== undefined) {
            if (extensions === undefined) {
              extensions = superExtensions;
            } else {
              extensions = { ...extensions, ...superExtensions };
            }
          }
        }
      }

      if (overloaded) {
        tokens.push(
          removeUndefinedProperties({
            file,
            name,
            type,
            value,
            description,
            deprecated,
            extensions,
          }),
        );
      } else {
        tokens.push(this.#tokens[i]);
      }
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
        return this.resolve(token);
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

      let name: ArrayDesignTokenName = token.name;
      let value: unknown | CurlyReference = token.value;

      if (DesignTokensCollection.#tokenNamesEqual(token.name, from)) {
        name = to;
      }

      if (isCurlyReference(token.value)) {
        if (token.value === fromAsCurlyReference) {
          value = toAsCurlyReference;
        }
      } else {
        console.assert(token.type !== undefined);

        const update: UpdateCurlyReference = (reference: CurlyReference): CurlyReference => {
          return reference === fromAsCurlyReference ? toAsCurlyReference : reference;
        };

        if (isBorderDesignTokensCollectionToken(token)) {
          value = updateBorderDesignTokensCollectionTokenValueReferences(token.value, update);
        } else if (isGradientDesignTokensCollectionToken(token)) {
          value = updateGradientDesignTokensCollectionTokenValueReferences(token.value, update);
        } else if (isShadowDesignTokensCollectionToken(token)) {
          value = updateShadowDesignTokensCollectionTokenValueReferences(token.value, update);
        } else if (isStrokeStyleDesignTokensCollectionToken(token)) {
          value = updateStrokeStyleDesignTokensCollectionTokenValueReferences(token.value, update);
        } else if (isTransitionDesignTokensCollectionToken(token)) {
          value = updateTransitionDesignTokensCollectionTokenValueReferences(token.value, update);
        } else if (isTypographyDesignTokensCollectionToken(token)) {
          value = updateTypographyDesignTokensCollectionTokenValueReferences(token.value, update);
        }
      }

      if (name !== token.name || value !== token.value) {
        this.#tokens[i] = {
          ...token,
          name,
          value,
        };
      }
    }
  }
}

/* INTERNAL TYPES */

interface DesignTokensCollectionTokenFilterFunction {
  (token: GenericDesignTokensCollectionToken): boolean;
}
