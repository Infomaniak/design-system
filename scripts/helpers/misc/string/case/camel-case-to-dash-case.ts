export function camelCaseToDashCase(input: string): string {
  return input.replace(
    /[A-Z]/g,
    (letter: string, index: number) => `${index > 0 ? '-' : ''}${letter.toLowerCase()}`,
  );
}
