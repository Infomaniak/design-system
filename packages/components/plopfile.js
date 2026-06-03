import { execSync } from 'node:child_process';

export default function (plop) {
  plop.setWelcomeMessage('🛠️ What would you like to build?');

  plop.setHelper('pascalCase', (text) => {
    return (
      text
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('') + 'Component'
    );
  });

  plop.setHelper('storyTitle', (text) => {
    const cleaned = text.replace(/^esds-/, '');
    return cleaned
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  });

  plop.setGenerator('component', {
    description: 'create a new component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'component name (kebab-case)',
        validate: (value) => {
          if (!value) return 'name is required';
          if (!/^[a-z][a-z0-9-]*$/.test(value)) return 'name must be valid kebab-case';
          return true;
        },
      },
    ],
    actions: [
      {
        type: 'addMany',
        destination: 'src/{{name}}',
        base: 'scripts/generator-templates',
        templateFiles: 'scripts/generator-templates/*.hbs',
        stripExtensions: ['hbs'],
      },
      {
        type: 'modify',
        path: 'vite.config.ts',
        pattern: /(\n\s+}\s*,\s*\n\s+formats:\s*\['es'\],)/,
        template: "\n        '{{name}}/index': resolve(__dirname, 'src/{{name}}/index.ts'),$1",
      },
    ],
  });

  plop.setGenerator('public-api', {
    description: 'generate public-api.ts from component directories',
    prompts: [],
    actions: [
      () => {
        execSync('node scripts/generate-public-api.js', { stdio: 'inherit' });
        return 'public-api.ts generated';
      },
    ],
  });
}
