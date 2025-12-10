import type { DesignToken } from '../../../design-token.ts';
import type { GradientDesignTokenValue } from './value/gradient-design-token-value.ts';

/**
 * @inheritDoc https://www.designtokens.org/tr/2025.10/format/#gradient
 */
export type GradientDesignToken = DesignToken<'gradient', GradientDesignTokenValue>;

/*---*/

// /**
//  * SHOULD PASS THIS TEST: https://www.designtokens.org/tr/2025.10/format/#example-gradient-token-using-references-example
//  */
// const A: DesignTokensGroup = {
//   'brand-primary': {
//     $type: 'color',
//     $value: {
//       colorSpace: 'srgb',
//       components: [0, 1, 0.4],
//     },
//   },
//
//   'position-end': {
//     $type: 'number',
//     $value: 1,
//   },
//
//   'brand-in-the-middle': {
//     $type: 'gradient',
//     $value: [
//       {
//         color: {
//           colorSpace: 'srgb',
//           components: [0, 0, 0],
//         },
//         position: 0,
//       },
//       {
//         color: '{brand-primary}',
//         position: 0.5,
//       },
//       {
//         color: {
//           colorSpace: 'srgb',
//           components: [0, 0, 0],
//         },
//         position: '{position-end}',
//       },
//     ],
//   },
//
//   'gradient-with-references': {
//     $type: 'gradient',
//     $value: [
//       '{gradient.start-stop}',
//       {
//         color: '{brand.secondary}',
//         position: 0.333,
//       },
//       '{gradient.end-stop}',
//     ],
//   },
//
//   gradient: {
//     'start-stop': {
//       $type: 'gradient',
//       $value: [
//         {
//           color: { colorSpace: 'srgb', components: [1, 1, 1] },
//           position: 0,
//         },
//       ],
//     },
//     'end-stop': {
//       $type: 'gradient',
//       $value: [
//         {
//           color: { colorSpace: 'srgb', components: [0, 0, 0] },
//           position: 1,
//         },
//       ],
//     },
//   },
// };
