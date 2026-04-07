/**
 * https://github.com/tc39/proposal-iterator-join
 */
export function iteratorJoin(iterator: Iterable<unknown>, separator: string): string {
  let output: string | undefined = undefined;

  for (const item of iterator) {
    if (output === undefined) {
      output = String(item);
    } else {
      output += separator + String(item);
    }
  }

  return output === undefined ? '' : output;
}
