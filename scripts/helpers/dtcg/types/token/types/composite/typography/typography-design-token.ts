import type { DesignToken } from '../../../design-token.ts';
import type { TypographyDesignTokenValue } from './typography-design-token-value.ts';

/**
 * @inheritDoc https://www.designtokens.org/tr/2025.10/format/#typography
 */
export type TypographyDesignToken = DesignToken<'typography', TypographyDesignTokenValue>;

/*---*/

// /**
//  * SHOULD PASS THIS TEST: https://www.designtokens.org/tr/2025.10/format/#example-typography-composite-token-examples
//  */
// const A: DesignTokensGroup = {
//   'type styles': {
//     'heading-level-1': {
//       $type: 'typography',
//       $value: {
//         fontFamily: 'Roboto',
//         fontSize: {
//           value: 42,
//           unit: 'px',
//         },
//         fontWeight: 700,
//         letterSpacing: {
//           value: 0.1,
//           unit: 'px',
//         },
//         lineHeight: 1.2,
//       },
//     },
//     microcopy: {
//       $type: 'typography',
//       $value: {
//         fontFamily: '{font.serif}',
//         fontSize: '{font.size.smallest}',
//         fontWeight: '{font.weight.normal}',
//         letterSpacing: {
//           value: 0,
//           unit: 'px',
//         },
//         lineHeight: 1,
//       },
//     },
//   },
// };
