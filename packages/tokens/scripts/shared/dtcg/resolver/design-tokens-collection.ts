import { glob, readFile } from 'node:fs/promises';
import { removeUndefinedProperties } from '../../../../../../scripts/helpers/misc/object/remove-undefined-properties.ts';
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
import { ascendDesignTokensTreeCommonTypes } from '../operations/ascend-common-types/ascend-design-tokens-tree-common-types.ts';
import { mergeDesignTokensTrees } from '../operations/merge/merge-design-tokens-trees.ts';
import type {
  DesignTokensCollectionTokenExtensions,
  DesignTokensCollectionTokenWithType,
  GenericDesignTokensCollectionToken,
  GenericDesignTokensCollectionTokenWithType,
  GenericResolvedDesignTokensCollectionToken,
} from './token/design-tokens-collection-token.ts';
import { designTokenValueToDesignTokensCollectionTokenValue } from './token/from/design-token-value-to-design-tokens-collection-token-value.ts';
import type { ArrayDesignTokenName } from './token/name/array-design-token-name.ts';
import type { DesignTokenNameLike } from './token/name/design-token-name-like.ts';
import { isBorderDesignTokensCollectionToken } from './token/types/composite/border/is-border-design-tokens-collection-token.ts';
import { isBorderDesignTokensCollectionTokenValueReferencing } from './token/types/composite/border/value/is-referencing/is-border-design-tokens-collection-token-value-referencing.ts';
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
import { isTypographyDesignTokensCollectionTokenValueReferencing } from './token/types/composite/typography/value/is-referencing/is-typography-design-tokens-collection-token-value-referencing.ts';
import { updateTypographyDesignTokensCollectionTokenValueReferences } from './token/types/composite/typography/value/update/update-typography-design-tokens-collection-token-value-references.ts';
import type { DesignTokensCollectionAddOptions } from './types/methods/add/design-tokens-collection-add-options.ts';
import type { DesignTokensCollectionFromDesignTokensTreeOptions } from './types/methods/from-design-tokens-tree/design-tokens-collection-from-design-tokens-tree-options.ts';
import type { DesignTokensCollectionFromFilesOptions } from './types/methods/from-files/design-tokens-collection-from-files-options.ts';
import { designTokensCollectionRenameExtensionsAutomatically } from './types/methods/rename/design-tokens-collection-rename-extensions-function.ts';
import type { DesignTokensCollectionRenameOptions } from './types/methods/rename/design-tokens-collection-rename-options.ts';
import type { DesignTokensCollectionToJsonOptions } from './types/methods/to-json/design-tokens-collection-to-json-options.ts';

/**
 * Represents a collection of design tokens and provides utility methods for
 * managing, merging, and querying tokens. Each token is uniquely identified
 * within the collection, and operations such as retrieval, addition, deletion,
 * and clearing are supported.
 */
export class DesignTokensCollection {
  /* NAME */

  static isCurlyReference(input: unknown): input is CurlyReference {
    return isCurlyReference(input);
  }

  static curlyReferenceToArrayDesignTokenName(input: CurlyReference): ArrayDesignTokenName {
    return curlyReferenceToSegmentsReference(input);
  }

  static arrayDesignTokenNameToCurlyReference(input: ArrayDesignTokenName): CurlyReference {
    return segmentsReferenceToCurlyReference(input);
  }

  static designTokenNameLikeToArrayDesignTokenName(
    input: DesignTokenNameLike,
  ): ArrayDesignTokenName {
    return typeof input === 'string' ? this.#stringDesignTokenNameToArray(input) : input;
  }

  static tokenNamesEqual(a: ArrayDesignTokenName, b: ArrayDesignTokenName): boolean {
    return (
      a.length === b.length &&
      a.every((token: string, index: number): boolean => token === b[index])
    );
  }

  /* OPERATIONS */

  /**
   * Merges two GenericDesignTokensCollectionToken objects and returns a new token
   * with combined and prioritized properties from both tokens.
   *
   * @param {GenericDesignTokensCollectionToken} baseToken - The base token to merge from.
   * @param {GenericDesignTokensCollectionToken} patchToken - The patch token with properties to override or add.
   * @returns {GenericDesignTokensCollectionToken} A new token containing merged properties from the baseToken and patchToken.
   */
  static mergeTokens(
    baseToken: GenericDesignTokensCollectionToken,
    patchToken: GenericDesignTokensCollectionToken,
  ): GenericDesignTokensCollectionToken {
    return removeUndefinedProperties({
      files: Array.from(new Set([...patchToken.files, ...baseToken.files])),
      name: patchToken.name,
      type: patchToken.type ?? baseToken.type,
      value: patchToken.value,
      description: patchToken.description ?? baseToken.description,
      deprecated: patchToken.deprecated ?? baseToken.deprecated,
      extensions:
        patchToken.extensions === undefined
          ? baseToken.extensions
          : baseToken.extensions === undefined
            ? patchToken.extensions
            : { ...baseToken.extensions, ...patchToken.extensions },
    });
  }

  static #arrayDesignTokenNameToStringKey(input: ArrayDesignTokenName): string {
    return JSON.stringify(input);
  }

  static #designTokenNameLikeToStringKey(input: DesignTokenNameLike): string {
    return this.#arrayDesignTokenNameToStringKey(
      this.designTokenNameLikeToArrayDesignTokenName(input),
    );
  }

  static #stringDesignTokenNameToArray(input: string): ArrayDesignTokenName {
    return isCurlyReference(input) ? curlyReferenceToSegmentsReference(input) : input.split('.');
  }

  static #newTokens: Map<string, GenericDesignTokensCollectionToken> | undefined;

  static #new(tokens: Map<string, GenericDesignTokensCollectionToken>): DesignTokensCollection {
    this.#newTokens = tokens;
    try {
      return new DesignTokensCollection();
    } finally {
      this.#newTokens = undefined;
    }
  }

  readonly #tokens: Map<string, GenericDesignTokensCollectionToken>;

  constructor(tokens?: Iterable<GenericDesignTokensCollectionToken>) {
    this.#tokens = DesignTokensCollection.#newTokens ?? new Map();

    if (tokens !== undefined) {
      for (const token of tokens) {
        this.add(token);
      }
    }
  }

  /* MAP/SET BEHAVIOUR */

  get size(): number {
    return this.#tokens.size;
  }

  /**
   * Retrieves all tokens from the collection.
   *
   * @returns {IteratorObject<GenericDesignTokensCollectionToken>} An iterable of all tokens in the collection.
   */
  tokens(): IteratorObject<GenericDesignTokensCollectionToken> {
    return this.#tokens.values();
  }

  /**
   * Iterates over the collection.
   *
   * @alias tokens
   */
  [Symbol.iterator](): IteratorObject<GenericDesignTokensCollectionToken> {
    return this.tokens();
  }

  /**
   * Adds a token to the collection and returns the current instance.
   *
   * If `merged` is true (default) and a token already exists with the same name, it is merged with the new token.
   *
   * @param {GenericDesignTokensCollectionToken} token The token to be added to the collection.
   * @param {DesignTokensCollectionAddOptions} [options] The options to use when inserting the token.
   * @returns {this} The current instance for method chaining.
   */
  add(
    token: GenericDesignTokensCollectionToken,
    { merge = true }: DesignTokensCollectionAddOptions = {},
  ): this {
    const key: string = DesignTokensCollection.#arrayDesignTokenNameToStringKey(token.name);
    const existingToken: GenericDesignTokensCollectionToken | undefined = this.#tokens.get(key);

    if (existingToken === undefined) {
      this.#tokens.set(key, token);
    } else {
      // delete token to put it as "last"
      this.#tokens.delete(key);
      this.#tokens.set(
        key,
        merge ? DesignTokensCollection.mergeTokens(existingToken, token) : token,
      );
    }

    return this;
  }

  /**
   * Checks if the collection contains a specific design token or token name.
   *
   * @param {DesignTokenNameLike} name - The token name to check for existence.
   * @returns {boolean} True if the token or token name exists in the collection, otherwise false.
   */
  has(name: DesignTokenNameLike): boolean {
    return this.#tokens.has(DesignTokensCollection.#designTokenNameLikeToStringKey(name));
  }

  /**
   * Retrieves a GenericDesignTokensCollectionToken based on the provided design token name.
   *
   * Note: the search is performed from last to first, and tokens with the selected name are aggregated to form one token with all properties merged.
   *
   * @param {DesignTokenNameLike} name - The design token name to retrieve.
   * @returns {GenericDesignTokensCollectionToken} The token associated with the provided name.
   * @throws {Error} If the token is not found.
   */
  get(name: DesignTokenNameLike): GenericDesignTokensCollectionToken {
    const token: GenericDesignTokensCollectionToken | undefined = this.getOptional(name);

    if (token === undefined) {
      throw new Error(
        `Missing token: ${DesignTokensCollection.designTokenNameLikeToArrayDesignTokenName(name).join('.')}`,
      );
    } else {
      return token;
    }
  }

  /**
   * Optionally retrieves a design token from the collection by its name.
   *
   * @param {DesignTokenNameLike} name - The name of the design token to retrieve.
   * @returns {GenericDesignTokensCollectionToken | undefined} The design token if found, or undefined if no matching token exists.
   */
  getOptional(name: DesignTokenNameLike): GenericDesignTokensCollectionToken | undefined {
    return this.#tokens.get(DesignTokensCollection.#designTokenNameLikeToStringKey(name));
  }

  /**
   * Deletes a design token from its name.
   *
   * @param {DesignTokenNameLike} name - The name of the token to delete.
   * @returns {boolean} If a token was deleted, returns true. Otherwise, returns false.
   */
  delete(name: DesignTokenNameLike): boolean {
    return this.#tokens.delete(DesignTokensCollection.#designTokenNameLikeToStringKey(name));
  }

  /**
   * Clears all tokens from the internal collection.
   *
   * @returns {this} The current instance for method chaining.
   */
  clear(): this {
    this.#tokens.clear();
    return this;
  }

  /* LIST */

  getTokensDirectlyReferencing(
    name: DesignTokenNameLike,
  ): IteratorObject<GenericDesignTokensCollectionToken> {
    name = DesignTokensCollection.designTokenNameLikeToArrayDesignTokenName(name);
    const nameAsCurlyReference: CurlyReference =
      DesignTokensCollection.arrayDesignTokenNameToCurlyReference(name);

    return this.#tokens.values().filter((token: GenericDesignTokensCollectionToken): boolean => {
      if (isCurlyReference(token.value)) {
        return token.value === nameAsCurlyReference;
      } else {
        console.assert(token.type !== undefined);

        if (isBorderDesignTokensCollectionToken(token)) {
          return isBorderDesignTokensCollectionTokenValueReferencing(
            token.value,
            nameAsCurlyReference,
          );
        } else if (isGradientDesignTokensCollectionToken(token)) {
          throw 'TODO: implement'; // TODO
        } else if (isShadowDesignTokensCollectionToken(token)) {
          throw 'TODO: implement'; // TODO
        } else if (isStrokeStyleDesignTokensCollectionToken(token)) {
          throw 'TODO: implement'; // TODO
        } else if (isTransitionDesignTokensCollectionToken(token)) {
          throw 'TODO: implement'; // TODO
        } else if (isTypographyDesignTokensCollectionToken(token)) {
          return isTypographyDesignTokensCollectionTokenValueReferencing(
            token.value,
            nameAsCurlyReference,
          );
        } else {
          return false;
        }
      }
    });
  }

  /* FROM */

  /**
   * Reads all files in order from the `sources` input (_glob pattern_ supported).
   *
   * Then, it extracts the design tokens and appends them to this collection.
   *
   * @param {Iterable<string>} sources - An iterable collection of file paths (glob) to be processed.
   * @param {DesignTokensCollectionFromFilesOptions} [options] - Optional options to customize the behavior of the method.
   * @returns {Promise<this>} A promise that resolves with the current instance for method chaining.
   */
  async fromFiles(
    sources: Iterable<string>,
    options?: DesignTokensCollectionFromFilesOptions,
  ): Promise<this> {
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
          {
            ...options,
            files: [entry],
          },
        );
      }
    }

    return this;
  }

  /**
   * Explores a design tokens tree and appends all design tokens found to the collection.
   *
   * @param {DesignTokensTree} root - The root node of the design tokens tree to process.
   * @param {string} [options] - Optional options to customize the behavior of the method.
   * @param {readonly string[]} [options.files] - An array of file paths associated with this design tokens tree.
   * @param {boolean} [options.forEachTokenBehaviour=merge] - What to do when a token is encountered during the traversal.
   * - `merge`: merges the current token with an existing one if it exists.
   * - `only-new-token`: throws an error if the current token is not already present in the collection.
   * - `prevent-new-token`: throws an error if the token is new.
   * @returns {this} The current instance for method chaining.
   */
  fromDesignTokensTree(
    root: DesignTokensTree,
    {
      files = [],
      forEachTokenBehaviour = 'merge',
    }: DesignTokensCollectionFromDesignTokensTreeOptions = {},
  ): this {
    this.#exploreDesignTokensTree({
      root,
      path: [],
      current: root,
      files,
      forEachTokenBehaviour,
    });

    return this;
  }

  #exploreDesignTokensTree({
    root,
    path,
    current,
    files,
    forEachTokenBehaviour,
  }: ExploreDesignTokensTreeOptions): void {
    if (isDesignToken(current)) {
      const { $value, $type, $deprecated, $description, $extensions } = current;

      const name: ArrayDesignTokenName = path.at(-1) === '$root' ? path.slice(0, -1) : path;

      if (forEachTokenBehaviour === 'only-new-token') {
        if (this.has(name)) {
          throw new Error(`Duplicate token (${forEachTokenBehaviour}): ${name.join('.')}`);
        }
      } else if (forEachTokenBehaviour === 'prevent-new-token') {
        if (!this.has(name)) {
          throw new Error(`Missing token (${forEachTokenBehaviour}): ${name.join('.')}`);
        }
      }

      if (isDesignTokenReference($value)) {
        this.add({
          files,
          name,
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

        this.add({
          files,
          name,
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
      const { $description, $type, $extends, $ref, $deprecated, $extensions, ...children } =
        current;

      if ($extends !== undefined || $ref !== undefined) {
        throw new Error('Missing $extends and $ref implementation on DesignTokensGroup.'); // TODO
      }

      for (const [name, child] of Object.entries(children)) {
        this.#exploreDesignTokensTree({
          root,
          path: [...path, name],
          current: {
            ...removeUndefinedProperties({ $description, $type, $deprecated, $extensions }),
            ...child,
          },
          files,
          forEachTokenBehaviour,
        });
      }
    }
  }

  /* OPERATIONS */

  /**
   * Resolves a design token to its final value by following references and merging properties.
   *
   * @param {GenericDesignTokensCollectionToken} token - The design token to resolve.
   * @returns {GenericDesignTokensCollectionToken} The fully resolved design token, including its value, properties, and resolution trace.
   * @throws {Error} If a circular reference is detected or if the token cannot be found.
   */
  resolve(token: GenericDesignTokensCollectionToken): GenericResolvedDesignTokensCollectionToken {
    let name: ArrayDesignTokenName = token.name;
    const explored: Set<CurlyReference> = new Set<CurlyReference>();
    explored.add(DesignTokensCollection.arrayDesignTokenNameToCurlyReference(name));

    while (true) {
      if (isCurlyReference(token.value)) {
        name = DesignTokensCollection.curlyReferenceToArrayDesignTokenName(token.value);

        if (explored.has(token.value)) {
          throw new Error(
            `Circular reference detected: ${traceCurlyReferences([...explored, token.value])}`,
          );
        }

        explored.add(token.value);

        const resolvedToken: GenericDesignTokensCollectionToken | undefined =
          this.getOptional(name);

        if (resolvedToken === undefined) {
          throw new Error(`Unable to find referenced token: ${traceCurlyReferences(explored)}`);
        }

        token = DesignTokensCollection.mergeTokens(resolvedToken, {
          ...token,
          value: resolvedToken.value,
        });
      } else {
        return {
          ...(token as GenericDesignTokensCollectionTokenWithType),
          trace: Array.from(explored, (reference: CurlyReference): ArrayDesignTokenName => {
            return DesignTokensCollection.curlyReferenceToArrayDesignTokenName(reference);
          }),
        };
      }
    }
  }

  /**
   * Renames a design token by updating its name and any references to it within the tokens collection.
   *
   * @param {DesignTokenNameLike} from - The current name of the design token.
   * @param {DesignTokenNameLike} to - The new name to assign to the design token.
   * @param {DesignTokensCollectionRenameOptions} options - Extra options.
   * @returns {void} This method does not return anything but updates the relevant tokens' names and references in-place.
   */
  rename(
    from: DesignTokenNameLike,
    to: DesignTokenNameLike,
    {
      extensions: renameExtensions = designTokensCollectionRenameExtensionsAutomatically,
      onExitingTokenBehaviour = 'throw',
    }: DesignTokensCollectionRenameOptions = {},
  ): void {
    from = DesignTokensCollection.designTokenNameLikeToArrayDesignTokenName(from);
    to = DesignTokensCollection.designTokenNameLikeToArrayDesignTokenName(to);

    if (DesignTokensCollection.tokenNamesEqual(from, to)) {
      return;
    }

    // TODO improve: get "from" token and rename it directly after/before updating rge references

    if (this.has(to)) {
      if (onExitingTokenBehaviour === 'throw') {
        throw new Error(`Replacing an existing token: ${to.join('.')}`);
      } else if (onExitingTokenBehaviour === 'skip') {
        return;
      }
    }

    const fromAsCurlyReference: CurlyReference =
      DesignTokensCollection.arrayDesignTokenNameToCurlyReference(from);
    const toAsCurlyReference: CurlyReference =
      DesignTokensCollection.arrayDesignTokenNameToCurlyReference(to);

    for (const token of Array.from(this.#tokens.values())) {
      let name: ArrayDesignTokenName = token.name;
      let value: unknown | CurlyReference = token.value;
      let extensions: DesignTokensCollectionTokenExtensions | undefined = token.extensions;

      if (
        DesignTokensCollection.tokenNamesEqual(token.name, from) &&
        onExitingTokenBehaviour !== 'only-references'
      ) {
        name = to;
      }

      const update: UpdateCurlyReference = (reference: CurlyReference): CurlyReference => {
        return reference === fromAsCurlyReference ? toAsCurlyReference : reference;
      };

      if (isCurlyReference(token.value)) {
        if (token.value === fromAsCurlyReference) {
          value = toAsCurlyReference;
        }
      } else {
        console.assert(token.type !== undefined);

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

      if (extensions !== undefined) {
        extensions = renameExtensions(extensions, update);
      }

      if (name !== token.name || value !== token.value || extensions !== token.extensions) {
        if (name !== token.name) {
          this.#tokens.delete(DesignTokensCollection.#arrayDesignTokenNameToStringKey(token.name));
        }

        this.#tokens.set(DesignTokensCollection.#arrayDesignTokenNameToStringKey(name), {
          ...token,
          name,
          value,
          extensions,
        });
      }
    }
  }

  clone(): DesignTokensCollection {
    return DesignTokensCollection.#new(new Map(this.#tokens.entries()));
  }

  toJSON({ ascendCommonTypes = true }: DesignTokensCollectionToJsonOptions = {}): DesignTokensTree {
    let tree: DesignTokensTree = {};

    for (const token of this.#tokens.values()) {
      tree = mergeDesignTokensTrees(
        tree,
        {
          $value: token.value,
          ...removeUndefinedProperties({
            $type: token.type,
            $deprecated: token.deprecated,
            $description: token.description,
            $extensions: token.extensions,
          }),
        },
        token.name,
      );
    }

    if (ascendCommonTypes) {
      tree = ascendDesignTokensTreeCommonTypes(tree);
    }

    return tree;
  }
}

/* INTERNAL */

interface ExploreDesignTokensTreeOptions extends Pick<
  DesignTokensCollectionFromDesignTokensTreeOptions,
  'forEachTokenBehaviour'
> {
  readonly root: DesignTokensTree;
  readonly path: readonly string[];
  readonly current: DesignTokensTree;
  readonly files: readonly string[];
}
