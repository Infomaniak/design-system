export function designTokenNameSegmentToKotlinVariableSegment(segment: string): string {
  return (
    segment
      // convert to camelCase
      .replace(
        /[^a-zA-Z0-9]+(.|$)/g,
        (_invalidChar: string, letter: string, offset: number): string =>
          offset === 0 ? letter : letter.toUpperCase(),
      )
  );
}
