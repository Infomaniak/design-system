// Compare the flattened repo DTCG tokens (repo-tokens.json) against the Figma
// variable dumps (figma-*.txt) and write diff-results.json.
// Per collection: figmaOnly (names), repoOnly (names), mismatch (resolved leaf values),
// plus unresolvedFigma / unresolvedRepo reference lists.
// Usage: node compare.mjs   (reads $TOKEN_DIFF_DIR, default /tmp/opencode/token-diff)
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = process.env.TOKEN_DIFF_DIR ?? '/tmp/opencode/token-diff';
const repo = JSON.parse(readFileSync(join(DIR, 'repo-tokens.json'), 'utf8'));

// ---------- Repo side: leaf tokens + composites kept apart ----------
const repoLeaf = {}; // group -> mode -> name -> value
const repoComposite = {}; // group -> mode -> name -> { props, kind }
for (const [group, data] of Object.entries(repo)) {
  repoLeaf[group] = {};
  repoComposite[group] = {};
  for (const [mode, tokens] of Object.entries(data.modes)) {
    repoLeaf[group][mode] = {};
    repoComposite[group][mode] = {};
    for (const t of tokens) {
      if (t.type === 'typography' || t.type === 'shadow') {
        repoComposite[group][mode][t.name] = { props: { ...t.value }, kind: t.type };
      } else {
        repoLeaf[group][mode][t.name] = t.value;
      }
    }
  }
}

// ---------- Figma side: load dumps ----------
const figma = {}; // collection -> mode -> name -> rawValue
function addLine(collection, name, values) {
  if (!figma[collection]) figma[collection] = {};
  const entry = {};
  for (const v of values) {
    const eq = v.indexOf('=');
    // "mode=value" only when the prefix is a bare mode name (not @alias/#hex/OPAn/number/string)
    if (eq > 0 && !v.startsWith('@') && !v.startsWith('#') && !v.startsWith('OPA') && !/^-?[\d.]+$/.test(v) && !/^"/.test(v)) {
      entry[v.slice(0, eq)] = v.slice(eq + 1);
    } else {
      entry['Mode 1'] = v;
    }
  }
  figma[collection][name] = entry;
}
function loadLines(file, collection, style) {
  for (const line of readFileSync(join(DIR, file), 'utf8').split('\n')) {
    if (!line.trim()) continue;
    if (style === 'prefixed-modes') { // "[collection] name|mode=value~..."
      const m = line.match(/^\[(.+?)\] (.+?)\|(.*)$/);
      if (!m) throw new Error(`Bad line in ${file}: ${line}`);
      addLine(m[1], m[2], m[3].split('~'));
    } else {
      const i = line.indexOf('|');
      const name = line.slice(0, i);
      const rest = line.slice(i + 1);
      if (style === 'modes') addLine(collection, name, rest.split('~')); // "name|mode=value~..."
      else addLine(collection, name, [rest]); // "name|value"
    }
  }
}
loadLines('figma-t1.txt', 't1', 'single');
loadLines('figma-t2a.txt', 't2', 'single');
loadLines('figma-t2b.txt', 't2', 'single');
loadLines('figma-t3.txt', 't3', 'single');
loadLines('figma-theme-a.txt', 'theme', 'modes');
loadLines('figma-theme-b.txt', 'theme', 'modes');
loadLines('figma-small.txt', null, 'prefixed-modes');

// ---------- Name mapping Figma -> repo ----------
const FONT_PROPS = 'fontFamily|fontSize|fontWeight|letterSpacing|lineHeight';
const SHADOW_PROP_MAP = { x: 'offsetX', y: 'offsetY', offsetX: 'offsetX', offsetY: 'offsetY', blur: 'blur', spread: 'spread', color: 'color' };

function figmaNameToRepo(collection, figName) {
  if (collection === 't2') {
    let m = figName.match(new RegExp(`^typography\\/(xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl)\\/(base|emphasized)\\/(${FONT_PROPS})$`));
    if (m) return { repoName: `typography.${m[1]}.${m[2]}`, prop: m[3] };
    m = figName.match(/^shadow\/(xs|sm|md|lg|xl|2xl)\/(offsetX|offsetY|blur|spread|color|x|y)$/);
    if (m) return { repoName: `shadow.${m[1]}`, prop: SHADOW_PROP_MAP[m[2]] };
  }
  if (collection === 't3') {
    const m = figName.match(new RegExp(`^(body|heading)\\/(xs|sm|md|lg|xl|2xl)\\/font\\/(base|emphasized)\\/(${FONT_PROPS})$`));
    if (m) return { repoName: `${m[1]}.${m[2]}.font.${m[3]}`, prop: m[4] };
  }
  // generic: ".../font/<fontProp>" -> repo composite "<path>.font" + prop
  const g = figName.match(new RegExp(`^(.+)\\/font\\/(${FONT_PROPS})$`));
  if (g) return { repoName: g[1].split('/').join('.') + '.font', prop: g[2] };
  const segs = figName.split('/').filter(s => s !== '@root');
  return { repoName: segs.join('.'), prop: null };
}

const figmaIndex = {}; // collection -> Map(repoName -> [{prop, figName}])
for (const [col, names] of Object.entries(figma)) {
  figmaIndex[col] = new Map();
  for (const figName of Object.keys(names)) {
    const { repoName, prop } = figmaNameToRepo(col, figName);
    if (!figmaIndex[col].has(repoName)) figmaIndex[col].set(repoName, []);
    figmaIndex[col].get(repoName).push({ prop, figName });
  }
}

// ---------- Value normalization / repo resolution ----------
function normHexFromComponents(components, alpha) {
  const to255 = x => Math.round(x * 255).toString(16).padStart(2, '0');
  return { type: 'color', hex: '#' + components.map(to255).join(''), alpha: alpha === undefined ? 1 : alpha };
}
function normalizeRepoNumber(name, v) {
  return name.startsWith('opacity.') ? v * 100 : v;
}

const MODIFIER_ORDER = ['theme', 'product', 'dataviz', 'button-type', 'button-size', 'badge-type', 'avatar-size'];
// Mode contexts mirroring the repo t3 snapshot convention (badge -> primary, avatar -> extra-large)
const DEFAULT_CTX = { theme: 'light', product: 'infomaniak', dataviz: 'blue', 'button-type': 'primary', 'button-size': 'medium', 'badge-type': 'primary', 'avatar-size': 'extra-large' };

function repoFind(name, ctx) {
  for (const mod of MODIFIER_ORDER) {
    const mode = ctx[mod] ?? DEFAULT_CTX[mod];
    if (mode && repoLeaf[`modifiers/${mod}`]?.[mode]?.[name] !== undefined) return { value: repoLeaf[`modifiers/${mod}`][mode][name] };
    if (mode && repoComposite[`modifiers/${mod}`]?.[mode]?.[name]) return { value: repoComposite[`modifiers/${mod}`][mode][name] };
  }
  for (const g of ['t3', 't2', 't1']) {
    if (repoLeaf[g]['Mode 1'][name] !== undefined) return { value: repoLeaf[g]['Mode 1'][name] };
    if (repoComposite[g]['Mode 1'][name]) return { value: repoComposite[g]['Mode 1'][name] };
  }
  return null;
}

const unresolvedRepo = new Set();
function resolveRepoValue(value, ctx, name, stack = new Set()) {
  if (typeof value === 'string') {
    const m = value.match(/^\{(.+)\}$/);
    if (!m) return { type: 'string', s: value };
    const target = m[1];
    if (stack.has(target)) return { type: 'cycle' };
    const found = repoFind(target, ctx);
    if (!found) { unresolvedRepo.add(`${target} (from ${name})`); return { type: 'unresolved' }; }
    return resolveRepoValue(found.value, ctx, target, new Set([...stack, target]));
  }
  if (typeof value === 'number') return { type: 'number', v: normalizeRepoNumber(name, value) };
  if (value && typeof value === 'object') {
    if ('value' in value && 'unit' in value) return { type: 'number', v: value.unit === 'rem' ? value.value * 16 : value.value };
    if (value.colorSpace) {
      let rawComps = value.components;
      if (typeof rawComps === 'string') { // components may reference another color token
        const found = repoFind(rawComps.replace(/^\{|\}$/g, ''), ctx);
        rawComps = found?.value?.colorSpace ? found.value.components : undefined;
      }
      if (!Array.isArray(rawComps)) return { type: 'unresolved' };
      const comps = rawComps.map(c => (typeof c === 'string' ? resolveRepoValue(c, ctx, name, stack)?.v ?? null : c));
      let alpha = 1;
      if (value.alpha !== undefined) alpha = typeof value.alpha === 'number' ? value.alpha : resolveRepoValue(value.alpha, ctx, name, stack)?.v / 100 ?? null;
      if (comps.some(c => c === null) || alpha === null) return { type: 'unresolved' };
      return normHexFromComponents(comps, alpha);
    }
    if (value.props) return { type: 'composite', props: value.props };
  }
  return { type: 'unknown', raw: JSON.stringify(value) };
}

// ---------- Figma resolution ----------
const unresolvedFigma = new Set();
function figmaModeFor(collection, ctx) {
  return ['t1', 't2', 't3'].includes(collection) ? 'Mode 1' : (ctx[collection] ?? null);
}
function resolveFigma(collection, name, ctx, stack = new Set()) {
  const mode = figmaModeFor(collection, ctx);
  const entry = figma[collection]?.[name];
  if (!entry) return { type: 'missing-node' };
  const raw = entry[mode] ?? entry['Mode 1'];
  if (raw === undefined) return { type: 'missing-mode', mode };
  const key = `${collection}|${name}|${mode}`;
  if (stack.has(key)) return { type: 'cycle' };
  const nstack = new Set([...stack, key]);
  if (raw.startsWith('@')) {
    const target = raw.slice(1);
    const candidates = Object.keys(figma).filter(c => figma[c][target] !== undefined && !(c === collection && target === name));
    const results = [];
    for (const c of candidates) {
      const r = resolveFigma(c, target, ctx, nstack);
      if (r.type === 'cycle' || r.type === 'missing-node') continue;
      results.push(JSON.stringify(r));
    }
    const distinct = [...new Set(results)];
    if (distinct.length === 0) { unresolvedFigma.add(`${target} (from ${collection}/${name})`); return { type: 'unresolved' }; }
    if (distinct.length > 1) return { type: 'ambiguous', options: distinct.map(d => JSON.parse(d)) };
    return JSON.parse(distinct[0]);
  }
  if (raw.startsWith('OPA')) { // color+opacity composite: OPA<percent>:@t1/target
    const m = raw.match(/^OPA(\d+):(.+)$/);
    const pct = Number(m[1]);
    const target = m[2].replace(/^@/, '');
    const base = resolveFigma('t1', target, ctx, nstack);
    if (base.type === 'color') return { ...base, alpha: pct / 100 };
    if (base.type === 'number') return { type: 'number', v: base.v };
    for (const c of Object.keys(figma).filter(c => figma[c][target] !== undefined)) {
      const r = resolveFigma(c, target, ctx, nstack);
      if (r.type === 'color') return { ...r, alpha: pct / 100 };
    }
    unresolvedFigma.add(`${target} (from ${collection}/${name})`);
    return { type: 'unresolved' };
  }
  if (raw.startsWith('#')) {
    const m = raw.match(/^#([0-9a-fA-F]{6})(?:@(\d+))?$/);
    if (!m) return { type: 'unknown', raw };
    return { type: 'color', hex: '#' + m[1].toLowerCase(), alpha: m[2] ? Number(m[2]) / 100 : 1 };
  }
  if (/^-?[\d.]+$/.test(raw)) return { type: 'number', v: Number(raw) };
  return { type: 'string', s: raw };
}

// ---------- Comparison ----------
function leavesEqual(a, b) {
  if (a.type !== b.type) return false;
  if (a.type === 'color') return a.hex === b.hex && Math.abs((a.alpha ?? 1) - (b.alpha ?? 1)) < 0.005;
  if (a.type === 'number') return Math.abs(a.v - b.v) < 1e-4;
  if (a.type === 'string') return a.s === b.s;
  return JSON.stringify(a) === JSON.stringify(b);
}
function fmtLeaf(l) {
  if (!l) return '∅';
  if (l.type === 'color') return l.hex + (l.alpha !== undefined && l.alpha !== 1 ? ` @${Math.round(l.alpha * 100)}%` : '');
  if (l.type === 'number') return String(Math.round(l.v * 1e4) / 1e4);
  if (l.type === 'string') return `"${l.s}"`;
  if (l.type === 'unresolved') return '⨯ unresolved';
  if (l.type === 'cycle') return '⨯ cycle';
  return JSON.stringify(l);
}

const GROUPS = [
  { fig: 't1', repoGroup: 't1', modes: [['Mode 1', 'Mode 1']] },
  { fig: 't2', repoGroup: 't2', modes: [['Mode 1', 'Mode 1']] },
  { fig: 't3', repoGroup: 't3', modes: [['Mode 1', 'Mode 1']] },
  { fig: 'theme', repoGroup: 'modifiers/theme', modes: [['light', 'light'], ['dark', 'dark']] },
  { fig: 'product', repoGroup: 'modifiers/product', modes: [['infomaniak', 'infomaniak'], ['calendar', 'calendar'], ['contacts', 'contacts'], ['euria', 'euria'], ['kchat', 'kchat'], ['kdrive', 'kdrive'], ['knote', 'knote'], ['mail', 'mail'], ['security', 'security'], ['swisstransfer', 'swisstransfer']] },
  { fig: 'dataviz', repoGroup: 'modifiers/dataviz', modes: [['blue', 'blue'], ['emerald', 'emerald'], ['gray', 'gray'], ['orange', 'orange'], ['pink', 'pink'], ['citrus', 'citrus'], ['violet', 'violet'], ['yellow', 'yellow'], ['brown', 'brown'], ['magenta', 'magenta']] },
  { fig: 'button-type', repoGroup: 'modifiers/button-type', modes: [['primary', 'primary'], ['secondary', 'secondary'], ['ghost-primary', 'ghost-primary'], ['ghost-secondary', 'ghost-secondary'], ['primary-destructive', 'primary-destructive'], ['secondary-destructive', 'secondary-destructive'], ['ghost-destructive', 'ghost-destructive']] },
  { fig: 'button-size', repoGroup: 'modifiers/button-size', modes: [['small', 'small'], ['medium', 'medium'], ['large', 'large']] },
  { fig: 'badge-type', repoGroup: 'modifiers/badge-type', modes: [['neutral', 'neutral'], ['primary', 'primary']] },
  { fig: 'avatar-size', repoGroup: 'modifiers/avatar-size', modes: [['extra-large', 'extra-large'], ['large', 'large'], ['medium', 'medium'], ['small', 'small']] },
];

const results = {};
for (const g of GROUPS) {
  const res = { figmaOnly: [], repoOnly: [], mismatch: [], stats: { figma: 0, repo: 0, common: 0 } };
  for (const [figMode, repoMode] of g.modes) {
    const ctx = repoMode === 'Mode 1' ? { ...DEFAULT_CTX } : { ...DEFAULT_CTX, [g.fig]: figMode };
    const figIndex = figmaIndex[g.fig] ?? new Map();
    const repoLeafMode = repoLeaf[g.repoGroup][repoMode] ?? {};
    const repoCompMode = repoComposite[g.repoGroup][repoMode] ?? {};
    const repoTokens = { ...repoLeafMode, ...Object.fromEntries(Object.entries(repoCompMode).map(([k, v]) => [k, { __composite: true, ...v }])) };
    res.stats.figma += figIndex.size;
    res.stats.repo += Object.keys(repoTokens).length;
    const figNames = new Set(figIndex.keys());
    const repoNames = new Set(Object.keys(repoTokens));
    for (const n of figNames) if (!repoNames.has(n)) res.figmaOnly.push({ name: n, mode: figMode, value: figIndex.get(n).map(x => `${x.figName} = ${JSON.stringify(figma[g.fig][x.figName])}`).join(' ; ') });
    for (const n of repoNames) if (!figNames.has(n)) {
      const v = repoTokens[n];
      res.repoOnly.push({ name: n, mode: repoMode, value: v?.__composite ? 'composite ' + JSON.stringify(v.props) : JSON.stringify(v) });
    }
    for (const n of figNames) {
      if (!repoNames.has(n)) continue;
      res.stats.common++;
      const isComposite = repoTokens[n]?.__composite;
      for (const { prop, figName } of figIndex.get(n)) {
        const figLeaf = resolveFigma(g.fig, figName, ctx);
        let repoLeafVal;
        if (isComposite) {
          if (!prop) { res.mismatch.push({ name: n, mode: figMode, figma: 'expanded-props', repo: 'composite (no prop)' }); continue; }
          const pv = repoTokens[n].props[prop];
          if (pv === undefined) { res.mismatch.push({ name: `${n}.${prop}`, mode: figMode, figma: fmtLeaf(figLeaf), repo: '⨯ prop absent in repo composite' }); continue; }
          repoLeafVal = resolveRepoValue(pv, ctx, `${n}.${prop}`);
        } else {
          repoLeafVal = resolveRepoValue(repoTokens[n], ctx, n);
          if (repoLeafVal.type === 'composite' && prop) { // reference to a typography/shadow composite
            const pv = repoLeafVal.props[prop];
            if (pv === undefined) { res.mismatch.push({ name: `${n}.${prop}`, mode: figMode, figma: fmtLeaf(figLeaf), repo: '⨯ prop absent in referenced composite' }); continue; }
            repoLeafVal = resolveRepoValue(pv, ctx, `${n}.${prop}`);
          }
        }
        const figIsUnresolved = ['unresolved', 'cycle', 'missing-node', 'missing-mode', 'ambiguous'].includes(figLeaf.type);
        const repoIsUnresolved = ['unresolved', 'cycle', 'unknown'].includes(repoLeafVal?.type);
        if (figIsUnresolved || repoIsUnresolved) {
          res.mismatch.push({ name: prop ? `${n}.${prop}` : n, mode: figMode, figma: fmtLeaf(figLeaf), repo: fmtLeaf(repoLeafVal), note: 'unresolved' });
          continue;
        }
        if (!leavesEqual(figLeaf, repoLeafVal)) res.mismatch.push({ name: prop ? `${n}.${prop}` : n, mode: figMode, figma: fmtLeaf(figLeaf), repo: fmtLeaf(repoLeafVal) });
      }
    }
  }
  results[g.fig] = res;
}

writeFileSync(join(DIR, 'diff-results.json'), JSON.stringify({ results, unresolvedFigma: [...unresolvedFigma], unresolvedRepo: [...unresolvedRepo] }, null, 1));

for (const [group, r] of Object.entries(results)) {
  console.log(`\n##### ${group}  (figma ${r.stats?.figma ?? '-'} / repo ${r.stats?.repo ?? '-'})`);
  console.log(`figmaOnly: ${r.figmaOnly.length}, repoOnly: ${r.repoOnly.length}, valueMismatches: ${r.mismatch.length}`);
}
