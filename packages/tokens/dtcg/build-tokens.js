import StyleDictionary from 'style-dictionary';

const sd = new StyleDictionary({
  include: [
    'tokens/t1-primitive/**/*.json',
    'tokens/t2-semantic/**/*.json',
    'tokens/t3-component/**/*.json',
  ],
  source: [`tokens/themes/light.tokens.json`],
});

await sd.buildAllPlatforms();
