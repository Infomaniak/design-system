export function cleanSwiftNameSegment(segment: string): string {
  return segment
    .replace(/[^a-zA-Z0-9-]/g, '')
    .replace(/-([a-zA-Z0-9])/g, (_, letter: string) => letter.toUpperCase());
}
