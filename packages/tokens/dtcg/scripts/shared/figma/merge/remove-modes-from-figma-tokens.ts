import { isObject } from '../../../../../../../scripts/helpers/misc/object/is-object.ts';
import { removeUndefinedProperties } from '../../../../../../../scripts/helpers/misc/object/remove-undefined-properties.ts';

export function removeModesFromFigmaTokens(tokens: unknown): unknown {
  if (!isObject(tokens)) {
    throw new Error('Expected an object.');
  }

  if (Reflect.has(tokens, '$value')) {
    const { $extensions, ...properties } = tokens as any;

    return {
      ...properties,
      ...removeUndefinedProperties({
        $extensions:
          $extensions === undefined
            ? undefined
            : removeUndefinedProperties({
                ...$extensions,
                mode: undefined,
              }),
      }),
    };
  } else {
    return Object.fromEntries(
      Object.entries(tokens).map(([key, value]): [string, unknown] => {
        return [key, removeModesFromFigmaTokens(value)];
      }),
    );
  }
}
