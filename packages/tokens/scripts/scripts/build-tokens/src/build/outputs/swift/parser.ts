/**
 * Custom parser that moves root-level $type into each top-level group.
 * This prevents SD5's merge from losing per-file $type when multiple
 * source files define different $type at their root level.
 */
export const fixTypeInheritanceParser = {
  name: 'esds/fix-type-inheritance',
  pattern: /\.tokens\.json$/,
  parser: ({ contents }: { filePath: string; contents: string }) => {
    const data = JSON.parse(contents);
    const rootType = data['$type'];
    if (rootType) {
      delete data['$type'];
      for (const [key, val] of Object.entries(data)) {
        if (key.startsWith('$')) continue;
        if (val && typeof val === 'object' && !(val as any)['$type']) {
          (val as any)['$type'] = rootType;
        }
      }
    }
    return data;
  },
};
