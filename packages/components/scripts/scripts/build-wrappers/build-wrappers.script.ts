/**
 * Orchestrates framework wrapper generation.
 *
 * Workflow:
 * 1. Creates a temporary directory with a filtered copy of `custom-elements.json`
 *    (readonly members removed so wrapper users cannot set read-only properties).
 * 2. Calls `cem export` pointing the tool at the temporary directory so the
 *    original manifest is never modified.
 * 3. Post-processes every wrapper's import to a named import from the package
 *    entry point plus a one-time `define()` call.
 * 4. Bundles React wrappers with Vite (ESM only, externalises React + the web
 *    components package).
 * 5. Vue and Angular wrappers are shipped as TypeScript source — their respective
 *    build tools compile them as part of the consumer app.
 */

import { spawn } from 'node:child_process';
import { cp, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const CEM_FILE = './custom-elements.json';
const REACT_OUT = './dist/react';
const ANGULAR_OUT = './dist/angular';
const VUE_OUT = './dist/vue';

const pkgUrl = import.meta.resolve('@pwrs/cem/package.json');
const pkgPath = fileURLToPath(pkgUrl);
const pkg = JSON.parse(await readFile(pkgPath, 'utf-8'));
const CEM_BIN = join(dirname(pkgPath), pkg.bin.cem);

interface CemMember {
  kind: string;
  readonly: boolean;
}

interface CemDeclaration {
  kind: string;
  customElement?: boolean;
  tagName?: string;
  name: string;
  members?: Array<CemMember>;
}

interface CemModule {
  declarations?: Array<CemDeclaration>;
}

interface CemPackage {
  modules: Array<CemModule>;
}

/* --- 1. Filter manifest (remove readonly members) --- */

function buildFilteredManifest(original: CemPackage): CemPackage {
  const manifest = structuredClone(original) as CemPackage;

  for (const mod of manifest.modules) {
    for (const decl of mod.declarations ?? []) {
      if (decl.kind === 'class' && decl.members) {
        decl.members = decl.members.filter((m) => !(m.kind === 'field' && m.readonly === true));
      }
    }
  }

  return manifest;
}

/* --- 2. Invoke @pwrs/cem export for a given format --- */

function cemExport(
  format: 'react' | 'angular' | 'vue',
  outputDir: string,
  packageDir: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      'node',
      [CEM_BIN, 'export', '--format', format, '-o', outputDir, '-p', packageDir],
      {
        stdio: 'inherit',
      },
    );
    child.on('error', reject);
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`cem export ${format} exited with code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

/* --- 3. Collect components from original manifest --- */

interface ComponentEntry {
  tagName: string;
  className: string;
}

function getComponents(cem: CemPackage): ComponentEntry[] {
  const entries: ComponentEntry[] = [];

  for (const mod of cem.modules) {
    for (const decl of mod.declarations ?? []) {
      if (decl.kind === 'class' && decl.customElement && decl.tagName) {
        entries.push({
          tagName: decl.tagName,
          className: decl.name,
        });
      }
    }
  }

  return entries;
}

/* --- 4. Post-process helpers --- */

/**
 * Fixes the direct component import line in generated wrappers.
 *
 * Before:
 *   import 'src/components/esds-icon/esds-icon.component.ts';
 *
 * After (React + Angular file or Vue <script setup> block):
 *   import { EsdsIconComponent as EsdsIconComponentElement } from '@infomaniak-design-system/components';
 *   EsdsIconComponentElement.define();
 */
function fixImportLine(content: string, className: string): string {
  const importPattern = /import ['"]@infomaniak-design-system\/components[^'"]*['"];/;
  const alias = `${className}Element`;
  const replacement = `import { ${className} as ${alias} } from '@infomaniak-design-system/components';\n${alias}.define();`;

  if (importPattern.test(content) && !content.includes(`${alias}.define()`)) {
    return content.replace(importPattern, replacement);
  }

  return content;
}

async function injectDefinesInDirectory(dir: string, components: ComponentEntry[]): Promise<void> {
  const files = await readdir(dir);

  for (const file of files) {
    if (!file.endsWith('.ts') && !file.endsWith('.vue')) {
      continue;
    }

    const path = join(dir, file);
    const original = await readFile(path, 'utf-8');

    let updated = original;
    for (const entry of components) {
      updated = fixImportLine(updated, entry.className);
    }

    if (updated !== original) {
      await writeFile(path, updated, 'utf-8');
    }
  }
}

/* --- 5. Main pipeline --- */

async function main(): Promise<void> {
  // Read original manifest
  const originalCem = JSON.parse(await readFile(CEM_FILE, 'utf-8'));

  const tmpDir = await mkdtemp(join(tmpdir(), 'cem-export-'));

  try {
    // Copy package.json so @pwrs/cem can resolve metadata
    await cp('./package.json', join(tmpDir, 'package.json'));

    // Write filtered manifest
    const filtered = buildFilteredManifest(originalCem);
    await writeFile(join(tmpDir, 'custom-elements.json'), JSON.stringify(filtered, null, 2), 'utf-8');

    // Export wrappers
    await Promise.all([
      cemExport('react', REACT_OUT, tmpDir),
      cemExport('angular', ANGULAR_OUT, tmpDir),
      cemExport('vue', VUE_OUT, tmpDir),
    ]);
  } finally {
    // Clean up temporary directory
    await rm(tmpDir, { recursive: true, force: true });
  }

  // Post-process: inject define() calls
  const components = getComponents(originalCem);

  await Promise.all([
    injectDefinesInDirectory(REACT_OUT, components),
    injectDefinesInDirectory(ANGULAR_OUT, components),
    injectDefinesInDirectory(VUE_OUT, components),
  ]);

  // Bundle React wrappers
  await build({
    configFile: false,
    build: {
      lib: {
        entry: join(process.cwd(), 'dist/react/index.ts'),
        name: 'EsdsReactWrappers',
        formats: ['es'],
        fileName: () => 'index.js',
      },
      outDir: join(process.cwd(), 'dist/react'),
      emptyOutDir: false,
      rollupOptions: {
        external: ['react', '@infomaniak-design-system/components'],
      },
    },
  });
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
