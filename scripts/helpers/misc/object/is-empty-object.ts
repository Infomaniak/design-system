export function isEmptyObject(input: object): boolean {
  for (const key in input) {
    if (input.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}
