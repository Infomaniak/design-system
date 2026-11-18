// Flatten the DTCG token files of packages/tokens/tokens into a single JSON:
// { group: { modes: { mode: [{ name, type, value }] } } }
// - groups: t1, t2, t3 (single mode "Mode 1") and modifiers/<name> (one mode per context file)
// - composite tokens ($type "typography" | "shadow") keep their $value object as-is;
//   the comparator expands them per property.
// Usage: node flatten-repo.mjs  (writes $TOKEN_DIFF_DIR/repo-tokens.json, default /tmp/opencode/token-diff)
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Repo root = 4 levels up from this script (.agents/skills/compare-figma-tokens/scripts/)
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, '../../../..');
const ROOT = join(REPO_ROOT, 'packages/tokens/tokens');
const OUT_DIR = process.env.TOKEN_DIFF_DIR ?? '/tmp/opencode/token-diff';

function flatten(obj, prefix, out, inheritedType) {
  if (obj === null || typeof obj !== 'object') return;
  if ('$value' in obj) {
    out.push({ name: prefix, type: obj.$type ?? inheritedType ?? null, value: obj.$value });
    return;
  }
  const type = obj.$type ?? inheritedType;
  for (const [key, child] of Object.entries(obj)) {
    if (key.startsWith('$')) {
      if (key === '$root') flatten(child, prefix, out, type); // $root is transparent
      continue; // $type, $description, $extensions...
    }
    flatten(child, prefix ? `${prefix}.${key}` : key, out, type);
  }
}

const result = {};
for (const dir of readdirSync(ROOT)) {
  const dirPath = join(ROOT, dir);
  if (dir === 't1-primitive' || dir === 't2-semantic' || dir === 't3-component') {
    const group = dir === 't1-primitive' ? 't1' : dir === 't2-semantic' ? 't2' : 't3';
    result[group] = { modes: {} };
    const tokens = [];
    for (const file of readdirSync(dirPath)) {
      if (!file.endsWith('.tokens.json')) continue;
      flatten(JSON.parse(readFileSync(join(dirPath, file), 'utf8')), '', tokens, null);
    }
    result[group].modes['Mode 1'] = tokens;
  } else if (dir === 'modifiers') {
    for (const modifier of readdirSync(dirPath)) {
      const group = `modifiers/${modifier}`;
      result[group] = { modes: {} };
      for (const file of readdirSync(join(dirPath, modifier))) {
        if (!file.endsWith('.tokens.json')) continue;
        const mode = file.replace('.tokens.json', '');
        const tokens = [];
        flatten(JSON.parse(readFileSync(join(dirPath, modifier, file), 'utf8')), '', tokens, null);
        result[group].modes[mode] = tokens;
      }
    }
  }
}

const stats = {};
for (const [group, data] of Object.entries(result)) {
  for (const [mode, tokens] of Object.entries(data.modes)) stats[`${group}/${mode}`] = tokens.length;
}
mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, 'repo-tokens.json'), JSON.stringify(result, null, 1));
console.log(JSON.stringify(stats, null, 1));
