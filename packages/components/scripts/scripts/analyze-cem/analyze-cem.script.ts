import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkgUrl = import.meta.resolve('@custom-elements-manifest/analyzer/package.json');
const pkgPath = fileURLToPath(pkgUrl);
const pkg = JSON.parse(await readFile(pkgPath, 'utf-8'));
const CEM_BIN = join(dirname(pkgPath), pkg.bin.cem);

const args = ['analyze', '--config', './custom-elements-manifest.config.mjs'];

const child = spawn('node', [CEM_BIN, ...args], {
  stdio: 'inherit',
});

child.on('close', (code) => {
  process.exit(code ?? 1);
});
