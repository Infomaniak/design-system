export function cleanSwiftNameSegment(segment: string): string {
  return segment
    .replace(/[^a-zA-Z0-9-]/g, '')
    .replace(/-([a-zA-Z0-9])/g, (_, letter: string) => letter.toUpperCase())
}

export function cleanSwiftName(name: string): string {
  const RESERVED_WORDS = ["Color", "Font"];

  return name
    .replace(/^(\d)/, '_$1')
    .replace(/^(.+)$/, (s) => RESERVED_WORDS.includes(s) ? `_${s}` : s);
}