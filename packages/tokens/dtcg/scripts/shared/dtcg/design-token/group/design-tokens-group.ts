import type { CurlyReference } from '../reference/types/curly/curly-reference.js';
import type { JsonPointer } from '../reference/types/json/members/pointer/json-pointer.js';
import type { DesignTokenNameSegment } from '../token/name/segment/design-token-name-segment.ts';
import type { DesignTokensTree } from '../tree/design-tokens-tree.ts';

/**
 * @inheritDoc https://www.designtokens.org/tr/2025.10/format/#groups
 *
 * > Groups organize design tokens into logical collections and provide a hierarchical structure for token files
 */
export interface DesignTokensGroup {
  readonly $description?: string;

  /**
   * Acts as a default type for tokens within the group that do not explicitly declare their own type.
   * Type inheritance applies to nested groups and their tokens unless overridden
   */
  readonly $type?: string;

  /**
   * @inheritDoc https://www.designtokens.org/tr/2025.10/format/#extending-groups
   * @alias $ref
   */
  readonly $extends?: CurlyReference;
  readonly $ref?: JsonPointer;

  /**
   * @inheritDoc https://www.designtokens.org/tr/2025.10/format/#deprecated-0
   */
  readonly $deprecated?: boolean | string;

  /**
   * @inheritDoc https://www.designtokens.org/tr/2025.10/format/#extensions-0
   */
  readonly $extensions?: Record<string, any>;

  // Design tokens
  readonly [name: DesignTokenNameSegment]: DesignTokensTree;
  readonly $root?: DesignTokensTree;
}

/*---*/

// /**
//  * SHOULD PASS THIS TEST: https://www.designtokens.org/tr/2025.10/format/#example-complex-hierarchical-structure
//  */
// const A: DesignTokensGroup = {
//   color: {
//     $type: 'color',
//     $description: 'Complete color system',
//     brand: {
//       $root: {
//         $value: {
//           colorSpace: 'srgb',
//           components: [0, 0.4, 0.8],
//           hex: '#0066cc',
//         },
//       },
//       light: {
//         $value: {
//           colorSpace: 'srgb',
//           components: [0.2, 0.533, 0.867],
//           hex: '#3388dd',
//         },
//       },
//       dark: {
//         $value: {
//           colorSpace: 'srgb',
//           components: [0, 0.267, 0.6],
//           hex: '#004499',
//         },
//       },
//     },
//     semantic: {
//       $extends: '{color.brand}',
//       success: {
//         $root: {
//           $value: {
//             colorSpace: 'srgb',
//             components: [0, 0.8, 0.4],
//             hex: '#00cc66',
//           },
//         },
//         light: {
//           $value: {
//             colorSpace: 'srgb',
//             components: [0.2, 0.867, 0.533],
//             hex: '#33dd88',
//           },
//         },
//         dark: {
//           $value: {
//             colorSpace: 'srgb',
//             components: [0, 0.6, 0.267],
//             hex: '#009944',
//           },
//         },
//       },
//       error: {
//         $root: {
//           $value: {
//             colorSpace: 'srgb',
//             components: [0.8, 0, 0],
//             hex: '#cc0000',
//           },
//         },
//         light: {
//           $value: {
//             colorSpace: 'srgb',
//             components: [1, 0.2, 0.2],
//             hex: '#ff3333',
//           },
//         },
//         dark: {
//           $value: {
//             colorSpace: 'srgb',
//             components: [0.6, 0, 0],
//             hex: '#990000',
//           },
//         },
//       },
//     },
//   },
// };
