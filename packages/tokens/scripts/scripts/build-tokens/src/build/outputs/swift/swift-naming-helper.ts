export function toCamelCase(parts: string[]): string {
  const expanded = parts.flatMap((s) => s.split('-'));
  return expanded
    .map((s, i) =>
      i === 0 ? s.charAt(0).toLowerCase() + s.slice(1) : s.charAt(0).toUpperCase() + s.slice(1),
    )
    .join('');
}

export function toSwiftVariableName(parts: string[]): string {
  const name = toCamelCase(parts);
  if (/^\d/.test(name)) return `_${name}`;
  if (name === 'default') return `\`${name}\``;
  return name;
}
