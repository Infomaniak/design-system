import { describe, expect, test } from 'vitest';
import { normalizeExtendsOfDesignTokensTree } from './normalize-extends-of-design-tokens-tree.js';

describe('normalizeExtendsOfDesignTokensTree', () => {
  // https://www.designtokens.org/tr/2025.10/format/#example-override-example
  test('override-example', () => {
    expect(
      normalizeExtendsOfDesignTokensTree({
        input: {
          field: {
            width: {
              $type: 'dimension',
              $value: { value: 12, unit: 'rem' },
            },
            background: {
              $value: {
                colorSpace: 'srgb',
                components: [1, 1, 1],
                hex: '#ffffff',
              },
            },
          },
        },
        'input-amount': {
          $extends: '{input}',
          field: {
            width: { $value: '100px' }, // Overrides field.width completely
          },
        },
      }),
    ).toEqual({
      input: {
        field: {
          width: {
            $type: 'dimension',
            $value: {
              unit: 'rem',
              value: 12,
            },
          },
          background: {
            $value: {
              colorSpace: 'srgb',
              components: [1, 1, 1],
              hex: '#ffffff',
            },
          },
        },
      },
      'input-amount': {
        field: {
          width: {
            $value: '100px',
          },
          background: {
            $value: {
              colorSpace: 'srgb',
              components: [1, 1, 1],
              hex: '#ffffff',
            },
          },
        },
      },
    });
  });

  // https://www.designtokens.org/tr/2025.10/format/#example-multi-level-override
  test('multi-level-override', () => {
    expect(
      normalizeExtendsOfDesignTokensTree({
        base: {
          color: { $value: '#blue' },
          spacing: { $value: '16px' },
        },
        extended: {
          $extends: '{base}',
          color: { $value: '#red' }, // Overrides base.color
          border: { $value: '1px solid' }, // Adds new token
        },
      }),
    ).toEqual({
      base: {
        color: {
          $value: '#blue',
        },
        spacing: {
          $value: '16px',
        },
      },
      extended: {
        color: {
          $value: '#red',
        },
        spacing: {
          $value: '16px',
        },
        border: {
          $value: '1px solid',
        },
      },
    });
  });

  // https://www.designtokens.org/tr/2025.10/format/#example-invalid-circular-reference
  test('invalid-circular-reference', () => {
    expect(() =>
      normalizeExtendsOfDesignTokensTree({
        button: {
          color: { $value: '#blue' },
          border: { $value: '1px solid' },
          secondary: {
            $extends: '{button}', // ❌ Invalid: circular reference
          },
        },
      }),
    ).toThrow();
  });

  // https://www.designtokens.org/tr/2025.10/format/#example-another-circular-reference
  test('another-circular-reference', () => {
    expect(() =>
      normalizeExtendsOfDesignTokensTree({
        groupA: {
          $extends: '{groupB}',
          token: { $value: 'valueA' },
        },
        groupB: {
          $extends: '{groupA}', // ❌ Invalid: circular reference
          token: { $value: 'valueB' },
        },
      }),
    ).toThrow();
  });

  // https://www.designtokens.org/tr/2025.10/format/#example-valid-inheritance-patterns
  test('valid-inheritance-patterns', () => {
    expect(
      normalizeExtendsOfDesignTokensTree({
        button: {
          color: { $value: '#blue' },
          border: { $value: '1px solid' },
        },
        'button-secondary': {
          $extends: '{button}', // ✅ Valid: references parent group
          color: { $value: '#gray' },
        },
        'button-large': {
          $extends: '{button}', // ✅ Valid: siblings can reference same parent
          padding: { $value: '16px' },
        },
      }),
    ).toEqual({
      button: {
        color: {
          $value: '#blue',
        },
        border: {
          $value: '1px solid',
        },
      },
      'button-large': {
        color: {
          $value: '#blue',
        },
        border: {
          $value: '1px solid',
        },
        padding: {
          $value: '16px',
        },
      },
      'button-secondary': {
        color: {
          $value: '#gray',
        },
        border: {
          $value: '1px solid',
        },
      },
    });
  });

  // https://www.designtokens.org/tr/2025.10/format/#example-json-pointer-references
  test('json-pointer-references', () => {
    expect(
      normalizeExtendsOfDesignTokensTree({
        base: {
          $value: {
            colorSpace: 'srgb',
            components: [0, 0.4, 0.8],
            hex: '#0066cc',
          },
        },
        alias: { $ref: '#/base' },
      }),
    ).toEqual({
      base: {
        $value: {
          colorSpace: 'srgb',
          components: [0, 0.4, 0.8],
          hex: '#0066cc',
        },
      },
      alias: {
        $value: '{base}',
      },
    });
  });

  // https://www.designtokens.org/tr/2025.10/format/#example-type-resolution-with-extensions
  test('type-resolution-with-extensions', () => {
    expect(
      normalizeExtendsOfDesignTokensTree({
        base: {
          $type: 'color',
          primary: {
            $value: {
              colorSpace: 'srgb',
              components: [0, 0.4, 0.8],
              hex: '#0066cc',
            },
          },
        },
        extended: {
          $extends: '{base}',
          $type: 'dimension', // Local constraint
          spacing: { $value: { value: 16, unit: 'px' } },
        },
      }),
    ).toEqual({
      base: {
        $type: 'color',
        primary: {
          $value: {
            colorSpace: 'srgb',
            components: [0, 0.4, 0.8],
            hex: '#0066cc',
          },
        },
      },
      extended: {
        $type: 'dimension',
        primary: {
          $value: {
            colorSpace: 'srgb',
            components: [0, 0.4, 0.8],
            hex: '#0066cc',
          },
        },
        spacing: {
          $value: {
            unit: 'px',
            value: 16,
          },
        },
      },
    });
  });

  // https://www.designtokens.org/tr/2025.10/format/#example-circular-reference-detection
  test('circular-reference-detection', () => {
    expect(() =>
      normalizeExtendsOfDesignTokensTree({
        a: { $extends: '{b}' },
        b: { $extends: '{c}' },
        c: { $extends: '{a}' }, // Creates circular reference: a → b → c → a
      }),
    ).toThrow();
  });

  // https://www.designtokens.org/tr/2025.10/format/#example-group-extension-with-override
  test('group-extension-with-override', () => {
    expect(
      normalizeExtendsOfDesignTokensTree({
        input: {
          $type: 'dimension',
          field: {
            width: { $value: { value: 100, unit: '%' } },
            background: {
              $value: {
                colorSpace: 'srgb',
                components: [1, 1, 1],
                hex: '#ffffff',
              },
            },
          },
        },
        'input-amount': {
          $extends: '{input}',
          field: {
            width: { $value: { value: 100, unit: 'px' } },
          },
        },
      }),
    ).toEqual({
      input: {
        $type: 'dimension',
        field: {
          width: {
            $value: {
              unit: '%',
              value: 100,
            },
          },
          background: {
            $value: {
              colorSpace: 'srgb',
              components: [1, 1, 1],
              hex: '#ffffff',
            },
          },
        },
      },
      'input-amount': {
        $type: 'dimension',
        field: {
          width: {
            $value: {
              unit: 'px',
              value: 100,
            },
          },
          background: {
            $value: {
              colorSpace: 'srgb',
              components: [1, 1, 1],
              hex: '#ffffff',
            },
          },
        },
      },
    });
  });

  // https://www.designtokens.org/tr/2025.10/format/#example-complex-hierarchical-structure
  test('complex-hierarchical-structure', () => {
    expect(
      normalizeExtendsOfDesignTokensTree({
        color: {
          $type: 'color',
          $description: 'Complete color system',
          brand: {
            $root: {
              $value: {
                colorSpace: 'srgb',
                components: [0, 0.4, 0.8],
                hex: '#0066cc',
              },
            },
            light: {
              $value: {
                colorSpace: 'srgb',
                components: [0.2, 0.533, 0.867],
                hex: '#3388dd',
              },
            },
            dark: {
              $value: {
                colorSpace: 'srgb',
                components: [0, 0.267, 0.6],
                hex: '#004499',
              },
            },
          },
          semantic: {
            $extends: '{color.brand}',
            success: {
              $root: {
                $value: {
                  colorSpace: 'srgb',
                  components: [0, 0.8, 0.4],
                  hex: '#00cc66',
                },
              },
              light: {
                $value: {
                  colorSpace: 'srgb',
                  components: [0.2, 0.867, 0.533],
                  hex: '#33dd88',
                },
              },
              dark: {
                $value: {
                  colorSpace: 'srgb',
                  components: [0, 0.6, 0.267],
                  hex: '#009944',
                },
              },
            },
            error: {
              $root: {
                $value: {
                  colorSpace: 'srgb',
                  components: [0.8, 0, 0],
                  hex: '#cc0000',
                },
              },
              light: {
                $value: {
                  colorSpace: 'srgb',
                  components: [1, 0.2, 0.2],
                  hex: '#ff3333',
                },
              },
              dark: {
                $value: {
                  colorSpace: 'srgb',
                  components: [0.6, 0, 0],
                  hex: '#990000',
                },
              },
            },
          },
        },
      }),
    ).toEqual({
      color: {
        $description: 'Complete color system',
        $type: 'color',
        brand: {
          $root: {
            $value: {
              colorSpace: 'srgb',
              components: [0, 0.4, 0.8],
              hex: '#0066cc',
            },
          },
          dark: {
            $value: {
              colorSpace: 'srgb',
              components: [0, 0.267, 0.6],
              hex: '#004499',
            },
          },
          light: {
            $value: {
              colorSpace: 'srgb',
              components: [0.2, 0.533, 0.867],
              hex: '#3388dd',
            },
          },
        },
        semantic: {
          $description: 'Complete color system',
          $root: {
            $value: {
              colorSpace: 'srgb',
              components: [0, 0.4, 0.8],
              hex: '#0066cc',
            },
          },
          $type: 'color',
          dark: {
            $value: {
              colorSpace: 'srgb',
              components: [0, 0.267, 0.6],
              hex: '#004499',
            },
          },
          error: {
            $root: {
              $value: {
                colorSpace: 'srgb',
                components: [0.8, 0, 0],
                hex: '#cc0000',
              },
            },
            dark: {
              $value: {
                colorSpace: 'srgb',
                components: [0.6, 0, 0],
                hex: '#990000',
              },
            },
            light: {
              $value: {
                colorSpace: 'srgb',
                components: [1, 0.2, 0.2],
                hex: '#ff3333',
              },
            },
          },
          light: {
            $value: {
              colorSpace: 'srgb',
              components: [0.2, 0.533, 0.867],
              hex: '#3388dd',
            },
          },
          success: {
            $root: {
              $value: {
                colorSpace: 'srgb',
                components: [0, 0.8, 0.4],
                hex: '#00cc66',
              },
            },
            dark: {
              $value: {
                colorSpace: 'srgb',
                components: [0, 0.6, 0.267],
                hex: '#009944',
              },
            },
            light: {
              $value: {
                colorSpace: 'srgb',
                components: [0.2, 0.867, 0.533],
                hex: '#33dd88',
              },
            },
          },
        },
      },
    });
  });
});
