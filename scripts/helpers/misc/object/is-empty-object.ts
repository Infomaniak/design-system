export function isEmptyObject(input: object): boolean {
  for (const key in input) {
    if (Object.hasOwn(input, key)) {
      return false;
    }
  }
  return true;
}
