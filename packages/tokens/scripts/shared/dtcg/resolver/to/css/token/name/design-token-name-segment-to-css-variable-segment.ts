export function designTokenNameSegmentToCssVariableSegment(segment: string): string {
  return (
    segment
      // replace white-spaces with single dash
      .replace(/\s+/g, '-')
      // convert camelCase/PascalCase to dash-case
      .replace(
        /[A-Z]/g,
        (letter: string, offset: number): string =>
          `${offset > 0 ? '-' : ''}${letter.toLowerCase()}`,
      )
      // remove starting and ending dashes
      .replace(/^-+|-+$/g, '')
      // remove consecutive dashes
      .replace(/--+/g, '-')
      // remove all non-alphanumeric or dash characters
      .replace(/[^a-z0-9\-]/g, '')
  );
}
