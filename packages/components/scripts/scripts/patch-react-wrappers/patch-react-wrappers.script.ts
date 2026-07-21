import { glob, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

/**
 * Post-processes generated React wrapper files to replace side-effect imports
 * with named imports that include a `.define()` call.
 *
 * This ensures custom elements are registered when React wrappers are imported,
 * while keeping the base component module free of side effects (tree-shakeable).
 */
async function main(reactDir: string = './react'): Promise<void> {
  const absoluteDir = resolve(reactDir);

  // Find all component wrapper JS files (exclude utility/barrel files)
  const jsFiles: string[] = [];
  for await (const entry of glob('*.js', { cwd: absoluteDir })) {
    const filename = String(entry);
    if (
      filename === 'index.js' ||
      filename === 'react-utils.js' ||
      filename === 'ScopeProvider.js'
    ) {
      continue;
    }
    jsFiles.push(resolve(absoluteDir, filename));
  }

  for (const jsFile of jsFiles) {
    const dtsFile = jsFile.replace(/\.js$/, '.d.ts');

    // Read the type definition to find the component class name
    let className: string | undefined;
    try {
      const dtsContent = await readFile(dtsFile, 'utf-8');
      // Match: import { ComponentName as ... } from '...';
      const match = dtsContent.match(
        /import\s*\{\s*(\w+)\s+as\s+\w+Element\s*\}\s*from\s*['"]([^'"]+)['"];/,
      );
      if (match) {
        className = match[1];
      }
    } catch {
      console.warn(`Warning: Could not read ${dtsFile}, skipping.`);
      continue;
    }

    if (!className) {
      console.warn(`Warning: Could not extract class name from ${dtsFile}, skipping.`);
      continue;
    }

    // Read the JS wrapper file
    let jsContent = await readFile(jsFile, 'utf-8');

    // Check if already patched
    if (jsContent.includes(`${className}.define()`)) {
      continue;
    }

    // Get the module path from the type definition import
    const dtsContent = await readFile(dtsFile, 'utf-8');
    const modulePathMatch = dtsContent.match(
      /import\s*\{\s*\w+\s+as\s+\w+Element\s*\}\s*from\s*['"]([^'"]+)['"];/,
    );
    const modulePath = modulePathMatch
      ? modulePathMatch[1]
      : '@infomaniak-design-system/components';

    // Replace side-effect import with named import + define() call
    // Match: import 'module-path'; or import "module-path";
    const sideEffectImportPattern = new RegExp(
      `import\\s*['\"]${modulePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['\"];`,
    );

    if (sideEffectImportPattern.test(jsContent)) {
      jsContent = jsContent.replace(
        sideEffectImportPattern,
        `import { ${className} } from '${modulePath}';\n${className}.define();`,
      );
      await writeFile(jsFile, jsContent, 'utf-8');
      console.log(`Patched ${jsFile} — added ${className}.define()`);
    } else {
      console.warn(`Warning: Could not find side-effect import in ${jsFile}`);
    }
  }
}

// Allow running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const reactDir = process.argv[2] || './react';
  main(reactDir).catch((error) => {
    console.error('Error patching React wrappers:', error);
    process.exit(1);
  });
}

export { main };
