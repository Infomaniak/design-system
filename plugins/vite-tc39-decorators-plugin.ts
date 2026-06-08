import babel from '@rolldown/plugin-babel';

export function viteTc39DecoratorsPlugin() {
  return babel({
    presets: [
      {
        preset: () => ({
          plugins: [['@babel/plugin-proposal-decorators', { version: '2023-11' }]],
        }),
        rolldown: { filter: { code: '@' } },
      },
    ],
  });
}
