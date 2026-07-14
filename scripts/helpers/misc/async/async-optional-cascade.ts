/**
 * Executes a series of asynchronous factory functions in sequence. All factories are executed in order without considering the resolved state of the previous ones.
 * At the end, if one or more factories have rejected, an error or an aggregate error
 * containing all errors will be thrown.
 *
 * @param {Iterable<() => PromiseLike<unknown>>} factories - An iterable collection of functions returning promises.
 * Each function is executed sequentially until all resolve or reject.
 * @return {Promise<void>} A promise that resolves if all factories resolved successfully.
 * If one or more factories rejected, the promise rejects with an error or an AggregateError containing all errors.
 */
export async function asyncOptionalCascade(
  factories: Iterable<() => PromiseLike<unknown>>,
): Promise<void> {
  const errors: unknown[] = [];

  for (const factory of factories) {
    try {
      await factory();
    } catch (error: unknown) {
      errors.push(error);
    }
  }

  if (errors.length === 1) {
    throw errors[0];
  } else if (errors.length > 1) {
    throw new AggregateError(errors);
  }
}
