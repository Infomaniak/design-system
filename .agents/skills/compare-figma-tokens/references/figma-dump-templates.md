# Figma dump templates (`use_figma`)

All snippets run through the `use_figma` tool with `figma.variables.getLocalVariableCollectionsAsync()` and `figma.variables.getLocalVariablesAsync()`. Pass `skillNames: "resource:figma-use"` and the session `sessionId` on every call. The tool return value is capped (~48 KB): dump one collection (or a slice of it) per call.

## 1. Single-mode collection (t1, t2, t3)

Line format: `name|value` — values: alias `@targetName`, color `#rrggbb` (+ `@alphaPercent`), raw number/string. **Hex is computed in the plugin** (never transcribe colors by hand).

```js
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const variables = await figma.variables.getLocalVariablesAsync();
const idToName = {};
for (const v of variables) idToName[v.id] = v.name;
const col = collections.find(c => c.name === 't1'); // 't2' | 't3' for the others
function fmt(val) {
  if (val && val.type === 'VARIABLE_ALIAS') return '@' + idToName[val.id];
  if (val && typeof val === 'object' && 'r' in val) {
    const to255 = x => Math.round(x * 255).toString(16).padStart(2, '0');
    const hex = '#' + to255(val.r) + to255(val.g) + to255(val.b);
    const a = val.a === undefined ? 1 : val.a;
    return a < 1 ? hex + '@' + Math.round(a * 100) : hex;
  }
  if (val && typeof val === 'object') return 'JSON:' + JSON.stringify(val);
  return String(val);
}
const sorted = variables.filter(v => v.variableCollectionId === col.id).sort((a, b) => a.name.localeCompare(b.name));
const lines = [];
for (const v of sorted.slice(0, 250)) { // paginate with slice(0,250) / slice(250)
  const parts = [];
  for (const val of Object.values(v.valuesByMode)) parts.push(fmt(val));
  lines.push(v.name + '|' + parts.join('~'));
}
return lines.join('\n');
```

Save each chunk to `figma-t1.txt`, `figma-t2a.txt` + `figma-t2b.txt`, `figma-t3.txt`.

## 2. Multi-mode collection (theme, small collections)

Line format: `[collection] name|mode=value~mode=value` for small collections; `[collection] ` prefix omitted for `theme` (`figma-theme-a.txt`, `figma-theme-b.txt`).

```js
const smallNames = ['product', 'dataviz', 'button-type', 'button-size', 'badge-type', 'avatar-size']; // or ['theme'] alone
const out = [];
for (const col of collections) {
  if (!smallNames.includes(col.name)) continue;
  const sorted = variables.filter(v => v.variableCollectionId === col.id).sort((a, b) => a.name.localeCompare(b.name));
  for (const v of sorted) {
    const parts = [];
    for (const m of col.modes) {
      const val = v.valuesByMode[m.modeId];
      let s;
      if (val && val.type === 'VARIABLE_ALIAS') s = '@' + idToName[val.id];
      else if (val && typeof val === 'object' && 'r' in val) {
        const to255 = x => Math.round(x * 255).toString(16).padStart(2, '0');
        s = '#' + to255(val.r) + to255(val.g) + to255(val.b);
        const a = val.a === undefined ? 1 : val.a;
        if (a < 1) s += '@' + Math.round(a * 100);
      } else s = String(val);
      parts.push(m.name + '=' + s);
    }
    out.push('[' + col.name + '] ' + v.name + '|' + parts.join('~'));
  }
}
return out.join('\n');
```

Expected sizes for a full dump (adjust if the file evolved): t1 ≈ 358 vars (1 call), t2 ≈ 485 (2 calls), t3 ≈ 177 (1 call), theme ≈ 240 × 2 modes (2 calls of ~125), small collections ≈ 130 (1 call).

## 3. Color+opacity composites

Figma stores `color/shadow`, `color/state/*`, `color/background/backdrop` as `{ color: { type: "VARIABLE_ALIAS", id }, opacity: number }`. The generic `fmt` prints them as `JSON:...`; re-encode them by hand into `OPA<percent>:@<targetName>` in the dump file (e.g. `OPA30:@color/gray/700`).

If the alias id is unknown (`idToName` misses it), resolve it once in a dedicated call:

```js
const ids = ['VariableID:1618:128', '1618:126']; // raw ids seen in composites
const out = {};
for (const id of ids) {
  const v = await figma.variables.getVariableByIdAsync(id);
  if (v) out[id] = v.name;
}
return out;
```

## 4. Targeted re-verification of a suspicious diff

Before reporting any mismatch as real, verify the exact variable in Figma (by collection + name, all modes):

```js
const col = collections.find(c => c.name === 'button-size');
for (const v of variables) {
  if (v.variableCollectionId === col.id && v.name === 'button/icon/size') {
    const modes = {};
    for (const [mid, val] of Object.entries(v.valuesByMode)) {
      modes[col.modes.find(m => m.modeId === mid)?.name] = fmt(val);
    }
    res[v.name] = modes;
  }
}
```

And the repo side with a direct JSON read, e.g.:

```shell
node -e "const j = require('./packages/tokens/tokens/modifiers/button-size/small.tokens.json'); console.log(JSON.stringify(j.button.icon.size.$value))"
```

## 5. Quick structure check

One cheap call to detect structural changes before a full re-dump (compare against the previous run's counts):

```js
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const variables = await figma.variables.getLocalVariablesAsync();
const counts = {};
for (const v of variables) {
  const col = collections.find(c => c.id === v.variableCollectionId);
  counts[col?.name ?? 'UNKNOWN'] = (counts[col?.name ?? 'UNKNOWN'] || 0) + 1;
}
return {
  total: variables.length,
  collections: collections.map(c => ({ name: c.name, modes: c.modes.map(m => m.name), variables: counts[c.name] || 0 })).sort((a, b) => a.name.localeCompare(b.name)),
};
```
